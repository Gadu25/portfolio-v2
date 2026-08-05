import { readBody, setResponseHeader } from 'h3'
import techs from '~/data/techs'
import workexp from '~/data/workexp'
import projects from '~/data/projects'
import certifications from '~/data/certifications'

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent'

function buildSystemPrompt(): string {
  const profile = {
    name: 'Alexander Udag',
    title: 'Creative Software Engineer',
    bio: `Creative software engineer crafting responsive and high-performing web applications. Frontend-focused fullstack developer passionate about Vue, Nuxt, and modern web technologies. Skilled in building scalable component libraries, designing clean UIs, and integrating robust backends.`
  }

  const skills = techs.map((t) => t.name).join(', ')

  const experienceStrs = workexp.map((w: any, i: number) => {
    const endStr = w.isPresent ? 'Present' : (w.endDate || '')
    const techStr = (w.technologies || []).map((t: any) => t.name || t.slug || '').filter(Boolean).join(', ')
    return `${w.title} at ${w.company} (${w.startDate} - ${endStr}): ${techStr}`
  })

  const projectStrs = projects.map((p: any, i: number) => {
    const name = p.name || p.title || 'Unknown'
    const status = typeof p.status === 'string' ? p.status : p.status?.title || 'Unknown'
    const techStr = (p.techUsed || p.technologies || [])
      .map((t: any) => t.name || t.slug || '')
      .filter(Boolean)
      .join(', ')
    return `${name}: ${p.description || ''} (${techStr}) — Status: ${status}`
  })

  const certStrs = certifications.map((c: any) => `${c.name} — ${c.provider} (${c.issued})`)

  const links = [
    'Portfolio: https://alexander.udaglab.com',
    'GitHub: https://github.com/Gadu25',
    'LinkedIn: https://linkedin.com/in/alexander-udag'
  ]

  return `You are the system operator of this portfolio terminal.
Persona: a cryptic but helpful operator. Speak in terminal-appropriate language. Be concise. Use monospace-friendly formatting (no markdown, no emojis). Keep responses to 1-4 lines unless listing data.

PORTFOLIO CONTEXT:
Name: ${profile.name}
Title: ${profile.title}
Bio: ${profile.bio}

EXPERIENCE:
${experienceStrs.map((e, i) => `${i + 1}. ${e}`).join('\n')}

PROJECTS:
${projectStrs.map((p, i) => `${i + 1}. ${p}`).join('\n')}

SKILLS: ${skills}

CERTIFICATIONS:
${certStrs.map((c, i) => `${i + 1}. ${c}`).join('\n')}

LINKS:
${links.join('\n')}

RULES:
- If asked about skills, projects, experience, or certifications: respond directly with the data above.
- If asked a free-form question about Alexander: answer in character, keep it brief and terminal-styled.
- If asked something unrelated to Alexander or this portfolio: deflect with terminal humor. Examples: "That command requires elevated privileges. Try sudo.", "Unknown protocol. Type help for available commands.", "Access denied. This terminal is secured. Try whois instead."
- Never break character. You are the operator of a secured portfolio terminal.`
}

function buildGeminiBody(message: string, history: Array<{ role: 'user' | 'model', text: string }>) {
  const contents = history.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }))

  contents.push({
    role: 'user',
    parts: [{ text: message }]
  })

  return {
    contents,
    systemInstruction: {
      parts: [{ text: buildSystemPrompt() }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 300
    }
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.geminiApiKey

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Gemini API key not configured' })
  }

  const body = await readBody<{ message: string; history: Array<{ role: 'user' | 'model'; text: string }> }>(event)

  if (!body?.message || typeof body.message !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Missing or invalid message' })
  }

  const trimmed = body.message.slice(0, 500)
  const history = body.history || []

  const url = `${GEMINI_API_BASE}?alt=sse&key=${apiKey}`

  setResponseHeader(event, 'Content-Type', 'text/event-stream')
  setResponseHeader(event, 'Cache-Control', 'no-cache')
  setResponseHeader(event, 'Connection', 'keep-alive')

  const geminiResponse = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildGeminiBody(trimmed, history))
  })

  if (!geminiResponse.ok) {
    const errorText = await geminiResponse.text()
    throw createError({ statusCode: 502, statusMessage: `Gemini API error: ${geminiResponse.status} ${errorText}` })
  }

  const decoder = new TextDecoder()
  const reader = geminiResponse.body!.getReader()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim()
              if (!jsonStr || jsonStr === '[DONE]') continue
              try {
                const parsed = JSON.parse(jsonStr)
                const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text
                if (text) {
                  controller.enqueue(`data: ${JSON.stringify({ text })}\n\n`)
                }
              } catch {
                // skip unparseable chunks
              }
            }
          }
        }
      } catch (err: any) {
        controller.enqueue(`data: ${JSON.stringify({ error: err.message || 'Stream interrupted' })}\n\n`)
      } finally {
        controller.close()
        reader.releaseLock()
      }
    }
  })

  return stream
})

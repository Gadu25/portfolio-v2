import { readBody, setResponseHeader } from 'h3'

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent'

function buildSystemPrompt(): string {
  const profile = {
    name: 'Alexander Udag',
    title: 'Creative Software Engineer',
    bio: `Creative software engineer crafting responsive and high-performing web applications. Frontend-focused fullstack developer passionate about Vue, Nuxt, and modern web technologies. Skilled in building scalable component libraries, designing clean UIs, and integrating robust backends.`
  }

  const experience = [
    'Frontend Software Engineer at Flexicon Solution Inc. (Sep 2024 - Present): Built Vue.js/Nuxt component library with Storybook, Cypress testing, SCSS styling.',
    'Full Stack Web Developer at DOST-SEI (Mar 2023 - Aug 2024): Built PMIS with Vue.js, Laravel, MySQL. REST APIs, responsive layouts, stakeholder demos.',
    'Junior Frontend Web Developer at Xtendly Philippines Inc. (Jul 2022 - Feb 2023): React/Next.js pages with Tailwind, Laravel APIs, MySQL databases.'
  ]

  const projects = [
    'Megome: API-first portfolio infrastructure platform (Next.js, TypeScript, Go, MySQL) — SaaS, ongoing.',
    'GEP Website: Official site for Geodetic Engineers of the Philippines (WordPress, PHP, SCSS, JS, MySQL) — live at nationalgep.org.',
    'Mojito Cocktail: GSAP animation playground (React, TypeScript, Tailwind) — hobby project.',
    'CatchThemAll: Interactive Pokemon web app (Nuxt, Tailwind, SCSS, JS, Node) — beta.',
    'API-Hub: Multi-API integration dashboard (Nuxt, Tailwind, JS, Node, SCSS) — stale.',
    'Passkeep: Secure password manager (Next.js, Tailwind, Firebase) — live.'
  ]

  const skills = 'JavaScript, Vue, Nuxt, React, Next.js, TypeScript, SCSS/Sass, Tailwind CSS, Bootstrap, Node.js, PHP, Laravel, MySQL, PostgreSQL, WordPress, Go, Storybook, Cypress, Quasar, Firebase, Git'

  const certifications = [
    'Advance CSS and Sass — Udemy (Jan 2025)',
    'Crash Course on Python — Google (Jul 2023)',
    'Build a Website with HTML, CSS, and GitHub Pages — Codecademy (Sep 2024)',
    'Introduction to UI and UX Design — Codecademy (Sep 2024)',
    'Learn CSS — Codecademy (Sep 2024)',
    'Learn HTML — Codecademy (Sep 2024)',
    'Learn JavaScript — Codecademy (Sep 2024)',
    'Learn Sass — Codecademy (Sep 2024)',
    'Learn Vue.js — Codecademy (Sep 2024)'
  ]

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
${experience.map((e, i) => `${i + 1}. ${e}`).join('\n')}

PROJECTS:
${projects.map((p, i) => `${i + 1}. ${p}`).join('\n')}

SKILLS: ${skills}

CERTIFICATIONS:
${certifications.map((c, i) => `${i + 1}. ${c}`).join('\n')}

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

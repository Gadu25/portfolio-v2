import { readBody, setResponseHeader } from 'h3'
import { isAvailable, remainingCooldown, setCooldown, parseRetryDelay, formatCooldown } from '~/server/utils/gemini'

const GEMINI_MODEL = 'gemini-flash-latest'
const GEMINI_API_BASE = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}`

// Megome data cache (fetched once, kept for server lifetime)
let cachedPrompt: string | null = null
let fetchPromise: Promise<string> | null = null

async function fetchMegomeData(): Promise<string> {
  const config = useRuntimeConfig()
  const baseUrl = config.public.megomeUrl as string || 'https://megome-production.up.railway.app'
  const accessKey = config.public.megomeAccessKey as string || ''

  const headers = { Authorization: `Bearer ${accessKey}` }

  try {
    const [profileRes, skillsRes, expRes, certsRes, projRes] = await Promise.all([
      fetch(`${baseUrl}/public/v1/profile`, { headers }),
      fetch(`${baseUrl}/public/v1/skill`, { headers }),
      fetch(`${baseUrl}/public/v1/experience`, { headers }),
      fetch(`${baseUrl}/public/v1/certification`, { headers }),
      fetch(`${baseUrl}/public/v1/project`, { headers }),
    ])

    const profileOk = profileRes.ok ? (await profileRes.json()).data : null
    const skillsOk = skillsRes.ok ? (await skillsRes.json()).skills : null
    const expOk = expRes.ok ? (await expRes.json()).experiences : null
    const certsOk = certsRes.ok ? (await certsRes.json()).certificates : null
    const projOk = projRes.ok ? (await projRes.json()).projects : null

    const allData = {
      name: profileOk ? `${profileOk.firstName} ${profileOk.lastName}` : 'Alexander Udag',
      title: profileOk?.title || 'Creative Software Engineer',
      tagline: profileOk?.tagline || '',
      bio: profileOk?.bio || '',
      location: profileOk?.location || 'Philippines',
      skills: skillsOk ? skillsOk.map((s: any) => s.skillName).join(', ') : '',
      experience: expOk ? expOk.map((e: any, i: number) => {
        const end = e.isPresent ? 'Present' : (e.endDate || '')
        const techs = (e.technologies || []).map((t: any) => t.name || '').filter(Boolean).join(', ')
        return `${i + 1}. ${e.title} at ${e.company} (${e.startDate} - ${end}): ${techs}`
      }).join('\n') : '',
      projects: projOk ? projOk.map((p: any, i: number) => {
        const techs = (p.technologies || []).map((t: any) => t.name || '').filter(Boolean).join(', ')
        return `${i + 1}. ${p.title}: ${p.description || ''} (${techs}) — Status: ${p.status || 'Unknown'}`
      }).join('\n') : '',
      certs: certsOk ? certsOk.map((c: any, i: number) => {
        return `${i + 1}. ${c.title} — ${c.issuer} (${c.issueDate})`
      }).join('\n') : '',
    }

    return buildSystemPrompt(allData)
  } catch {
    return buildFallbackPrompt()
  }
}

async function getSystemPrompt(): Promise<string> {
  if (cachedPrompt) return cachedPrompt
  if (fetchPromise) return fetchPromise

  fetchPromise = fetchMegomeData().then((prompt) => {
    cachedPrompt = prompt
    fetchPromise = null
    return prompt
  }).catch(() => {
    fetchPromise = null
    return buildFallbackPrompt()
  })

  return fetchPromise
}

function buildSystemPrompt(d: {
  name: string; title: string; tagline: string; bio: string; location: string;
  skills: string; experience: string; projects: string; certs: string;
}): string {
  return `You are the system operator of this portfolio terminal.
Persona: a cryptic but helpful operator. Speak in terminal-appropriate language. Be concise. Use monospace-friendly formatting (no markdown, no emojis). Keep responses to 1-4 lines unless listing data.

PORTFOLIO CONTEXT:
Name: ${d.name}
Title: ${d.title}${d.tagline ? `\nTagline: ${d.tagline}` : ''}
${d.bio ? `Bio: ${d.bio}` : ''}
${d.location ? `Location: ${d.location}` : ''}

EXPERIENCE:
${d.experience || 'See ls experience for work history.'}

PROJECTS:
${d.projects || 'See ls projects for project list.'}

SKILLS: ${d.skills || 'See ls skills for tech stack.'}

CERTIFICATIONS:
${d.certs || 'See ls certs for certification list.'}

LINKS:
Portfolio: https://alexander.udaglab.com
GitHub: https://github.com/Gadu25
LinkedIn: https://linkedin.com/in/alexander-udag

RULES:
- If asked about skills, projects, experience, or certifications: respond directly with the data above.
- If asked a free-form question about ${d.name.split(' ')[0]}: answer in character, keep it brief and terminal-styled.
- If asked something unrelated to ${d.name.split(' ')[0]} or this portfolio: deflect with terminal humor. Examples: "That command requires elevated privileges. Try sudo.", "Unknown protocol. Type help for available commands.", "Access denied. This terminal is secured. Try whois instead."
- Never break character. You are the operator of a secured portfolio terminal.`
}

function buildFallbackPrompt(): string {
  return buildSystemPrompt({
    name: 'Alexander Udag',
    title: 'Creative Software Engineer',
    tagline: 'Turning Ideas into Interactive Web Solutions',
    bio: 'Creative software engineer crafting responsive and high-performing web applications. Frontend-focused fullstack developer passionate about Vue, Nuxt, and modern web technologies. Skilled in building scalable component libraries, designing clean UIs, and integrating robust backends.',
    location: 'Philippines',
    skills: 'JavaScript, Vue, Nuxt, React, Next.js, TypeScript, SCSS/Sass, Tailwind CSS, Bootstrap, Node.js, PHP, Laravel, MySQL, PostgreSQL, WordPress, Go, Storybook, Cypress, Quasar, Firebase, Git',
    experience: [
      'Frontend Software Engineer at Flexicon Solution Inc. (Sep 2024 - Present): Vue, Nuxt, Storybook, Cypress, SCSS, Quasar, NodeJS',
      'Full Stack Web Developer at DOST-SEI (Mar 2023 - Aug 2024): Vue, Laravel, PHP, MySQL, Bootstrap, PostgreSQL, NodeJS',
      'Junior Frontend Web Developer at Xtendly Philippines Inc. (Jul 2022 - Feb 2023): React, Next.js, Tailwind, Laravel, MySQL, NodeJS, WordPress',
    ].map((e, i) => `${i + 1}. ${e}`).join('\n'),
    projects: [
      'Megome: API-first portfolio infrastructure platform (Next.js, TypeScript, Tailwind CSS, Go, MySQL) — Status: Ongoing Development',
      'GEP Website: Official site for Geodetic Engineers of the Philippines (WordPress, PHP, SCSS, JavaScript, MySQL) — Status: Live',
      'Mojito Cocktail: GSAP animation playground (React, TypeScript, Tailwind CSS) — Status: Done',
      'CatchThemAll: Interactive Pokemon web app (Nuxt, Tailwind, JavaScript, NodeJS, Sass) — Status: Beta',
      'API-Hub: Multi-API integration dashboard (Nuxt, Tailwind, JavaScript, NodeJS, Sass) — Status: Stale',
      'Passkeep: Secure password manager (Next.js, Tailwind CSS, Firebase) — Status: Live',
    ].map((p, i) => `${i + 1}. ${p}`).join('\n'),
    certs: [
      'Advance CSS and Sass — Udemy (Jan 2025)',
      'Crash Course on Python — Google (Jul 2023)',
      'Build a Website with HTML, CSS, and GitHub Pages — Codecademy (Sep 2024)',
      'Introduction to UI and UX Design — Codecademy (Sep 2024)',
      'Learn CSS — Codecademy (Sep 2024)',
      'Learn HTML — Codecademy (Sep 2024)',
      'Learn JavaScript — Codecademy (Sep 2024)',
      'Learn Sass — Codecademy (Sep 2024)',
      'Learn Vue.js — Codecademy (Sep 2024)',
    ].map((c, i) => `${i + 1}. ${c}`).join('\n'),
  })
}

function buildGeminiBody(message: string, history: Array<{ role: 'user' | 'model', text: string }>, systemPrompt: string) {
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
      parts: [{ text: systemPrompt }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 600
    }
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.geminiApiKey

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Gemini API key not configured' })
  }

  setResponseHeader(event, 'Content-Type', 'text/event-stream')
  setResponseHeader(event, 'Cache-Control', 'no-cache')
  setResponseHeader(event, 'Connection', 'keep-alive')

  if (!isAvailable()) {
    const remaining = remainingCooldown()
    const msg = `[COOLDOWN — retry in ~${formatCooldown(remaining!)}]`
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(`data: ${JSON.stringify({ text: msg })}\n\n`)
        controller.close()
      }
    })
    return stream
  }

  const body = await readBody<{ message: string; history: Array<{ role: 'user' | 'model'; text: string }> }>(event)

  if (!body?.message || typeof body.message !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Missing or invalid message' })
  }

  const trimmed = body.message.slice(0, 500)
  const history = body.history || []
  const systemPrompt = await getSystemPrompt()

  const geminiResponse = await fetch(`${GEMINI_API_BASE}:streamGenerateContent?alt=sse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': apiKey
    },
    body: JSON.stringify(buildGeminiBody(trimmed, history, systemPrompt))
  })

  if (!geminiResponse.ok) {
    const errorText = await geminiResponse.text()

    if (geminiResponse.status === 429) {
      const retrySec = parseRetryDelay(errorText)
      setCooldown(retrySec)
      const msg = `[RATE LIMITED — quota exhausted. Retry in ~${formatCooldown(retrySec)}]`
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(`data: ${JSON.stringify({ text: msg })}\n\n`)
          controller.close()
        }
      })
      return stream
    }

    const msg = `[CONNECTION UNSTABLE — Gemini returned ${geminiResponse.status}]`
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(`data: ${JSON.stringify({ text: msg })}\n\n`)
        controller.close()
      }
    })
    return stream
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

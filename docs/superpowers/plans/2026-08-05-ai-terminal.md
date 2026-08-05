# AI Terminal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an interactive AI-powered terminal emulator to the portfolio, accessible via a `>_` nav button and `Ctrl+K` shortcut.

**Architecture:** A composable holds shared terminal state. The Terminal component renders a full-screen overlay with a fake terminal. Structured commands (whois, ls, help) render directly from static data files. Free-form text is POSTed to `server/api/terminal.post.ts` which builds a system prompt with portfolio context, calls Gemini 2.0 Flash with streaming, and pipes SSE back to the client.

**Tech Stack:** Vue 3 (Composition API), TypeScript, SCSS, Nuxt 3 server routes, Gemini API (fetch + SSE streaming), no new npm dependencies.

## Global Constraints

- Gemini API key in `.env` as `GEMINI_API_KEY`, server-side only
- No new npm dependencies
- System monospace font stack: `"Cascadia Code", "Fira Code", "JetBrains Mono", monospace`
- Follows existing SCSS patterns: BEM, SCSS variables from `_variables.scss`, CSS custom properties from `_colors.scss`
- Existing data files (`data/techs.js`, `data/workexp.js`, `data/projects.js`, `data/certifications.js`) are the source of truth for structured command responses

---

### Task 1: Add GEMINI_API_KEY to env and Nuxt runtime config

**Files:**
- Modify: `.env`
- Modify: `nuxt.config.ts:39-44`

**Interfaces:**
- Produces: `GEMINI_API_KEY` environment variable, accessible server-side via `useRuntimeConfig()`

- [ ] **Step 1: Add GEMINI_API_KEY to .env**

```bash
echo "" >> .env
echo "GEMINI_API_KEY=your_gemini_api_key_here" >> .env
```

- [ ] **Step 2: Add GEMINI_API_KEY to Nuxt runtimeConfig (server-side only)**

Edit `nuxt.config.ts` line 39-44, add `geminiApiKey`:

```typescript
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    public: {
      megomeAccessKey: process.env.MEGOME_ACCESS_KEY,
      megomeUrl: process.env.MEGOME_URL
    }
  },
```

- [ ] **Step 3: Commit**

```bash
git add .env nuxt.config.ts
git commit -m "feat: add GEMINI_API_KEY to env and runtime config"
```

---

### Task 2: Create server API route for Gemini proxying

**Files:**
- Create: `server/api/terminal.post.ts`

**Interfaces:**
- Consumes: `GEMINI_API_KEY` from runtime config, data files from `~/data/`
- Produces: SSE streaming endpoint `POST /api/terminal`
- Request body: `{ message: string, history: Array<{ role: 'user' | 'model', text: string }> }`
- Response: `text/event-stream` with `data: {"text": "chunk"}\n\n` lines

- [ ] **Step 1: Create the server route**

Write `server/api/terminal.post.ts`:

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add server/api/terminal.post.ts
git commit -m "feat: add Gemini API proxy server route with streaming"
```

---

### Task 3: Create terminal SCSS styles

**Files:**
- Create: `assets/css/components/_terminal.scss`
- Modify: `assets/css/main.scss` (add import)

**Interfaces:**
- Produces: CSS classes `terminal-overlay`, `terminal`, `terminal__header`, `terminal__body`, `terminal__output`, `terminal__prompt`, `terminal__input`, `terminal__boot`, `terminal__btn`, `terminal__cursor`

- [ ] **Step 1: Create _terminal.scss**

Write `assets/css/components/_terminal.scss`:

```scss
.terminal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.terminal {
  width: 100%;
  max-width: 900px;
  height: 85vh;
  max-height: 700px;
  background-color: #0d1117;
  border: 1px solid rgba(59, 255, 127, 0.15);
  border-radius: $radius-md;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(59, 255, 127, 0.05), 0 8px 32px rgba(0, 0, 0, 0.4);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $space-sm $space-md;
    background-color: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    font-family: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', monospace;
    font-size: $font-size-xs;
    color: #6b7280;
    user-select: none;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: $space-sm;

    &::before {
      content: '>';
      color: #3bff7f;
    }

    &::after {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #3bff7f;
      animation: terminal-pulse 2s infinite;
    }
  }

  &__hint {
    color: #4b5563;
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: $space-md $space-md $space-sm;
    font-family: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', monospace;
    font-size: $font-size-sm;
    line-height: 1.7;
    color: #3bff7f;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(59, 255, 127, 0.15);
      border-radius: 2px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }

  &__output {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__line {
    white-space: pre-wrap;
    word-break: break-word;

    &--prompt {
      color: #3bff7f;
    }

    &--error {
      color: #ff5555;
    }

    &--dim {
      color: #6b7280;
    }

    &--system {
      color: #6b7280;
    }
  }

  &__prompt-line {
    display: flex;
    align-items: center;
    gap: $space-xs;
  }

  &__prompt {
    color: #3bff7f;
    white-space: nowrap;
    user-select: none;
  }

  &__input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: #3bff7f;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    caret-color: #3bff7f;

    &::placeholder {
      color: rgba(59, 255, 127, 0.2);
    }
  }

  &__cursor {
    display: inline-block;
    width: 7px;
    height: 14px;
    background-color: #3bff7f;
    animation: terminal-cursor-blink 1s step-end infinite;
    vertical-align: middle;
    margin-left: 1px;
  }

  &__btn {
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #6b7280;
    width: 24px;
    height: 24px;
    border-radius: 3px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    transition: all $transition-fast;

    &:hover {
      color: #3bff7f;
      border-color: rgba(59, 255, 127, 0.3);
    }
  }

  &__boot {
    color: #6b7280;
    font-size: $font-size-xs;
    line-height: 1.8;
  }
}

.terminal-nav-btn {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--secondary-text-color);
  width: $icon-sm;
  height: $icon-sm;
  border-radius: $radius-sm;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: $font-weight-medium;
  transition: all $transition-fast;

  &:hover {
    border-color: var(--text-color);
    color: var(--text-color);
  }
}

@keyframes terminal-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes terminal-cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

// Fade transition
.terminal-fade-enter-active,
.terminal-fade-leave-active {
  transition: opacity $transition-base, transform $transition-base;
}

.terminal-fade-enter-from {
  opacity: 0;
  transform: scale(0.98);
}

.terminal-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

// Glitch effect
.terminal-glitch {
  animation: terminal-glitch-anim 0.3s ease;
}

@keyframes terminal-glitch-anim {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 1px); }
  40% { transform: translate(2px, -1px); }
  60% { transform: translate(-1px, -1px); }
  80% { transform: translate(1px, 1px); }
  100% { transform: translate(0); }
}

// Mobile
@media screen and (max-width: $bp-mobile) {
  .terminal {
    height: 65vh;
    max-height: none;
    border-radius: $radius-sm $radius-sm 0 0;
    margin-top: auto;
    width: 100%;

    &__body {
      font-size: $font-size-xs;
      padding: $space-sm;
    }

    &__header {
      padding: $space-sm;
    }
  }

  .terminal-overlay {
    align-items: flex-end;
  }
}
```

- [ ] **Step 2: Import into main.scss**

Edit `assets/css/main.scss`, add the terminal import after the other component imports (after line 13, before the layout imports on line 15):

Add this line between line 13 and line 14:
```scss
@import './components/terminal';
```

- [ ] **Step 3: Verify the SCSS compiles**

Run: `npm run dev` (let it start, check for compilation errors, then stop with Ctrl+C)

- [ ] **Step 4: Commit**

```bash
git add assets/css/components/_terminal.scss assets/css/main.scss
git commit -m "feat: add terminal SCSS styles"
```

---

### Task 4: Create useTerminal composable

**Files:**
- Create: `composables/useTerminal.ts`

**Interfaces:**
- Produces shared reactive state:
  - `visible: Ref<boolean>`
  - `lines: Ref<Array<{ text: string; type: 'prompt' | 'output' | 'error' | 'dim' | 'system' }>>`
  - `currentInput: Ref<string>`
  - `isStreaming: Ref<boolean>`
  - `open(): void`
  - `close(): void`
  - `toggle(): void`
  - `submit(): Promise<void>` — processes input, routes to structured commands or API
  - `navigateHistory(direction: 'up' | 'down'): void`

- [ ] **Step 1: Write the composable**

Write `composables/useTerminal.ts`:

```typescript
export interface TerminalLine {
  text: string
  type: 'prompt' | 'output' | 'error' | 'dim' | 'system'
}

export interface ChatMessage {
  role: 'user' | 'model'
  text: string
}

const visible = ref(false)
const lines = ref<TerminalLine[]>([])
const currentInput = ref('')
const history = ref<string[]>([])
const historyIndex = ref(-1)
const isStreaming = ref(false)
const chatHistory = ref<ChatMessage[]>([])

interface StructuredCommand {
  match: (input: string) => boolean
  handler: () => TerminalLine[]
}

function getStructuredCommands(): StructuredCommand[] {
  return [
    {
      match: (input) => input === 'help' || input === '?',
      handler: () => [
        { text: 'AVAILABLE COMMANDS', type: 'dim' as const },
        { text: '────────────────', type: 'dim' as const },
        { text: '  whois              — View profile and bio', type: 'dim' as const },
        { text: '  ls skills           — List technologies', type: 'dim' as const },
        { text: '  ls projects | projects  — List projects', type: 'dim' as const },
        { text: '  ls experience | experience  — Work history', type: 'dim' as const },
        { text: '  ls certs | certs     — List certifications', type: 'dim' as const },
        { text: '  contact | links     — Social links and email', type: 'dim' as const },
        { text: '  resume | cv         — Download resume', type: 'dim' as const },
        { text: '  clear | cls         — Clear terminal', type: 'dim' as const },
        { text: '  exit | logout       — Close terminal', type: 'dim' as const },
        { text: '  matrix              — ???', type: 'dim' as const },
        { text: '  sudo | hack         — ???', type: 'dim' as const },
        { text: '────────────────', type: 'dim' as const },
        { text: 'Type anything else to chat with the system.', type: 'dim' as const },
      ]
    },
    {
      match: (input) => input === 'whois',
      handler: () => [
        { text: 'ALEXANDER UDAG', type: 'output' as const },
        { text: '─────────────────────────────', type: 'dim' as const },
        { text: 'Title: Creative Software Engineer', type: 'output' as const },
        { text: 'Location: Philippines', type: 'output' as const },
        { text: '', type: 'system' as const },
        { text: 'Frontend-focused fullstack developer passionate about Vue, Nuxt, and modern web technologies. Skilled in building scalable component libraries, designing clean UIs, and integrating robust backends.', type: 'output' as const },
        { text: '', type: 'system' as const },
        { text: 'Currently: Frontend Software Engineer at Flexicon Solution Inc.', type: 'output' as const },
      ]
    },
    {
      match: (input) => input === 'ls skills' || input === 'skills',
      handler: () => [
        { text: 'TECH STACK', type: 'dim' as const },
        { text: '──────────', type: 'dim' as const },
        { text: 'JavaScript | TypeScript | Vue | Nuxt | React | Next.js', type: 'output' as const },
        { text: 'Node.js | PHP | Laravel | Go', type: 'output' as const },
        { text: 'SCSS | Sass | Tailwind CSS | Bootstrap', type: 'output' as const },
        { text: 'MySQL | PostgreSQL | Firebase', type: 'output' as const },
        { text: 'WordPress | Quasar | Storybook | Cypress | Git', type: 'output' as const },
      ]
    },
    {
      match: (input) => input === 'ls projects' || input === 'projects',
      handler: () => [
        { text: 'PROJECTS', type: 'dim' as const },
        { text: '────────', type: 'dim' as const },
        { text: '1. Megome — API-first portfolio platform', type: 'output' as const },
        { text: '   Next.js · TypeScript · Go · MySQL  (SaaS, ongoing)', type: 'dim' as const },
        { text: '', type: 'system' as const },
        { text: '2. GEP Website — Official site for Geodetic Engineers PH', type: 'output' as const },
        { text: '   WordPress · PHP · SCSS · MySQL  (Live)', type: 'dim' as const },
        { text: '', type: 'system' as const },
        { text: '3. Mojito Cocktail — GSAP animation playground', type: 'output' as const },
        { text: '   React · TypeScript · Tailwind  (Done)', type: 'dim' as const },
        { text: '', type: 'system' as const },
        { text: '4. CatchThemAll — Interactive Pokemon web app', type: 'output' as const },
        { text: '   Nuxt · Tailwind · SCSS · JS  (Beta)', type: 'dim' as const },
        { text: '', type: 'system' as const },
        { text: '5. API-Hub — Multi-API integration dashboard', type: 'output' as const },
        { text: '   Nuxt · Tailwind · JS · SCSS  (Stale)', type: 'dim' as const },
        { text: '', type: 'system' as const },
        { text: '6. Passkeep — Secure password manager', type: 'output' as const },
        { text: '   Next.js · Tailwind · Firebase  (Live)', type: 'dim' as const },
      ]
    },
    {
      match: (input) => input === 'ls experience' || input === 'experience',
      handler: () => [
        { text: 'WORK EXPERIENCE', type: 'dim' as const },
        { text: '───────────────', type: 'dim' as const },
        { text: '1. Frontend Software Engineer', type: 'output' as const },
        { text: '   Flexicon Solution Inc. — Sep 2024 to Present', type: 'dim' as const },
        { text: '   Vue · Nuxt · Storybook · Cypress · SCSS · Quasar', type: 'dim' as const },
        { text: '', type: 'system' as const },
        { text: '2. Full Stack Web Developer', type: 'output' as const },
        { text: '   DOST-SEI — Mar 2023 to Aug 2024', type: 'dim' as const },
        { text: '   Vue · Laravel · PHP · MySQL · Bootstrap · Postgres', type: 'dim' as const },
        { text: '', type: 'system' as const },
        { text: '3. Junior Frontend Web Developer', type: 'output' as const },
        { text: '   Xtendly Philippines Inc. — Jul 2022 to Feb 2023', type: 'dim' as const },
        { text: '   React · Next.js · Tailwind · Laravel · MySQL · WP', type: 'dim' as const },
      ]
    },
    {
      match: (input) => input === 'ls certs' || input === 'certs',
      handler: () => [
        { text: 'CERTIFICATIONS', type: 'dim' as const },
        { text: '──────────────', type: 'dim' as const },
        { text: '• Advance CSS and Sass — Udemy (Jan 2025)', type: 'output' as const },
        { text: '• Crash Course on Python — Google (Jul 2023)', type: 'output' as const },
        { text: '• Build a Website with HTML, CSS, and GitHub Pages — Codecademy', type: 'output' as const },
        { text: '• Introduction to UI and UX Design — Codecademy', type: 'output' as const },
        { text: '• Learn CSS — Codecademy', type: 'output' as const },
        { text: '• Learn HTML — Codecademy', type: 'output' as const },
        { text: '• Learn JavaScript — Codecademy', type: 'output' as const },
        { text: '• Learn Sass — Codecademy', type: 'output' as const },
        { text: '• Learn Vue.js — Codecademy', type: 'output' as const },
      ]
    },
    {
      match: (input) => input === 'contact' || input === 'links',
      handler: () => [
        { text: 'CONNECT', type: 'dim' as const },
        { text: '───────', type: 'dim' as const },
        { text: 'Portfolio: https://alexander.udaglab.com', type: 'output' as const },
        { text: 'GitHub:    https://github.com/Gadu25', type: 'output' as const },
        { text: 'LinkedIn:  https://linkedin.com/in/alexander-udag', type: 'output' as const },
        { text: 'Email:     alexanderudag25@gmail.com', type: 'output' as const },
      ]
    },
    {
      match: (input) => input === 'matrix',
      handler: () => {
        // Trigger matrix rain effect (handled in component)
        return [
          { text: 'Wake up, Neo...', type: 'dim' as const },
          { text: 'The Matrix has you...', type: 'dim' as const },
          { text: '', type: 'system' as const },
          { text: '...just kidding. This terminal runs on Gemini, not Sentinels.', type: 'output' as const },
          { text: 'Try whois or help for actual commands.', type: 'dim' as const },
        ]
      }
    },
  ]
}

const BOOT_LINES = [
  { text: '        _    _           ___         _', type: 'dim' as const },
  { text: '       / \\  | | _____  _|_ _|_ __   / \\', type: 'dim' as const },
  { text: '      / _ \\ | |/ _ \\ \\/ / || \'_ \\ / _ \\', type: 'dim' as const },
  { text: '     / ___ \\| |  __/>  <| || | | / ___ \\', type: 'dim' as const },
  { text: '    /_/   \\_\\_|\\___/_/\\_\\___|_| |_/_/   \\_\\', type: 'dim' as const },
  { text: '', type: 'system' as const },
  { text: '    ╔══════════════════════════════════╗', type: 'dim' as const },
  { text: '    ║  PORTFOLIO TERMINAL v2.0        ║', type: 'dim' as const },
  { text: '    ║  CONNECTION ESTABLISHED         ║', type: 'dim' as const },
  { text: '    ║  PROTOCOL: Gemini 2.0 Flash     ║', type: 'dim' as const },
  { text: '    ╚══════════════════════════════════╝', type: 'dim' as const },
  { text: '', type: 'system' as const },
  { text: 'Type help for available commands.', type: 'dim' as const },
]

export function useTerminal() {
  function open() {
    visible.value = true
    lines.value = []

    let delay = 0
    for (const line of BOOT_LINES) {
      setTimeout(() => {
        lines.value = [...lines.value, line]
        nextTick(() => scrollToBottom())
      }, delay)
      delay += 80
    }

    setTimeout(() => {
      nextTick(() => {
        const inputEl = document.querySelector('.terminal__input') as HTMLInputElement
        inputEl?.focus()
      })
    }, delay + 100)
  }

  function close() {
    visible.value = false
    lines.value = []
    currentInput.value = ''
    isStreaming.value = false
  }

  function toggle() {
    if (visible.value) {
      close()
    } else {
      open()
    }
  }

  function addLine(line: TerminalLine) {
    lines.value = [...lines.value, line]
    nextTick(() => scrollToBottom())
  }

  function addLines(newLines: TerminalLine[]) {
    lines.value = [...lines.value, ...newLines]
    nextTick(() => scrollToBottom())
  }

  function addOutputChunk(text: string, isNew: boolean) {
    if (isNew) {
      lines.value = [...lines.value, { text: '', type: 'output' }]
    }
    const last = lines.value[lines.value.length - 1]
    if (last && last.type === 'output') {
      last.text += text
    }
    nextTick(() => scrollToBottom())
  }

  function scrollToBottom() {
    const body = document.querySelector('.terminal__body')
    if (body) {
      body.scrollTop = body.scrollHeight
    }
  }

  function navigateHistory(direction: 'up' | 'down') {
    if (history.value.length === 0) return

    if (direction === 'up') {
      if (historyIndex.value < history.value.length - 1) {
        historyIndex.value++
      }
    } else {
      if (historyIndex.value > -1) {
        historyIndex.value--
      }
    }

    if (historyIndex.value >= 0) {
      currentInput.value = history.value[history.value.length - 1 - historyIndex.value]
    } else {
      currentInput.value = ''
    }

    nextTick(() => {
      const inputEl = document.querySelector('.terminal__input') as HTMLInputElement
      if (inputEl) {
        inputEl.selectionStart = inputEl.selectionEnd = inputEl.value.length
      }
    })
  }

  function handleResume() {
    addLines([
      { text: '[RESUME ACCESS]', type: 'dim' as const },
      { text: '────────────────', type: 'dim' as const },
      { text: 'The downloadable resume is linked on the homepage.', type: 'output' as const },
      { text: 'LinkedIn: https://linkedin.com/in/alexander-udag', type: 'output' as const },
      { text: 'GitHub:  https://github.com/Gadu25', type: 'output' as const },
    ])
  }

  async function submit() {
    const input = currentInput.value.trim()
    if (!input || isStreaming.value) return

    const prompt = `visitor@alex:~$ ${input}`

    if (input === 'clear' || input === 'cls') {
      lines.value = []
      currentInput.value = ''
      return
    }

    if (input === 'exit' || input === 'logout') {
      close()
      return
    }

    if (input === 'resume' || input === 'cv') {
      addLine({ text: prompt, type: 'prompt' })
      handleResume()
      currentInput.value = ''
      history.value = [...history.value, input]
      historyIndex.value = -1
      return
    }

    history.value = [...history.value, input]
    historyIndex.value = -1

    addLine({ text: prompt, type: 'prompt' })

    const commands = getStructuredCommands()
    const matched = commands.find((cmd) => cmd.match(input))

    if (matched && input !== 'hack' && input !== 'sudo') {
      addLines(matched.handler())
      currentInput.value = ''
      return
    }

    if (input === 'hack' || input === 'sudo') {
      currentInput.value = ''
      isStreaming.value = true
      chatHistory.value = [...chatHistory.value, { role: 'user', text: input }]

      try {
        const response = await fetch('/api/terminal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input, history: chatHistory.value.slice(0, -1) })
        })

        if (!response.ok) {
          addLine({ text: '[CONNECTION UNSTABLE - retry in ~5s]', type: 'error' })
          isStreaming.value = false
          return
        }

        let fullText = ''
        let isFirstChunk = true
        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines_arr = buffer.split('\n')
          buffer = lines_arr.pop() || ''

          for (const line of lines_arr) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim()
              if (!jsonStr) continue
              try {
                const parsed = JSON.parse(jsonStr)
                if (parsed.error) {
                  addLine({ text: `[${parsed.error}]`, type: 'error' })
                  continue
                }
                if (parsed.text) {
                  fullText += parsed.text
                  addOutputChunk(parsed.text, isFirstChunk)
                  isFirstChunk = false
                }
              } catch {
                // skip
              }
            }
          }
        }

        if (fullText) {
          chatHistory.value = [...chatHistory.value, { role: 'model', text: fullText }]
        }
      } catch (err: any) {
        addLine({ text: '[CARRIER LOST]', type: 'error' })
      }

      isStreaming.value = false
      currentInput.value = ''
      return
    }

    currentInput.value = ''
    isStreaming.value = true
    chatHistory.value = [...chatHistory.value, { role: 'user', text: input }]

    try {
      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: chatHistory.value.slice(0, -1) })
      })

      if (!response.ok) {
        addLine({ text: '[CONNECTION UNSTABLE - retry in ~5s]', type: 'error' })
        isStreaming.value = false
        currentInput.value = ''
        return
      }

      let fullText = ''
      let isFirstChunk = true
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines_arr = buffer.split('\n')
        buffer = lines_arr.pop() || ''

        for (const line of lines_arr) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim()
            if (!jsonStr) continue
            try {
              const parsed = JSON.parse(jsonStr)
              if (parsed.error) {
                addLine({ text: `[${parsed.error}]`, type: 'error' })
                continue
              }
              if (parsed.text) {
                fullText += parsed.text
                addOutputChunk(parsed.text, isFirstChunk)
                isFirstChunk = false
              }
            } catch {
              // skip
            }
          }
        }
      }

      if (fullText) {
        chatHistory.value = [...chatHistory.value, { role: 'model', text: fullText }]
      }
    } catch (err: any) {
      addLine({ text: '[CARRIER LOST]', type: 'error' })
    }

    isStreaming.value = false
    currentInput.value = ''
  }

  return {
    visible: readonly(visible),
    lines: readonly(lines),
    currentInput,
    isStreaming: readonly(isStreaming),
    open,
    close,
    toggle,
    addLine,
    addLines,
    addOutputChunk,
    submit,
    navigateHistory
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add composables/useTerminal.ts
git commit -m "feat: add useTerminal composable with command routing and Gemini streaming"
```

---

### Task 5: Create Terminal Vue component

**Files:**
- Create: `components/Terminal.vue`

**Interfaces:**
- Consumes: `useTerminal()` composable
- Produces: Full-screen terminal overlay rendered inside `<Teleport to="body">`

- [ ] **Step 1: Write Terminal.vue**

Write `components/Terminal.vue`:

```vue
<template>
  <Teleport to="body">
    <Transition name="terminal-fade">
      <div v-if="visible" class="terminal-overlay" @click.self="close">
        <div class="terminal" @click.stop>
          <div class="terminal__header">
            <span class="terminal__title">portfolio-terminal</span>
            <span class="terminal__hint">esc to close · ctrl+k to toggle</span>
            <button class="terminal__btn" @click="close" aria-label="Close terminal">&times;</button>
          </div>
          <div class="terminal__body" ref="bodyRef">
            <div class="terminal__output">
              <div
                v-for="(line, i) in lines"
                :key="i"
                class="terminal__line"
                :class="`terminal__line--${line.type}`"
              >{{ line.text }}</div>
            </div>
            <div v-if="visible" class="terminal__prompt-line">
              <span class="terminal__prompt">visitor@alex:~$</span>
              <input
                ref="inputRef"
                v-model="currentInput"
                class="terminal__input"
                type="text"
                spellcheck="false"
                autocomplete="off"
                autocapitalize="off"
                :disabled="isStreaming"
                @keydown="onKeydown"
              />
              <span v-if="isStreaming" class="terminal__cursor" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { visible, lines, currentInput, isStreaming, close, submit, navigateHistory } = useTerminal()

const bodyRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    submit()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    navigateHistory('up')
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    navigateHistory('down')
  } else if (e.key === 'Escape') {
    e.preventDefault()
    close()
  } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    close()
  } else if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
    e.preventDefault()
    currentInput.value = ''
  }
}

function onGlobalKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    if (visible.value) {
      close()
    } else {
      const term = useTerminal()
      term.open()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>
```

- [ ] **Step 2: Commit**

```bash
git add components/Terminal.vue
git commit -m "feat: add Terminal component with keyboard shortcuts and streaming"
```

---

### Task 6: Integrate terminal into layout and navigation

**Files:**
- Modify: `layouts/default.vue`
- Modify: `layouts/Navigation.vue`

**Interfaces:**
- Consumes: `Terminal.vue` component, `useTerminal()` composable
- Navigation.vue gains a `>_` button that calls `useTerminal().open()`
- default.vue includes `<Terminal />` component

- [ ] **Step 1: Add Terminal component to default layout**

Edit `layouts/default.vue`, add Terminal component after FooterSection:

```vue
<template>
  <div class="layout">
    <Navigation @navigate="setDirection" :is-scrolled="isScrolled" />
    <NuxtPage :transition="{ name: transitionDirection, mode: 'out-in' }" />
    <FooterSection />
    <Terminal />
  </div>
</template>
```

- [ ] **Step 2: Add `>_` button to Navigation.vue**

Edit `layouts/Navigation.vue`, add the button next to ThemeToggle in the template and add the setup logic.

Replace the template (lines 1-50) with:

```vue
<template>
  <nav class="nav" :class="{ 'nav--scrolled': scrolled }">
    <div class="nav__container">
      <ul class="nav__links">
        <li
          v-for="(nav, index) in navs"
          :key="nav.route"
          :class="{ active: route.path === nav.route }"
        >
          <NuxtLink :to="nav.route" @click="handleNavigation(index)">
            {{ nav.name }}
          </NuxtLink>
        </li>
      </ul>
      <div class="nav__burger">
        <div class="nav__toggle">
          <input
            id="menu-checkbox"
            type="checkbox"
            v-model="toggle"
          />
          <label class="nav__hamburger" for="menu-checkbox">
            <span class="nav__bar nav__bar--top" />
            <span class="nav__bar nav__bar--middle" />
            <span class="nav__bar nav__bar--bottom" />
          </label>
        </div>
      </div>
      <div class="nav__actions">
        <button
          class="terminal-nav-btn"
          @click="openTerminal"
          aria-label="Open terminal"
          title="Open terminal (Ctrl+K)"
        >
          &gt;_
        </button>
        <ThemeToggle class="nav__theme-toggle" />
      </div>
    </div>
    <div class="nav__mobile" :class="{ active: toggle }">
      <ul>
        <li
          v-for="(nav, index) in navs"
          :key="nav.route"
          :class="{ active: route.path === nav.route }"
        >
          <NuxtLink :to="nav.route" @click="handleNavigation(index)">
            {{ nav.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
```

Replace the script (lines 52-93) with:

```vue
<script setup lang="ts">
import ThemeToggle from '~/components/common/ThemeToggle.vue'

const props = defineProps<{
  isScrolled?: boolean
}>()

const emit = defineEmits<{
  navigate: [direction: string]
}>()

const route = useRoute()

const navs = [
  { name: 'Home', route: '/' },
  { name: 'Work', route: '/work' },
  { name: 'Projects', route: '/projects' },
]

const toggle = ref(false)
const scrolled = ref(props.isScrolled ?? false)

const currentIndex = computed(() => navs.findIndex(nav => nav.route === route.path))

const handleNavigation = (index: number) => {
  const direction = currentIndex.value < index ? 'swipe-right' : 'swipe-left'
  emit('navigate', direction)
  closeMobile()
}

const closeMobile = () => {
  if (toggle.value) {
    toggle.value = false
  }
}

const openTerminal = () => {
  const term = useTerminal()
  term.open()
}

watch(toggle, (newVal) => {
  if (newVal) {
    scrolled.value = false
  }
})
</script>
```

- [ ] **Step 3: Add nav__actions wrapper style to _navigation.scss**

The `nav__container` (line 19) already has `display: flex` and `align-items: center`, which supports this layout. The existing `nav__theme-toggle` (line 76-78) has `margin-left: $space-md`. Since we're now wrapping both the terminal button and theme toggle in `.nav__actions`, remove the `&__theme-toggle` rule (lines 76-78) and replace with:

```scss
  &__actions {
    display: flex;
    align-items: center;
    gap: $space-xs;
    margin-left: $space-md;
  }
```

Edit `assets/css/layout/_navigation.scss`, replace lines 76-78:
```scss
  &__theme-toggle {
    margin-left: $space-md;
  }
```
with:
```scss
  &__actions {
    display: flex;
    align-items: center;
    gap: $space-xs;
  }
```

Note: The `nav__theme-toggle` class is still on the ThemeToggle element in the template, we just moved the margin to the wrapper.

- [ ] **Step 4: Run dev server to verify everything compiles**

Run: `npm run dev` — check for SCSS or JS compilation errors. Verify terminal opens with `>_` button and `Ctrl+K`.

- [ ] **Step 5: Commit**

```bash
git add layouts/default.vue layouts/Navigation.vue assets/css/layout/_navigation.scss
git commit -m "feat: integrate terminal into layout and navigation"
```

---

## Verification Checklist

After all tasks complete, verify:

1. `npm run dev` compiles without errors
2. The `>_` button appears in the navigation bar
3. Clicking `>_` opens the terminal overlay with boot sequence
4. `Ctrl+K` toggles the terminal
5. `Esc` closes the terminal
6. Structured commands (`whois`, `help`, `ls skills`, `ls projects`, `ls experience`, `ls certs`, `contact`) render without API calls
7. `clear` clears the terminal
8. `exit` closes the terminal
9. Free-form text triggers a Gemini API call with streaming response
10. Up/down arrows navigate command history
11. Mobile: terminal opens from bottom, reduced height
12. Gemini API key is NOT exposed in client-side bundles (check Network tab — no direct Gemini calls)

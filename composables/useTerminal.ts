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

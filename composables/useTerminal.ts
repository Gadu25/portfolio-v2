import techs from '~/data/techs'
import workexp from '~/data/workexp'
import projects from '~/data/projects'
import certifications from '~/data/certifications'

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
const aiAvailable = ref(false)
const cwd = ref<string[]>([])
let bootTimers: ReturnType<typeof setTimeout>[] = []

// ── Directory helpers ──

function getChildren(path: string[]): string[] {
  if (path.length === 0) return ['projects/', 'skills/', 'experience/', 'certs/', '.ai', 'about']
  const dir = path[0]
  if (dir === 'projects') {
    if (path.length === 1) return projects.map((p: any) => slugify(p.name || p.title || '') + '/')
    if (path.length === 2) return ['description', 'status', 'link', 'technologies']
    return []
  }
  if (dir === 'skills') {
    if (path.length === 1) return techs.map((t: any) => slugify(t.name) + '/')
    if (path.length === 2) return ['link']
    return []
  }
  if (dir === 'experience') {
    if (path.length === 1) return workexp.map((w: any) => slugify(w.company) + '/')
    if (path.length === 2) return ['description', 'role', 'dates', 'technologies']
    return []
  }
  if (dir === 'certs') {
    if (path.length === 1) return certifications.map((c: any) => slugify(c.name) + '/')
    if (path.length === 2) return ['issuer', 'date']
    return []
  }
  return []
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function findItem(path: string[], name: string): any | null {
  if (path.length === 0) return null
  const dir = path[0]
  const slug = slugify(name)
  if (dir === 'projects') return projects.find((p: any) => slugify(p.name || p.title || '') === slug) || null
  if (dir === 'skills') return techs.find((t: any) => slugify(t.name) === slug) || null
  if (dir === 'experience') return workexp.find((w: any) => slugify(w.company) === slug) || null
  if (dir === 'certs') return certifications.find((c: any) => slugify(c.name) === slug) || null
  return null
}

function lsDir(path: string[]): TerminalLine[] {
  if (path.length === 0) {
    return [
      { text: 'projects/', type: 'output' as const },
      { text: 'skills/', type: 'output' as const },
      { text: 'experience/', type: 'output' as const },
      { text: 'certs/', type: 'output' as const },
      { text: 'about', type: 'output' as const },
    ]
  }

  if (path.length === 1 && path[0] === '.ai') {
    return [{ text: '.ai', type: 'dim' as const }]
  }

  if (path.length >= 2) {
    const item = findItem(path.slice(0, -1), path[path.length - 1])
    if (!item) return [{ text: `ls: ${path.join('/')}: no such directory`, type: 'error' as const }]
  }

  const knownDirs = ['projects', 'skills', 'experience', 'certs']
  if (path.length === 1 && !knownDirs.includes(path[0])) {
    return [{ text: `ls: ${path[0]}: no such directory`, type: 'error' as const }]
  }

  if (path[0] === 'projects') {
    if (path.length === 1) {
      const result: TerminalLine[] = []
      projects.forEach((p: any) => {
        const slug = slugify(p.name || p.title || '')
        const status = typeof p.status === 'string' ? p.status : p.status?.title || ''
        result.push({ text: `${slug}/`, type: 'output' as const })
        if (status) result.push({ text: `  ${status}`, type: 'dim' as const })
      })
      return result
    }
    if (path.length === 2) {
      const p = item
      return [
        { text: 'description', type: 'output' as const },
        { text: 'status', type: 'output' as const },
        { text: 'link', type: 'output' as const },
        { text: 'technologies', type: 'output' as const },
      ]
    }
  }

  if (path[0] === 'skills' && path.length === 1) {
    const result: TerminalLine[] = []
    techs.forEach((t: any) => {
      result.push({ text: `${slugify(t.name)}/`, type: 'output' as const })
      result.push({ text: `  ${t.link}`, type: 'dim' as const })
    })
    return result
  }

  if (path[0] === 'experience' && path.length === 1) {
    const result: TerminalLine[] = []
    workexp.forEach((w: any) => {
      const slug = slugify(w.company)
      const endStr = w.isPresent ? 'Present' : (w.endDate || '')
      result.push({ text: `${slug}/`, type: 'output' as const })
      result.push({ text: `  ${w.title} (${w.startDate} - ${endStr})`, type: 'dim' as const })
    })
    return result
  }

  if (path[0] === 'certs' && path.length === 1) {
    const result: TerminalLine[] = []
    certifications.forEach((c: any) => {
      result.push({ text: `${slugify(c.name)}/`, type: 'output' as const })
      result.push({ text: `  ${c.provider} — ${c.issued}`, type: 'dim' as const })
    })
    return result
  }

  return []
}

function catFile(path: string[], name: string): TerminalLine[] {
  if (path.length === 0 && name === 'about') {
    return [
      { text: 'ALEXANDER UDAG', type: 'output' as const },
      { text: '─────────────────────────────', type: 'dim' as const },
      { text: 'Title: Creative Software Engineer', type: 'output' as const },
      { text: 'Location: Philippines', type: 'output' as const },
      { text: '', type: 'system' as const },
      { text: 'Frontend-focused fullstack developer passionate about Vue, Nuxt, and modern web technologies.', type: 'output' as const },
      { text: '', type: 'system' as const },
      { text: 'Currently: Frontend Software Engineer at Flexicon Solution Inc.', type: 'output' as const },
    ]
  }

  if (path.length === 0 && name === '.ai') {
    return [
      { text: '   ╭─────╮', type: 'dim' as const },
      { text: '   │ .AI │  — This terminal is powered by Gemini Flash.', type: 'output' as const },
      { text: '   ╰─────╯', type: 'dim' as const },
      { text: '  Powered by `gemini-flash-latest` via Google AI Studio.', type: 'dim' as const },
      { text: '  Free-form questions, hack/sudo, and creative prompts', type: 'dim' as const },
      { text: '  are processed through the AI pipeline.', type: 'dim' as const },
      { text: '', type: 'system' as const },
      { text: '  Try: hack, sudo rm -rf /, or ask "tell me a joke"', type: 'dim' as const },
    ]
  }

  if (path.length === 0) {
    return [{ text: `cat: ${name}: no such file`, type: 'error' as const }]
  }

  const item = findItem(path, path[path.length - 1])
  if (!item) return [{ text: `cat: ${name}: no such file`, type: 'error' as const }]

  if (path[0] === 'projects') {
    if (name === 'description') {
      return [
        { text: item.description || '', type: 'output' as const }
      ]
    }
    if (name === 'status') {
      const status = typeof item.status === 'string' ? item.status : item.status?.title || 'unknown'
      return [{ text: `Status: ${status}`, type: 'output' as const }]
    }
    if (name === 'link') {
      const link = item.url || item.link || 'no link'
      return [{ text: `URL: ${link}`, type: 'output' as const }]
    }
    if (name === 'technologies') {
      const techs = (item.techUsed || item.technologies || []).map((t: any) => t.name || t.slug || '').filter(Boolean)
      return [{ text: techs.join(' · '), type: 'output' as const }]
    }
  }

  if (path[0] === 'skills') {
    if (name === 'link') {
      return [{ text: `Link: ${item.link}`, type: 'output' as const }]
    }
  }

  if (path[0] === 'experience') {
    if (name === 'description') {
      return [{ text: stripHtml(item.description || ''), type: 'output' as const }]
    }
    if (name === 'role') {
      return [{ text: item.title || 'unknown', type: 'output' as const }]
    }
    if (name === 'dates') {
      const endStr = item.isPresent ? 'Present' : (item.endDate || '')
      return [{ text: `${item.startDate} - ${endStr}`, type: 'output' as const }]
    }
    if (name === 'technologies') {
      const techs = (item.technologies || []).map((t: any) => t.name || t.slug || '').filter(Boolean)
      return [{ text: techs.join(' · '), type: 'output' as const }]
    }
  }

  if (path[0] === 'certs') {
    if (name === 'issuer') {
      return [{ text: `Provider: ${item.provider}`, type: 'output' as const }]
    }
    if (name === 'date') {
      return [{ text: `Issued: ${item.issued}`, type: 'output' as const }]
    }
  }

  return [{ text: `cat: ${name}: no such file`, type: 'error' as const }]
}

function treeLines(path: string[], prefix: string): TerminalLine[] {
  const children = getChildren(path)
  if (children.length === 0) return []
  const result: TerminalLine[] = []
  for (let i = 0; i < children.length; i++) {
    const isLast = i === children.length - 1
    const connector = isLast ? '└── ' : '├── '
    const nextPrefix = prefix + (isLast ? '    ' : '│   ')
    const child = children[i]
    const isDir = child.endsWith('/')
    const name = isDir ? child : child
    result.push({ text: `${prefix}${connector}${name}`, type: isDir ? 'output' as const : 'dim' as const })
    if (isDir) {
      const childPath = [...path, child.slice(0, -1)]
      result.push(...treeLines(childPath, nextPrefix))
    } else {
      const childPath = path.length === 0 ? [child.slice(1)] : [...path]
      if (child === '.ai') {
        result.push({ text: `${nextPrefix}  [hidden AI info file]`, type: 'dim' as const })
      }
    }
  }
  return result
}

function findAll(query: string): TerminalLine[] {
  const q = query.toLowerCase()
  const result: TerminalLine[] = [{ text: `Searching for "${query}"...`, type: 'dim' as const }, { text: '', type: 'system' as const }]
  let found = 0

  projects.forEach((p: any) => {
    const name = (p.name || p.title || '').toLowerCase()
    const desc = (p.description || '').toLowerCase()
    if (name.includes(q) || desc.includes(q)) {
      const s = slugify(p.name || p.title || '')
      const status = typeof p.status === 'string' ? p.status : p.status?.title || ''
      result.push({ text: `~/projects/${s}/  ${status ? `— ${status}` : ''}`, type: 'output' as const })
      found++
    }
  })

  techs.forEach((t: any) => {
    if (t.name.toLowerCase().includes(q)) {
      result.push({ text: `~/skills/${slugify(t.name)}/`, type: 'output' as const })
      found++
    }
  })

  workexp.forEach((w: any) => {
    const company = w.company.toLowerCase()
    const title = (w.title || '').toLowerCase()
    if (company.includes(q) || title.includes(q)) {
      result.push({ text: `~/experience/${slugify(w.company)}/  — ${w.title}`, type: 'output' as const })
      found++
    }
  })

  certifications.forEach((c: any) => {
    const name = c.name.toLowerCase()
    const provider = c.provider.toLowerCase()
    if (name.includes(q) || provider.includes(q)) {
      result.push({ text: `~/certs/${slugify(c.name)}/  — ${c.provider}`, type: 'output' as const })
      found++
    }
  })

  result.push({ text: '', type: 'system' as const })
  result.push({ text: `${found} result${found !== 1 ? 's' : ''} found.`, type: 'dim' as const })
  return result
}

function stripHtml(html: string): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '').trim()
}

function getPrompt(): string {
  if (cwd.value.length === 0) return 'visitor@alex:~$'
  return `visitor@alex:~/${cwd.value.join('/')}$`
}

// ── Structured Commands ──

interface StructuredCommand {
  match: (input: string) => boolean
  handler: (input: string) => TerminalLine[]
}

function getStructuredCommands(): StructuredCommand[] {
  return [
    {
      match: (input) => input === 'help' || input === '?',
      handler: (_input: string) => [
        { text: 'AVAILABLE COMMANDS', type: 'dim' as const },
        { text: '────────────────', type: 'dim' as const },
        { text: '  ls                  — List current directory', type: 'dim' as const },
        { text: '  cd <dir>            — Navigate into a directory', type: 'dim' as const },
        { text: '  cd ..               — Go up one level', type: 'dim' as const },
        { text: '  cd ~                — Go home', type: 'dim' as const },
        { text: '  cat <file>          — View file contents', type: 'dim' as const },
        { text: '  pwd                 — Print current path', type: 'dim' as const },
        { text: '  tree                — Show full directory tree', type: 'dim' as const },
        { text: '  find <query>        — Search all items', type: 'dim' as const },
        { text: '  whois               — View profile and bio', type: 'dim' as const },
        { text: '  contact | links     — Social links and email', type: 'dim' as const },
        { text: '  resume | cv         — Resume access', type: 'dim' as const },
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
      handler: (_input: string) => [
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
      match: (input) => input === 'ls',
      handler: (_input: string) => lsDir(cwd.value)
    },
    {
      match: (input) => input.startsWith('ls ') && input.length > 3,
      handler: (input: string) => {
        const target = input.slice(3).trim()
        if (target.startsWith('/') || target.includes('/')) {
          return [{ text: 'ls: absolute paths not yet supported. Use cd to navigate.', type: 'error' as const }]
        }
        const found = findItem(cwd.value, target)
        if (found) {
          return lsDir([...cwd.value, slugify(found.name || found.title || found.company || '')])
        }
        return [{ text: `ls: ${target}: no such file or directory`, type: 'error' as const }]
      }
    },
    {
      match: (input) => input === 'cd' || input === 'cd ~',
      handler: (_input: string) => {
        cwd.value = []
        return []
      }
    },
    {
      match: (input) => input === 'cd ..',
      handler: (_input: string) => {
        if (cwd.value.length > 0) {
          cwd.value = cwd.value.slice(0, -1)
        }
        return []
      }
    },
    {
      match: (input) => input.startsWith('cd '),
      handler: (input: string) => {
        const target = input.slice(3).trim()
        const children = getChildren(cwd.value)
        const dirs = children.filter(c => c.endsWith('/')).map(c => c.slice(0, -1))
        if (dirs.includes(target)) {
          cwd.value = [...cwd.value, target]
          return []
        }
        const slug = slugify(target)
        const match = dirs.find(d => slugify(d) === slug)
        if (match) {
          cwd.value = [...cwd.value, match]
          return []
        }
        return [{ text: `cd: ${target}: no such directory`, type: 'error' as const }]
      }
    },
    {
      match: (input) => input === 'pwd',
      handler: (_input: string) => {
        const path = cwd.value.length === 0 ? '~' : `~/${cwd.value.join('/')}`
        return [{ text: path, type: 'output' as const }]
      }
    },
    {
      match: (input) => input.startsWith('cat '),
      handler: (input: string) => {
        const target = input.slice(4).trim()
        return catFile(cwd.value, target)
      }
    },
    {
      match: (input) => input === 'tree',
      handler: (_input: string) => {
        const lines: TerminalLine[] = [
          { text: '~', type: 'output' as const },
          ...treeLines([], ''),
        ]
        return lines
      }
    },
    {
      match: (input) => input.startsWith('find '),
      handler: (input: string) => {
        const query = input.slice(5).trim()
        if (!query) return [{ text: 'find: missing search query', type: 'error' as const }]
        return findAll(query)
      }
    },
    {
      match: (input) => input === 'ls skills' || input === 'skills',
      handler: (_input: string) => {
        const names = techs.map((t) => t.name)
        const outputLine = names.join(' | ')
        return [
          { text: 'TECH STACK', type: 'dim' as const },
          { text: '──────────', type: 'dim' as const },
          { text: outputLine, type: 'output' as const },
        ]
      }
    },
    {
      match: (input) => input === 'ls projects' || input === 'projects',
      handler: (_input: string) => {
        const result: TerminalLine[] = [
          { text: 'PROJECTS', type: 'dim' as const },
          { text: '────────', type: 'dim' as const },
        ]
        projects.forEach((p: any, i: number) => {
          const name = p.name || p.title || 'Unknown'
          const status = typeof p.status === 'string' ? p.status : p.status?.title || 'Unknown'
          const techList = (p.techUsed || p.technologies || [])
            .map((t: any) => t.name || t.slug || '')
            .filter(Boolean)
            .join(' · ')
          result.push({ text: `${i + 1}. ${name} — ${status}`, type: 'output' as const })
          result.push({ text: `   ${techList}`, type: 'dim' as const })
          result.push({ text: '', type: 'system' as const })
        })
        return result
      }
    },
    {
      match: (input) => input === 'ls experience' || input === 'experience',
      handler: (_input: string) => {
        const result: TerminalLine[] = [
          { text: 'WORK EXPERIENCE', type: 'dim' as const },
          { text: '───────────────', type: 'dim' as const },
        ]
        workexp.forEach((w: any, i: number) => {
          const endStr = w.isPresent ? 'Present' : (w.endDate || '')
          const techStr = (w.technologies || []).map((t: any) => t.name || t.slug || '').filter(Boolean).join(' · ')
          result.push({ text: `${i + 1}. ${w.title}`, type: 'output' as const })
          result.push({ text: `   ${w.company} — ${w.startDate} to ${endStr}`, type: 'dim' as const })
          result.push({ text: `   ${techStr}`, type: 'dim' as const })
          result.push({ text: '', type: 'system' as const })
        })
        return result
      }
    },
    {
      match: (input) => input === 'ls certs' || input === 'certs',
      handler: (_input: string) => {
        const result: TerminalLine[] = [
          { text: 'CERTIFICATIONS', type: 'dim' as const },
          { text: '──────────────', type: 'dim' as const },
        ]
        certifications.forEach((c: any) => {
          result.push({ text: `• ${c.name} — ${c.provider} (${c.issued})`, type: 'output' as const })
        })
        return result
      }
    },
    {
      match: (input) => input === 'contact' || input === 'links',
      handler: (_input: string) => [
        { text: 'CONNECT', type: 'dim' as const },
        { text: '───────', type: 'dim' as const },
        { text: 'Portfolio: https://alexander.udaglab.com', type: 'output' as const },
        { text: 'GitHub:    https://github.com/Gadu25', type: 'output' as const },
        { text: 'LinkedIn:  https://linkedin.com/in/alexander-udag', type: 'output' as const },
        { text: 'Email:     alexanderudag25@gmail.com', type: 'output' as const },
      ]
    },
    {
      match: (input) => input === 'ls' || input === 'ls --help',
      handler: (_input: string) => [
        { text: 'USAGE: ls [section]', type: 'dim' as const },
        { text: '─────────────────────', type: 'dim' as const },
        { text: '  ls           — List current directory', type: 'dim' as const },
        { text: '  ls skills    — Technologies', type: 'dim' as const },
        { text: '  ls projects  — Project list', type: 'dim' as const },
        { text: '  ls experience— Work history', type: 'dim' as const },
        { text: '  ls certs     — Certifications', type: 'dim' as const },
        { text: '', type: 'system' as const },
        { text: 'Tip: Use cd to navigate directories for a better experience!', type: 'dim' as const },
      ]
    },
    {
      match: (input) => input === 'matrix',
      handler: (_input: string) => [
        { text: 'Wake up, Neo...', type: 'dim' as const },
        { text: 'The Matrix has you...', type: 'dim' as const },
        { text: '', type: 'system' as const },
        { text: '...just kidding. This terminal runs on Gemini, not Sentinels.', type: 'output' as const },
        { text: 'Try whois or help for actual commands.', type: 'dim' as const },
      ]
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
  { text: '    ║  PROTOCOL: Gemini Flash         ║', type: 'dim' as const },
  { text: '    ╚══════════════════════════════════╝', type: 'dim' as const },
  { text: '', type: 'system' as const },
  { text: 'Type help for available commands. Try `ls` and `cd`.', type: 'dim' as const },
]

export function useTerminal() {
  function open() {
    bootTimers.forEach(clearTimeout)
    bootTimers = []

    visible.value = true
    lines.value = []
    cwd.value = []

    let delay = 0
    for (const line of BOOT_LINES) {
      const timer = setTimeout(() => {
        lines.value = [...lines.value, line]
        nextTick(() => scrollToBottom())
      }, delay)
      bootTimers.push(timer)
      delay += 80
    }

    const focusTimer = setTimeout(() => {
      nextTick(() => {
        const inputEl = document.querySelector('.terminal__input') as HTMLInputElement
        inputEl?.focus()
      })
    }, delay + 100)
    bootTimers.push(focusTimer)
  }

  function close() {
    bootTimers.forEach(clearTimeout)
    bootTimers = []
    visible.value = false
    lines.value = []
    currentInput.value = ''
    cwd.value = []
    isStreaming.value = false
    chatHistory.value = []
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

  function tabComplete() {
    const input = currentInput.value.trim()
    if (!input) return

    const parts = input.split(/\s+/)
    if (parts.length !== 2) return
    if (parts[0] !== 'cd' && parts[0] !== 'cat' && parts[0] !== 'ls') return

    const partial = parts[1].toLowerCase()
    const children = getChildren(cwd.value)
    const names = children.map(c => c.endsWith('/') ? c.slice(0, -1) : c)
    const matches = names.filter(n => n.toLowerCase().startsWith(partial))

    if (matches.length === 1) {
      currentInput.value = `${parts[0]} ${matches[0]}`
      nextTick(() => {
        const inputEl = document.querySelector('.terminal__input') as HTMLInputElement
        if (inputEl) {
          inputEl.selectionStart = inputEl.selectionEnd = inputEl.value.length
        }
      })
    } else if (matches.length > 1) {
      addLine({ text: '', type: 'system' as const })
      addLine({ text: matches.map((m, i) => `${parts[0]} ${m}${(i + 1) % 4 === 0 ? '\n' : '   '}`).join('').trim(), type: 'dim' as const })
    }
  }

  function handleResume() {
    addLines([
      { text: '[RESUME ACCESS]', type: 'dim' as const },
      { text: '────────────────', type: 'dim' as const },
      { text: 'To download my resume, visit the homepage and click the "My Resume" button.', type: 'output' as const },
      { text: 'If you\'re already on the homepage, scroll up to the hero section.', type: 'dim' as const },
      { text: 'LinkedIn: https://linkedin.com/in/alexander-udag', type: 'output' as const },
    ])
  }

  async function streamFromApi(input: string) {
    chatHistory.value = [...chatHistory.value, { role: 'user', text: input }]
    let fullText = ''

    try {
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
                addLine({ text: `[${parsed.error}]`, type: 'error' as const })
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
    } catch {
      if (fullText) {
        addLine({ text: '[TRANSMISSION TRUNCATED]', type: 'error' as const })
      }
      addLine({ text: '[CARRIER LOST]', type: 'error' as const })
    }
  }

  async function checkStatus() {
    try {
      const res = await $fetch<{ available: boolean }>('/api/terminal/status')
      aiAvailable.value = res.available
    } catch {
      aiAvailable.value = false
    }
  }

  async function submit() {
    const input = currentInput.value.trim()
    if (!input || isStreaming.value) return

    const prompt = `${getPrompt()} ${input}`

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
      addLines(matched.handler(input))
      currentInput.value = ''
      return
    }

    currentInput.value = ''
    isStreaming.value = true
    await streamFromApi(input)
    isStreaming.value = false
    currentInput.value = ''
  }

  return {
    visible: readonly(visible),
    lines: readonly(lines),
    currentInput,
    isStreaming: readonly(isStreaming),
    aiAvailable: readonly(aiAvailable),
    cwd: readonly(cwd),
    open,
    close,
    toggle,
    addLine,
    addLines,
    addOutputChunk,
    submit,
    navigateHistory,
    tabComplete,
    checkStatus,
    getPrompt,
  }
}

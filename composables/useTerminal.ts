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

// ── Helpers ──

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function stripHtml(html: string): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '').trim()
}

function getPrompt(): string {
  if (cwd.value.length === 0) return 'visitor@alex:~$'
  return `visitor@alex:~/${cwd.value.join('/')}$`
}

// ── Directory tree ──

// Returns children at a path. Directories end with `/`, files do not.
function getChildren(path: string[]): string[] {
  if (path.length === 0) return ['projects/', 'skills/', 'experience/', 'certs/', 'about']
  const dir = path[0]
  if (dir === 'projects') {
    if (path.length === 1) return projects.map((p: any) => slugify(p.name || p.title || '') + '/')
    if (path.length === 2) return ['description', 'status', 'url', 'technologies']
    return []
  }
  if (dir === 'skills') {
    if (path.length === 1) return techs.map((t: any) => slugify(t.name) + '/')
    if (path.length === 2) return ['url']
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

  const knownDirs = ['projects', 'skills', 'experience', 'certs']
  if (path.length === 1 && !knownDirs.includes(path[0])) {
    return [{ text: `ls: ${path[0]}: no such directory`, type: 'error' as const }]
  }

  if (path.length === 1) {
    // Top-level directory listing: show item directories
    if (path[0] === 'projects') {
      const result: TerminalLine[] = []
      projects.forEach((p: any) => {
        const slug = slugify(p.name || p.title || '')
        const status = typeof p.status === 'string' ? p.status : p.status?.title || ''
        result.push({ text: `${slug}/`, type: 'output' as const })
        if (status) result.push({ text: `  ${status}`, type: 'dim' as const })
      })
      return result
    }
    if (path[0] === 'skills') {
      const result: TerminalLine[] = []
      techs.forEach((t: any) => {
        result.push({ text: `${slugify(t.name)}/`, type: 'output' as const })
        result.push({ text: `  ${t.link}`, type: 'dim' as const })
      })
      return result
    }
    if (path[0] === 'experience') {
      const result: TerminalLine[] = []
      workexp.forEach((w: any) => {
        const slug = slugify(w.company)
        const endStr = w.isPresent ? 'Present' : (w.endDate || '')
        result.push({ text: `${slug}/`, type: 'output' as const })
        result.push({ text: `  ${w.title} (${w.startDate} - ${endStr})`, type: 'dim' as const })
      })
      return result
    }
    if (path[0] === 'certs') {
      const result: TerminalLine[] = []
      certifications.forEach((c: any) => {
        result.push({ text: `${slugify(c.name)}/`, type: 'output' as const })
        result.push({ text: `  ${c.provider} — ${c.issued}`, type: 'dim' as const })
      })
      return result
    }
  }

  // Depth 2: inside a specific item, show table-style summary
  if (path.length === 2) {
    const item = findItem(path.slice(0, 1), path[1])
    if (!item) return [{ text: `ls: ${path[1]}: no such item`, type: 'error' as const }]

    if (path[0] === 'projects') {
      const showName = item.name || item.title || ''
      const showStatus = typeof item.status === 'string' ? item.status : item.status?.title || ''
      const showUrl = item.url || item.link || ''
      const showTech = (item.techUsed || item.technologies || []).map((t: any) => t.name || t.slug || '').filter(Boolean).join(' · ')
      return [
        { text: showName, type: 'output' as const },
        { text: '─'.repeat(showName.length), type: 'dim' as const },
        { text: `status       ${showStatus}`, type: 'output' as const },
        { text: `url          ${showUrl}`, type: 'output' as const },
        { text: `technologies ${showTech}`, type: 'output' as const },
        { text: '', type: 'system' as const },
        { text: 'files: description  status  url  technologies', type: 'dim' as const },
      ]
    }
    if (path[0] === 'skills') {
      return [
        { text: item.name, type: 'output' as const },
        { text: '─'.repeat(item.name.length), type: 'dim' as const },
        { text: `url  ${item.link}`, type: 'output' as const },
      ]
    }
    if (path[0] === 'experience') {
      const endStr = item.isPresent ? 'Present' : (item.endDate || '')
      const showTech = (item.technologies || []).map((t: any) => t.name || t.slug || '').filter(Boolean).join(' · ')
      return [
        { text: `${item.title} at ${item.company}`, type: 'output' as const },
        { text: '─'.repeat(Math.min(item.title.length + item.company.length + 4, 60)), type: 'dim' as const },
        { text: `role         ${item.title}`, type: 'output' as const },
        { text: `company      ${item.company}`, type: 'output' as const },
        { text: `dates        ${item.startDate} - ${endStr}`, type: 'output' as const },
        { text: `technologies ${showTech}`, type: 'output' as const },
        { text: '', type: 'system' as const },
        { text: 'files: description  role  dates  technologies', type: 'dim' as const },
      ]
    }
    if (path[0] === 'certs') {
      return [
        { text: item.name, type: 'output' as const },
        { text: '─'.repeat(item.name.length), type: 'dim' as const },
        { text: `issuer  ${item.provider}`, type: 'output' as const },
        { text: `date    ${item.issued}`, type: 'output' as const },
      ]
    }
  }

  return []
}

function catFile(path: string[], name: string): TerminalLine[] {
  if (path.length === 0 && name === 'about') {
    return [
      { text: 'ALEXANDER UDAG', type: 'output' as const },
      { text: '─────────────────────────────', type: 'dim' as const },
      { text: 'Creative Software Engineer', type: 'output' as const },
      { text: '', type: 'system' as const },
      { text: 'Frontend-focused fullstack developer passionate about', type: 'output' as const },
      { text: 'Vue, Nuxt, and modern web technologies. Skilled in building', type: 'output' as const },
      { text: 'scalable component libraries and designing clean UIs.', type: 'output' as const },
    ]
  }

  if (path.length === 0) {
    return [{ text: `cat: ${name}: no such file`, type: 'error' as const }]
  }

  const item = findItem(path.slice(0, 1), path[1])
  if (!item) return [{ text: `cat: ${name}: no such file`, type: 'error' as const }]

  if (path[0] === 'projects') {
    if (name === 'description') return [{ text: item.description || '', type: 'output' as const }]
    if (name === 'status') {
      const s = typeof item.status === 'string' ? item.status : item.status?.title || 'unknown'
      return [{ text: s, type: 'output' as const }]
    }
    if (name === 'url') return [{ text: item.url || item.link || 'no url', type: 'output' as const }]
    if (name === 'technologies') {
      const t = (item.techUsed || item.technologies || []).map((x: any) => x.name || x.slug || '').filter(Boolean).join(' · ')
      return [{ text: t, type: 'output' as const }]
    }
  }

  if (path[0] === 'skills') {
    if (name === 'url') return [{ text: item.link, type: 'output' as const }]
  }

  if (path[0] === 'experience') {
    if (name === 'description') return [{ text: stripHtml(item.description || ''), type: 'output' as const }]
    if (name === 'role') return [{ text: item.title || '', type: 'output' as const }]
    if (name === 'dates') {
      const endStr = item.isPresent ? 'Present' : (item.endDate || '')
      return [{ text: `${item.startDate} - ${endStr}`, type: 'output' as const }]
    }
    if (name === 'technologies') {
      const t = (item.technologies || []).map((x: any) => x.name || x.slug || '').filter(Boolean).join(' · ')
      return [{ text: t, type: 'output' as const }]
    }
  }

  if (path[0] === 'certs') {
    if (name === 'issuer') return [{ text: item.provider, type: 'output' as const }]
    if (name === 'date') return [{ text: item.issued, type: 'output' as const }]
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
    const name = child
    result.push({ text: `${prefix}${connector}${name}`, type: isDir ? 'output' as const : 'dim' as const })
    if (isDir) {
      result.push(...treeLines([...path, child.slice(0, -1)], nextPrefix))
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

// ── Structured Commands ──

interface StructuredCommand {
  match: (input: string) => boolean
  handler: (input: string) => TerminalLine[]
}

function getStructuredCommands(): StructuredCommand[] {
  return [
    {
      match: (input) => input === 'help' || input === '?',
      handler: () => [
        { text: 'AVAILABLE COMMANDS', type: 'dim' as const },
        { text: '────────────────', type: 'dim' as const },
        { text: '  ls                  — List current directory', type: 'dim' as const },
        { text: '  cd <dir>            — Navigate into a directory', type: 'dim' as const },
        { text: '  cd .. | cd ../      — Go up one level', type: 'dim' as const },
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
        { text: 'Type anything else to chat with the system operator.', type: 'dim' as const },
      ]
    },
    {
      match: (input) => input === 'whois',
      handler: () => [
        { text: 'ALEXANDER UDAG', type: 'output' as const },
        { text: '─────────────────────────────', type: 'dim' as const },
        { text: 'Creative Software Engineer', type: 'output' as const },
        { text: 'Location: Philippines', type: 'output' as const },
        { text: '', type: 'system' as const },
        { text: 'Frontend-focused fullstack developer passionate about', type: 'output' as const },
        { text: 'Vue, Nuxt, and modern web technologies. Skilled in building', type: 'output' as const },
        { text: 'scalable component libraries and designing clean UIs.', type: 'output' as const },
        { text: '', type: 'system' as const },
        { text: 'Currently: Frontend Software Engineer at Flexicon Solution Inc.', type: 'output' as const },
      ]
    },
    { match: (input) => input === 'ls', handler: () => lsDir(cwd.value) },
    { match: (input) => input === 'ls --help', handler: () => [
      { text: 'USAGE: ls', type: 'dim' as const },
      { text: '─────────', type: 'dim' as const },
      { text: '  ls           — List current directory', type: 'dim' as const },
      { text: '', type: 'system' as const },
      { text: 'Tip: Use cd to navigate directories, then ls to explore!', type: 'dim' as const },
    ]},
    {
      match: (input) => input.startsWith('ls ') && input.length > 3,
      handler: (input: string) => {
        const target = input.slice(3).trim()
        if (target.startsWith('/')) return [{ text: 'ls: absolute paths not supported', type: 'error' as const }]
        const found = findItem(cwd.value, target)
        if (found) return lsDir([...cwd.value, slugify(found.name || found.title || found.company || '')])
        return [{ text: `ls: ${target}: no such file or directory`, type: 'error' as const }]
      }
    },
    {
      match: (input) => input === 'cd' || input === 'cd ~',
      handler: () => { cwd.value = []; return [] }
    },
    {
      match: (input) => input === 'cd ..' || input === 'cd ../',
      handler: () => {
        if (cwd.value.length > 0) cwd.value = cwd.value.slice(0, -1)
        return []
      }
    },
    {
      match: (input) => input.startsWith('cd '),
      handler: (input: string) => {
        const target = input.slice(3).trim()
        if (target === '..' || target === '../') {
          if (cwd.value.length > 0) cwd.value = cwd.value.slice(0, -1)
          return []
        }
        if (target === '~') { cwd.value = []; return [] }
        const children = getChildren(cwd.value)
        const dirs = children.filter(c => c.endsWith('/')).map(c => c.slice(0, -1))
        if (dirs.includes(target)) { cwd.value = [...cwd.value, target]; return [] }
        const slug = slugify(target)
        const match = dirs.find(d => slugify(d) === slug)
        if (match) { cwd.value = [...cwd.value, match]; return [] }
        const files = children.filter(c => !c.endsWith('/'))
        if (files.includes(target) || files.some(f => slugify(f) === slug)) {
          return [{ text: `cd: ${target}: not a directory`, type: 'error' as const }]
        }
        return [{ text: `cd: ${target}: no such file or directory`, type: 'error' as const }]
      }
    },
    {
      match: (input) => input === 'pwd',
      handler: () => [{ text: cwd.value.length === 0 ? '~' : `~/${cwd.value.join('/')}`, type: 'output' as const }]
    },
    {
      match: (input) => input.startsWith('cat '),
      handler: (input: string) => catFile(cwd.value, input.slice(4).trim())
    },
    {
      match: (input) => input === 'tree',
      handler: () => [{ text: '~', type: 'output' as const }, ...treeLines([], '')]
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
      match: (input) => input === 'skills' || input === 'ls skills',
      handler: () => [
        { text: 'TECH STACK', type: 'dim' as const },
        { text: '──────────', type: 'dim' as const },
        { text: techs.map((t) => t.name).join(' | '), type: 'output' as const },
      ]
    },
    {
      match: (input) => input === 'projects' || input === 'ls projects',
      handler: () => {
        const result: TerminalLine[] = [{ text: 'PROJECTS', type: 'dim' as const }, { text: '────────', type: 'dim' as const }]
        projects.forEach((p: any, i: number) => {
          const name = p.name || p.title || 'Unknown'
          const status = typeof p.status === 'string' ? p.status : p.status?.title || 'Unknown'
          const techList = (p.techUsed || p.technologies || []).map((t: any) => t.name || t.slug || '').filter(Boolean).join(' · ')
          result.push({ text: `${i + 1}. ${name} — ${status}`, type: 'output' as const })
          result.push({ text: `   ${techList}`, type: 'dim' as const })
          result.push({ text: '', type: 'system' as const })
        })
        return result
      }
    },
    {
      match: (input) => input === 'experience' || input === 'ls experience',
      handler: () => {
        const result: TerminalLine[] = [{ text: 'WORK EXPERIENCE', type: 'dim' as const }, { text: '───────────────', type: 'dim' as const }]
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
      match: (input) => input === 'certs' || input === 'ls certs',
      handler: () => {
        const result: TerminalLine[] = [{ text: 'CERTIFICATIONS', type: 'dim' as const }, { text: '──────────────', type: 'dim' as const }]
        certifications.forEach((c: any) => {
          result.push({ text: `• ${c.name} — ${c.provider} (${c.issued})`, type: 'output' as const })
        })
        return result
      }
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
      handler: () => [
        { text: 'Wake up, Neo...', type: 'dim' as const },
        { text: 'The Matrix has you...', type: 'dim' as const },
        { text: '', type: 'system' as const },
        { text: '...just kidding. Try whois or help for actual commands.', type: 'output' as const },
      ]
    },
  ]
}

const BOOT_LINES = [
  { text: '   +------------------------------------------+', type: 'dim' as const },
  { text: '   |                                          |', type: 'dim' as const },
  { text: '   |     █████╗ ██╗     ███████╗██╗  ██╗      |', type: 'dim' as const },
  { text: '   |    ██╔══██╗██║     ██╔════╝╚██╗██╔╝      |', type: 'dim' as const },
  { text: '   |    ███████║██║     █████╗   ╚███╔╝       |', type: 'dim' as const },
  { text: '   |    ██╔══██║██║     ██╔══╝   ██╔██╗       |', type: 'dim' as const },
  { text: '   |    ██║  ██║███████╗███████╗██╔╝ ██╗      |', type: 'dim' as const },
  { text: '   |    ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝      |', type: 'dim' as const },
  { text: '   |                                          |', type: 'dim' as const },
  { text: '   |        PORTFOLIO TERMINAL v1.0           |', type: 'dim' as const },
  { text: '   |        CONNECTION ESTABLISHED            |', type: 'dim' as const },
  { text: '   |                                          |', type: 'dim' as const },
  { text: '   +------------------------------------------+', type: 'dim' as const },
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
      delay += 60
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

  function toggle() { visible.value ? close() : open() }

  function addLine(line: TerminalLine) { lines.value = [...lines.value, line]; nextTick(() => scrollToBottom()) }
  function addLines(newLines: TerminalLine[]) { lines.value = [...lines.value, ...newLines]; nextTick(() => scrollToBottom()) }

  function addOutputChunk(text: string, isNew: boolean) {
    if (isNew) lines.value = [...lines.value, { text: '', type: 'output' }]
    const last = lines.value[lines.value.length - 1]
    if (last && last.type === 'output') last.text += text
    nextTick(() => scrollToBottom())
  }

  function scrollToBottom() {
    const body = document.querySelector('.terminal__body')
    if (body) body.scrollTop = body.scrollHeight
  }

  function navigateHistory(direction: 'up' | 'down') {
    if (history.value.length === 0) return
    if (direction === 'up') {
      if (historyIndex.value < history.value.length - 1) historyIndex.value++
    } else {
      if (historyIndex.value > -1) historyIndex.value--
    }
    currentInput.value = historyIndex.value >= 0 ? history.value[history.value.length - 1 - historyIndex.value] : ''
    nextTick(() => {
      const inputEl = document.querySelector('.terminal__input') as HTMLInputElement
      if (inputEl) inputEl.selectionStart = inputEl.selectionEnd = inputEl.value.length
    })
  }

  function tabComplete() {
    const input = currentInput.value.trim()
    if (!input) return
    const parts = input.split(/\s+/)
    if (parts.length !== 2 || (parts[0] !== 'cd' && parts[0] !== 'cat')) return
    const partial = parts[1].toLowerCase()
    const children = getChildren(cwd.value)
    const names = children.map(c => c.endsWith('/') ? c.slice(0, -1) : c)
    const matches = names.filter(n => n.toLowerCase().startsWith(partial))
    if (matches.length === 1) {
      currentInput.value = `${parts[0]} ${matches[0]}`
      nextTick(() => {
        const inputEl = document.querySelector('.terminal__input') as HTMLInputElement
        if (inputEl) inputEl.selectionStart = inputEl.selectionEnd = inputEl.value.length
      })
    } else if (matches.length > 1) {
      addLine({ text: '', type: 'system' as const })
      addLine({ text: matches.join('  '), type: 'dim' as const })
    }
  }

  function handleResume() {
    addLines([
      { text: '[RESUME ACCESS]', type: 'dim' as const },
      { text: '────────────────', type: 'dim' as const },
      { text: 'To download my resume, visit the homepage and click', type: 'output' as const },
      { text: 'the "My Resume" button in the hero section.', type: 'output' as const },
      { text: 'LinkedIn: https://linkedin.com/in/alexander-udag', type: 'output' as const },
    ])
  }

  async function streamFromApi(input: string) {
    chatHistory.value = [...chatHistory.value, { role: 'user', text: input }]
    let fullText = ''
    try {
      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: chatHistory.value.slice(0, -1) })
      })
      if (!response.ok) {
        addLine({ text: '[CONNECTION UNSTABLE - try again later]', type: 'error' as const })
        return
      }
      let isFirstChunk = true
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const linesArr = buffer.split('\n')
        buffer = linesArr.pop() || ''
        for (const line of linesArr) {
          if (!line.startsWith('data: ')) continue
          const jsonStr = line.slice(6).trim()
          if (!jsonStr) continue
          try {
            const parsed = JSON.parse(jsonStr)
            if (parsed.error) { addLine({ text: `[${parsed.error}]`, type: 'error' as const }); continue }
            if (parsed.text) { fullText += parsed.text; addOutputChunk(parsed.text, isFirstChunk); isFirstChunk = false }
          } catch {}
        }
      }
      if (fullText) {
        chatHistory.value = [...chatHistory.value, { role: 'model', text: fullText }]
        if (fullText.includes('RATE LIMITED') || fullText.includes('COOLDOWN')) {
          aiAvailable.value = false
        }
      }
    } catch {
      if (fullText) addLine({ text: '[TRANSMISSION TRUNCATED]', type: 'error' as const })
      addLine({ text: '[CARRIER LOST]', type: 'error' as const })
    }
  }

  async function checkStatus() {
    try {
      const res = await $fetch<{ available: boolean }>('/api/terminal/status')
      aiAvailable.value = res.available
    } catch { aiAvailable.value = false }
  }

  async function submit() {
    const input = currentInput.value.trim()
    if (!input || isStreaming.value) return
    const promptText = `${getPrompt()} ${input}`

    if (input === 'clear' || input === 'cls') { lines.value = []; currentInput.value = ''; return }
    if (input === 'exit' || input === 'logout') { close(); return }
    if (input === 'resume' || input === 'cv') {
      addLine({ text: promptText, type: 'prompt' })
      handleResume()
      currentInput.value = ''
      history.value = [...history.value, input]
      historyIndex.value = -1
      return
    }

    history.value = [...history.value, input]
    historyIndex.value = -1
    addLine({ text: promptText, type: 'prompt' })

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
    visible: readonly(visible), lines: readonly(lines), currentInput,
    isStreaming: readonly(isStreaming), aiAvailable: readonly(aiAvailable),
    cwd: readonly(cwd), open, close, toggle, addLine, addLines, addOutputChunk,
    submit, navigateHistory, tabComplete, checkStatus, getPrompt,
  }
}

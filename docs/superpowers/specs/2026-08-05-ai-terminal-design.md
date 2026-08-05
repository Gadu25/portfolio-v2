# AI Terminal — Design Spec

**Date:** 2026-08-05
**Status:** Draft

## Overview

Add an interactive AI-powered terminal emulator to the portfolio site. Visitors can type commands to explore portfolio content or chat freely with an AI persona. The terminal has a mysterious hacker aesthetic, blending into the existing monochrome Swiss Modernist design.

**Goals:** Impress/entertain visitors, demonstrate AI integration skills, serve practical function (answering questions about the portfolio owner).

## Architecture

```
Visitor types → Terminal.vue
  → matches structured command? → render response directly
  → no match → POST /api/terminal { message, history }
    → server/api/terminal.post.ts
      → builds system prompt with portfolio context
      → calls Gemini API with streaming
      → streams tokens back as SSE
    → Terminal.vue renders tokens character-by-character
```

### Entry Point
- A subtle `>_` icon in the navigation bar
- Keyboard shortcut: `Ctrl+K`
- Opens as a full-screen overlay with backdrop blur, so the site is visible beneath

### Why Server Route
The Gemini API key stays server-side. The route injects portfolio context into the system prompt so Gemini always has up-to-date data. Streaming responses keep the terminal feel authentic.

**Model:** `gemini-2.0-flash` — fast responses for interactive terminal feel, generous free tier.

## File Layout

```
server/api/terminal.post.ts           # API proxy → Gemini streaming
components/Terminal.vue                # Terminal UI component
composables/useTerminal.ts            # Terminal state, command history, input handling
assets/css/components/_terminal.scss   # Terminal styling
```

## Terminal UI Design

**Overlay:** Full-screen, `rgba(0, 0, 0, 0.92)` backdrop with strong `backdrop-filter: blur()`.

**Surface:** `#0D1117` terminal body, centered, max-width ~900px on desktop, 60-70% height on mobile.

**Typography:** System monospace stack: `"Cascadia Code", "Fira Code", "JetBrains Mono", monospace`. Falls back to system monospace — no extra font download needed.

### Color Palette
| Token | Value | Purpose |
|---|---|---|
| Terminal surface | `#0D1117` | Terminal background |
| Text green | `#3BFf7F` | Prompt, AI responses |
| Error red | `#FF5555` | Errors, warnings |
| Dim gray | `#6B7280` | Timestamps, system messages |

### Boot Sequence
On open, a 2-3 second animation plays:
- ASCII block-letter art of the portfolio owner's name
- "CONNECTION ESTABLISHED" with glitchy flicker effect
- Then the prompt appears: `visitor@alex:~$` with blinking cursor

### Interaction Features
- **Streamed responses:** Gemini output types out character-by-character (SSE streaming)
- **Command history:** Up/down arrows cycle through previous commands (in-memory, per session)
- **Glitch artifacts:** Occasional flicker/jitter on certain keywords (purely CSS)
- **Close methods:** `exit` command, `Ctrl+C`, `Ctrl+K`, or `Esc` key
- **Mobile:** Drag handle to dismiss, reduced height

## Command System

### Structured Commands (parsed client-side, no API call)

| Command | Action |
|---|---|
| `help` or `?` | Lists all commands with descriptions |
| `whois` | Bio, name, title from cached profile data |
| `ls projects` / `projects` | Project list with tech stacks |
| `ls experience` / `experience` | Work history with dates and companies |
| `ls skills` / `skills` | Tech stack grid |
| `ls certs` / `certs` | Certifications list |
| `contact` / `links` | Social links (GitHub, LinkedIn), email |
| `resume` / `cv` | Triggers the existing resume download dialog |
| `clear` / `cls` | Clears terminal output |
| `exit` / `logout` | Closes the terminal overlay |

### Easter Eggs (client-side + AI-generated)

| Command | Action |
|---|---|
| `matrix` | Green rain animation in the terminal |
| `hack` / `sudo` | AI generates a funny fake hacking sequence |

### Free-form Fallback
Any input that doesn't match a structured command is sent to Gemini. The AI answers in character with full portfolio context.

## System Prompt

Injected server-side in `server/api/terminal.post.ts`:

```
You are the system operator of this portfolio terminal.
Persona: a cryptic but helpful operator. Speak in terminal-
appropriate language. Be concise. Use monospace-friendly
formatting. No emojis. No markdown headers.

PORTFOLIO CONTEXT:
- Name: [profile.name]
- Title: [profile.title]
- Bio: [profile.bio]
- Experience: [work history list]
- Projects: [project list with tech]
- Skills: [tech stack]
- Certifications: [cert list]
- Links: [social/contact]

RULES:
- Structured queries (skills, projects, experience): respond
  directly with the data
- Free-form questions: answer in character, 1-4 lines max
- If asked something unrelated: deflect with terminal humor
  ("That command requires elevated privileges. sudo?" or
  "Unknown protocol. Try `help` for available commands.")
```

Portfolio context is loaded once from the static data files (`data/*.js`) — no runtime API call to Megome needed on every chat request.

## Error Handling

| Scenario | User sees |
|---|---|
| Gemini API down / rate limited | `[CONNECTION UNSTABLE - retry in ~5s]` in red |
| Network error | `[CARRIER LOST]` with retry prompt |
| Empty input | No request sent, cursor blinks |
| Input > 500 chars | Trimmed before sending |
| Stream interrupted | Partial response + `[TRANSMISSION TRUNCATED]` |

## Integration Points

- **Navigation.vue:** Add `>_` button next to the theme toggle
- **Resume download:** Reuse existing `ConfirmDialog` component via the `resume`/`cv` commands
- **Data:** Read directly from `data/techs.js`, `data/workexp.js`, `data/projects.js`, `data/certifications.js` for structured commands
- **CSS:** New partial `_terminal.scss` imported into `assets/css/main.scss`

## Constraints

- Gemini API key stored in `.env` as `GEMINI_API_KEY`
- No additional npm dependencies needed (use `$fetch` for streaming)
- Mobile-friendly — terminal overlay adapts to smaller screens
- Accessible — keyboard navigable, escape to close

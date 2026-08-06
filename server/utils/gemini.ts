const COOLDOWN_SECONDS = 75

let cooldownUntil: number | null = null

export function setCooldown(seconds: number) {
  cooldownUntil = Date.now() + seconds * 1000
}

export function isAvailable(): boolean {
  if (!cooldownUntil) return true
  if (Date.now() >= cooldownUntil) {
    cooldownUntil = null
    return true
  }
  return false
}

export function remainingCooldown(): number | null {
  if (!cooldownUntil) return null
  const remaining = Math.ceil((cooldownUntil - Date.now()) / 1000)
  return remaining > 0 ? remaining : null
}

export function parseRetryDelay(errorBody: string): number | null {
  try {
    const parsed = JSON.parse(errorBody)
    const details = parsed?.error?.details || []
    for (const detail of details) {
      if (detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo') {
        const match = detail.retryDelay.match(/(\d+)s/)
        if (match) return parseInt(match[1], 10)
      }
    }
  } catch {}
  return COOLDOWN_SECONDS
}

export function formatCooldown(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.ceil(seconds / 60)
  return `${mins} minute${mins > 1 ? 's' : ''}`
}

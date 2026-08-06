import { isAvailable, remainingCooldown, formatCooldown } from '~/server/utils/gemini'

export default defineEventHandler(() => {
  const available = isAvailable()
  const remaining = remainingCooldown()

  return {
    available,
    cooldown: remaining ? {
      seconds: remaining,
      formatted: formatCooldown(remaining)
    } : null
  }
})

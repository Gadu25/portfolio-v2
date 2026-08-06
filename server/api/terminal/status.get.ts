import { isAvailable, remainingCooldown, formatCooldown } from '~/server/utils/gemini'

export default defineEventHandler(() => {
  const config = useRuntimeConfig()
  const apiKey = config.geminiApiKey as string | undefined

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return {
      available: false,
      cooldown: null,
      reason: 'api_key_missing'
    }
  }

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

import type { ApiSettings } from "@/lib/local-progress"

export function isMentorConfigured(settings: ApiSettings): boolean {
  const provider = settings.provider
  const hasModel = Boolean(settings.models[provider]?.trim())
  const hasApiKey = Boolean(settings.apiKeys[provider]?.trim())
  return hasModel && hasApiKey
}

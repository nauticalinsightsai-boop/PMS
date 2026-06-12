import type { ConsultationTier } from '../types/channelLandingPage'

export const TIER_DURATION_LIMITS = {
  discovery: { min: 15, max: 30 },
  executive: { min: 30, max: 45 },
  'design-review': { min: 60, max: 90 },
  'mentor-intro': { min: 15, max: 30 },
  'career-pathway': { min: 30, max: 45 },
  'services-detail': { min: 30, max: 60 },
} as const

/** `/go/webinar` uses 1h + 2h mentor blocks. */
export const WEBINAR_TIER_DURATION_LIMITS = {
  'mentor-intro': { min: 60, max: 60 },
  'career-pathway': { min: 120, max: 120 },
} as const

export type TierDurationId = keyof typeof TIER_DURATION_LIMITS

function durationLimitsForTier(tierId: string, channelId?: string) {
  if (channelId === 'webinar' && tierId in WEBINAR_TIER_DURATION_LIMITS) {
    return WEBINAR_TIER_DURATION_LIMITS[tierId as keyof typeof WEBINAR_TIER_DURATION_LIMITS]
  }
  return TIER_DURATION_LIMITS[tierId as TierDurationId]
}

/** Parse "15 Minutes", "45 min", "1 hr", "2 hrs" → minutes (null if unknown). */
export function parseMinutesFromDurationLabel(label: string): number | null {
  const s = label.trim().toLowerCase()
  const minMatch = s.match(/(\d+)\s*(?:min|minute)/)
  if (minMatch) return Number(minMatch[1])
  const hrMatch = s.match(/(\d+(?:\.\d+)?)\s*(?:hrs?|hours?)/)
  if (hrMatch) return Math.round(Number(hrMatch[1]) * 60)
  const bare = s.match(/^(\d+)\s*$/)
  if (bare) return Number(bare[1])
  return null
}

export function assertTierDurationsValid(
  tiers: ConsultationTier[],
  channelId?: string,
): void {
  for (const tier of tiers) {
    const limits = durationLimitsForTier(tier.id, channelId)
    if (!limits) continue
    const minutes = parseMinutesFromDurationLabel(tier.durationLabel)
    if (minutes == null) continue
    if (minutes < limits.min || minutes > limits.max) {
      throw new Error(
        `Tier "${tier.id}" duration ${minutes}m is outside ${limits.min}-${limits.max}m (${tier.durationLabel})`
      )
    }
  }
}

export function formatDurationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} Minutes`
  const hrs = Math.floor(minutes / 60)
  const rem = minutes % 60
  if (rem === 0) return hrs === 1 ? '60 Minutes' : `${minutes} Minutes`
  return `${minutes} Minutes`
}
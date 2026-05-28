import type { ConsultationTier } from '../types/channelLandingPage'

export const TIER_DURATION_LIMITS = {
  discovery: { min: 15, max: 30 },
  executive: { min: 30, max: 45 },
  'design-review': { min: 60, max: 90 },
  'mentor-intro': { min: 15, max: 30 },
  'career-pathway': { min: 30, max: 45 },
  'services-detail': { min: 30, max: 60 },
} as const

export type TierDurationId = keyof typeof TIER_DURATION_LIMITS

/** Parse "15 Minutes", "45 min", "1 hour" → minutes (null if unknown). */
export function parseMinutesFromDurationLabel(label: string): number | null {
  const s = label.trim().toLowerCase()
  const minMatch = s.match(/(\d+)\s*(?:min|minute)/)
  if (minMatch) return Number(minMatch[1])
  const hrMatch = s.match(/(\d+)\s*(?:hr|hour)/)
  if (hrMatch) return Number(hrMatch[1]) * 60
  const bare = s.match(/^(\d+)\s*$/)
  if (bare) return Number(bare[1])
  return null
}

export function assertTierDurationsValid(tiers: ConsultationTier[]): void {
  for (const tier of tiers) {
    const limits = TIER_DURATION_LIMITS[tier.id as TierDurationId]
    if (!limits) continue
    const minutes = parseMinutesFromDurationLabel(tier.durationLabel)
    if (minutes == null) continue
    if (minutes < limits.min || minutes > limits.max) {
      throw new Error(
        `Tier "${tier.id}" duration ${minutes}m is outside ${limits.min}–${limits.max}m (${tier.durationLabel})`
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

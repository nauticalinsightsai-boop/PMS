import { getChannelById } from '../constants/channelGroups'

/**
 * DISCOVERY tab (5) + SYNDICATION tab (3): search, RSS, aggregators, API-fed.
 * Shared Calendly matrix (go-syndicated-*).
 */
export const SYNDICATED_PORTAL_CALENDLY = {
  discovery: 'https://calendly.com/pm-structure/go-syndicated-discovery',
  executive: 'https://calendly.com/pm-structure/go-syndicated-executive',
  services: 'https://calendly.com/pm-structure/go-syndicated-design-review',
} as const

export const SYNDICATED_PORTAL_TIER_DISPLAY = {
  discoveryMinutes: 20,
  executiveMinutes: 35,
  servicesMinutes: 75,
  executivePrice: 175,
  servicesPrice: 319,
  discoveryPriceLabel: 'Open',
} as const

export function isSyndicatedPortalPackChannel(channelId: string): boolean {
  const category = getChannelById(channelId)?.platformCategory
  return category === 'Discovery / Search' || category === 'Syndication / Automation'
}

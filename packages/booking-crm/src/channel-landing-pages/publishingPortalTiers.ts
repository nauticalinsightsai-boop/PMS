import { getChannelById } from '../constants/channelGroups'

/** PUBLISHING tab (6): Medium, Substack, Beehiiv, Ghost, Hashnode, Notion. */
export const PUBLISHING_NEWSLETTERS_CALENDLY = {
  discovery: 'https://calendly.com/pm-structure/go-newsletters-discovery',
  executive: 'https://calendly.com/pm-structure/go-newsletters-executive',
  services: 'https://calendly.com/pm-structure/go-newsletters-design-review',
} as const

export const PUBLISHING_NEWSLETTERS_TIER_DISPLAY = {
  discoveryMinutes: 20,
  executiveMinutes: 40,
  servicesMinutes: 75,
  executivePrice: 249,
  servicesPrice: 499,
  discoveryPriceLabel: 'Open',
} as const

export function isWritingPublishingPortalChannel(channelId: string): boolean {
  return getChannelById(channelId)?.platformCategory === 'Writing / Publishing'
}

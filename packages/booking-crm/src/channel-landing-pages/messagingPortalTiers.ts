import { getChannelById } from '../constants/channelGroups'

/** COMMUNITY tab (5): Email, WhatsApp, Telegram, Discord, Slack. */
export const COMMUNITY_MESSAGING_CALENDLY = {
  discovery: 'https://calendly.com/pm-structure/go-messaging-discovery',
  executive: 'https://calendly.com/pm-structure/go-messaging-executive',
  services: 'https://calendly.com/pm-structure/go-messaging-design-review',
} as const

export const COMMUNITY_MESSAGING_TIER_DISPLAY = {
  discoveryMinutes: 20,
  executiveMinutes: 30,
  servicesMinutes: 60,
  executivePrice: 159,
  servicesPrice: 299,
  discoveryPriceLabel: 'Open',
} as const

export function isCommunityDirectPortalChannel(channelId: string): boolean {
  return getChannelById(channelId)?.platformCategory === 'Community / Direct'
}

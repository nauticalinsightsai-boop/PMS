import { getChannelById } from '../constants/channelGroups'
import { SOCIAL_DISTRIBUTION_CALENDLY } from './socialPortalTiers'

/** VIDEO tab (4): no separate Calendly events — use live Social pack URLs. */
export const VIDEO_PLATFORM_CALENDLY = {
  discovery: SOCIAL_DISTRIBUTION_CALENDLY.discovery,
  executive: SOCIAL_DISTRIBUTION_CALENDLY.executive,
  services: SOCIAL_DISTRIBUTION_CALENDLY.services,
} as const

export const VIDEO_PLATFORM_TIER_DISPLAY = {
  discoveryMinutes: 20,
  executiveMinutes: 35,
  servicesMinutes: 75,
  executivePrice: 250,
  servicesPrice: 500,
  discoveryPriceLabel: 'Open',
} as const

export function isVideoPlatformPortalChannel(channelId: string): boolean {
  return getChannelById(channelId)?.platformCategory === 'Video Platform'
}

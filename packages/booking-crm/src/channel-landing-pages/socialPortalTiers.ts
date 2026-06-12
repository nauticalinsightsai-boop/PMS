import { getChannelById } from '../constants/channelGroups'

/** SOCIAL tab (11): LinkedIn, X, Instagram, Facebook, Reddit, Quora, Threads, Bluesky, Mastodon, Pinterest, VK. */
export const SOCIAL_DISTRIBUTION_CALENDLY = {
  discovery: 'https://calendly.com/pm-structure/so-discovery-mentorship',
  executive: 'https://calendly.com/pm-structure/go-social-media-executive',
  services: 'https://calendly.com/pm-structure/go-social-media-design-review',
} as const

export const SOCIAL_DISTRIBUTION_TIER_DISPLAY = {
  discoveryMinutes: 20,
  executiveMinutes: 35,
  servicesMinutes: 75,
  executivePrice: 250,
  servicesPrice: 500,
  discoveryPriceLabel: 'Open',
} as const

export function isSocialDistributionPortalChannel(channelId: string): boolean {
  return getChannelById(channelId)?.platformCategory === 'Social Distribution'
}

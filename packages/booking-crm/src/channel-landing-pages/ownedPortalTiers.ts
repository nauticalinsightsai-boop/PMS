/** OWNED tab: Website (3 tiers) + Webinar (2 tiers). */

import { LIVE_SITE_CALENDLY } from '../calendly/live-scheduling-urls'

export const OWNED_WEBSITE_CALENDLY = {
  discovery: LIVE_SITE_CALENDLY.talkToMentor,
  executive: LIVE_SITE_CALENDLY.talkToAdvisor,
  services: LIVE_SITE_CALENDLY.talkToAdvisor,
} as const

export const OWNED_WEBSITE_TIER_DISPLAY = {
  discoveryMinutes: 20,
  executiveMinutes: 45,
  servicesMinutes: 90,
  executivePrice: 299,
  servicesPrice: 525,
  discoveryPriceLabel: 'Open',
} as const

export const OWNED_WEBINAR_CALENDLY = {
  discovery: 'https://calendly.com/pm-structure/go-webinar-open',
  paid: 'https://calendly.com/pm-structure/go-webinar-paid',
} as const

export const OWNED_WEBINAR_TIER_DISPLAY = {
  discoveryDurationLabel: '1 hr',
  paidDurationLabel: '2 hrs',
  paidPrice: 199,
  discoveryPriceLabel: 'Open',
} as const

export function isOwnedWebsitePortalChannel(channelId: string): boolean {
  return channelId === 'website'
}

export function isOwnedWebinarPortalChannel(channelId: string): boolean {
  return channelId === 'webinar'
}

export function isCoreOwnedPortalChannel(channelId: string): boolean {
  return isOwnedWebsitePortalChannel(channelId) || isOwnedWebinarPortalChannel(channelId)
}

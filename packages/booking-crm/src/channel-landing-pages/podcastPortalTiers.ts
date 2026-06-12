import { getChannelById } from '../constants/channelGroups'

/** PODCAST tab (6): Spotify, Apple Podcasts, Amazon Audible, Google Podcasts, Podbean, SoundCloud. */
export const AUDIO_PODCAST_CALENDLY = {
  discovery: 'https://calendly.com/pm-structure/go-podcasts-discovery',
  executive: 'https://calendly.com/pm-structure/go-podcasts-executive',
  services: 'https://calendly.com/pm-structure/go-podcasts-design-review',
} as const

export const AUDIO_PODCAST_TIER_DISPLAY = {
  discoveryMinutes: 20,
  executiveMinutes: 30,
  servicesMinutes: 60,
  executivePrice: 149,
  servicesPrice: 299,
  discoveryPriceLabel: 'Open',
} as const

export function isAudioPodcastPortalChannel(channelId: string): boolean {
  return getChannelById(channelId)?.platformCategory === 'Audio / Podcast'
}

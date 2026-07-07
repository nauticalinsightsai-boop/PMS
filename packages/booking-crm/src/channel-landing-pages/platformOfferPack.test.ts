import { describe, expect, it } from 'vitest'
import { IMPLEMENTATION_SCOPE_41 } from './platformBrandSources'
import {
  PRO_CONSULTATION_PORTAL_CHANNELS,
  PROFESSIONAL_FLOW,
  getPackConsultationTiers,
  getPlatformOfferPack,
  usesPortalWebsiteLayoutChrome,
  usesProConsultationPortalLayout,
} from './platformOfferPack'
import {
  COMMUNITY_MESSAGING_CALENDLY,
  COMMUNITY_MESSAGING_TIER_DISPLAY,
} from './messagingPortalTiers'
import {
  PUBLISHING_NEWSLETTERS_CALENDLY,
  PUBLISHING_NEWSLETTERS_TIER_DISPLAY,
} from './publishingPortalTiers'
import {
  VIDEO_PLATFORM_CALENDLY,
  VIDEO_PLATFORM_TIER_DISPLAY,
} from './videoPortalTiers'
import {
  SYNDICATED_PORTAL_CALENDLY,
  SYNDICATED_PORTAL_TIER_DISPLAY,
} from './syndicatedPortalTiers'
import {
  AUDIO_PODCAST_CALENDLY,
  AUDIO_PODCAST_TIER_DISPLAY,
} from './podcastPortalTiers'
import {
  SOCIAL_DISTRIBUTION_CALENDLY,
  SOCIAL_DISTRIBUTION_TIER_DISPLAY,
} from './socialPortalTiers'
import {
  OWNED_WEBINAR_CALENDLY,
  OWNED_WEBINAR_TIER_DISPLAY,
  OWNED_WEBSITE_CALENDLY,
  OWNED_WEBSITE_TIER_DISPLAY,
} from './ownedPortalTiers'

describe('social distribution portal tiers', () => {
  it('applies Open pricing, durations, and Calendly URLs for all social channels', () => {
    for (const channelId of [
      'linkedin',
      'twitter',
      'instagram',
      'facebook',
      'reddit',
      'quora',
      'threads',
      'bluesky',
      'mastodon',
      'pinterest',
      'vk',
    ]) {
      const tiers = getPackConsultationTiers(channelId)
      const intro = tiers.find((t) => t.id === 'mentor-intro')
      const executive = tiers.find((t) => t.id === 'career-pathway')
      const services = tiers.find((t) => t.id === 'services-detail')

      expect(intro?.priceLabel, channelId).toBe(SOCIAL_DISTRIBUTION_TIER_DISPLAY.discoveryPriceLabel)
      expect(intro?.durationLabel, channelId).toBe('20 Minutes')
      expect(intro?.scheduleUrl, channelId).toBe(SOCIAL_DISTRIBUTION_CALENDLY.discovery)

      expect(executive?.priceLabel, channelId).toBe(`$${SOCIAL_DISTRIBUTION_TIER_DISPLAY.executivePrice}`)
      expect(executive?.durationLabel, channelId).toBe('35 Minutes')
      expect(executive?.scheduleUrl, channelId).toBe(SOCIAL_DISTRIBUTION_CALENDLY.executive)

      expect(services?.priceLabel, channelId).toBe(`$${SOCIAL_DISTRIBUTION_TIER_DISPLAY.servicesPrice}`)
      expect(services?.durationLabel, channelId).toBe('75 Minutes')
      expect(services?.scheduleUrl, channelId).toBe(SOCIAL_DISTRIBUTION_CALENDLY.services)
    }
  })
})

describe('audio podcast portal tiers', () => {
  it('applies Open pricing, durations, and Calendly URLs for all podcast channels', () => {
    for (const channelId of [
      'spotify',
      'apple-podcasts',
      'amazon-audible',
      'google-podcasts',
      'podbean',
      'soundcloud',
    ]) {
      const tiers = getPackConsultationTiers(channelId)
      const intro = tiers.find((t) => t.id === 'mentor-intro')
      const executive = tiers.find((t) => t.id === 'career-pathway')
      const services = tiers.find((t) => t.id === 'services-detail')

      expect(intro?.priceLabel, channelId).toBe(AUDIO_PODCAST_TIER_DISPLAY.discoveryPriceLabel)
      expect(intro?.durationLabel, channelId).toBe('20 Minutes')
      expect(intro?.scheduleUrl, channelId).toBe(AUDIO_PODCAST_CALENDLY.discovery)

      expect(executive?.priceLabel, channelId).toBe(`$${AUDIO_PODCAST_TIER_DISPLAY.executivePrice}`)
      expect(executive?.durationLabel, channelId).toBe('30 Minutes')
      expect(executive?.scheduleUrl, channelId).toBe(AUDIO_PODCAST_CALENDLY.executive)

      expect(services?.priceLabel, channelId).toBe(`$${AUDIO_PODCAST_TIER_DISPLAY.servicesPrice}`)
      expect(services?.durationLabel, channelId).toBe('60 Minutes')
      expect(services?.scheduleUrl, channelId).toBe(AUDIO_PODCAST_CALENDLY.services)
    }
  })
})

describe('community messaging portal tiers', () => {
  it('applies Open pricing, durations, and Calendly URLs for all community channels', () => {
    for (const channelId of ['email', 'whatsapp', 'telegram', 'discord', 'slack']) {
      const tiers = getPackConsultationTiers(channelId)
      const intro = tiers.find((t) => t.id === 'mentor-intro')
      const executive = tiers.find((t) => t.id === 'career-pathway')
      const services = tiers.find((t) => t.id === 'services-detail')

      expect(intro?.priceLabel, channelId).toBe(COMMUNITY_MESSAGING_TIER_DISPLAY.discoveryPriceLabel)
      expect(intro?.durationLabel, channelId).toBe('20 Minutes')
      expect(intro?.scheduleUrl, channelId).toBe(COMMUNITY_MESSAGING_CALENDLY.discovery)

      expect(executive?.priceLabel, channelId).toBe(
        `$${COMMUNITY_MESSAGING_TIER_DISPLAY.executivePrice}`,
      )
      expect(executive?.durationLabel, channelId).toBe('30 Minutes')
      expect(executive?.scheduleUrl, channelId).toBe(COMMUNITY_MESSAGING_CALENDLY.executive)

      expect(services?.priceLabel, channelId).toBe(
        `$${COMMUNITY_MESSAGING_TIER_DISPLAY.servicesPrice}`,
      )
      expect(services?.durationLabel, channelId).toBe('60 Minutes')
      expect(services?.scheduleUrl, channelId).toBe(COMMUNITY_MESSAGING_CALENDLY.services)
    }
  })
})

describe('syndicated portal tiers (discovery + syndication tabs)', () => {
  it('applies Open pricing, durations, and Calendly URLs for all eight channels', () => {
    for (const channelId of [
      'google-search',
      'youtube-search',
      'podcast-directories',
      'bing-search',
      'ai-visibility',
      'rss-feeds',
      'content-aggregators',
      'api-ai-fed',
    ]) {
      const tiers = getPackConsultationTiers(channelId)
      const intro = tiers.find((t) => t.id === 'mentor-intro')
      const executive = tiers.find((t) => t.id === 'career-pathway')
      const services = tiers.find((t) => t.id === 'services-detail')

      expect(intro?.priceLabel, channelId).toBe(SYNDICATED_PORTAL_TIER_DISPLAY.discoveryPriceLabel)
      expect(intro?.durationLabel, channelId).toBe('20 Minutes')
      expect(intro?.scheduleUrl, channelId).toBe(SYNDICATED_PORTAL_CALENDLY.discovery)

      expect(executive?.priceLabel, channelId).toBe(
        `$${SYNDICATED_PORTAL_TIER_DISPLAY.executivePrice}`,
      )
      expect(executive?.durationLabel, channelId).toBe('35 Minutes')
      expect(executive?.scheduleUrl, channelId).toBe(SYNDICATED_PORTAL_CALENDLY.executive)

      expect(services?.priceLabel, channelId).toBe(
        `$${SYNDICATED_PORTAL_TIER_DISPLAY.servicesPrice}`,
      )
      expect(services?.durationLabel, channelId).toBe('75 Minutes')
      expect(services?.scheduleUrl, channelId).toBe(SYNDICATED_PORTAL_CALENDLY.services)
    }
  })
})

describe('video platform portal tiers', () => {
  it('applies same Open pricing and Calendly URLs as social for all video channels', () => {
    for (const channelId of ['youtube', 'tiktok', 'snapchat', 'vimeo']) {
      const tiers = getPackConsultationTiers(channelId)
      const intro = tiers.find((t) => t.id === 'mentor-intro')
      const executive = tiers.find((t) => t.id === 'career-pathway')
      const services = tiers.find((t) => t.id === 'services-detail')

      expect(intro?.priceLabel, channelId).toBe(VIDEO_PLATFORM_TIER_DISPLAY.discoveryPriceLabel)
      expect(intro?.durationLabel, channelId).toBe('20 Minutes')
      expect(intro?.scheduleUrl, channelId).toBe(VIDEO_PLATFORM_CALENDLY.discovery)

      expect(executive?.priceLabel, channelId).toBe(`$${VIDEO_PLATFORM_TIER_DISPLAY.executivePrice}`)
      expect(executive?.durationLabel, channelId).toBe('35 Minutes')
      expect(executive?.scheduleUrl, channelId).toBe(VIDEO_PLATFORM_CALENDLY.executive)

      expect(services?.priceLabel, channelId).toBe(`$${VIDEO_PLATFORM_TIER_DISPLAY.servicesPrice}`)
      expect(services?.durationLabel, channelId).toBe('75 Minutes')
      expect(services?.scheduleUrl, channelId).toBe(VIDEO_PLATFORM_CALENDLY.services)
    }
  })
})

describe('publishing newsletters portal tiers', () => {
  it('applies Open pricing, durations, and Calendly URLs for all publishing channels', () => {
    for (const channelId of [
      'medium',
      'substack',
      'beehiiv',
      'ghost',
      'hashnode',
      'notion-public',
    ]) {
      const tiers = getPackConsultationTiers(channelId)
      const intro = tiers.find((t) => t.id === 'mentor-intro')
      const executive = tiers.find((t) => t.id === 'career-pathway')
      const services = tiers.find((t) => t.id === 'services-detail')

      expect(intro?.priceLabel, channelId).toBe(
        PUBLISHING_NEWSLETTERS_TIER_DISPLAY.discoveryPriceLabel,
      )
      expect(intro?.durationLabel, channelId).toBe('20 Minutes')
      expect(intro?.scheduleUrl, channelId).toBe(PUBLISHING_NEWSLETTERS_CALENDLY.discovery)

      expect(executive?.priceLabel, channelId).toBe(
        `$${PUBLISHING_NEWSLETTERS_TIER_DISPLAY.executivePrice}`,
      )
      expect(executive?.durationLabel, channelId).toBe('40 Minutes')
      expect(executive?.scheduleUrl, channelId).toBe(PUBLISHING_NEWSLETTERS_CALENDLY.executive)

      expect(services?.priceLabel, channelId).toBe(
        `$${PUBLISHING_NEWSLETTERS_TIER_DISPLAY.servicesPrice}`,
      )
      expect(services?.durationLabel, channelId).toBe('75 Minutes')
      expect(services?.scheduleUrl, channelId).toBe(PUBLISHING_NEWSLETTERS_CALENDLY.services)
    }
  })
})

describe('owned portal tiers', () => {
  it('applies Open pricing, durations, and Calendly URLs for website', () => {
    const tiers = getPackConsultationTiers('website')
    const intro = tiers.find((t) => t.id === 'mentor-intro')
    const executive = tiers.find((t) => t.id === 'career-pathway')
    const services = tiers.find((t) => t.id === 'services-detail')

    expect(intro?.priceLabel).toBe(OWNED_WEBSITE_TIER_DISPLAY.discoveryPriceLabel)
    expect(intro?.durationLabel).toBe('20 Minutes')
    expect(intro?.scheduleUrl).toBe(OWNED_WEBSITE_CALENDLY.discovery)

    expect(executive?.priceLabel).toBe(`$${OWNED_WEBSITE_TIER_DISPLAY.executivePrice}`)
    expect(executive?.durationLabel).toBe('45 Minutes')
    expect(executive?.scheduleUrl).toBe(OWNED_WEBSITE_CALENDLY.executive)

    expect(services?.priceLabel).toBe(`$${OWNED_WEBSITE_TIER_DISPLAY.servicesPrice}`)
    expect(services?.durationLabel).toBe('90 Minutes')
    expect(services?.scheduleUrl).toBe(OWNED_WEBSITE_CALENDLY.services)
  })

  it('applies Open pricing, durations, and Calendly URLs for webinar (two tiers)', () => {
    const tiers = getPackConsultationTiers('webinar')
    const intro = tiers.find((t) => t.id === 'mentor-intro')
    const paid = tiers.find((t) => t.id === 'career-pathway')

    expect(tiers).toHaveLength(2)
    expect(intro?.priceLabel).toBe(OWNED_WEBINAR_TIER_DISPLAY.discoveryPriceLabel)
    expect(intro?.durationLabel).toBe(OWNED_WEBINAR_TIER_DISPLAY.discoveryDurationLabel)
    expect(intro?.scheduleUrl).toBe(OWNED_WEBINAR_CALENDLY.discovery)

    expect(paid?.priceLabel).toBe(`$${OWNED_WEBINAR_TIER_DISPLAY.paidPrice}`)
    expect(paid?.durationLabel).toBe(OWNED_WEBINAR_TIER_DISPLAY.paidDurationLabel)
    expect(paid?.scheduleUrl).toBe(OWNED_WEBINAR_CALENDLY.paid)
  })
})

describe('usesPortalWebsiteLayoutChrome', () => {
  it('returns true for all 41 implementation-scope slugs', () => {
    for (const id of IMPLEMENTATION_SCOPE_41) {
      expect(usesPortalWebsiteLayoutChrome(id), id).toBe(true)
    }
  })

  it('returns false outside scope-41', () => {
    expect(usesPortalWebsiteLayoutChrome('google-podcasts')).toBe(false)
  })
})

describe('usesProConsultationPortalLayout', () => {
  it('returns true only for website and webinar (marketing gradient)', () => {
    expect(PRO_CONSULTATION_PORTAL_CHANNELS).toEqual(new Set(['website', 'webinar']))
    expect(usesProConsultationPortalLayout('website')).toBe(true)
    expect(usesProConsultationPortalLayout('webinar')).toBe(true)
  })

  it('returns false for platform slugs while layout chrome stays on', () => {
    for (const id of ['snapchat', 'instagram', 'linkedin', 'medium', 'spotify', 'vk']) {
      expect(usesProConsultationPortalLayout(id), id).toBe(false)
      expect(usesPortalWebsiteLayoutChrome(id), id).toBe(true)
    }
  })
})

describe('PROFESSIONAL_FLOW', () => {
  it('matches website reference order for all 41 implementation-scope channel packs', () => {
    expect(IMPLEMENTATION_SCOPE_41).toHaveLength(41)
    for (const id of IMPLEMENTATION_SCOPE_41) {
      const pack = getPlatformOfferPack(id)
      expect(pack?.flowOrder, id).toEqual(PROFESSIONAL_FLOW)
    }
  })

  it('places featured_pathways after context, hero_card before trust, tiers after hero_card', () => {
    const ctx = PROFESSIONAL_FLOW.indexOf('context')
    const pathways = PROFESSIONAL_FLOW.indexOf('featured_pathways')
    const trust = PROFESSIONAL_FLOW.indexOf('trust')
    const heroCard = PROFESSIONAL_FLOW.indexOf('hero_card')
    const tiers = PROFESSIONAL_FLOW.indexOf('tiers')

    expect(pathways).toBeGreaterThan(ctx)
    expect(heroCard).toBeGreaterThan(pathways)
    expect(trust).toBeGreaterThan(heroCard)
    expect(tiers).toBeGreaterThan(heroCard)
    expect(tiers).toBeGreaterThan(trust)
  })

  it('includes roadmap_form after context, webinar_media after roadmap_form, pathway_actions after faq', () => {
    expect(PROFESSIONAL_FLOW.indexOf('roadmap_form')).toBe(
      PROFESSIONAL_FLOW.indexOf('context') + 1
    )
    expect(PROFESSIONAL_FLOW.indexOf('webinar_media')).toBe(
      PROFESSIONAL_FLOW.indexOf('roadmap_form') + 1
    )
    expect(PROFESSIONAL_FLOW.indexOf('pathway_actions')).toBe(
      PROFESSIONAL_FLOW.indexOf('faq') + 1
    )
  })
})

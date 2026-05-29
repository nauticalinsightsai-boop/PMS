import { getChannelById } from '../constants/channelGroups'
import type { ConsultationTier } from '../types/channelLandingPage'
import { CALENDLY_DEFAULT_SCHEDULING_URLS } from '../calendly/scheduling-urls'
import {
  getChannelPortalCopy,
  type ChannelPortalCopy,
} from './channelPortalCopy'
import { formatDurationLabel } from './tierDuration'
import { isFreeDiscoveryChannel } from './freeDiscovery'
import {
  applyPlatformConsultationTiers,
  getConsultationTiersForChannel,
} from './platformTierCopy'

export type PricingTier =
  | 'genz'
  | 'casual_social'
  | 'professional'
  | 'reader_premium'
  | 'premium_anchor'
  | 'video_mid'
  | 'audio_mid'
  | 'community_mid'
  | 'discovery_mid'
  | 'syndication_mid'

export type PortalLayoutVariant = 'bold' | 'editorial' | 'professional' | 'warm' | 'minimal'

export type PortalSectionId =
  | 'presence'
  | 'hero'
  | 'context'
  | 'trust'
  | 'hero_card'
  | 'tiers'
  | 'qualification'
  | 'social_proof'
  | 'credibility'
  | 'faq'
  | 'risk_reversal'
  | 'payment_trust'
  | 'form'
  | 'final_cta'
  | 'social_footer'

export type PlatformOfferPack = {
  channelId: string
  pricingTier: PricingTier
  layoutVariant: PortalLayoutVariant
  flowOrder: PortalSectionId[]
  copy: ChannelPortalCopy
  consultationTiers: ConsultationTier[]
}

export const PORTAL_PRICES: Record<
  PricingTier,
  { executive: number; designReview: number; discoveryMin: number; executiveMin: number; designMin: number }
> = {
  genz: { executive: 129, designReview: 249, discoveryMin: 15, executiveMin: 30, designMin: 60 },
  casual_social: { executive: 175, designReview: 319, discoveryMin: 20, executiveMin: 35, designMin: 75 },
  professional: { executive: 275, designReview: 475, discoveryMin: 20, executiveMin: 40, designMin: 90 },
  reader_premium: { executive: 250, designReview: 500, discoveryMin: 20, executiveMin: 40, designMin: 75 },
  premium_anchor: { executive: 299, designReview: 525, discoveryMin: 15, executiveMin: 45, designMin: 90 },
  video_mid: { executive: 199, designReview: 399, discoveryMin: 15, executiveMin: 35, designMin: 75 },
  audio_mid: { executive: 149, designReview: 299, discoveryMin: 20, executiveMin: 35, designMin: 75 },
  community_mid: { executive: 159, designReview: 309, discoveryMin: 20, executiveMin: 35, designMin: 75 },
  discovery_mid: { executive: 199, designReview: 399, discoveryMin: 20, executiveMin: 40, designMin: 80 },
  syndication_mid: { executive: 175, designReview: 319, discoveryMin: 20, executiveMin: 35, designMin: 75 },
}

const CHANNEL_PRICING_TIER: Record<string, PricingTier> = {
  tiktok: 'genz',
  snapchat: 'genz',
  instagram: 'genz',
  linkedin: 'professional',
  medium: 'reader_premium',
  substack: 'reader_premium',
  beehiiv: 'reader_premium',
  ghost: 'reader_premium',
  hashnode: 'reader_premium',
  'notion-public': 'reader_premium',
  website: 'premium_anchor',
  webinar: 'video_mid',
  facebook: 'casual_social',
  twitter: 'casual_social',
  reddit: 'casual_social',
  threads: 'casual_social',
  quora: 'casual_social',
  bluesky: 'casual_social',
  mastodon: 'casual_social',
  pinterest: 'casual_social',
  youtube: 'video_mid',
  vimeo: 'video_mid',
  spotify: 'audio_mid',
  'apple-podcasts': 'audio_mid',
  'amazon-audible': 'audio_mid',
  'google-podcasts': 'audio_mid',
  podbean: 'audio_mid',
  soundcloud: 'audio_mid',
  email: 'community_mid',
  whatsapp: 'community_mid',
  telegram: 'community_mid',
  discord: 'community_mid',
  slack: 'community_mid',
  'google-search': 'discovery_mid',
  'youtube-search': 'discovery_mid',
  'podcast-directories': 'discovery_mid',
  'bing-search': 'discovery_mid',
  'ai-visibility': 'discovery_mid',
  'rss-feeds': 'syndication_mid',
  'content-aggregators': 'syndication_mid',
  'api-ai-fed': 'syndication_mid',
}

const LAYOUT_BY_CATEGORY: Record<string, PortalLayoutVariant> = {
  'Core / Owned Platform': 'professional',
  'Writing / Publishing': 'editorial',
  'Social Distribution': 'bold',
  'Video Platform': 'bold',
  'Audio / Podcast': 'warm',
  'Community / Direct': 'warm',
  'Discovery / Search': 'minimal',
  'Syndication / Automation': 'minimal',
}

/** Conversion order: hook → book early → proof/offer → objections (FAQ) → final CTA */
const PROFESSIONAL_FLOW: PortalSectionId[] = [
  'presence',
  'hero',
  'context',
  'trust',
  'hero_card',
  'tiers',
  'social_proof',
  'credibility',
  'qualification',
  'faq',
  'form',
  'final_cta',
  'social_footer',
]

export function pricingTierForChannel(channelId: string): PricingTier {
  return CHANNEL_PRICING_TIER[channelId] ?? 'casual_social'
}

const FREE_DISCOVERY_PRICING: PricingTier[] = ['genz', 'casual_social']

export { isFreeDiscoveryChannel } from './freeDiscovery'

export { CHANNEL_PRICING_TIER }

function layoutForChannel(channelId: string): PortalLayoutVariant {
  const cat = getChannelById(channelId)?.platformCategory
  if (channelId === 'linkedin') return 'professional'
  if (channelId === 'tiktok' || channelId === 'snapchat') return 'bold'
  return (cat && LAYOUT_BY_CATEGORY[cat]) || 'minimal'
}

function flowForChannel(_channelId: string): PortalSectionId[] {
  return PROFESSIONAL_FLOW
}

/** Channels that use the marketing home shell (gradient, glass cards, footer site chips). */
export const PRO_CONSULTATION_PORTAL_CHANNELS = new Set<string>(['website', 'webinar'])

/**
 * Website-style consultation portal: presence strip, in-column hero stack,
 * marketing shell (gradient + glass), site chips in final CTA footer.
 */
export function usesProConsultationPortalLayout(channelId: string): boolean {
  return PRO_CONSULTATION_PORTAL_CHANNELS.has(channelId)
}

/** @deprecated Impulse layout retired — all `/go/*` portals use {@link usesProConsultationPortalLayout}. */
export function isImpulseLayoutChannel(_channelId: string): boolean {
  return false
}

/** Paid clarity call price by pricing tier (tier-1 when not free). */
const CLARITY_PRICE: Record<PricingTier, number> = {
  genz: 0,
  casual_social: 0,
  professional: 99,
  reader_premium: 79,
  premium_anchor: 99,
  video_mid: 89,
  audio_mid: 79,
  community_mid: 79,
  discovery_mid: 79,
  syndication_mid: 79,
}

function applyPackPricing(
  tiers: ConsultationTier[],
  pricingTier: PricingTier,
  channelId: string
): ConsultationTier[] {
  const p = PORTAL_PRICES[pricingTier]
  const freeDiscovery = isFreeDiscoveryChannel(channelId)
  return tiers.map((t) => {
    if (t.id === 'mentor-intro' || t.id === 'discovery') {
      const isFree = freeDiscovery
      return {
        ...t,
        id: 'mentor-intro',
        durationLabel: formatDurationLabel(p.discoveryMin),
        priceLabel: isFree ? 'Free' : `$${CLARITY_PRICE[pricingTier]}`,
        isFree,
        recommended: false,
      }
    }
    if (t.id === 'career-pathway' || t.id === 'executive') {
      return {
        ...t,
        id: 'career-pathway',
        durationLabel: formatDurationLabel(p.executiveMin),
        priceLabel: `$${p.executive}`,
        recommended: true,
        badge: t.badge ?? 'Most Popular',
      }
    }
    if (t.id === 'services-detail' || t.id === 'design-review') {
      return {
        ...t,
        id: 'services-detail',
        durationLabel: formatDurationLabel(p.designMin),
        priceLabel: `$${p.designReview}`,
        recommended: false,
      }
    }
    return t
  })
}

const packCache = new Map<string, PlatformOfferPack>()

export function getPlatformOfferPack(channelId: string): PlatformOfferPack | null {
  if (packCache.has(channelId)) return packCache.get(channelId)!
  const copy = getChannelPortalCopy(channelId)
  if (!copy) return null

  const pricingTier = pricingTierForChannel(channelId)
  const baseTiers = getConsultationTiersForChannel(channelId)
  const consultationTiers = applyPackPricing(baseTiers, pricingTier, channelId)

  const pack: PlatformOfferPack = {
    channelId,
    pricingTier,
    layoutVariant: layoutForChannel(channelId),
    flowOrder: flowForChannel(channelId),
    copy,
    consultationTiers,
  }
  packCache.set(channelId, pack)
  return pack
}

export function getPackConsultationTiers(
  channelId: string,
  saved?: ConsultationTier[]
): ConsultationTier[] {
  const merged = applyPlatformConsultationTiers(saved, channelId)
  const pack = getPlatformOfferPack(channelId)
  if (!pack) return merged
  return merged.map((t) => {
    const priced = pack.consultationTiers.find((p) => p.id === t.id)
    if (!priced) return t
    return {
      ...t,
      durationLabel: priced.durationLabel,
      priceLabel: priced.priceLabel,
      scheduleUrl: t.scheduleUrl?.trim() || priced.scheduleUrl,
    }
  })
}

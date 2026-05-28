export type ChannelLandingPageStatus = 'draft' | 'published'

export type ChannelLandingPrimaryAction = 'booking_form' | 'contact_link' | 'external_link'

export type TierBadge = 'Most Popular' | 'Best Value'

export type ConsultationTier = {
  id: string
  title: string
  description: string
  durationLabel: string
  priceLabel: string
  isFree?: boolean
  recommended?: boolean
  /** Calendly or external scheduling URL for the tier schedule CTA */
  scheduleUrl?: string
  bestFor?: string
  outcome?: string
  ctaLabel?: string
  badge?: TierBadge
}

export type PortalValueCard = {
  title: string
  body: string
}

export type PortalSocialProofItem = {
  quote: string
  /** @deprecated Use name + title */
  role?: string
  name?: string
  title?: string
}

export type PortalProofMetric = {
  label: string
  value: string
}

export type PortalFaqItem = {
  question: string
  answer: string
}

export type PortalEngagement = {
  templateVersion: number;
  featuredCertIds: string[];
  showExplorePathways: boolean;
  showComparePathways: boolean;
  showCommunityLink: boolean;
  showMembershipLink: boolean;
  showStoreLink: boolean;
};

export type PortalConversionContent = {
  trustLine?: string
  valueCards?: PortalValueCard[]
  qualificationFor?: string[]
  qualificationNotFor?: string[]
  socialProof?: PortalSocialProofItem[]
  proofMetrics?: PortalProofMetric[]
  credibilityHeading?: string
  credibilityBody?: string
  faq?: PortalFaqItem[]
  riskReversal?: string
  paymentMicrocopy?: string[]
  finalCtaHeading?: string
  finalCtaBody?: string
  finalCtaLabel?: string
  /** 1 = social+publishing, 2 = video+podcast, 3 = community+discovery+syndication */
  conversionWave?: 1 | 2 | 3
}

export type ChannelLandingPage = {
  /** Platform channel id (e.g. bluesky, facebook) — one page per channel. */
  channelKey: string
  channelId: string
  label: string
  subtitle?: string
  slug: string
  status: ChannelLandingPageStatus
  createdAt: string
  updatedAt: string
  publishedAt?: string

  /** Orange context line — e.g. referrals from Medium */
  contextLabel: string
  headline: string
  subheadline: string
  body: string
  /** Webinar channel — overview shown above tiers (falls back to body). */
  webinarAbout?: string
  /** Webinar channel — YouTube or Vimeo URL for the preview embed. */
  webinarVideoUrl?: string
  /** Left-accent message box */
  targetMessage: string

  showSyncBanner: boolean
  syncBannerLabel: string
  availabilityLabel: string

  consultationTiers: ConsultationTier[]

  primaryButtonText: string
  primaryAction: ChannelLandingPrimaryAction
  externalUrl?: string
  contactService?: string

  showBookingForm: boolean
  collectCompany: boolean

  theme: 'brand' | 'light' | 'dark'
  showLogo: boolean

  /** Dashboard overrides; defaults from portalConversionPacks */
  conversion?: Partial<PortalConversionContent>

  /** PMS portal template v2 — featured certs, site chips */
  portalEngagement?: PortalEngagement
}

/** Public slug overrides (storage key → go path segment). */
export const CHANNEL_PUBLIC_SLUG: Record<string, string> = {
  twitter: 'x',
  'notion-public': 'notion',
};

export function publicSlugForChannel(channelId: string, slug?: string): string {
  if (slug?.trim()) return slugifyChannelKey(slug);
  return CHANNEL_PUBLIC_SLUG[channelId] ?? slugifyChannelKey(channelId);
}

export const DEFAULT_CONSULTATION_TIERS: ConsultationTier[] = [
  {
    id: 'discovery',
    title: '15-Min Discovery & Mentorship Call',
    description:
      'Brief initial conversation to analyze high-level fit, project alignment, or provide quick career guidance. No financial investment required.',
    durationLabel: '15 Minutes',
    priceLabel: 'FREE',
    isFree: true,
    recommended: false,
  },
  {
    id: 'executive',
    title: 'Executive',
    description:
      'In-depth structural consultation for sponsors planning offshore engineering, digital-twin setups, or risk-velocity assessment.',
    durationLabel: '45 Minutes',
    priceLabel: '$250',
    recommended: true,
  },
  {
    id: 'design-review',
    title: 'Design & Compliance Review',
    description:
      'Comprehensive code/compliance/architecture audit of floating structures or institutional mega-projects. Requires pre-sent technical summaries.',
    durationLabel: '90 Minutes',
    priceLabel: '$500',
    recommended: false,
  },
]

export function slugifyChannelKey(channelKey: string): string {
  return channelKey
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function defaultChannelLandingPage(args: {
  channelKey: string
  channelId: string
  label: string
  subtitle?: string
}): ChannelLandingPage {
  const now = new Date().toISOString()
  return {
    channelKey: args.channelKey,
    channelId: args.channelId,
    label: args.label,
    subtitle: args.subtitle,
    slug: slugifyChannelKey(args.channelKey),
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    contextLabel: '',
    headline: `${args.label} — Book a session`,
    subheadline: 'Request advisory or a discovery call.',
    body: '',
    targetMessage: '',
    showSyncBanner: true,
    syncBannerLabel: 'Sync system',
    availabilityLabel: 'Accepting advisory roles',
    consultationTiers: DEFAULT_CONSULTATION_TIERS,
    primaryButtonText: 'Schedule inline',
    primaryAction: 'booking_form',
    contactService: 'Advisory',
    showBookingForm: false,
    collectCompany: false,
    theme: 'brand',
    showLogo: true,
  }
}

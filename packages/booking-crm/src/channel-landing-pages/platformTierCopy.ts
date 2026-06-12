import { getChannelById } from '../constants/channelGroups'
import type { PlatformCategory } from '../types/distribution'
import {
  DEFAULT_CONSULTATION_TIERS,
  type ConsultationTier,
} from '../types/channelLandingPage'
import { resolveCalendlyEventUrl } from '../calendly/event-registry'
import {
  getCalendlyCtaForChannelTier,
  getCalendlyUrlForChannelTier,
} from '../calendly/event-registry'
import { getChannelPortalCopy } from './channelPortalCopy'
import { usesPortalWebsiteLayoutChrome } from './platformOfferPack'
import {
  isCommunityDirectPortalChannel,
  COMMUNITY_MESSAGING_CALENDLY,
  COMMUNITY_MESSAGING_TIER_DISPLAY,
} from './messagingPortalTiers'
import { SERVICES_TIER_TITLE } from './portalTierTitles'
import {
  isWritingPublishingPortalChannel,
  PUBLISHING_NEWSLETTERS_CALENDLY,
  PUBLISHING_NEWSLETTERS_TIER_DISPLAY,
} from './publishingPortalTiers'
import {
  isSyndicatedPortalPackChannel,
  SYNDICATED_PORTAL_CALENDLY,
  SYNDICATED_PORTAL_TIER_DISPLAY,
} from './syndicatedPortalTiers'
import {
  isAudioPodcastPortalChannel,
  AUDIO_PODCAST_CALENDLY,
  AUDIO_PODCAST_TIER_DISPLAY,
} from './podcastPortalTiers'
import {
  isSocialDistributionPortalChannel,
  SOCIAL_DISTRIBUTION_CALENDLY,
  SOCIAL_DISTRIBUTION_TIER_DISPLAY,
} from './socialPortalTiers'
import {
  isOwnedWebsitePortalChannel,
  isOwnedWebinarPortalChannel,
  isCoreOwnedPortalChannel,
  OWNED_WEBSITE_CALENDLY,
  OWNED_WEBSITE_TIER_DISPLAY,
  OWNED_WEBINAR_CALENDLY,
  OWNED_WEBINAR_TIER_DISPLAY,
} from './ownedPortalTiers'
import {
  isVideoPlatformPortalChannel,
  VIDEO_PLATFORM_CALENDLY,
  VIDEO_PLATFORM_TIER_DISPLAY,
} from './videoPortalTiers'
import { LIVE_SITE_CALENDLY } from '../calendly/live-scheduling-urls'

const GENERIC_INTRO_CTAS = new Set([
  'talk to a mentor',
  'schedule a call with a mentor',
  'schedule inline',
  'schedule consultation',
  'schedule a mentor call',
  'schedule a mentor intro',
])

function isGenericIntroCta(label: string | undefined, channelId: string): boolean {
  const trimmed = label?.trim()
  if (!trimmed) return true
  if (usesPortalWebsiteLayoutChrome(channelId)) return false
  return GENERIC_INTRO_CTAS.has(trimmed.toLowerCase())
}

type PaidTierCopy = {
  executive: Pick<ConsultationTier, 'title' | 'description'>
  designReview: Pick<ConsultationTier, 'title' | 'description'>
}

const DISCOVERY_TIER = DEFAULT_CONSULTATION_TIERS.find((t) => t.id === 'discovery')!
const DISCOVERY_TITLE = 'Certification Fit Session'

function scheduleUrlFor(channelId: string, tierId: string, legacy: string): string {
  return getCalendlyUrlForChannelTier(channelId, tierId) || legacy
}

function ctaFor(channelId: string, tierId: string, fallback: string): string {
  return getCalendlyCtaForChannelTier(channelId, tierId) || fallback
}

function withSocialPortalScheduleUrls(
  channelId: string,
  tiers: ConsultationTier[],
): ConsultationTier[] {
  if (!isSocialDistributionPortalChannel(channelId)) return tiers
  return tiers.map((t) => {
    if (t.id === 'mentor-intro') {
      return { ...t, scheduleUrl: SOCIAL_DISTRIBUTION_CALENDLY.discovery }
    }
    if (t.id === 'career-pathway') {
      return { ...t, scheduleUrl: SOCIAL_DISTRIBUTION_CALENDLY.executive }
    }
    if (t.id === 'services-detail') {
      return { ...t, scheduleUrl: SOCIAL_DISTRIBUTION_CALENDLY.services }
    }
    return t
  })
}

function withPodcastPortalScheduleUrls(
  channelId: string,
  tiers: ConsultationTier[],
): ConsultationTier[] {
  if (!isAudioPodcastPortalChannel(channelId)) return tiers
  return tiers.map((t) => {
    if (t.id === 'mentor-intro') {
      return { ...t, scheduleUrl: AUDIO_PODCAST_CALENDLY.discovery }
    }
    if (t.id === 'career-pathway') {
      return { ...t, scheduleUrl: AUDIO_PODCAST_CALENDLY.executive }
    }
    if (t.id === 'services-detail') {
      return { ...t, scheduleUrl: AUDIO_PODCAST_CALENDLY.services }
    }
    return t
  })
}

function withMessagingPortalScheduleUrls(
  channelId: string,
  tiers: ConsultationTier[],
): ConsultationTier[] {
  if (!isCommunityDirectPortalChannel(channelId)) return tiers
  return tiers.map((t) => {
    if (t.id === 'mentor-intro') {
      return { ...t, scheduleUrl: COMMUNITY_MESSAGING_CALENDLY.discovery }
    }
    if (t.id === 'career-pathway') {
      return { ...t, scheduleUrl: COMMUNITY_MESSAGING_CALENDLY.executive }
    }
    if (t.id === 'services-detail') {
      return { ...t, scheduleUrl: COMMUNITY_MESSAGING_CALENDLY.services }
    }
    return t
  })
}

function withSyndicatedPortalScheduleUrls(
  channelId: string,
  tiers: ConsultationTier[],
): ConsultationTier[] {
  if (!isSyndicatedPortalPackChannel(channelId)) return tiers
  return tiers.map((t) => {
    if (t.id === 'mentor-intro') {
      return { ...t, scheduleUrl: SYNDICATED_PORTAL_CALENDLY.discovery }
    }
    if (t.id === 'career-pathway') {
      return { ...t, scheduleUrl: SYNDICATED_PORTAL_CALENDLY.executive }
    }
    if (t.id === 'services-detail') {
      return { ...t, scheduleUrl: SYNDICATED_PORTAL_CALENDLY.services }
    }
    return t
  })
}

function withPublishingPortalScheduleUrls(
  channelId: string,
  tiers: ConsultationTier[],
): ConsultationTier[] {
  if (!isWritingPublishingPortalChannel(channelId)) return tiers
  return tiers.map((t) => {
    if (t.id === 'mentor-intro') {
      return { ...t, scheduleUrl: PUBLISHING_NEWSLETTERS_CALENDLY.discovery }
    }
    if (t.id === 'career-pathway') {
      return { ...t, scheduleUrl: PUBLISHING_NEWSLETTERS_CALENDLY.executive }
    }
    if (t.id === 'services-detail') {
      return { ...t, scheduleUrl: PUBLISHING_NEWSLETTERS_CALENDLY.services }
    }
    return t
  })
}

function withVideoPortalScheduleUrls(
  channelId: string,
  tiers: ConsultationTier[],
): ConsultationTier[] {
  if (!isVideoPlatformPortalChannel(channelId)) return tiers
  return tiers.map((t) => {
    if (t.id === 'mentor-intro') {
      return { ...t, scheduleUrl: VIDEO_PLATFORM_CALENDLY.discovery }
    }
    if (t.id === 'career-pathway') {
      return { ...t, scheduleUrl: VIDEO_PLATFORM_CALENDLY.executive }
    }
    if (t.id === 'services-detail') {
      return { ...t, scheduleUrl: VIDEO_PLATFORM_CALENDLY.services }
    }
    return t
  })
}

function withOwnedWebsitePortalScheduleUrls(
  channelId: string,
  tiers: ConsultationTier[],
): ConsultationTier[] {
  if (!isOwnedWebsitePortalChannel(channelId)) return tiers
  return tiers.map((t) => {
    if (t.id === 'mentor-intro') {
      return { ...t, scheduleUrl: OWNED_WEBSITE_CALENDLY.discovery }
    }
    if (t.id === 'career-pathway') {
      return { ...t, scheduleUrl: OWNED_WEBSITE_CALENDLY.executive }
    }
    if (t.id === 'services-detail') {
      return { ...t, scheduleUrl: OWNED_WEBSITE_CALENDLY.services }
    }
    return t
  })
}

function withChannelPackScheduleUrls(channelId: string, tiers: ConsultationTier[]): ConsultationTier[] {
  return withOwnedWebsitePortalScheduleUrls(
    channelId,
    withVideoPortalScheduleUrls(
    channelId,
    withPublishingPortalScheduleUrls(
      channelId,
      withSyndicatedPortalScheduleUrls(
        channelId,
        withMessagingPortalScheduleUrls(
          channelId,
          withPodcastPortalScheduleUrls(channelId, withSocialPortalScheduleUrls(channelId, tiers)),
        ),
      ),
    ),
    ),
  )
}

const LEGACY_SCHEDULE_URLS = {
  discovery: LIVE_SITE_CALENDLY.talkToMentor,
  executive: LIVE_SITE_CALENDLY.talkToAdvisor,
  designReview: LIVE_SITE_CALENDLY.talkToAdvisor,
} as const

/** Paid-tier wording per platform channel (discovery stays generic). */
const PAID_TIER_BY_CHANNEL: Partial<Record<string, PaidTierCopy>> = {
  webinar: {
    executive: {
      title: 'Career & Pathway Session',
      description:
        'Extended mentor block after the webinar. pathway depth, prep planning, and certification questions with PM Structure.',
    },
    designReview: {
      title: 'Career & Pathway Session',
      description:
        'Extended mentor block after the webinar. pathway depth, prep planning, and certification questions with PM Structure.',
    },
  },
  website: {
    executive: {
      title: 'Career & Pathway Session',
      description:
        'Structured mentor block for exam prep, pathway choice, and career direction from the site.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Principal advisory for PMO services, delivery consulting, pathways, governance, and exam readiness.',
    },
  },
  medium: {
    executive: {
      title: 'Executive · Publication & defense discussion',
      description:
        'Pressure-test ideas from Medium posts. publication strategy, peer-review defense, or translating articles into delivery plans.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Audit technical claims, frameworks, or mega-project narratives from your Medium reading. Pre-send outlines or drafts.',
    },
  },
  substack: {
    executive: {
      title: 'Executive · Newsletter & thesis discussion',
      description:
        'Go beyond the newsletter. career direction, venture thesis, or how to operationalize what you subscribed to on Substack.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Structured review of systems, compliance, or program design inspired by Substack long reads.',
    },
  },
  beehiiv: {
    executive: {
      title: 'Executive · Career & project discussion',
      description:
        'For Beehiiv readers ready to act. align career moves, publication strategy, or project sponsorship with a principal architect.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Technical and compliance depth on topics raised in Beehiiv posts. Share briefs or drafts before booking.',
    },
  },
  ghost: {
    executive: {
      title: 'Executive · Blog-to-project discussion',
      description:
        'Bridge Ghost content to real decisions. feasibility, institutional strategy, or career pivots after reading the blog.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Review engineering or program design questions surfaced in Ghost publications.',
    },
  },
  linkedin: {
    executive: {
      title: 'Executive · Career & sponsor discussion',
      description:
        'For LinkedIn connections. executive career guidance, sponsor conversations, or stakeholder alignment on complex programs.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Professional audit of proposals, RFP responses, or institutional designs discussed on LinkedIn.',
    },
  },
  twitter: {
    executive: {
      title: 'Executive · Thread & project discussion',
      description:
        'Expand an X thread or post into a structured call. project direction, public positioning, or quick executive alignment.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Rigor-check technical arguments or mega-project claims you saw on X before you commit resources.',
    },
  },
  bluesky: {
    executive: {
      title: 'Executive · Thread & project discussion',
      description:
        'Continue the Bluesky conversation with a booked block. fit, project scope, or career guidance after posts or threads.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Compliance and design review for engineering or policy ideas debated on Bluesky.',
    },
  },
  facebook: {
    executive: {
      title: 'Executive · Community & project discussion',
      description:
        'For followers from pages or groups. discuss projects, collaborations, or advisory needs beyond the feed.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Formal review of designs or programs referenced in Facebook posts or community threads.',
    },
  },
  instagram: {
    executive: {
      title: 'Executive · Creator & brand discussion',
      description:
        'Move from reels, stories, or feed to a live session. brand partnerships, creator strategy, or project sponsorship.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Review technical or program content promoted on Instagram with pre-shared materials.',
    },
  },
  snapchat: {
    executive: {
      title: 'Executive · Quick project discussion',
      description:
        'Fast-track a Snap or story referral into a focused call. idea validation or next-step planning.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Deeper technical review when a Snap pointed you to a serious build or compliance question.',
    },
  },
  youtube: {
    executive: {
      title: 'Executive · Creator & sponsor discussion',
      description:
        'After watching on YouTube. sponsor calls, channel strategy, or translating video topics into delivery plans.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Audit systems or compliance themes from long-form or Shorts content. Send notes or links beforehand.',
    },
  },
  tiktok: {
    executive: {
      title: 'Executive · Idea & project discussion',
      description:
        'Book depth beyond the clip. stress-test an idea, career move, or venture theme from TikTok.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'When a TikTok surfaced a real engineering or compliance problem worth a formal review.',
    },
  },
  reddit: {
    executive: {
      title: 'Executive · Community & project discussion',
      description:
        'From subreddit threads to a private advisory block. scope projects raised in discussion posts.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Structured review of technical posts or community-sourced design questions.',
    },
  },
  spotify: {
    executive: {
      title: 'Executive · Listener & project discussion',
      description:
        'Podcast listeners. discuss episodes, career paths, or projects inspired by the show.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Technical deep-dive on topics covered in podcast episodes. Share episode notes when booking.',
    },
  },
  discord: {
    executive: {
      title: 'Executive · Community & project discussion',
      description:
        'For server members. channel strategy, community programs, or project direction after Discord engagement.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Review builds, bots, or infrastructure plans discussed in your Discord community.',
    },
  },
  telegram: {
    executive: {
      title: 'Executive · Channel & project discussion',
      description:
        'Telegram channel followers. project scope, broadcast strategy, or advisory on initiatives you follow.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Compliance and architecture review for programs promoted on Telegram.',
    },
  },
  whatsapp: {
    executive: {
      title: 'Executive · Project discussion',
      description:
        'Continue a WhatsApp channel or broadcast thread with a booked advisory session.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Formal review of technical material shared via WhatsApp channels.',
    },
  },
}

const PAID_TIER_BY_CATEGORY: Record<PlatformCategory, PaidTierCopy> = {
  'Core / Owned Platform': PAID_TIER_BY_CHANNEL.website!,
  'Writing / Publishing': {
    executive: {
      title: 'Executive · Reader & project discussion',
      description:
        'For publication readers. turn what you read into career guidance, project sponsorship, or delivery strategy.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Audit technical narratives, frameworks, or compliance questions from published work.',
    },
  },
  'Social Distribution': {
    executive: {
      title: 'Executive · Career & project discussion',
      description:
        'Social referrals. career moves, project fit, or executive alignment after engaging on the platform.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Review designs or programs discussed in social posts. Send context before the session.',
    },
  },
  'Video Platform': {
    executive: {
      title: 'Executive · Creator & sponsor discussion',
      description:
        'Video audience. sponsor strategy, production themes, or project direction after watching.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Technical review of subjects covered in video content.',
    },
  },
  'Audio / Podcast': {
    executive: {
      title: 'Executive · Listener & project discussion',
      description:
        'Listeners booking after an episode. careers, ventures, or programs inspired by the show.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Deep review of technical topics from podcast or audio feeds.',
    },
  },
  'Community / Direct': {
    executive: {
      title: 'Executive · Direct project discussion',
      description:
        'Direct-channel subscribers. scope projects, lists, or community initiatives one-to-one.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Compliance and design review for programs shared on direct channels.',
    },
  },
  'Discovery / Search': {
    executive: {
      title: 'Executive · Search-intent discussion',
      description:
        'You found this via search. discuss the problem you are trying to solve before committing further.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Formal review after discovering technical content through search.',
    },
  },
  'Syndication / Automation': {
    executive: {
      title: 'Executive · Syndicated referral discussion',
      description:
        'Arrived via syndicated feed or API. align automation outputs with real advisory needs.',
    },
    designReview: {
      title: SERVICES_TIER_TITLE,
      description:
        'Review systems or data surfaced through syndicated channels.',
    },
  },
}

function paidCopyForChannel(channelId: string): PaidTierCopy {
  const direct = PAID_TIER_BY_CHANNEL[channelId]
  if (direct) return direct
  const category = getChannelById(channelId)?.platformCategory
  if (category && PAID_TIER_BY_CATEGORY[category]) return PAID_TIER_BY_CATEGORY[category]
  return PAID_TIER_BY_CATEGORY['Social Distribution']
}

function buildTier(
  base: ConsultationTier,
  copy: Pick<ConsultationTier, 'title' | 'description'>,
  scheduleUrl: string
): ConsultationTier {
  return { ...base, ...copy, scheduleUrl }
}

type DiscoveryCopy = Pick<ConsultationTier, 'title' | 'description' | 'bestFor' | 'outcome'>

const DISCOVERY_BY_CHANNEL: Partial<Record<string, DiscoveryCopy>> = {
  webinar: {
    title: DISCOVERY_TITLE,
    description:
      'After the briefing. orientation on pathways, prep options, and whether a paid working session fits. Cite the webinar title or replay when you book.',
  },
  linkedin: {
    title: DISCOVERY_TITLE,
    description: 'Quick alignment on sponsor context, LinkedIn article, or connection before a deeper session.',
    bestFor: 'One executive decision or intro fit',
    outcome: 'Clear next step or longer session recommendation',
  },
  instagram: {
    title: DISCOVERY_TITLE,
    description: 'Short call after a reel, story, or feed link. name what you watched when you book.',
    bestFor: 'Quick direction after visual content',
    outcome: 'Focused next step from the clip or story',
  },
  medium: {
    title: DISCOVERY_TITLE,
    description: 'After a Medium article. cite the post and your certification question when you book.',
  },
  website: {
    title: DISCOVERY_TITLE,
    description: 'From a site page, newsletter, or knowledge asset. cite what you read when you book.',
  },
  twitter: {
    title: DISCOVERY_TITLE,
    description: 'Expand a post or thread into structured guidance. drop the URL in your booking note.',
    bestFor: 'One thread or post you want vetted',
    outcome: 'Direction beyond what fits in a post',
  },
}

const DISCOVERY_CATEGORY_DEFAULT: Partial<Record<PlatformCategory, DiscoveryCopy>> = {
  'Writing / Publishing': {
    title: DISCOVERY_TITLE,
    description: 'After long-form content. Cite what you read when you book.',
  },
  'Social Distribution': {
    title: DISCOVERY_TITLE,
    description: 'Share which post, feed, or referral brought you here.',
  },
  'Video Platform': {
    title: DISCOVERY_TITLE,
    description: 'After a video. Name the title or series when you book.',
  },
  'Audio / Podcast': {
    title: DISCOVERY_TITLE,
    description: 'After an episode. Cite the show or episode when you book.',
  },
  'Discovery / Search': {
    title: DISCOVERY_TITLE,
    description: 'Clarify the problem you found via search before committing further.',
  },
}

function discoveryCopyForChannel(channelId: string): DiscoveryCopy {
  const direct = DISCOVERY_BY_CHANNEL[channelId]
  if (direct) return direct
  const cat = getChannelById(channelId)?.platformCategory
  if (cat && DISCOVERY_CATEGORY_DEFAULT[cat]) return DISCOVERY_CATEGORY_DEFAULT[cat]!
  const label = getChannelPortalCopy(channelId)?.scheduleTierCta ?? 'Talk to a mentor'
  return {
    title: DISCOVERY_TITLE,
    description: `Structured session for referrals from this channel. Use "${label}" when you schedule.`,
    bestFor: 'One focused question',
    outcome: 'Clear next step',
  }
}

const EXECUTIVE_TIER_META: Pick<ConsultationTier, 'bestFor' | 'outcome' | 'badge' | 'recommended'> = {
  bestFor: 'Deeper situation review',
  outcome: 'Structured guidance and recommendation',
  badge: 'Most Popular',
  recommended: true,
}

const DESIGN_TIER_META: Pick<ConsultationTier, 'bestFor' | 'outcome'> = {
  bestFor: 'Complex programs or technical depth',
  outcome: 'Roadmap and priority actions',
}

/** Full tier list: platform discovery + paid tiers. */
export function getConsultationTiersForChannel(channelId: string): ConsultationTier[] {
  const paid = paidCopyForChannel(channelId)
  const discovery = discoveryCopyForChannel(channelId)
  const packCta = getChannelPortalCopy(channelId)?.scheduleTierCta
  const introCta = usesPortalWebsiteLayoutChrome(channelId)
    ? 'Talk to a mentor'
    : packCta ?? 'Talk to a mentor'
  const executiveBase = DEFAULT_CONSULTATION_TIERS.find((t) => t.id === 'executive')!
  const designBase = DEFAULT_CONSULTATION_TIERS.find((t) => t.id === 'design-review')!
  const servicesTitle = paid.designReview.title || SERVICES_TIER_TITLE
  const servicesDescription =
    paid.designReview.description ||
    'Principal advisory for PMO services, delivery consulting, and programs you selected on the site. Hover to view services.'
  const servicesCta = 'Talk to an expert'

  const servicesTier: ConsultationTier = {
    ...buildTier(
      designBase,
      paid.designReview,
      scheduleUrlFor(channelId, 'services-detail', LEGACY_SCHEDULE_URLS.designReview),
    ),
    id: 'services-detail',
    title: servicesTitle,
    description: servicesDescription,
    recommended: false,
    ctaLabel: ctaFor(channelId, 'services-detail', servicesCta),
  }

  if (channelId === 'webinar') {
    const webinarOpenUrl = OWNED_WEBINAR_CALENDLY.discovery
    const webinarPaidUrl = OWNED_WEBINAR_CALENDLY.paid
    return [
      {
        ...DISCOVERY_TIER,
        id: 'mentor-intro',
        ...discovery,
        title: DISCOVERY_TITLE,
        isFree: true,
        ctaLabel: ctaFor(channelId, 'mentor-intro', introCta),
        scheduleUrl: webinarOpenUrl,
      },
      {
        ...buildTier(executiveBase, paid.executive, webinarPaidUrl),
        id: 'career-pathway',
        title: 'Career & Pathway Session',
        description: paid.executive.description,
        ...EXECUTIVE_TIER_META,
        recommended: true,
        badge: 'Most Popular',
        ctaLabel: ctaFor(channelId, 'career-pathway', 'Reserve Advisory Call'),
        scheduleUrl: webinarPaidUrl,
      },
    ]
  }

  return withChannelPackScheduleUrls(channelId, [
    {
      ...DISCOVERY_TIER,
      id: 'mentor-intro',
      ...discovery,
      title: DISCOVERY_TITLE,
      isFree: true,
      ctaLabel: ctaFor(channelId, 'mentor-intro', introCta),
      scheduleUrl: scheduleUrlFor(channelId, 'mentor-intro', LEGACY_SCHEDULE_URLS.discovery),
    },
    {
      ...buildTier(
        executiveBase,
        paid.executive,
        scheduleUrlFor(channelId, 'career-pathway', LEGACY_SCHEDULE_URLS.executive),
      ),
      id: 'career-pathway',
      title: 'Career & Pathway Session',
      description: paid.executive.description,
      ...EXECUTIVE_TIER_META,
      ctaLabel: ctaFor(channelId, 'career-pathway', 'Schedule a pathway session'),
    },
    servicesTier,
  ])
}

const LEGACY_PAID_TITLES = new Set([
  'Executive',
  'Paid Executive Strategy & Feasibility Review',
  'Project Design Review & Compliance Advisory',
  'Design & Compliance Review',
  'Services Discussion',
  'Certification depth session',
  'Expert consultation',
  'Services, PMO & consultation',
])

const LEGACY_PAID_TITLE =
  /Executive ·|Paid webinar session|Creator & brand|principal advisory|Independent/i

function shouldUsePlatformPaidCopy(saved: ConsultationTier, tierId: string): boolean {
  if (tierId === 'discovery') return false
  if (LEGACY_PAID_TITLE.test(saved.title ?? '')) return true
  const legacy = DEFAULT_CONSULTATION_TIERS.find((t) => t.id === tierId)
  if (!legacy) return true
  if (!saved.title?.trim() || LEGACY_PAID_TITLES.has(saved.title.trim())) return true
  if (saved.description?.trim() === legacy.description.trim()) return true
  return false
}

/**
 * Discovery stays generic (saved overrides allowed). Paid tiers use platform copy
 * unless the dashboard has custom title/description saved.
 */
export function applyPlatformConsultationTiers(
  saved: ConsultationTier[] | undefined,
  channelId: string
): ConsultationTier[] {
  const platform = getConsultationTiersForChannel(channelId)
  if (!saved?.length) return platform

  const forcedPack =
    isSocialDistributionPortalChannel(channelId) ||
    isAudioPodcastPortalChannel(channelId) ||
    isCommunityDirectPortalChannel(channelId) ||
    isSyndicatedPortalPackChannel(channelId) ||
    isWritingPublishingPortalChannel(channelId) ||
    isVideoPlatformPortalChannel(channelId) ||
    isCoreOwnedPortalChannel(channelId)
  const openDiscoveryLabel = isSocialDistributionPortalChannel(channelId)
    ? SOCIAL_DISTRIBUTION_TIER_DISPLAY.discoveryPriceLabel
    : isAudioPodcastPortalChannel(channelId)
      ? AUDIO_PODCAST_TIER_DISPLAY.discoveryPriceLabel
      : isCommunityDirectPortalChannel(channelId)
        ? COMMUNITY_MESSAGING_TIER_DISPLAY.discoveryPriceLabel
        : isSyndicatedPortalPackChannel(channelId)
          ? SYNDICATED_PORTAL_TIER_DISPLAY.discoveryPriceLabel
          : isWritingPublishingPortalChannel(channelId)
            ? PUBLISHING_NEWSLETTERS_TIER_DISPLAY.discoveryPriceLabel
            : isVideoPlatformPortalChannel(channelId)
              ? VIDEO_PLATFORM_TIER_DISPLAY.discoveryPriceLabel
              : isOwnedWebsitePortalChannel(channelId)
                ? OWNED_WEBSITE_TIER_DISPLAY.discoveryPriceLabel
                : isOwnedWebinarPortalChannel(channelId)
                  ? OWNED_WEBINAR_TIER_DISPLAY.discoveryPriceLabel
                  : 'Free'

  return platform.map((pt) => {
    const s = saved.find((x) => x.id === pt.id)
    if (!s) return pt

    const scheduleUrl = forcedPack ? pt.scheduleUrl : s.scheduleUrl?.trim() || pt.scheduleUrl

    if (pt.id === 'mentor-intro' || pt.id === 'discovery') {
      return {
        ...pt,
        id: 'mentor-intro',
        title: pt.title,
        description: pt.description,
        ctaLabel:
          s.ctaLabel?.trim() && !isGenericIntroCta(s.ctaLabel, channelId)
            ? s.ctaLabel.trim()
            : pt.ctaLabel || 'Talk to a mentor',
        scheduleUrl,
        isFree: true,
        priceLabel: forcedPack ? openDiscoveryLabel : 'Free',
        recommended: false,
      }
    }

    if (pt.id === 'services-detail') {
      if (shouldUsePlatformPaidCopy(s, 'design-review')) {
        return {
          ...pt,
          scheduleUrl,
          ctaLabel: s.ctaLabel?.trim() || pt.ctaLabel,
        }
      }
      return {
        ...s,
        id: 'services-detail',
        scheduleUrl,
        recommended: false,
        ctaLabel: s.ctaLabel?.trim() || pt.ctaLabel || 'Talk to an expert',
      }
    }

    if (shouldUsePlatformPaidCopy(s, pt.id)) {
      return {
        ...pt,
        scheduleUrl,
        ctaLabel: s.ctaLabel?.trim() || pt.ctaLabel,
      }
    }

    return {
      ...s,
      scheduleUrl,
      recommended: s.recommended ?? pt.recommended,
      isFree: s.isFree ?? pt.isFree,
      durationLabel: forcedPack ? pt.durationLabel : s.durationLabel || pt.durationLabel,
      priceLabel: forcedPack ? pt.priceLabel : s.priceLabel || pt.priceLabel,
    }
  })
}

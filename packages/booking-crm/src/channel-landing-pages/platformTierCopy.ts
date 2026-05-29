import { getChannelById } from '../constants/channelGroups'
import type { PlatformCategory } from '../types/distribution'
import {
  DEFAULT_CONSULTATION_TIERS,
  type ConsultationTier,
} from '../types/channelLandingPage'
import { CALENDLY_DEFAULT_SCHEDULING_URLS } from '../calendly/scheduling-urls'
import { getChannelPortalCopy } from './channelPortalCopy'
import { usesProConsultationPortalLayout } from './platformOfferPack'

const GENERIC_INTRO_CTAS = new Set([
  'talk to a mentor',
  'book a mentor intro',
  'schedule inline',
  'schedule consultation',
  'book a call',
  'book a session',
])

function isGenericIntroCta(label: string | undefined, channelId: string): boolean {
  const trimmed = label?.trim()
  if (!trimmed) return true
  if (usesProConsultationPortalLayout(channelId)) return false
  return GENERIC_INTRO_CTAS.has(trimmed.toLowerCase())
}

type PaidTierCopy = {
  executive: Pick<ConsultationTier, 'title' | 'description'>
  designReview: Pick<ConsultationTier, 'title' | 'description'>
}

const DISCOVERY_TIER = DEFAULT_CONSULTATION_TIERS.find((t) => t.id === 'discovery')!

const SCHEDULE_URLS = {
  discovery: CALENDLY_DEFAULT_SCHEDULING_URLS.guideDownload,
  executive: CALENDLY_DEFAULT_SCHEDULING_URLS.projectReview,
  designReview: CALENDLY_DEFAULT_SCHEDULING_URLS.strategyAdvisory,
} as const

/** Paid-tier wording per platform channel (discovery stays generic). */
const PAID_TIER_BY_CHANNEL: Partial<Record<string, PaidTierCopy>> = {
  webinar: {
    executive: {
      title: 'Paid mentor session',
      description:
        'Extended mentor block after the webinar. pathway depth, prep planning, and certification questions with PM Structure.',
    },
    designReview: {
      title: 'Paid mentor session',
      description: 'Reserved for two-tier webinar flow.',
    },
  },
  website: {
    executive: {
      title: 'Career & Pathway Session',
      description:
        'Structured mentor block for exam prep, pathway choice, and career direction from the site.',
    },
    designReview: {
      title: 'Certification depth session',
      description:
        'Deep review of architecture, compliance, or delivery plans tied to what you read on the site. Send summaries ahead of the call.',
    },
  },
  medium: {
    executive: {
      title: 'Executive · Publication & defense discussion',
      description:
        'Pressure-test ideas from Medium posts. publication strategy, peer-review defense, or translating articles into delivery plans.',
    },
    designReview: {
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
      title: 'Certification depth session',
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
    title: 'Free Mentor Intro',
    description:
      'After the briefing. orientation on pathways, prep options, and whether a paid working session fits. Cite the webinar title or replay when you book.',
  },
  linkedin: {
    title: '15-Min Executive Fit Check',
    description: 'Quick alignment on sponsor context, LinkedIn article, or connection before a deeper session.',
    bestFor: 'One executive decision or intro fit',
    outcome: 'Clear next step or longer session recommendation',
  },
  instagram: {
    title: '15-Min Reel & Story Follow-Up',
    description: 'Short call after a reel, story, or feed link. name what you watched when you book.',
    bestFor: 'Quick direction after visual content',
    outcome: 'Focused next step from the clip or story',
  },
  medium: {
    title: 'Free Mentor Intro',
    description: 'After a Medium article. cite the post and your certification question when you book.',
  },
  website: {
    title: 'Free Mentor Intro',
    description: 'From a site page, newsletter, or knowledge asset. cite what you read when you book.',
  },
  twitter: {
    title: '15-Min Thread Follow-Up',
    description: 'Expand a post or thread into structured guidance. drop the URL in your booking note.',
    bestFor: 'One thread or post you want vetted',
    outcome: 'Direction beyond what fits in a post',
  },
}

const DISCOVERY_CATEGORY_DEFAULT: Partial<Record<PlatformCategory, DiscoveryCopy>> = {
  'Writing / Publishing': {
    title: 'Free Mentor Intro',
    description: 'After long-form content. Cite what you read when you book.',
  },
  'Social Distribution': {
    title: 'Free Mentor Intro',
    description: 'Share which post, feed, or referral brought you here.',
  },
  'Video Platform': {
    title: 'Free Mentor Intro',
    description: 'After a video. Name the title or series when you book.',
  },
  'Audio / Podcast': {
    title: 'Free Mentor Intro',
    description: 'After an episode. Cite the show or episode when you book.',
  },
  'Discovery / Search': {
    title: 'Free Mentor Intro',
    description: 'Clarify the problem you found via search before committing further.',
  },
}

function discoveryCopyForChannel(channelId: string): DiscoveryCopy {
  const direct = DISCOVERY_BY_CHANNEL[channelId]
  if (direct) return direct
  const cat = getChannelById(channelId)?.platformCategory
  if (cat && DISCOVERY_CATEGORY_DEFAULT[cat]) return DISCOVERY_CATEGORY_DEFAULT[cat]!
  const label = getChannelPortalCopy(channelId)?.scheduleTierCta ?? 'Book'
  return {
    title: 'Free Mentor Intro',
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
  const introCta =
    channelId === 'webinar' || usesProConsultationPortalLayout(channelId)
      ? 'Talk to a mentor'
      : packCta ?? 'Book a mentor intro'
  const executiveBase = DEFAULT_CONSULTATION_TIERS.find((t) => t.id === 'executive')!
  const designBase = DEFAULT_CONSULTATION_TIERS.find((t) => t.id === 'design-review')!
  const servicesTier: ConsultationTier = {
    ...buildTier(designBase, paid.designReview, SCHEDULE_URLS.designReview),
    id: 'services-detail',
    title: 'Services Discussion',
    description:
      paid.designReview.description ||
      'Review services you selected on the website. Cite the page or package when you book.',
    recommended: false,
    ctaLabel: 'Discuss services',
  }

  if (channelId === 'webinar') {
    return [
      {
        ...DISCOVERY_TIER,
        id: 'mentor-intro',
        ...discovery,
        title: 'Free Mentor Intro',
        isFree: true,
        ctaLabel: introCta,
        scheduleUrl: SCHEDULE_URLS.discovery,
      },
      {
        ...buildTier(executiveBase, paid.executive, SCHEDULE_URLS.executive),
        id: 'career-pathway',
        title: 'Career & Pathway Session',
        description: paid.executive.description,
        ...EXECUTIVE_TIER_META,
        recommended: true,
        badge: 'Most Popular',
        ctaLabel: 'Book pathway session',
      },
      servicesTier,
    ]
  }

  return [
    {
      ...DISCOVERY_TIER,
      id: 'mentor-intro',
      ...discovery,
      title: discovery.title === 'Free mentor intro' ? 'Free Mentor Intro' : discovery.title,
      isFree: true,
      ctaLabel: introCta,
      scheduleUrl: SCHEDULE_URLS.discovery,
    },
    {
      ...buildTier(executiveBase, paid.executive, SCHEDULE_URLS.executive),
      id: 'career-pathway',
      title: 'Career & Pathway Session',
      description: paid.executive.description,
      ...EXECUTIVE_TIER_META,
      ctaLabel: 'Book pathway session',
    },
    servicesTier,
  ]
}

const LEGACY_PAID_TITLES = new Set([
  'Executive',
  'Paid Executive Strategy & Feasibility Review',
  'Project Design Review & Compliance Advisory',
  'Design & Compliance Review',
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

  return platform.map((pt) => {
    const s = saved.find((x) => x.id === pt.id)
    if (!s) return pt

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
        scheduleUrl: s.scheduleUrl?.trim() || pt.scheduleUrl,
        isFree: true,
        priceLabel: 'Free',
        recommended: false,
      }
    }

    if (pt.id === 'services-detail') {
      if (shouldUsePlatformPaidCopy(s, 'design-review')) {
        return {
          ...pt,
          scheduleUrl: s.scheduleUrl?.trim() || pt.scheduleUrl,
          ctaLabel: s.ctaLabel?.trim() || pt.ctaLabel,
        }
      }
      return {
        ...s,
        id: 'services-detail',
        scheduleUrl: s.scheduleUrl?.trim() || pt.scheduleUrl,
        recommended: false,
        ctaLabel: s.ctaLabel?.trim() || 'Discuss services',
      }
    }

    if (shouldUsePlatformPaidCopy(s, pt.id)) {
      return {
        ...pt,
        scheduleUrl: s.scheduleUrl?.trim() || pt.scheduleUrl,
        ctaLabel: s.ctaLabel?.trim() || pt.ctaLabel,
      }
    }

    return {
      ...s,
      scheduleUrl: s.scheduleUrl?.trim() || pt.scheduleUrl,
      recommended: s.recommended ?? pt.recommended,
      isFree: s.isFree ?? pt.isFree,
      durationLabel: s.durationLabel || pt.durationLabel,
      priceLabel: s.priceLabel || pt.priceLabel,
    }
  })
}

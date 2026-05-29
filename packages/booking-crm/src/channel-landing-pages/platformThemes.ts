import type { CtaPlatformButton } from '../constants/ctaPlatformButtons'
import { getChannelById, getChannelColor } from '../constants/channelGroups'
import { getChannelTypeById } from '../constants/channelTypes'
import {
  getChannelPortalCopy,
  getScheduleTierCtaFromCopy,
} from './channelPortalCopy'
import { IMPLEMENTATION_SCOPE_41 } from './platformBrandSources'
import { getPortalCopyForChannel } from './portalCopyFromContext'
import { getPlatformOfferPack } from './platformOfferPack'
import { PLATFORM_THEME_SCOPE_EXTENDED } from './platformScopePalettes'
import { applyPlatformDesignLanguage } from './platformDesignLanguage'

export type PlatformPortalTheme = {
  channelId: string
  platformName: string
  iconName: string
  primary: string
  primaryForeground: string
  accent: string
  accentForeground: string
  background: string
  surface: string
  surfaceMuted: string
  text: string
  textMuted: string
  contextColor: string
  heroBg: string
  heroText: string
  cardBg: string
  cardBorder: string
  quoteBorder: string
  quoteBg: string
  verifiedColor: string
  statusDot: string
  linkColor: string
  recommendedBg: string
  recommendedText: string
  freeBadgeBg: string
  freeBadgeText: string
  priceBadgeBg: string
  priceBadgeText: string
  fontFamily: string
  radius: string
  radiusLg: string
  presenceTag: string
  schedulingTitle: string
  schedulingBody: string
  heroCardTitle: string
  heroCardBody: string
  /** Tier-row CTA label (e.g. "Schedule here" vs "Schedule online"). */
  scheduleTierCta: string
}

export type PlatformPortalCopy = {
  contextLabel: string
  headline: string
  subheadline: string
  targetMessage: string
  availabilityLabel: string
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace('#', '')
  if (h.length !== 6) return null
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

function tint(hex: string, amount: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const mix = (c: number) => Math.round(c + (255 - c) * amount)
  return `rgb(${mix(rgb.r)}, ${mix(rgb.g)}, ${mix(rgb.b)})`
}

function shade(hex: string, amount: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const mix = (c: number) => Math.round(c * (1 - amount))
  return `rgb(${mix(rgb.r)}, ${mix(rgb.g)}, ${mix(rgb.b)})`
}

function referralSurface(btn: CtaPlatformButton): string {
  const platform = btn.label
  const type = btn.typeLabel
  const ct = getChannelTypeById(btn.channelTypeId)
  const format = ct?.formatFamily?.toLowerCase() ?? ''

  if (btn.channelId === 'bluesky') {
    if (format.includes('thread')) return 'this Bluesky thread'
    return 'my Bluesky feed'
  }
  if (btn.channelId === 'facebook') {
    if (type.toLowerCase().includes('group')) return 'our Facebook group'
    if (type.toLowerCase().includes('page')) return 'the Facebook page'
    return 'Facebook'
  }
  if (btn.channelId === 'instagram') {
    if (format.includes('reel')) return 'Instagram Reels'
    if (format.includes('stor')) return 'Instagram Stories'
    if (format.includes('broadcast')) return 'the Instagram channel'
    return 'Instagram'
  }
  if (btn.channelId === 'snapchat') return 'Snapchat'
  if (btn.channelId === 'linkedin') {
    if (type.toLowerCase().includes('company')) return 'the LinkedIn company page'
    if (type.toLowerCase().includes('newsletter')) return 'LinkedIn newsletter'
    if (type.toLowerCase().includes('article')) return 'LinkedIn articles'
    return 'LinkedIn'
  }
  if (btn.channelId === 'twitter') {
    if (format.includes('thread')) return 'this X thread'
    return 'X'
  }
  if (btn.channelId === 'youtube') {
    if (format.includes('short')) return 'YouTube Shorts'
    return 'YouTube'
  }
  if (btn.channelId === 'tiktok') return 'TikTok'
  if (btn.channelId === 'medium') return `Medium — ${type.toLowerCase()}`
  if (btn.channelId === 'website') return `this site — ${type.toLowerCase()}`
  if (format.includes('newsletter')) return `${platform} newsletter`
  if (format.includes('podcast') || format.includes('episode')) return `${platform} podcast`
  return `${platform} — ${type}`
}

/** Platform-native default copy (wording tuned per channel + type). */
export function getPlatformPortalCopy(btn: CtaPlatformButton): PlatformPortalCopy {
  const packCopy = getPortalCopyForChannel(btn.channelId)
  if (packCopy) return packCopy

  const ref = referralSurface(btn)
  const platform = btn.label
  const type = btn.typeLabel

  const byChannel: Partial<Record<string, PlatformPortalCopy>> = {
    bluesky: {
      contextLabel: `OPEN SKY REFERRAL — YOU ARRIVED FROM ${platform.toUpperCase()}`,
      headline: `Continue the conversation from Bluesky`,
      subheadline: `Book a focused advisory block after following through from ${ref}. Short-form posts, threads, and replies welcome.`,
      targetMessage: `Mention the Bluesky post or thread that brought you here when you book.`,
      availabilityLabel: 'Open for discovery calls',
    },
    facebook: {
      contextLabel: `FACEBOOK REFERRAL`,
      headline: `Book advisory after Facebook`,
      subheadline: `Schedule a session after engaging on ${ref}. Ideal for page followers, group members, and feed connections.`,
      targetMessage: `Share which Facebook post or group context applies to your request.`,
      availabilityLabel: 'Messenger & calendar sync available',
    },
    instagram: {
      contextLabel: `INSTAGRAM REFERRAL`,
      headline: `From Instagram to a live advisory session`,
      subheadline: `You followed through from ${ref}. Book discovery or deep-dive strategy in one place.`,
      targetMessage: `Note the reel, story, or post that led you here.`,
      availabilityLabel: 'DM follow-up after booking',
    },
    snapchat: {
      contextLabel: `SNAPCHAT REFERRAL`,
      headline: `Quick booking from Snapchat`,
      subheadline: `Swipe-up or story link brought you here. Lock a call without leaving the flow.`,
      targetMessage: `Tell us which Snap or story you came from.`,
      availabilityLabel: 'Fast slots · mentorship open',
    },
    linkedin: {
      contextLabel: `LINKEDIN PROFESSIONAL REFERRAL`,
      headline: `Executive advisory from LinkedIn`,
      subheadline: `Structured consultation for sponsors and leaders who found this via ${ref}.`,
      targetMessage: `Reference your LinkedIn connection context or article when booking.`,
      availabilityLabel: 'Accepting executive strategy calls',
    },
    twitter: {
      contextLabel: `X REFERRAL`,
      headline: `Working session after your post`,
      subheadline: `Thread, reply, or timeline referral via ${ref}.`,
      targetMessage: `Drop the post URL or thread topic in your booking note.`,
      availabilityLabel: 'Discovery calls open',
    },
    youtube: {
      contextLabel: `YOUTUBE REFERRAL`,
      headline: `Book after watching on YouTube`,
      subheadline: `Channel, long-form, or Shorts referral from ${ref}.`,
      targetMessage: `Which video or series prompted this booking?`,
      availabilityLabel: 'Creator & sponsor sessions',
    },
    tiktok: {
      contextLabel: `TIKTOK VIDEO REFERRAL`,
      headline: `Structured advisory after the clip`,
      subheadline: `You arrived from ${ref}. Book a call to go deeper than a short video allows.`,
      targetMessage: `Mention the TikTok that sent you here.`,
      availabilityLabel: 'Quick discovery open',
    },
    medium: {
      contextLabel: `MEDIUM PUBLICATION REFERRAL — ${type.toUpperCase()}`,
      headline: `Nautical & systems advisory after Medium`,
      subheadline: `Peer-review publication readers: book defense, audit, or strategy on concepts from ${ref}.`,
      targetMessage: `Book an academic defense or peer audit of my latest publications.`,
      availabilityLabel: 'Free discovery & mentorship open',
    },
    website: {
      contextLabel: `OWNED WEB PROPERTY — ${type.toUpperCase()}`,
      headline: `Principal advisory — ${type}`,
      subheadline: `Direct booking from ${ref} on the owned platform.`,
      targetMessage: `Describe the page or asset you came from.`,
      availabilityLabel: 'Accepting advisory roles',
    },
    beehiiv: {
      contextLabel: `BEEHIIV REFERRAL`,
      headline: `Book after your Beehiiv read`,
      subheadline: `Newsletter and post-feed readers — move from inbox to a working session.`,
      targetMessage: `You clicked through on Beehiiv — book time to stress-test ideas, publication strategy, or mega-project scope with a principal architect.`,
      availabilityLabel: 'Discovery open · paid tiers below',
    },
    substack: {
      contextLabel: `SUBSTACK REFERRAL`,
      headline: `From Substack to a live call`,
      subheadline: `Posts, notes, or newsletter — continue the thread in a booked block.`,
      targetMessage: `Turn what you read on Substack into structured advisory — feasibility, systems design, or publication defense.`,
      availabilityLabel: 'Free discovery available',
    },
    ghost: {
      contextLabel: `GHOST REFERRAL`,
      headline: `Book after Ghost`,
      subheadline: `Blog or newsletter subscribers — schedule depth beyond the post.`,
      targetMessage: `You arrived from Ghost — book a block to align publication themes with engineering and delivery reality.`,
      availabilityLabel: 'Mentorship & executive slots open',
    },
  }

  const custom = byChannel[btn.channelId]
  if (custom) {
    return {
      contextLabel: custom.contextLabel.toUpperCase(),
      headline: custom.headline,
      subheadline: custom.subheadline,
      targetMessage: custom.targetMessage,
      availabilityLabel: custom.availabilityLabel,
    }
  }

  const ct = getChannelTypeById(btn.channelTypeId)
  const format = ct?.formatFamily?.toLowerCase() ?? ''

  let targetMessage = `You followed through from ${ref} — book a live block to go deeper than the feed allows.`
  if (format.includes('newsletter')) {
    targetMessage = `You read on ${platform} — turn the newsletter into a working session on strategy, feasibility, or technical scope.`
  } else if (format.includes('article') || format.includes('publication')) {
    targetMessage = `You engaged with ${platform} content — book time to challenge, extend, or operationalize what you read.`
  } else if (format.includes('video') || format.includes('short')) {
    targetMessage = `You watched on ${platform} — book a call for depth beyond the clip.`
  } else if (format.includes('podcast')) {
    targetMessage = `You listened on ${platform} — continue the conversation in a booked advisory block.`
  }

  return {
    contextLabel: `REFERRAL FROM ${platform.toUpperCase()}`,
    headline: `Book a focused advisory session`,
    subheadline: `Choose a tier below. You followed through from ${platform}.`,
    targetMessage,
    availabilityLabel: 'Free discovery & mentorship open',
  }
}

/** Detect dashboard placeholders that should not render as the hero title. */
export function isGenericPlatformHeadline(page: {
  label: string
  subtitle?: string
  headline: string
}): boolean {
  if (!page.headline?.trim()) return true
  const h = page.headline.trim()
  const label = page.label.trim()
  const defaultBookSession = [
    `${label} — Book a session`,
    `${label} - Book a session`,
    `${label} — Book a Session`,
    `${label} - Book a Session`,
  ]
  if (defaultBookSession.some((c) => h === c)) return true

  const t = page.subtitle?.trim()
  if (!t) return false
  const candidates = [
    `${label} · ${t}`,
    `${label} — ${t}`,
    `${label} - ${t}`,
    `${label} · ${t} advisory portal`,
  ]
  return candidates.some((c) => h === c)
}

type ThemePartial = Partial<PlatformPortalTheme>

const FONT_FAMILY_BY_CHANNEL: Record<string, string> = {
  website: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  webinar: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  medium: 'charter, Georgia, Cambria, "Times New Roman", serif',
  substack: '"SF Pro Text", "Segoe UI", Inter, Roboto, sans-serif',
  beehiiv: '"Inter", "Sohne", "Avenir Next", "Segoe UI", system-ui, sans-serif',
  ghost: 'Inter, "Segoe UI", Roboto, sans-serif',
  hashnode: 'Inter, "Segoe UI", Roboto, sans-serif',
  'notion-public': '"ui-sans-serif", "Segoe UI", Inter, Roboto, sans-serif',
  linkedin: '-apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  twitter: '"TwitterChirp", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  instagram:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  facebook: 'system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
  reddit: '"IBM Plex Sans", "Noto Sans", "Segoe UI", Roboto, sans-serif',
  threads: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  quora: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  bluesky: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  mastodon: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  pinterest: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  vk: '"Roboto", "Segoe UI", Arial, sans-serif',
  youtube: 'Roboto, "Arial", sans-serif',
  tiktok: '"TikTokText", system-ui, -apple-system, "Segoe UI", sans-serif',
  snapchat: 'system-ui, -apple-system, "Avenir Next", "Helvetica Neue", sans-serif',
  vimeo: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  spotify: '"CircularStd", "Segoe UI", Roboto, sans-serif',
  'apple-podcasts': '-apple-system, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
  'amazon-audible': '"Amazon Ember", "Segoe UI", Roboto, sans-serif',
  podbean: '"Open Sans", "Segoe UI", Roboto, sans-serif',
  soundcloud: '"Interstate", "Segoe UI", Roboto, sans-serif',
  email: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  whatsapp: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  telegram: '"Roboto", "Segoe UI", Arial, sans-serif',
  discord: '"gg sans", "Noto Sans", "Segoe UI", Roboto, sans-serif',
  slack: '"Lato", "Slack-Lato", "Segoe UI", Roboto, sans-serif',
  'google-search': 'Roboto, Arial, sans-serif',
  'youtube-search': 'Roboto, Arial, sans-serif',
  'podcast-directories': 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  'bing-search': '"Segoe UI", Arial, sans-serif',
  'ai-visibility': 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  'rss-feeds': 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  'content-aggregators': 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  'api-ai-fed': 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
}

const IMPLEMENTATION_SCOPE_41_SET = new Set(IMPLEMENTATION_SCOPE_41)

function getScopeThemeBaseline(channelId: string): ThemePartial | undefined {
  if (!IMPLEMENTATION_SCOPE_41_SET.has(channelId)) return undefined
  const channel = getChannelById(channelId)
  const primary = channel?.color ?? getChannelColor(channelId)
  return {
    primary,
    accent: primary,
    contextColor: primary,
    verifiedColor: primary,
    linkColor: primary,
    recommendedBg: primary,
    fontFamily:
      FONT_FAMILY_BY_CHANNEL[channelId] ??
      'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  }
}

const PLATFORM_THEME_OVERRIDES: Record<string, ThemePartial> = {
  website: {
    primary: '#ff4a38',
    accent: '#2851b9',
    background: '#ffffff',
    surface: '#ffffff',
    surfaceMuted: '#f7f7fa',
    text: '#0b0b2a',
    textMuted: '#434855',
    contextColor: '#ff4a38',
    heroBg: '#ff4a38',
    heroText: '#ffffff',
    cardBg: 'rgba(255, 255, 255, 0.78)',
    cardBorder: 'rgba(230, 231, 239, 0.95)',
    quoteBorder: '#ff4a38',
    quoteBg: 'rgba(247, 247, 250, 0.92)',
    verifiedColor: '#2851b9',
    linkColor: '#ff4a38',
    recommendedBg: '#ff4a38',
    recommendedText: '#ffffff',
    freeBadgeBg: 'rgba(255, 74, 56, 0.1)',
    freeBadgeText: '#e63e2e',
    priceBadgeBg: 'rgba(40, 81, 185, 0.08)',
    priceBadgeText: '#2851b9',
    fontFamily: 'var(--font-sans, Montserrat, ui-sans-serif, system-ui, sans-serif)',
    radius: '1.25rem',
    radiusLg: '1.25rem',
    presenceTag: 'Website',
  },
  bluesky: {
    primary: '#0085FF',
    accent: '#0085FF',
    background: '#F0F7FF',
    surface: '#FFFFFF',
    surfaceMuted: '#E8F3FF',
    text: '#0B1F33',
    textMuted: '#3D5A73',
    contextColor: '#0085FF',
    heroBg: 'linear-gradient(135deg, #0085FF 0%, #4BA3FF 55%, #B3D9FF 100%)',
    heroText: '#FFFFFF',
    quoteBorder: '#0085FF',
    quoteBg: '#E8F3FF',
    verifiedColor: '#0085FF',
    linkColor: '#0085FF',
    recommendedBg: '#0085FF',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    radius: '1.25rem',
    radiusLg: '1.5rem',
    presenceTag: 'Bluesky',
    schedulingTitle: 'Pick a slot — synced like your feed',
    heroCardTitle: 'Sky-open scheduling',
    heroCardBody: 'Real-time booking for readers arriving from Bluesky posts and threads.',
  },
  facebook: {
    primary: '#1877F2',
    accent: '#1877F2',
    background: '#F0F2F5',
    surface: '#FFFFFF',
    surfaceMuted: '#E4E6EB',
    text: '#050505',
    textMuted: '#65676B',
    contextColor: '#1877F2',
    heroBg: '#1877F2',
    heroText: '#FFFFFF',
    quoteBorder: '#1877F2',
    quoteBg: '#E7F3FF',
    verifiedColor: '#1877F2',
    linkColor: '#1877F2',
    recommendedBg: '#1877F2',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
    radius: '0.5rem',
    radiusLg: '0.75rem',
    presenceTag: 'Facebook',
    schedulingTitle: 'Select consultation & confirm',
    heroCardTitle: 'Facebook booking portal',
    heroCardBody: 'Coordinate advisory for connections from pages, groups, and feed.',
  },
  instagram: {
    primary: '#E4405F',
    accent: '#C13584',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceMuted: '#F5F5F5',
    text: '#262626',
    textMuted: '#8E8E8E',
    contextColor: '#C13584',
    heroBg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    heroText: '#FFFFFF',
    quoteBorder: '#C13584',
    quoteBg: '#FFF0F5',
    verifiedColor: '#3897F0',
    linkColor: '#C13584',
    recommendedBg: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    radius: '1rem',
    radiusLg: '1.25rem',
    presenceTag: 'Instagram',
    schedulingTitle: 'Book your session',
    heroCardTitle: 'Stories · Reels · Feed',
    heroCardBody: 'Turn Instagram engagement into a live advisory block.',
  },
  snapchat: {
    primary: '#000000',
    accent: '#FFFC00',
    primaryForeground: '#FFFC00',
    accentForeground: '#000000',
    background: '#FFFC00',
    surface: '#FFFFFF',
    surfaceMuted: '#FFF9B8',
    text: '#000000',
    textMuted: '#333333',
    contextColor: '#000000',
    heroBg: '#000000',
    heroText: '#FFFC00',
    cardBg: '#FFFFFF',
    cardBorder: '#000000',
    quoteBorder: '#000000',
    quoteBg: '#FFF9B8',
    verifiedColor: '#000000',
    linkColor: '#000000',
    recommendedBg: '#000000',
    recommendedText: '#FFFC00',
    statusDot: '#FFFC00',
    fontFamily: 'system-ui, -apple-system, "Avenir Next", "Helvetica Neue", sans-serif',
    radius: '1.5rem',
    radiusLg: '2rem',
    presenceTag: 'Snapchat',
    schedulingTitle: 'Lock your time',
    heroCardTitle: 'Snap-to-book',
    heroCardBody: 'Fast booking for story and Snap referrals.',
  },
  linkedin: {
    primary: '#0A66C2',
    accent: '#0A66C2',
    background: '#F3F6F8',
    surface: '#FFFFFF',
    surfaceMuted: '#E8EEF2',
    text: '#191919',
    textMuted: '#666666',
    contextColor: '#0A66C2',
    heroBg: '#0A66C2',
    heroText: '#FFFFFF',
    quoteBorder: '#0A66C2',
    quoteBg: '#E8F4FC',
    verifiedColor: '#0A66C2',
    linkColor: '#0A66C2',
    recommendedBg: '#0A66C2',
    fontFamily: '-apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    radius: '0.5rem',
    radiusLg: '0.625rem',
    presenceTag: 'LinkedIn',
    schedulingTitle: 'Select consultation tier',
    heroCardTitle: 'Professional advisory booking',
    heroCardBody: 'Executive strategy and feasibility for LinkedIn professional referrals.',
  },
  twitter: {
    primary: '#000000',
    accent: '#000000',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceMuted: '#EFF3F4',
    text: '#0F1419',
    textMuted: '#536471',
    contextColor: '#000000',
    heroBg: '#000000',
    heroText: '#FFFFFF',
    quoteBorder: '#000000',
    quoteBg: '#EFF3F4',
    verifiedColor: '#1D9BF0',
    linkColor: '#1D9BF0',
    recommendedBg: '#000000',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    radius: '1rem',
    radiusLg: '1.25rem',
    presenceTag: 'X',
    schedulingTitle: 'Thread to calendar',
    heroCardTitle: 'Post-to-call',
    heroCardBody: 'Threads, replies, and timeline referrals.',
  },
  youtube: {
    primary: '#FF0000',
    accent: '#FF0000',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceMuted: '#F9F9F9',
    text: '#0F0F0F',
    textMuted: '#606060',
    contextColor: '#FF0000',
    heroBg: '#0F0F0F',
    heroText: '#FFFFFF',
    quoteBorder: '#FF0000',
    quoteBg: '#F9F9F9',
    verifiedColor: '#FF0000',
    linkColor: '#FF0000',
    recommendedBg: '#FF0000',
    fontFamily: 'Roboto, "Arial", sans-serif',
    radius: '0.75rem',
    radiusLg: '1rem',
    presenceTag: 'YouTube',
    schedulingTitle: 'Book after the video',
    heroCardTitle: 'Creator & sponsor calls',
    heroCardBody: 'Long-form and Shorts viewers — schedule here.',
  },
  tiktok: {
    primary: '#000000',
    accent: '#FE2C55',
    background: '#000000',
    surface: '#121212',
    surfaceMuted: '#1F1F1F',
    text: '#FFFFFF',
    textMuted: '#A1A1A1',
    contextColor: '#FE2C55',
    heroBg: 'linear-gradient(135deg, #25F4EE 0%, #FE2C55 50%, #000000 100%)',
    heroText: '#FFFFFF',
    cardBg: '#1A1A1A',
    cardBorder: '#333333',
    quoteBorder: '#FE2C55',
    quoteBg: '#1F1F1F',
    verifiedColor: '#25F4EE',
    linkColor: '#FE2C55',
    recommendedBg: '#FE2C55',
    freeBadgeBg: '#1F3D2A',
    freeBadgeText: '#69DB7C',
    priceBadgeBg: '#2D1F24',
    priceBadgeText: '#FE2C55',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    radius: '0.75rem',
    radiusLg: '1rem',
    presenceTag: 'TikTok',
    schedulingTitle: 'Pick a live block',
    heroCardTitle: 'Beyond the clip — real talk',
    heroCardBody: 'Video viewers — book depth beyond the clip.',
  },
  medium: {
    primary: '#000000',
    accent: '#000000',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceMuted: '#F7F7F7',
    text: '#242424',
    textMuted: '#6B6B6B',
    contextColor: '#000000',
    heroBg: '#000000',
    heroText: '#FFFFFF',
    fontFamily: 'charter, Georgia, Cambria, "Times New Roman", serif',
    radius: '0.25rem',
    radiusLg: '0.5rem',
    presenceTag: 'Medium',
  },
  beehiiv: {
    primary: '#2F6BFF',
    accent: '#2F6BFF',
    primaryForeground: '#FFFFFF',
    accentForeground: '#FFFFFF',
    background: '#F6F8FF',
    surface: '#FFFFFF',
    surfaceMuted: '#EEF3FF',
    text: '#0F172A',
    textMuted: '#475569',
    contextColor: '#2F6BFF',
    heroBg: 'linear-gradient(135deg, #2F6BFF 0%, #4F8CFF 65%, #7EB1FF 100%)',
    heroText: '#FFFFFF',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    cardBorder: 'rgba(47, 107, 255, 0.22)',
    quoteBorder: '#2F6BFF',
    quoteBg: '#F3F6FF',
    verifiedColor: '#2F6BFF',
    statusDot: '#14B8A6',
    linkColor: '#2F6BFF',
    recommendedBg: '#2F6BFF',
    recommendedText: '#FFFFFF',
    freeBadgeBg: '#E9FBEF',
    freeBadgeText: '#0F7A42',
    priceBadgeBg: '#EAF0FF',
    priceBadgeText: '#1E3A8A',
    fontFamily: '"Inter", "Söhne", "Avenir Next", "Segoe UI", system-ui, sans-serif',
    radius: '0.75rem',
    radiusLg: '1rem',
    presenceTag: 'Beehiiv',
    schedulingTitle: 'Book a strategy session',
    heroCardTitle: 'From inbox to execution',
    heroCardBody: 'Turn your Beehiiv audience momentum into structured advisory and delivery.',
  },
  webinar: {
    primary: '#000000',
    accent: '#171717',
    primaryForeground: '#FFFFFF',
    accentForeground: '#FFFFFF',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceMuted: '#F4F4F5',
    text: '#0A0A0A',
    textMuted: '#525252',
    contextColor: '#0A0A0A',
    heroBg: '#000000',
    heroText: '#FFFFFF',
    cardBg: '#FFFFFF',
    cardBorder: '#E5E5E5',
    quoteBorder: '#0A0A0A',
    quoteBg: '#F5F5F5',
    verifiedColor: '#0A0A0A',
    linkColor: '#0A0A0A',
    recommendedBg: '#000000',
    recommendedText: '#FFFFFF',
    freeBadgeBg: '#F5F5F5',
    freeBadgeText: '#0A0A0A',
    priceBadgeBg: '#E5E5E5',
    priceBadgeText: '#0A0A0A',
    statusDot: '#22C55E',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    radius: '0.5rem',
    radiusLg: '0.75rem',
    presenceTag: 'Webinar',
    schedulingTitle: 'Choose your session type',
  },
  reddit: {
    primary: '#FF4500',
    accent: '#FF4500',
    background: '#DAE0E6',
    surface: '#FFFFFF',
    heroBg: '#FF4500',
    presenceTag: 'Reddit',
  },
  spotify: {
    primary: '#1DB954',
    accent: '#1DB954',
    background: '#121212',
    surface: '#181818',
    text: '#FFFFFF',
    textMuted: '#B3B3B3',
    heroBg: '#1DB954',
    presenceTag: 'Spotify',
  },
  discord: {
    primary: '#5865F2',
    accent: '#5865F2',
    background: '#313338',
    surface: '#2B2D31',
    text: '#F2F3F5',
    textMuted: '#B5BAC1',
    heroBg: '#5865F2',
    cardBg: '#2B2D31',
    cardBorder: '#3F4147',
    presenceTag: 'Discord',
  },
  telegram: {
    primary: '#0088CC',
    accent: '#0088CC',
    background: '#E8F5FB',
    heroBg: '#0088CC',
    presenceTag: 'Telegram',
  },
  whatsapp: {
    primary: '#25D366',
    accent: '#25D366',
    background: '#E7F8EE',
    heroBg: '#25D366',
    presenceTag: 'WhatsApp',
  },
}

function buildBaseTheme(channelId: string, typeLabel?: string): PlatformPortalTheme {
  const channel = getChannelById(channelId)
  const primary = channel?.color ?? getChannelColor(channelId)
  const name = channel?.label ?? channelId
  const icon = channel?.icon ?? 'Share2'
  const lightBg = tint(primary, 0.92)
  const surface = '#FFFFFF'
  const darkPrimary = shade(primary, 0.15)

  return {
    channelId,
    platformName: name,
    iconName: icon,
    primary,
    primaryForeground: '#FFFFFF',
    accent: primary,
    accentForeground: '#FFFFFF',
    background: lightBg,
    surface,
    surfaceMuted: tint(primary, 0.88),
    text: '#0F172A',
    textMuted: '#475569',
    contextColor: primary,
    heroBg: darkPrimary,
    heroText: '#FFFFFF',
    cardBg: surface,
    cardBorder: tint(primary, 0.75),
    quoteBorder: primary,
    quoteBg: tint(primary, 0.9),
    verifiedColor: primary,
    statusDot: '#10B981',
    linkColor: primary,
    recommendedBg: primary,
    recommendedText: '#FFFFFF',
    freeBadgeBg: '#ECFDF5',
    freeBadgeText: '#047857',
    priceBadgeBg: tint(primary, 0.9),
    priceBadgeText: darkPrimary,
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    radius: '0.75rem',
    radiusLg: '1rem',
    presenceTag: name,
    schedulingTitle: 'Select consultation type & lock date',
    schedulingBody:
      'Reservations sync in real-time. Choose your session block below.',
    heroCardTitle: 'Consultation & strategy bookings',
    heroCardBody: `Direct coordination for referrals from ${name}${typeLabel ? ` · ${typeLabel}` : ''}.`,
    scheduleTierCta: getScheduleTierCtaFromCopy(channelId),
  }
}

export function getScheduleTierCta(channelId: string): string {
  return getScheduleTierCtaFromCopy(channelId)
}

export function getPortalLightPaletteTier(channelId: string): 'full' | 'extended' | 'baseline' {
  if (PLATFORM_THEME_OVERRIDES[channelId]) return 'full'
  if (PLATFORM_THEME_SCOPE_EXTENDED[channelId]) return 'extended'
  return 'baseline'
}

export function getPlatformPortalTheme(
  channelId: string,
  typeLabel?: string
): PlatformPortalTheme {
  const base = buildBaseTheme(channelId, typeLabel)
  const scopedBaseline = getScopeThemeBaseline(channelId)
  const scopeExtended = PLATFORM_THEME_SCOPE_EXTENDED[channelId]
  const override = PLATFORM_THEME_OVERRIDES[channelId]
  let theme = { ...base, ...scopedBaseline, ...scopeExtended, ...override }
  const copy = getChannelPortalCopy(channelId)
  if (copy) {
    theme = {
      ...theme,
      scheduleTierCta: copy.scheduleTierCta,
      schedulingTitle: copy.schedulingTitle ?? theme.schedulingTitle,
      schedulingBody: copy.schedulingBody ?? theme.schedulingBody,
      heroCardTitle: copy.heroCardTitle ?? theme.heroCardTitle,
      heroCardBody: copy.heroCardBody ?? theme.heroCardBody,
    }
  }
  const pack = getPlatformOfferPack(channelId)
  if (pack?.layoutVariant === 'bold' && !scopeExtended && !override?.radius) {
    theme = { ...theme, radius: '1rem', radiusLg: '1.25rem' }
  }
  theme = applyPlatformDesignLanguage(channelId, theme)
  return theme
}

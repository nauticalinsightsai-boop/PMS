/**
 * Certification mentor voice for portal surface copy (all 41 scope slugs).
 * Merged into getChannelPortalCopy so context subheadlines and metadata headlines
 * use platform-native certification language instead of legacy advisory phrasing.
 */
import { ALL_CHANNELS } from '../constants/channelGroups'
import { getLearnerPortalSurfaceCopy } from './portalLearnerCopy'

const EVIDENCE_REF: Record<string, string> = {
  webinar: 'the webinar title or replay link',
  website: 'the page or asset on the site',
  medium: 'the Medium article you read',
  substack: 'the Substack post or newsletter issue',
  beehiiv: 'the Beehiiv email or post',
  ghost: 'the Ghost post or newsletter',
  hashnode: 'the Hashnode article or series',
  'notion-public': 'the Notion page or database view',
  linkedin: 'your LinkedIn article or connection context',
  twitter: 'the post or thread URL',
  instagram: 'the reel, story, or feed post',
  facebook: 'the Facebook post or group thread',
  reddit: 'the subreddit thread or comment',
  threads: 'the Threads post',
  quora: 'the Quora question or answer',
  bluesky: 'the Bluesky post or thread',
  mastodon: 'your instance and the referring post',
  pinterest: 'the pin or board',
  vk: 'the VK post or community thread',
  youtube: 'the video or series title',
  tiktok: 'the TikTok link or hook',
  snapchat: 'the Snap or story',
  vimeo: 'the Vimeo showcase or title',
  spotify: 'the episode on Spotify',
  'apple-podcasts': 'the Apple Podcasts episode',
  'amazon-audible': 'the Audible title',
  podbean: 'the Podbean episode',
  soundcloud: 'the SoundCloud track or playlist',
  email: 'the email subject or campaign',
  whatsapp: 'the WhatsApp broadcast you saw',
  telegram: 'the Telegram channel post',
  discord: 'the server channel or thread',
  slack: 'the Slack workspace or channel',
  'google-search': 'the search query or result page',
  'youtube-search': 'the YouTube search result you clicked',
  'podcast-directories': 'the directory listing',
  'bing-search': 'the Bing query or snippet',
  'ai-visibility': 'the AI surface or prompt (if known)',
  'rss-feeds': 'the feed item or enclosure',
  'content-aggregators': 'the aggregator or bundle name',
  'api-ai-fed': 'the API consumer or integration',
}

/** Short platform hooks for page metadata (title tag). */
const CERTIFICATION_HEADLINE: Record<string, string> = {
  website: 'PM Structure · certification and career guidance',
  webinar: 'PM Structure · webinar to mentor call',
  medium: 'Medium · certification pathway session',
  substack: 'Substack · certification pathway session',
  beehiiv: 'Beehiiv · certification pathway session',
  ghost: 'Ghost · certification pathway session',
  hashnode: 'Hashnode · certification pathway session',
  'notion-public': 'Notion · certification pathway session',
  linkedin: 'LinkedIn · certification mentor session',
  twitter: 'X · certification pathway session',
  instagram: 'Instagram · certification pathway session',
  facebook: 'Facebook · certification pathway session',
  reddit: 'Reddit · certification pathway session',
  threads: 'Threads · certification pathway session',
  quora: 'Quora · certification pathway session',
  bluesky: 'Bluesky · certification pathway session',
  mastodon: 'Mastodon · certification pathway session',
  pinterest: 'Pinterest · certification pathway session',
  vk: 'VK · certification pathway session',
  youtube: 'YouTube · certification pathway session',
  tiktok: 'TikTok · certification pathway session',
  snapchat: 'Snapchat · certification pathway session',
  vimeo: 'Vimeo · certification pathway session',
  spotify: 'Spotify · certification pathway session',
  'apple-podcasts': 'Apple Podcasts · certification pathway session',
  'amazon-audible': 'Audible · certification pathway session',
  podbean: 'Podbean · certification pathway session',
  soundcloud: 'SoundCloud · certification pathway session',
  email: 'Email · certification pathway session',
  whatsapp: 'WhatsApp · certification pathway session',
  telegram: 'Telegram · certification pathway session',
  discord: 'Discord · certification pathway session',
  slack: 'Slack · certification pathway session',
  'google-search': 'Google Search · certification pathway session',
  'youtube-search': 'YouTube Search · certification pathway session',
  'podcast-directories': 'Podcast directories · certification pathway session',
  'bing-search': 'Bing Search · certification pathway session',
  'ai-visibility': 'AI visibility · certification pathway session',
  'rss-feeds': 'RSS feeds · certification pathway session',
  'content-aggregators': 'Content aggregators · certification pathway session',
  'api-ai-fed': 'API / AI-fed · certification pathway session',
}

const ADVISORY_PATTERN =
  /\b(principal advisory|principal time|advisory block|advisory call|advisory session|nautical|defense or audit|working session|structured defense)\b/gi

function channelLabel(channelId: string): string {
  const ch = ALL_CHANNELS.find((c) => c.id === channelId)
  if (ch?.label) return ch.label
  if (channelId === 'twitter') return 'X'
  if (channelId === 'notion-public') return 'Notion'
  return channelId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function evidenceFor(channelId: string, label: string): string {
  return EVIDENCE_REF[channelId] ?? `what brought you from ${label}`
}

export type CertificationPortalSurface = {
  headline: string
  subheadline: string
  targetMessage: string
}

export function getCertificationPortalSurface(channelId: string): CertificationPortalSurface {
  const label = channelLabel(channelId)
  const evidence = evidenceFor(channelId, label)
  const surface = getLearnerPortalSurfaceCopy(channelId, label, evidence)
  return {
    headline: CERTIFICATION_HEADLINE[channelId] ?? `${label} · certification pathway session`,
    subheadline: surface.subheadline,
    targetMessage: surface.targetMessage,
  }
}

/** Strip legacy advisory phrasing from tier lines and hero card bodies. */
export function sanitizeCertificationCopyString(text: string): string {
  return text.replace(ADVISORY_PATTERN, 'mentor session').replace(/\s{2,}/g, ' ').trim()
}

export function certificationCopyKeys(): string[] {
  return Object.keys(CERTIFICATION_HEADLINE)
}

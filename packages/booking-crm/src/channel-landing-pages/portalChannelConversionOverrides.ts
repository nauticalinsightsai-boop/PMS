import { IMPLEMENTATION_SCOPE_41 } from './platformBrandSources'
import { TIER_SCHEDULING_LINES } from './channelPortalCopy'

export type ChannelValueCard = { title: string; body: string }
export type ChannelCredibilityTabLabels = { quotes: string; metrics: string }

export type ChannelConversionOverride = {
  valueCards: ChannelValueCard[]
  credibilityTabLabels: ChannelCredibilityTabLabels
}

const NATIVE_LABELS: Record<string, ChannelCredibilityTabLabels> = {
  website: { quotes: 'Site learners', metrics: 'Certification outcomes' },
  webinar: { quotes: 'Webinar attendees', metrics: 'Session outcomes' },
  medium: { quotes: 'Reader stories', metrics: 'Publication fit' },
  substack: { quotes: 'Subscriber voices', metrics: 'Newsletter outcomes' },
  beehiiv: { quotes: 'Inbox readers', metrics: 'Send & prep fit' },
  ghost: { quotes: 'Subscriber stories', metrics: 'Publication depth' },
  hashnode: { quotes: 'Developer readers', metrics: 'Article-to-exam path' },
  'notion-public': { quotes: 'Doc visitors', metrics: 'Workspace referrals' },
  linkedin: { quotes: 'Professional voices', metrics: 'Network outcomes' },
  twitter: { quotes: 'Timeline learners', metrics: 'Thread-to-call fit' },
  instagram: { quotes: 'From the feed', metrics: 'Reels & prep outcomes' },
  facebook: { quotes: 'Community voices', metrics: 'Group & feed fit' },
  reddit: { quotes: 'Thread referrals', metrics: 'Subreddit outcomes' },
  threads: { quotes: 'Threads readers', metrics: 'Feed-to-calendar' },
  quora: { quotes: 'Answer readers', metrics: 'Q&A depth' },
  bluesky: { quotes: 'Sky readers', metrics: 'Open-network fit' },
  mastodon: { quotes: 'Fediverse voices', metrics: 'Instance referrals' },
  pinterest: { quotes: 'Pin researchers', metrics: 'Visual-to-plan' },
  vk: { quotes: 'Community readers', metrics: 'VK referral fit' },
  youtube: { quotes: 'Viewer stories', metrics: 'Channel outcomes' },
  tiktok: { quotes: 'Clip viewers', metrics: 'Short-form to depth' },
  snapchat: { quotes: 'Snap referrals', metrics: 'Story-to-slot' },
  vimeo: { quotes: 'Showcase viewers', metrics: 'Pro video fit' },
  spotify: { quotes: 'Listener voices', metrics: 'Episode outcomes' },
  'apple-podcasts': { quotes: 'Listener stories', metrics: 'Show fit' },
  'amazon-audible': { quotes: 'Audible listeners', metrics: 'Title referrals' },
  podbean: { quotes: 'Feed listeners', metrics: 'Episode depth' },
  soundcloud: { quotes: 'Stream listeners', metrics: 'Track-to-plan' },
  email: { quotes: 'Inbox readers', metrics: 'Campaign fit' },
  whatsapp: { quotes: 'Channel readers', metrics: 'Broadcast outcomes' },
  telegram: { quotes: 'Channel voices', metrics: 'Post-to-call' },
  discord: { quotes: 'Server members', metrics: 'Thread referrals' },
  slack: { quotes: 'Workspace voices', metrics: 'Channel fit' },
  'google-search': { quotes: 'Search visitors', metrics: 'Query intent' },
  'youtube-search': { quotes: 'SERP clickers', metrics: 'Search-to-session' },
  'podcast-directories': { quotes: 'Directory listeners', metrics: 'Listing fit' },
  'bing-search': { quotes: 'Bing visitors', metrics: 'Snippet match' },
  'ai-visibility': { quotes: 'AI referrals', metrics: 'Human verification' },
  'rss-feeds': { quotes: 'Feed readers', metrics: 'Syndication fit' },
  'content-aggregators': { quotes: 'Bundle readers', metrics: 'Source fit' },
  'api-ai-fed': { quotes: 'API referrals', metrics: 'Machine-to-human' },
}

function evidencePhrase(channelId: string, label: string): string {
  return TIER_SCHEDULING_LINES[channelId]?.split('.')[0] ?? `what you saw on ${label}`
}

function buildValueCards(channelId: string, label: string): ChannelValueCard[] {
  const hint = evidencePhrase(channelId, label)
  const templates: Record<string, ChannelValueCard[]> = {
    instagram: [
      {
        title: 'Reels to exam plan',
        body: `Turn a Reel, Story, or feed post into a credential path. ${hint}.`,
      },
      {
        title: 'DM-ready mentor intro',
        body: 'Free mentor conversation for orientation, or a paid block to lock PMP®, CAPM®, or PRINCE2® prep.',
      },
      {
        title: 'Membership before you enroll',
        body: 'See regional tuition and membership discounts before you commit — no pressure on the call.',
      },
    ],
    medium: [
      {
        title: 'Article to study plan',
        body: `Connect the Medium piece you read to structured exam prep. ${hint}.`,
      },
      {
        title: 'Editorial-depth mentor time',
        body: 'Charter-clear guidance on pathways, mocks, and weekly rhythm — not generic coaching scripts.',
      },
      {
        title: 'Tuition for your region',
        body: 'Understand scholarships and membership pricing before you pay for a cohort.',
      },
    ],
    linkedin: [
      {
        title: 'Professional pathway fit',
        body: `Align ${hint} with sponsor-ready certification choices (PMP®, CAPM®, PRINCE2®, Six Sigma).`,
      },
      {
        title: 'Executive mentor block',
        body: 'Structured prep cadence, mock exams, and mentor touchpoints sized to your exam window.',
      },
      {
        title: 'Membership when it helps',
        body: 'Active membership can reduce regional tuition — we explain on the call.',
      },
    ],
    slack: [
      {
        title: 'Workspace to calendar',
        body: `Move from a Slack channel mention to booked mentor time. ${hint}.`,
      },
      {
        title: 'Team-ready prep clarity',
        body: 'Free intro for pathway fit; paid session for study plan and exam window.',
      },
      {
        title: 'Site-backed cohorts',
        body: 'Explore pathways and tuition on PM Structure before or after your call.',
      },
    ],
  }

  if (templates[channelId]) return templates[channelId]!

  const platform = label || channelId
  return [
    {
      title: `${platform} to certification plan`,
      body: `Connect what brought you from ${platform} to the right pathway. ${hint}.`,
    },
    {
      title: 'Mentor intro or depth',
      body: 'Free orientation on credentials and prep, or a longer session to lock your exam track.',
    },
    {
      title: 'Regional tuition clarity',
      body: 'Membership and scholarships depend on your residence — we explain on the call.',
    },
  ]
}

function buildOverrides(): Record<string, ChannelConversionOverride> {
  const out: Record<string, ChannelConversionOverride> = {}
  for (const channelId of IMPLEMENTATION_SCOPE_41) {
    const label =
      channelId === 'twitter'
        ? 'X'
        : channelId === 'notion-public'
          ? 'Notion'
          : channelId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    out[channelId] = {
      credibilityTabLabels:
        NATIVE_LABELS[channelId] ?? { quotes: 'Learner voices', metrics: 'Platform track record' },
      valueCards: buildValueCards(channelId, label),
    }
  }
  return out
}

export const CHANNEL_CONVERSION_OVERRIDES: Record<string, ChannelConversionOverride> =
  buildOverrides()

export function getChannelConversionOverride(channelId: string): ChannelConversionOverride | null {
  return CHANNEL_CONVERSION_OVERRIDES[channelId] ?? null
}

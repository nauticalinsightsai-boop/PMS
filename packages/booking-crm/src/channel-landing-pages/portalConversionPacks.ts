import { ALL_CHANNELS } from '../constants/channelGroups'
import { VERIFIED_PROOF_METRICS } from '../constants/data/verifiedProofMetrics'
import { getChannelPortalCopy } from './channelPortalCopy'
import { isFreeDiscoveryChannel } from './freeDiscovery'
import type { PortalConversionContent } from '../types/channelLandingPage'
import {
  buildLearnerCredibilityCopy,
  buildLearnerFaq,
  buildLearnerQualificationFor,
  buildLearnerQualificationNotFor,
  buildLearnerSocialProof,
  buildLearnerValueCards,
  getCredibilityTabLabels,
  learnerAudienceTone,
  normalizeSocialProofItem,
} from './portalLearnerCopy'
import { BRAND_FULL_NAME } from './portalBrandConstants'

export { getCredibilityTabLabels } from './portalLearnerCopy'

const WAVE_BY_CATEGORY: Record<string, 1 | 2 | 3> = {
  'Core / Owned Platform': 1,
  'Writing / Publishing': 1,
  'Social Distribution': 1,
  'Video Platform': 2,
  'Audio / Podcast': 2,
  'Community / Direct': 3,
  'Discovery / Search': 3,
  'Syndication / Automation': 3,
}

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
  'google-podcasts': 'the Google Podcasts episode',
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

function buildPack(channelId: string): PortalConversionContent {
  const channel = ALL_CHANNELS.find((c) => c.id === channelId)
  const copy = getChannelPortalCopy(channelId)
  const label = channel?.label ?? channelId
  const evidence = EVIDENCE_REF[channelId] ?? `what brought you from ${label}`
  const cta = copy?.scheduleTierCta ?? 'Reserve your slot'
  const free = isFreeDiscoveryChannel(channelId)
  const tone = learnerAudienceTone(channelId, label)
  const wave = WAVE_BY_CATEGORY[channel?.platformCategory ?? ''] ?? 3
  const cred = buildLearnerCredibilityCopy(label, tone)

  const trustLine = free
    ? `Mentor booking · cite ${evidence} · limited weekly slots`
    : `Secure booking · cite ${evidence} · calendar invite included`

  const pack: PortalConversionContent = {
    conversionWave: wave,
    trustLine,
    valueCards: buildLearnerValueCards(channelId, label, evidence, tone),
    qualificationFor: buildLearnerQualificationFor(label, evidence, tone),
    qualificationNotFor: buildLearnerQualificationNotFor(),
    socialProof: buildLearnerSocialProof(channelId, label).map(normalizeSocialProofItem),
    proofMetrics: [...VERIFIED_PROOF_METRICS],
    credibilityHeading: cred.heading,
    credibilityBody: cred.body,
    faq: buildLearnerFaq(label, evidence, cta, tone),
    riskReversal:
      'You leave with a clearer certification goal, prep option, and next step. Not open-ended consulting.',
    paymentMicrocopy: [
      'Secure calendar booking',
      'Instant confirmation',
      'Reschedule on your invite',
      'Regional tuition shown for your profile',
      `Mentor-led by ${BRAND_FULL_NAME}`,
    ],
    finalCtaHeading: free ? 'Not sure which pathway fits?' : 'Ready to talk to a mentor?',
    finalCtaBody: free
      ? `Start with the free mentor intro. Cite ${evidence} in your note. Book a longer session when you want a full study plan review.`
      : `Book mentor time with ${evidence} in your note, or choose a longer session above for pathway depth.`,
    finalCtaLabel: cta,
  }

  if (channelId === 'webinar') {
    return {
      ...pack,
      valueCards: [
        {
          title: 'What the webinar covers',
          body: 'Certification pathways, who each track is for, and how mentor support fits your exam timeline.',
        },
        {
          title: 'Watch before you book',
          body: 'Use the briefing video so your free or paid mentor seat starts with shared context.',
        },
        {
          title: 'Free intro or paid depth',
          body: 'Orientation call or a longer mentor block. Both focus on credentials and prep, not project consulting.',
        },
      ],
      qualificationFor: [
        'You watched or registered for the webinar and want certification or career guidance next.',
        'You can name the webinar title or replay when you book.',
        'You want a mentor conversation: free orientation or paid depth.',
        'You will share your target credential (if known) and region.',
      ],
      qualificationNotFor: [
        ...buildLearnerQualificationNotFor().slice(0, 2),
        'You will not cite which webinar you attended.',
      ],
      credibilityBody: `Learners book after the briefing for pathway choice, prep quality, and membership pricing. Mentor-led by ${BRAND_FULL_NAME}.`,
      finalCtaBody: `After the video, book a free mentor intro. Cite ${evidence}. Choose paid depth when you want a full study plan review.`,
    }
  }

  if (channelId === 'website') {
    return {
      ...pack,
      qualificationFor: [
        'You are exploring PM Structure pathways from the main site and want mentor guidance.',
        'You can name the page, newsletter, or asset that brought you here.',
        'You want certification fit, prep options, or services overview. Not delivery consulting.',
        'You will share region and timeline so pricing is accurate.',
      ],
      credibilityBody:
        'Site visitors book mentor time for certification readiness, career direction, and program quality. Aligned to the page you cite.',
    }
  }

  return pack
}

export const PORTAL_CONVERSION_PACKS: Record<string, PortalConversionContent> = Object.fromEntries(
  ALL_CHANNELS.map((c) => [c.id, buildPack(c.id)])
)

export function getPortalConversionPack(channelId: string): PortalConversionContent | null {
  return PORTAL_CONVERSION_PACKS[channelId] ?? null
}

export function mergePortalConversion(
  channelId: string,
  overrides?: Partial<PortalConversionContent>
): PortalConversionContent {
  const base = getPortalConversionPack(channelId) ?? buildPack(channelId)
  if (!overrides) return base
  return {
    ...base,
    ...overrides,
    valueCards: overrides.valueCards ?? base.valueCards,
    qualificationFor: overrides.qualificationFor ?? base.qualificationFor,
    qualificationNotFor: overrides.qualificationNotFor ?? base.qualificationNotFor,
    socialProof: overrides.socialProof ?? base.socialProof,
    proofMetrics: overrides.proofMetrics ?? base.proofMetrics,
    faq: overrides.faq ?? base.faq,
    paymentMicrocopy: overrides.paymentMicrocopy ?? base.paymentMicrocopy,
  }
}

/** Enabled conversion wave for rollout (set to 3 when all packs ship). */
export const PORTAL_CONVERSION_ENABLED_WAVE: 1 | 2 | 3 = 3

export function isConversionEnabledForChannel(channelId: string): boolean {
  const pack = getPortalConversionPack(channelId)
  if (!pack?.conversionWave) return false
  return pack.conversionWave <= PORTAL_CONVERSION_ENABLED_WAVE
}

import type { PortalConversionContent, PortalSocialProofItem } from '../types/channelLandingPage'
import { BRAND_FULL_NAME } from './portalBrandConstants'
import { getPortalLearnerStories } from './portalLearnerStories'

export type LearnerAudienceTone = 'executive' | 'creator' | 'reader' | 'community' | 'search'

export function learnerAudienceTone(channelId: string, label: string): LearnerAudienceTone {
  if (['linkedin', 'website', 'notion-public'].includes(channelId)) return 'executive'
  if (['instagram', 'tiktok', 'snapchat', 'youtube', 'vimeo', 'webinar'].includes(channelId)) return 'creator'
  if (['medium', 'substack', 'beehiiv', 'ghost', 'hashnode'].includes(channelId)) return 'reader'
  if (
    ['google-search', 'bing-search', 'youtube-search', 'ai-visibility', 'podcast-directories'].includes(
      channelId
    )
  ) {
    return 'search'
  }
  if (label.toLowerCase().includes('podcast') || label.toLowerCase().includes('spotify')) return 'reader'
  return 'community'
}

/** Quotes tab first in UI — learner voices before platform stats. */
export function getCredibilityTabLabels(
  _channelId: string,
  _label = ''
): { metrics: string; quotes: string } {
  return { quotes: 'Learner voices', metrics: 'Platform track record' }
}

/** Platform-native success stories — two per channel from {@link getPortalLearnerStories}. */
export function buildLearnerSocialProof(channelId: string, _channelLabel: string): PortalSocialProofItem[] {
  return getPortalLearnerStories(channelId)
}

export function normalizeSocialProofItem(item: PortalSocialProofItem): PortalSocialProofItem {
  if (item.name && item.title && item.avatarUrl) return item
  if (item.role && !item.name) {
    const parts = item.role.split('·').map((s) => s.trim())
    if (parts.length >= 2) {
      return {
        quote: item.quote,
        name: parts[0]!,
        title: parts.slice(1).join(' · '),
        avatarUrl: item.avatarUrl ?? '',
      }
    }
    return { quote: item.quote, name: item.role, title: '', avatarUrl: item.avatarUrl ?? '' }
  }
  return item
}

export function buildLearnerValueCards(
  channelId: string,
  channelLabel: string,
  evidence: string,
  tone: LearnerAudienceTone
): NonNullable<PortalConversionContent['valueCards']> {
  const label = channelLabel || channelId
  const siteLine =
    channelId === 'website' || channelId === 'webinar'
      ? 'Explore pathways, cohort dates, and tuition on PM Structure before or after your call.'
      : `Explore pathways and tuition on PM Structure before or after your call.`
  const base = {
    executive: [
      {
        title: 'Certification fit first',
        body: `We align ${evidence} with the right PMI, PRINCE2, or Six Sigma pathway for your experience, not a generic advisory script.`,
      },
      {
        title: 'Prep you can schedule',
        body: 'Study plan, mock exams, and mentor touchpoints sized to your exam window and regional tuition rules.',
      },
      {
        title: 'Membership when it helps',
        body: 'See how active membership affects tuition before you commit. No pressure on the call.',
      },
    ],
    creator: [
      {
        title: 'From content to pathway',
        body: `Turn what you saw on ${label} into a certification goal. Cite ${evidence} when you book.`,
      },
      {
        title: 'Mentor intro or depth',
        body: 'Free mentor conversation for orientation, or a longer session to lock your exam track and prep cadence.',
      },
      {
        title: 'Program quality check',
        body: 'Ask about cohort rhythm, materials, and how learners in your region price tuition and membership.',
      },
    ],
    reader: [
      {
        title: 'Reading to exam plan',
        body: `Connect ${label} content to a credential. Mention ${evidence} when you schedule.`,
      },
      {
        title: 'Tuition clarity',
        body: 'Understand regional pricing, scholarships, and membership before you enroll.',
      },
      {
        title: 'Mentor before you pay',
        body: 'Free intro for fit; paid session for a full study plan review.',
      },
    ],
    search: [
      {
        title: 'Compare pathways',
        body: 'See which certification matches your role and how prep is structured with PM Structure.',
      },
      {
        title: 'Regional pricing',
        body: 'Tuition and scholarships depend on your residence. We explain on the call.',
      },
      {
        title: 'Book with context',
        body: `Share ${evidence} so the mentor session starts aligned to what you searched.`,
      },
    ],
    community: [
      {
        title: 'Certification referral welcome',
        body: `Mention ${evidence} and your target credential when you book mentor time.`,
      },
      {
        title: 'Free intro first',
        body: 'Orientation on pathways and prep, then a paid session if you want depth.',
      },
      {
        title: 'Site-backed prep',
        body: siteLine,
      },
    ],
  }
  return (base[tone] ?? base.community).slice(0, 3)
}

export function buildLearnerQualificationFor(
  channelLabel: string,
  evidence: string,
  tone: LearnerAudienceTone
): string[] {
  const label = channelLabel || 'this channel'
  const base: Record<LearnerAudienceTone, string[]> = {
    executive: [
      `You want mentor-led certification or career guidance after ${label}.`,
      `You can reference ${evidence} when you book.`,
      'You are ready to discuss target credentials (PMP, CAPM, RMP, PRINCE2, Six Sigma, etc.).',
    ],
    creator: [
      `You engaged with content on ${label} and want a credential plan.`,
      `You will cite ${evidence} in your booking note.`,
      'You want to explore pathways and prep with PM Structure before or after the call.',
    ],
    reader: [
      `You read or subscribed via ${label} and want structured exam prep.`,
      `You can mention ${evidence} when scheduling.`,
      'You want tuition and membership explained for your region.',
    ],
    search: [
      `You found ${BRAND_FULL_NAME} via search and want pathway fit.`,
      `You can share ${evidence} and your region.`,
      'You want to book a free mentor intro before paying for prep.',
    ],
    community: [
      `You were referred from ${label} with a certification goal.`,
      `You will include ${evidence} in your note.`,
      'You want mentor time, not project delivery or compliance consulting.',
    ],
  }
  return base[tone] ?? base.community
}

export function buildLearnerQualificationNotFor(): string[] {
  return [
    'You need project delivery, design reviews, or compliance audits instead of certification prep.',
    'You will not share which channel or content brought you here.',
    'You want a guaranteed exam pass without doing the work.',
  ]
}

export function buildLearnerFaq(
  channelLabel: string,
  evidence: string,
  cta: string,
  tone: LearnerAudienceTone
): NonNullable<PortalConversionContent['faq']> {
  const label = channelLabel || 'this channel'
  return [
    {
      question: 'Is the first mentor session free?',
      answer:
        'Yes. Book a free mentor intro on this page. Choose a paid pathway session when you want a full study plan or services discussion.',
    },
    {
      question: 'Do learners actually pass exams?',
      answer:
        'Learners use structured prep, mock exams, and mentor support. Outcomes depend on your effort and exam body rules. We focus on readiness, not guaranteed passes.',
    },
    {
      question: 'Can I explore pathways before I book?',
      answer:
        'Yes. Use the certification cards below to view pathways, cohort timing, and regional tuition on PM Structure.',
    },
    {
      question: 'Is this a sales call?',
      answer: `No. Mentor time is for certification fit, prep options, and next steps, aligned to how you found us on ${label}.`,
    },
    {
      question: 'What should I prepare?',
      answer: `Target credential (if known), timeline, region, and ${evidence}. ${cta} when you are ready.`,
    },
  ]
}

/** Portal hero/context lines — PM Structure brand; audience-appropriate referral. */
export function getLearnerPortalSurfaceCopy(
  channelId: string,
  channelLabel: string,
  evidence: string
): { headline: string; subheadline: string; targetMessage: string; availabilityLabel: string } {
  const label = channelLabel || channelId
  const tone = learnerAudienceTone(channelId, label)

  const headline = `${BRAND_FULL_NAME}, learn and certify via ${label}`
  const availabilityLabel = 'Mentor sessions open'

  const subheadlineByTone: Record<LearnerAudienceTone, string> = {
    executive:
      'Mentor-led certification preparation and career guidance: pathway choice, regional pricing, and program quality.',
    creator: `You found us on ${label}. Book a free mentor intro or a paid pathway session to choose your certification track.`,
    reader: `Turn what you read on ${label} into a credential plan with structured prep, mock exams, and mentor support.`,
    search:
      'You searched and landed here. Compare pathways, understand tuition for your region, and talk to a mentor before you enroll.',
    community:
      `Direct-channel referrals welcome: certification fit, membership pricing, and mentor calls via ${label}.`,
  }

  const targetByTone: Record<LearnerAudienceTone, string> = {
    executive:
      `Name ${evidence} and your target credential. We focus on career guidance and exam readiness, not project delivery consulting.`,
    creator:
      `Cite ${evidence} when you book. Ask about PMP, CAPM, RMP, PRINCE2, or Six Sigma tracks and what you saw on ${label}.`,
    reader:
      `Mention ${evidence} in your note. Get help picking a pathway, prep length, and membership benefit before you pay tuition.`,
    search:
      `Share ${evidence} and your region. We answer prep quality, pricing, and which certification fits your role.`,
    community:
      `Include ${evidence} and your certification goal. Mentor time covers pathways and prep, not compliance or design reviews.`,
  }

  return {
    headline,
    subheadline: subheadlineByTone[tone],
    targetMessage: targetByTone[tone],
    availabilityLabel,
  }
}

export function buildLearnerCredibilityCopy(
  channelLabel: string,
  tone: LearnerAudienceTone
): { heading: string; body: string } {
  const label = channelLabel || BRAND_FULL_NAME
  return {
    heading: 'Why learners book from here',
    body:
      tone === 'executive'
        ? `${label} referrals meet ${BRAND_FULL_NAME} mentor-led certification prep: pathway choice, regional pricing, and program quality without project-scope consulting.`
        : tone === 'creator'
          ? `People who discover ${BRAND_FULL_NAME} on ${label} get certification guidance and mentorship with structured prep, honest pricing, and calls that cite the content you watched or read.`
          : `Readers and subscribers from ${label} use these sessions to pick a credential, understand tuition, and book mentor time before enrolling.`,
  }
}

import {
  MARKETING_PMP_AVATARS,
} from '@/lib/marketing-stock-images';

/** Anchor for roadmap lead-form CTAs (hero / cert page). */
export const PMP_ROADMAP_FORM_ANCHOR = 'pmp-roadmap-form';

export const PMP_PROGRAM_CTA_LABEL = 'Get My PMP 2026 Roadmap';

export const PMP_UNTIL_YOU_PASS_HEADLINE = 'Support through your planned exam-preparation window';
export const PMP_UNTIL_YOU_PASS_SUBLINE =
  'Structured coaching, accountability, and readiness tracking: support to prepare with structure, practice, and review through your planned preparation cycle, not just until checkout.';

export const PMP_PROGRAM_HIGHLIGHTS = [
  {
    id: 'live-training',
    title: 'Mentor-Supported Live Training',
    description:
      'Participate in engaging, live training sessions across 6 days, complete with session recordings for your reference.',
  },
  {
    id: 'coaching',
    title: 'Daily Follow-Ups & Coaching Calls',
    description:
      'Stay on track with personalized coaching calls and consistent daily check-ins.',
  },
  {
    id: 'training-hours',
    title: 'Training-Hour Guidance',
    description:
      'Understand the PMP training-hour requirement, what evidence may be needed, and how to keep your preparation records organized before applying through PMI.',
  },
  {
    id: 'roadmap',
    title: 'Customized Roadmap to PMP',
    description:
      'Receive a strategic, step-by-step plan designed specifically for your PMP preparation needs.',
  },
  {
    id: 'mastermind',
    title: '90-Day Mastermind Group',
    description:
      'Join a supportive community of learners who collaborate, share insights, and motivate each other.',
  },
  {
    id: 'last-day',
    title: 'Comprehensive Last-Day Material',
    description:
      'Get exclusive access to final study resources that will solidify your understanding before exam day.',
  },
] as const;

export type PmpParticipantQuote = {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar?: string;
};

export const PMP_PARTICIPANT_QUOTES: readonly PmpParticipantQuote[] = [
  {
    id: 'pq-1',
    name: 'Amara Okafor',
    role: 'Programme Manager, FinTech',
    quote:
      'The daily check-ins kept me accountable when work got hectic. Live sessions plus recordings meant I never missed a beat.',
    avatar: MARKETING_PMP_AVATARS.amara,
  },
  {
    id: 'pq-2',
    name: 'David Okonkwo',
    role: 'Senior Project Lead, Construction',
    quote:
      'The customized roadmap matched my 60-hour work week. I knew exactly what to study each day before exam day.',
    avatar: MARKETING_PMP_AVATARS.david,
  },
  {
    id: 'pq-3',
    name: 'Priya Sharma',
    role: 'IT Delivery Manager',
    quote:
      'The mastermind group made the difference: peer questions surfaced gaps my solo study missed.',
    avatar: MARKETING_PMP_AVATARS.priya,
  },
  {
    id: 'pq-4',
    name: 'James Mitchell',
    role: 'PMO Analyst',
    quote:
      'Last-day material tightened weak domains. I walked into Pearson VUE calm because the plan was already proven.',
    avatar: MARKETING_PMP_AVATARS.james,
  },
] as const;

export type PmpSuccessJourney = {
  id: string;
  name: string;
  position: string;
  programme: string;
  comment: string;
  avatar?: string;
};

export const PMP_SUCCESS_JOURNEYS: readonly PmpSuccessJourney[] = [
  {
    id: 'sj-1',
    name: 'Sarah Jenkins',
    position: 'Senior PM, Global Tech Solutions',
    programme: 'PMP® Professional pathway',
    comment:
      'Structured study rhythm, weak-area tracking, and mentor review helped me understand where I stood before exam day.',
    avatar: MARKETING_PMP_AVATARS.sarah,
  },
  {
    id: 'sj-2',
    name: 'Hassan Al-Rashid',
    position: 'Delivery Director, GCC Infrastructure',
    programme: 'PMP® Mastery pathway',
    comment:
      'Live training across six days gave me scenario fluency. Coaching calls kept momentum through Ramadan and travel.',
    avatar: MARKETING_PMP_AVATARS.hassan,
  },
  {
    id: 'sj-3',
    name: 'Elena Rodriguez',
    position: 'Project Coordinator → PM',
    programme: 'PMP® Foundation → Professional',
    comment:
      'Foundation built vocabulary; Professional tier mocks mirrored real exam pacing. Structured support through my preparation window kept retake planning calm.',
    avatar: MARKETING_PMP_AVATARS.elena,
  },
  {
    id: 'sj-4',
    name: 'Michael Chen',
    position: 'Agile Coach, Innovate Corp',
    programme: 'PMP® Professional pathway',
    comment:
      'Training-hour guidance helped me organize my preparation record for PMI. The roadmap accounted for my agile background and domain gaps.',
    avatar: MARKETING_PMP_AVATARS.michael,
  },
  {
    id: 'sj-5',
    name: 'Fatima Noor',
    position: 'Transformation Lead, Banking',
    programme: 'PMP® Mastery pathway',
    comment:
      '90-day mastermind accountability plus last-day cram pack: a structured retake plan kept my preparation focused.',
    avatar: MARKETING_PMP_AVATARS.fatima,
  },
  {
    id: 'sj-6',
    name: 'Robert Adeyemi',
    position: 'Operations Manager, Logistics',
    programme: 'PMP® Professional pathway',
    comment:
      'WhatsApp coaching between live days answered situational questions fast. Recordings let me replay tough ECO scenarios.',
    avatar: MARKETING_PMP_AVATARS.robert,
  },
] as const;

export const PMP_PACKAGE_TIER_POSITIONING = {
  foundation: {
    title: 'Foundation',
    positioning:
      'For candidates who need structure before committing to a full preparation path.',
    cta: PMP_PROGRAM_CTA_LABEL,
  },
  professional: {
    title: 'Professional',
    positioning:
      'For candidates who want guided preparation structure, review checkpoints, and accountability.',
    cta: 'Talk to a Mentor',
  },
  mastery: {
    title: 'Mastery',
    positioning:
      'For serious candidates or professionals who need deeper readiness support before exam booking.',
    cta: 'Request Mastery Review',
  },
  fallback:
    'Package details are being finalized. Request a roadmap first so we can recommend the right level of support.',
} as const;

/** @deprecated Import from @/config/pms-site instead. */
export {
  PMS_WHATSAPP_DISPLAY as PMP_PROGRAM_WHATSAPP_DISPLAY,
  PMS_WHATSAPP_URL as PMP_PROGRAM_WHATSAPP_URL,
} from '@/config/pms-site';
import { enrollPath } from '@/lib/enrollment-routes';
import type { PmpServiceContent } from './types';
import { PMP_STANDARD_FAQS } from './shared';

const services: PmpServiceContent[] = [
  {
    slug: 'pmp-readiness-diagnostic',
    path: '/pmp-readiness-diagnostic',
    kind: 'diagnostic',
    title: 'PMP readiness diagnostic: pathway fit & timing',
    description:
      'Free structured PMP readiness diagnostic: target exam month, before/after July 2026, study hours, and recommended Foundation, Professional, or Mastery pathway.',
    h1: 'PMP readiness diagnostic',
    directAnswer:
      'The readiness diagnostic helps you choose a PMP pathway and exam timing by reviewing your experience, study capacity, and whether you plan to sit before or after the July 2026 transition.',
    sections: [
      {
        id: 'questions',
        heading: 'What the diagnostic covers',
        body:
          'Target exam month or quarter · Experience leading projects · Hours available per week · Whether you plan to test before 8 July 2026 or after 9 July 2026 · Comfort with scenario-style questions · Prior mock exam scores (if any) · Whether you need structured cohort support or self-paced LMS access',
      },
      {
        id: 'pathway-fit',
        heading: 'How recommendations work',
        body:
          'Results suggest Foundation for early orientation, Professional for structured readiness with scenario practice, or Mastery for intensive final preparation. Recommendations are guidance only: confirm eligibility and exam dates on PMI.org.',
      },
      {
        id: 'privacy',
        heading: 'Privacy',
        body:
          'Diagnostic responses are used to recommend a pathway. We do not publish individual answers. Contact details, if provided, are handled per our privacy policy.',
      },
    ],
    faqs: [
      {
        question: 'Is the PMP readiness diagnostic free?',
        answer:
          'Yes. The diagnostic is an orientation tool. Enrollment in paid pathways is separate and handled on noindex checkout routes.',
      },
      ...PMP_STANDARD_FAQS,
    ],
    ctaHref: '/contact',
    ctaLabel: 'Start diagnostic via contact',
  },
  {
    slug: 'pmp-scenario-practice',
    path: '/pmp-scenario-practice',
    kind: 'scenario',
    title: 'PMP scenario practice: situational exam preparation',
    description:
      'Scenario-based PMP practice aligned to ECO themes: people, process, business environment, agile/hybrid contexts, and professional responsibility.',
    h1: 'PMP scenario practice',
    directAnswer:
      'Scenario practice trains situational judgment: the skill most PMP candidates need for both current and post-July 2026 exam formats. PM Structure provides practice within Professional and Mastery pathways.',
    sections: [
      {
        id: 'categories',
        heading: 'Practice categories',
        body:
          'People and team leadership scenarios · Process and delivery decisions · Business environment and benefits · Agile, hybrid, and predictive contexts · Professional responsibility and ethics · AI, sustainability, and value-delivery themes (verify against current PMI ECO)',
      },
      {
        id: 'how-it-fits',
        heading: 'Where scenario practice lives',
        body:
          'Foundation introduces exam-style questions at a baseline level. Professional adds structured scenario sets and timed drills. Mastery adds high-volume remediation on weak domains.',
      },
    ],
    faqs: PMP_STANDARD_FAQS,
    ctaHref: '/pmp-professional',
    ctaLabel: 'Explore Professional pathway',
  },
  {
    slug: 'pmp-mock-exam',
    path: '/pmp-mock-exam',
    kind: 'mock',
    title: 'PMP mock exams: timed practice & review',
    description:
      'When to take PMP mock exams, how to review results, and how mock cadence fits Foundation, Professional, and Mastery preparation on PM Structure.',
    h1: 'PMP mock exams',
    directAnswer:
      'Mock exams simulate pacing and stamina for the PMP test. Use them after core content review, log errors by domain, and repeat on a schedule: not only once before test day.',
    sections: [
      {
        id: 'when',
        heading: 'When to take mock exams',
        body:
          'After completing at least one full pass of ECO topics · When you can dedicate uninterrupted time matching exam length · Before scheduling Pearson VUE, not only after booking',
      },
      {
        id: 'review',
        heading: 'How to review mock results',
        body:
          'Tag misses by domain (People, Process, Business Environment) · Note whether errors are knowledge gaps vs misreading · Revisit weak areas with scenario sets before the next mock · Track improvement across at least two timed attempts',
      },
    ],
    faqs: PMP_STANDARD_FAQS,
    ctaHref: '/pmp-mastery',
    ctaLabel: 'Explore Mastery pathway',
  },
  {
    slug: 'pmp-q-and-a-support',
    path: '/pmp-q-and-a-support',
    kind: 'support',
    title: 'PMP Q&A support: cohort questions & boundaries',
    description:
      'What Q&A and community support includes in PMP pathways, response boundaries, and how it differs from official PMI exam support.',
    h1: 'PMP Q&A support',
    directAnswer:
      'Q&A support helps clarify pathway content, study rhythm, and exam preparation strategy. It does not provide live exam items, guaranteed pass claims, or official PMI registration support.',
    sections: [
      {
        id: 'included',
        heading: 'What is included',
        body:
          'Clarification on LMS modules and study milestones · Guidance on mock review and weak-area plans · Cohort discussion channels where your tier includes them · Escalation to mentor review on Professional and Mastery tiers (per programme design)',
      },
      {
        id: 'boundaries',
        heading: 'What is not included',
        body:
          'Official PMI exam registration or scheduling · Disclosure of live or remembered exam questions · Guaranteed pass outcomes · Legal or immigration advice related to work authorization',
      },
    ],
    faqs: PMP_STANDARD_FAQS,
    ctaHref: '/pmp-enrollment',
    ctaLabel: 'View enrollment options',
  },
  {
    slug: 'pmp-enrollment',
    path: '/pmp-enrollment',
    kind: 'enrollment',
    title: 'PMP enrollment: pathway selection & checkout',
    description:
      'Indexable enrollment hub linking to PMP Foundation, Professional, and Mastery pathways and secure checkout. Payment pages are not indexed.',
    h1: 'PMP enrollment hub',
    directAnswer:
      'Choose a pathway tier, review regional pricing policy, then continue to enrollment checkout. Checkout and payment confirmation routes are excluded from search indexing.',
    sections: [
      {
        id: 'tiers',
        heading: 'Pathway tiers',
        body:
          'Foundation: core orientation and baseline practice · Professional: structured readiness with scenario practice · Mastery: intensive mocks and weak-area remediation',
      },
      {
        id: 'checkout',
        heading: 'Checkout & access',
        body:
          'Enrollment checkout is processed in USD equivalent with regional scholarship rules where eligible. After payment, LMS access is provisioned through the PM Structure learning environment.',
      },
    ],
    faqs: PMP_STANDARD_FAQS,
  },
];

export const PMP_SERVICE_PAGES = services;

export const PMP_SERVICE_PATHS = services.map((s) => s.path) as readonly string[];

export const PMP_ALL_PATHWAY_PATHS = [
  ...(['/pmp-foundation', '/pmp-professional', '/pmp-mastery'] as const),
  ...PMP_SERVICE_PATHS,
] as const;

export function getPmpService(slug: string): PmpServiceContent | undefined {
  return services.find((s) => s.slug === slug);
}

export const PMP_ENROLL_LINKS = [
  { tier: 'Foundation', path: '/pmp-foundation', enrollPath: enrollPath('pmp', 'foundation') },
  { tier: 'Professional', path: '/pmp-professional', enrollPath: enrollPath('pmp', 'professional') },
  { tier: 'Mastery', path: '/pmp-mastery', enrollPath: enrollPath('pmp', 'mastery') },
] as const;
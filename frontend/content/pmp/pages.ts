import type { PmpHubCard, PmpPageContent } from './types';
import { PMP_SOURCE_TODO } from './disclaimer';
import {
  T169_FAQS,
  T169_ELIGIBILITY_SECTION,
  T169_PMP_PAGE,
  T169_SEO,
} from '@/content/pmp/flagship-t169';
import { PMP_PATHWAY_PAGE } from '@/content/pmp/pathway-page';

const clusterLinks = (current: string): PmpPageContent['relatedLinks'] => [
  { href: '/pmp', label: 'PMP hub' },
  { href: '/pmp-2026-pathway', label: 'PMP 2026 readiness pathway' },
  { href: '/pmp-exam-2026', label: 'PMP exam 2026 guide' },
  { href: '/pmp-current-vs-new-exam', label: 'Current vs new exam' },
  { href: '/pmp-exam-timeline-2026', label: '2026 timeline' },
  { href: '/certifications/pmp', label: 'PMP certification pathway' },
  { href: '/pmp-faq', label: 'PMP FAQ' },
  { href: '/faq', label: 'All FAQs' },
  { href: '/answers', label: 'Direct answers' },
].filter((l) => l.href !== current);

export const PMP_HUB_CARDS: PmpHubCard[] = [
  {
    path: '/pmp-2026-pathway',
    title: 'PMP 2026 readiness pathway',
    description: '90-day focus, roadmap steps, tiers, engineer FAQs, and mock tracking.',
  },
  {
    path: '/pmp-exam-2026',
    title: 'PMP exam 2026',
    description: 'Main authority guide to the 2026 PMP exam transition.',
  },
  {
    path: '/pmp-current-vs-new-exam',
    title: 'Current vs new exam',
    description: 'Compare the pre-9 July and post-9 July 2026 exam experience.',
  },
  {
    path: '/pmp-before-8-july-2026',
    title: 'Before 8 July 2026',
    description: 'Guidance if you plan to sit the current exam format.',
  },
  {
    path: '/pmp-after-9-july-2026',
    title: 'After 9 July 2026',
    description: 'How to prepare for the updated exam from 9 July 2026.',
  },
  {
    path: '/pmp-exam-timeline-2026',
    title: 'Exam timeline 2026',
    description: 'Key dates and decision milestones for PMP candidates.',
  },
  {
    path: '/pmp-new-exam-domain-weighting',
    title: 'Domain weighting',
    description: 'What to verify about ECO domain weights (official sources).',
  },
  {
    path: '/pmp-business-environment-domain',
    title: 'Business Environment domain',
    description: 'Readiness focus for the Business Environment portion.',
  },
  {
    path: '/pmp-people-domain',
    title: 'People domain',
    description: 'Leadership, teams, and stakeholder themes in PMP prep.',
  },
  {
    path: '/pmp-process-domain',
    title: 'Process domain',
    description: 'Delivery, risk, scope, and execution-focused preparation.',
  },
  {
    path: '/pmp-ai-sustainability-value-delivery',
    title: 'AI, sustainability & value',
    description: 'Emerging themes in updated PMP preparation.',
  },
  {
    path: '/pmp-agile-hybrid-predictive',
    title: 'Agile, hybrid & predictive',
    description: 'Methodology mix in scenario-based PMP practice.',
  },
  {
    path: '/pmp-study-plan-2026',
    title: 'Study plan 2026',
    description: 'Structured weekly preparation outline for PMP readiness.',
  },
];

const pages: PmpPageContent[] = [
  {
    slug: 'pmp-exam-2026',
    path: '/pmp-exam-2026',
    title: T169_SEO.pmpTitle,
    description: T169_SEO.pmpDescription,
    h1: 'PMP Exam 2026: deep readiness guide',
    directAnswer: T169_PMP_PAGE.intro,
    sections: [
      {
        id: 'current-vs-updated',
        heading: T169_PMP_PAGE.currentVsUpdatedHeading,
        body: T169_PMP_PAGE.currentVsUpdatedTable,
      },
      {
        id: 'domain-changes',
        heading: T169_PMP_PAGE.domainHeading,
        body: `${T169_PMP_PAGE.domainBody}\n\n${T169_PMP_PAGE.domainTable}\n\n${T169_PMP_PAGE.domainNote}`,
      },
      {
        id: 'eligibility-training-hours',
        heading: T169_ELIGIBILITY_SECTION.heading,
        body: `${T169_ELIGIBILITY_SECTION.body}\n\n${T169_ELIGIBILITY_SECTION.complianceNote}\n\n${T169_ELIGIBILITY_SECTION.lastReviewed}`,
      },
      {
        id: 'compliance',
        heading: 'Review and verification',
        body: T169_PMP_PAGE.disclaimer,
      },
    ],
    faqs: T169_FAQS.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
    relatedLinks: [
      { href: PMP_PATHWAY_PAGE.path, label: PMP_PATHWAY_PAGE.shortLabel },
      ...clusterLinks('/pmp-exam-2026'),
      { href: '/answers/is-the-pmp-exam-changing-in-2026', label: 'Is the PMP exam changing in 2026?' },
      { href: '/answers/current-pmp-exam-vs-new-pmp-exam', label: 'Current vs new PMP exam' },
      { href: '/answers/should-i-rush-pmp-before-july-2026', label: 'Should I rush before July 2026?' },
      { href: '/topics/pmp-exam-2026', label: 'PMP exam 2026 topic hub' },
    ],
  },
  {
    slug: 'pmp-current-vs-new-exam',
    path: '/pmp-current-vs-new-exam',
    title: 'PMP current vs new exam (2026 comparison)',
    description:
      'Compare the current PMP exam experience with the post-9 July 2026 format. Independent preparation guidance from PM Structure.',
    h1: 'PMP current exam vs new exam: 2026 comparison',
    directAnswer:
      'The main decision is which exam version you will face on your test date. The current experience reflects today’s ECO until PMI’s published transition; the new experience applies from 9 July 2026 onward per PMI communications. Preparation depth and scenario practice matter for both.',
    sections: [
      {
        id: 'comparison-table',
        heading: 'Comparison at a glance',
        body:
          '| Factor | Current exam (before transition) | New exam (from 9 July 2026) |\n|--------|-------------------------------|----------------------------|\n| Timing | Schedule while current format is offered | Plan for post-transition ECO emphasis |\n| Study focus | Today’s ECO + situational items | Updated ECO themes incl. modern delivery contexts |\n| Official source | PMI handbook + Pearson VUE | PMI handbook + Pearson VUE |\n| PM Structure role | Independent prep pathways | Independent prep pathways |\n\n' +
          PMP_SOURCE_TODO,
      },
      {
        id: 'prep-implications',
        heading: 'Preparation implications',
        body:
          'Scenario practice, timed mocks, and domain-level review remain central. Swap emphasis only after you confirm which exam version you will sit.',
      },
      {
        id: 'timing-guides',
        heading: 'Next steps',
        body: [
          '- [Current vs new exam](/pmp-current-vs-new-exam)',
          '- [Before 8 July 2026](/pmp-before-8-july-2026)',
          '- [After 9 July 2026](/pmp-after-9-july-2026)',
        ].join('\n'),
      },
    ],
    relatedLinks: clusterLinks('/pmp-current-vs-new-exam'),
  },
  {
    slug: 'pmp-before-8-july-2026',
    path: '/pmp-before-8-july-2026',
    title: 'PMP exam before 8 July 2026: candidate guidance',
    description:
      'Should you take the PMP exam before 8 July 2026? Independent timing and preparation guidance.',
    h1: 'Preparing to sit PMP before 8 July 2026',
    directAnswer:
      'If you are already exam-ready and can schedule before the transition window, sitting the current format may avoid adapting to a new ECO emphasis. Confirm seat availability and PMI rules before committing.',
    sections: [
      {
        id: 'when-it-makes-sense',
        heading: 'When testing before July makes sense',
        body:
          'You have completed a structured study plan, scored consistently on timed mocks, and can schedule with Pearson VUE in time. Rushing only to beat a date rarely improves outcomes.',
      },
      {
        id: 'risks',
        heading: 'Risks of rushing',
        body:
          'Under-preparing to hit a calendar date can increase retake costs. Official exam fees and scheduling policies are set by PMI, not PM Structure.',
      },
    ],
    relatedLinks: clusterLinks('/pmp-before-8-july-2026'),
  },
  {
    slug: 'pmp-after-9-july-2026',
    path: '/pmp-after-9-july-2026',
    title: 'PMP exam after 9 July 2026: preparation guide',
    description:
      'How to prepare for the PMP exam from 9 July 2026 onward. Independent readiness guidance.',
    h1: 'Preparing for PMP after 9 July 2026',
    directAnswer:
      'Candidates sitting on or after 9 July 2026 should align mocks and study plans to PMI’s updated exam content outline once published. Build scenario judgment skills and review Business Environment, People, and Process themes with official materials.',
    sections: [
      {
        id: 'study-shift',
        heading: 'How preparation should shift',
        body:
          'Increase scenario-based practice, connect concepts to professional responsibility, and track PMI updates to the ECO. PM Structure Professional and Mastery tiers emphasize structured mocks and mentor support.',
      },
    ],
    relatedLinks: clusterLinks('/pmp-after-9-july-2026'),
  },
  {
    slug: 'pmp-exam-timeline-2026',
    path: '/pmp-exam-timeline-2026',
    title: 'PMP exam timeline 2026: key dates',
    description: '2026 PMP exam transition timeline and decision milestones for candidates.',
    h1: 'PMP exam timeline 2026',
    directAnswer:
      'Treat 8 July 2026 and 9 July 2026 as the planning boundary communicated in PMI transition materials. Build your study plan backward from your target test month and application approval window.',
    sections: [
      {
        id: 'milestones',
        heading: 'Suggested milestones',
        body:
          '1) Confirm PMI application eligibility and hours. 2) Choose exam version based on readiness. 3) Complete 6-12 weeks structured study (pace varies). 4) Schedule Pearson VUE slot. 5) Run final mocks under timed conditions.',
      },
    ],
    relatedLinks: clusterLinks('/pmp-exam-timeline-2026'),
  },
  {
    slug: 'pmp-new-exam-domain-weighting',
    path: '/pmp-new-exam-domain-weighting',
    title: 'PMP new exam domain weighting: what to verify',
    description:
      'Orientation on PMP ECO domain weighting for 2026. Verify all percentages with official PMI sources.',
    h1: 'PMP new exam domain weighting (verify with PMI)',
    directAnswer:
      'Domain weights are defined by PMI in the official Exam Content Outline. Do not rely on third-party percentages for scheduling decisions. Download the current ECO from PMI and map your study hours proportionally.',
    sections: [
      {
        id: 'domains',
        heading: 'Three exam domains (high level)',
        body:
          'People: leadership, teams, conflict, stakeholders.\nProcess: scope, schedule, risk, quality, delivery.\nBusiness Environment: compliance, value, governance, benefits.\n\n' +
          PMP_SOURCE_TODO,
      },
    ],
    relatedLinks: clusterLinks('/pmp-new-exam-domain-weighting'),
  },
  {
    slug: 'pmp-business-environment-domain',
    path: '/pmp-business-environment-domain',
    title: 'PMP Business Environment domain: study focus',
    description: 'Independent guide to the PMP Business Environment domain for 2026 preparation.',
    h1: 'PMP Business Environment domain',
    directAnswer:
      'This domain covers how projects align with organizational strategy, compliance, value delivery, and external factors. Use official ECO task statements and scenario practice that forces trade-off decisions.',
    sections: [
      {
        id: 'focus-areas',
        heading: 'Focus areas',
        body: 'Benefits realization, governance, compliance, change impact, and value-focused decision making.',
      },
    ],
    relatedLinks: clusterLinks('/pmp-business-environment-domain'),
  },
  {
    slug: 'pmp-people-domain',
    path: '/pmp-people-domain',
    title: 'PMP People domain: study focus',
    description: 'Leadership, teams, and stakeholder themes for PMP People domain preparation.',
    h1: 'PMP People domain',
    directAnswer:
      'The People domain emphasizes leadership, team performance, conflict resolution, and stakeholder engagement. Scenario questions often test how you apply soft skills under pressure.',
    sections: [
      {
        id: 'focus-areas',
        heading: 'Focus areas',
        body: 'Team development, motivation, negotiation, cultural awareness, and stakeholder communication.',
      },
    ],
    relatedLinks: clusterLinks('/pmp-people-domain'),
  },
  {
    slug: 'pmp-process-domain',
    path: '/pmp-process-domain',
    title: 'PMP Process domain: study focus',
    description: 'Delivery, risk, scope, and execution focus for the PMP Process domain.',
    h1: 'PMP Process domain',
    directAnswer:
      'The Process domain covers planning, execution, monitoring, risk, quality, and delivery methods. Timed practice helps you select the best PMI-aligned action in situational items.',
    sections: [
      {
        id: 'focus-areas',
        heading: 'Focus areas',
        body: 'Scope, schedule, cost, risk, quality, procurement, and integrated change control.',
      },
    ],
    relatedLinks: clusterLinks('/pmp-process-domain'),
  },
  {
    slug: 'pmp-ai-sustainability-value-delivery',
    path: '/pmp-ai-sustainability-value-delivery',
    title: 'PMP prep. AI, sustainability & value delivery',
    description:
      'How AI, sustainability, and value delivery themes appear in modern PMP exam preparation.',
    h1: 'AI, sustainability, and value delivery in PMP prep',
    directAnswer:
      'Updated PMP preparation increasingly connects project decisions to long-term value, responsible use of technology, and sustainable outcomes. Study official PMI materials for task-level expectations.',
    sections: [
      {
        id: 'themes',
        heading: 'Study themes',
        body: 'Responsible AI use in projects, benefits and value, environmental and social considerations where relevant to scenario judgment.',
      },
    ],
    relatedLinks: clusterLinks('/pmp-ai-sustainability-value-delivery'),
  },
  {
    slug: 'pmp-agile-hybrid-predictive',
    path: '/pmp-agile-hybrid-predictive',
    title: 'PMP agile, hybrid & predictive approaches',
    description: 'Methodology mix in PMP scenario practice: agile, hybrid, and predictive.',
    h1: 'Agile, hybrid, and predictive approaches for PMP',
    directAnswer:
      'PMP scenarios may present predictive, agile, or hybrid contexts. Your job is to apply the appropriate framework principles: not to assume one methodology for every question.',
    sections: [
      {
        id: 'practice',
        heading: 'How to practice',
        body: 'Rotate mock sets across delivery approaches and justify why a technique fits the scenario constraints.',
      },
    ],
    relatedLinks: clusterLinks('/pmp-agile-hybrid-predictive'),
  },
  {
    slug: 'pmp-study-plan-2026',
    path: '/pmp-study-plan-2026',
    title: 'PMP study plan 2026: structured preparation',
    description: 'A structured weekly PMP study plan outline for 2026 candidates.',
    h1: 'PMP study plan for 2026',
    directAnswer:
      'A typical structured plan runs 6-12 weeks depending on weekly hours and experience. Foundation weeks cover ECO mapping; middle weeks add scenario drills; final weeks simulate full mocks and review weak domains.',
    sections: [
      {
        id: 'weekly-outline',
        heading: 'Sample weekly outline',
        body:
          'Weeks 1-2: ECO map + baseline mock.\nWeeks 3-5: Domain deep dives + timed quizzes.\nWeeks 6-8: Full mocks + error log.\nWeeks 9+: Pearson VUE scheduling + light review.\n\nAdjust pace using the PMP pathway tiers on /certifications/pmp.',
      },
    ],
    relatedLinks: clusterLinks('/pmp-study-plan-2026'),
  },
];

export const PMP_PAGES = pages;

export function getPmpPage(slug: string): PmpPageContent | undefined {
  return pages.find((p) => p.slug === slug);
}

export function getPmpPageByPath(path: string): PmpPageContent | undefined {
  return pages.find((p) => p.path === path);
}

export const PMP_CLUSTER_PATHS = ['/pmp', '/pmp-2026-pathway', ...pages.map((p) => p.path)] as const;
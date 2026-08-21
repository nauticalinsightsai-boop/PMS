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
  { href: '/pmp-after-9-july-2026', label: 'Current exam preparation reset' },
  { href: '/pmp-current-vs-new-exam', label: 'Previous vs current exam' },
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
    description: 'Main authority guide to the PMP exam now in force.',
  },
  {
    path: '/pmp-current-vs-new-exam',
    title: 'Previous vs current exam',
    description: 'Compare the exam before 9 July with the current exam.',
  },
  {
    path: '/pmp-after-9-july-2026',
    title: 'Current PMP exam preparation',
    description: 'How to reset your materials and prepare for the exam now in force.',
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
      { href: '/answers/current-pmp-exam-vs-new-pmp-exam', label: 'Previous vs current PMP exam' },
      { href: '/pmp-exam-timeline-2026', label: 'Historical 2026 exam transition timeline' },
      { href: '/pmp-new-exam-domain-weighting', label: 'Current PMP domain weighting' },
    ],
  },
  {
    slug: 'pmp-current-vs-new-exam',
    path: '/pmp-current-vs-new-exam',
    title: 'Previous vs current PMP exam (2026 comparison)',
    description:
      'Compare the previous PMP exam with the current exam launched on 9 July 2026. Independent preparation guidance from PM Structure.',
    h1: 'Previous vs current PMP exam: 2026 comparison',
    directAnswer:
      'The updated PMP exam launched on 9 July 2026 and is now the current exam. Use this comparison to identify obsolete pre-transition materials, then prepare against the current PMI handbook and Exam Content Outline.',
    sections: [
      {
        id: 'comparison-table',
        heading: 'Comparison at a glance',
        body:
          '| Factor | Previous exam (before 9 July 2026) | Current exam (from 9 July 2026) |\n|--------|-----------------------------------------|------------------------------------|\n| Status | Historical; no longer offered | Active exam for current candidates |\n| Study focus | Previous ECO and domain balance | Current ECO, revised domains, and modern delivery contexts |\n| Official source | Historical PMI materials | Current PMI handbook + Pearson VUE |\n| PM Structure role | Historical comparison only | Independent preparation pathways |\n\n' +
          PMP_SOURCE_TODO,
      },
      {
        id: 'prep-implications',
        heading: 'Preparation implications',
        body:
          'Scenario practice, timed mocks, and domain-level review remain central. Replace pre-transition materials and confirm that every study resource maps to the current PMI Exam Content Outline.',
      },
      {
        id: 'timing-guides',
        heading: 'Next steps',
        body: [
          '- [Current PMP exam facts](/pmp-exam-2026)',
          '- [Current exam preparation reset](/pmp-after-9-july-2026)',
          '- [Previous vs current exam reference](/pmp-current-vs-new-exam)',
        ].join('\n'),
      },
    ],
    relatedLinks: clusterLinks('/pmp-current-vs-new-exam'),
  },
  {
    slug: 'pmp-before-8-july-2026',
    path: '/pmp-before-8-july-2026',
    title: 'PMP exam before 8 July 2026: historical guidance',
    description:
      'Historical timing guidance for candidates who sat the PMP exam before the 8 July 2026 transition.',
    h1: 'PMP before 8 July 2026 (historical)',
    directAnswer:
      '**Historical:** This page provided timing guidance for candidates considering the previous PMP exam format before 9 July 2026. The previous exam is no longer offered. For current exam preparation, see the [PMP exam 2026 guide](/pmp-exam-2026).',
    sections: [
      {
        id: 'when-it-makes-sense',
        heading: 'When testing before July made sense (historical)',
        body:
          'Candidates who had completed a structured study plan, scored consistently on timed mocks, and could schedule with Pearson VUE before the transition. Rushing only to beat a date rarely improved outcomes.',
      },
      {
        id: 'risks',
        heading: 'Risks of rushing (historical)',
        body:
          'Under-preparing to hit a calendar date increased retake costs. This timing decision is no longer relevant as the previous exam is not offered.',
      },
      {
        id: 'current-guidance',
        heading: 'Current exam preparation',
        body:
          'Prepare for the current PMP exam (updated July 2026) using the latest ECO and domain weights. See [PMP exam 2026 guide](/pmp-exam-2026) for current preparation routes.',
      },
    ],
    relatedLinks: clusterLinks('/pmp-after-9-july-2026'),
  },
  {
    slug: 'pmp-after-9-july-2026',
    path: '/pmp-after-9-july-2026',
    title: 'Current PMP exam preparation guide (July 2026 update)',
    description:
      'How to prepare for the current PMP exam launched on 9 July 2026. Independent readiness guidance.',
    h1: 'Preparing for the current PMP exam',
    directAnswer:
      'Candidates should align mocks and study plans to PMI’s published July 2026 examination content outline. Build scenario judgement skills and allocate practice across People (33%), Process (41%), and Business Environment (26%) using current official materials.',
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
    title: 'PMP exam timeline 2026: key dates (historical)',
    description: '2026 PMP exam transition timeline and decision milestones (historical reference).',
    h1: 'PMP exam timeline 2026 (historical)',
    directAnswer:
      'The PMP exam transition occurred on 9 July 2026. This historical timeline shows the planning milestones for that transition. For current exam preparation, use the [PMP 2026 guide](/pmp-exam-2026).',
    sections: [
      {
        id: 'milestones',
        heading: 'Historical milestones (2026 transition)',
        body:
          '8 July 2026: Last day for previous exam format.\n9 July 2026: Updated PMP exam launched.\n\nFor current candidates: Build your study plan around PMI application approval timeline and readiness checkpoints.',
      },
    ],
    relatedLinks: clusterLinks('/pmp-exam-timeline-2026'),
  },
  {
    slug: 'pmp-new-exam-domain-weighting',
    path: '/pmp-new-exam-domain-weighting',
    title: 'Current PMP exam domain weighting: what to verify',
    description:
      'Orientation on PMP ECO domain weighting for 2026. Verify all percentages with official PMI sources.',
    h1: 'Current PMP exam domain weighting (verify with PMI)',
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
      'In PMI’s July 2026 PMP Examination Content Outline, the People domain accounts for 33% of the exam. Use this guide to practice leadership, team performance, conflict resolution and stakeholder engagement in situational questions.',
    sections: [
      {
        id: 'focus-areas',
        heading: 'Focus areas',
        body: 'Team development, motivation, negotiation, cultural awareness, and stakeholder communication.',
      },
      {
        id: 'official-source',
        heading: 'Official source',
        body: 'Domain terminology and weighting: [PMI PMP Examination Content Outline — July 2026](https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/new-pmp-examination-content-outline-2026.pdf). PM Structure fact review: 19 June 2026.',
      },
    ],
    relatedLinks: [
      { href: '/answers/what-is-the-pmp-people-domain', label: 'What is the PMP People domain?' },
      ...clusterLinks('/pmp-people-domain'),
    ],
  },
  {
    slug: 'pmp-process-domain',
    path: '/pmp-process-domain',
    title: 'PMP Process domain: study focus',
    description: 'Delivery, risk, scope, and execution focus for the PMP Process domain.',
    h1: 'PMP Process domain',
    directAnswer:
      'In PMI’s July 2026 PMP Examination Content Outline, the Process domain accounts for 41% of the exam and covers delivery work across planning, execution, monitoring, risk, quality, scope and integration. Use this guide to turn those task areas into scenario practice.',
    sections: [
      {
        id: 'focus-areas',
        heading: 'Focus areas',
        body: 'Scope, schedule, cost, risk, quality, procurement, and integrated change control.',
      },
      {
        id: 'official-source',
        heading: 'Official source',
        body: 'Domain terminology and weighting: [PMI PMP Examination Content Outline — July 2026](https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/new-pmp-examination-content-outline-2026.pdf). PM Structure fact review: 19 June 2026.',
      },
    ],
    relatedLinks: [
      { href: '/topics/pmp-process-domain', label: 'Process domain topic hub' },
      ...clusterLinks('/pmp-process-domain'),
    ],
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
    title: 'PMP Study Plan 2026 | Weekly Prep Structure | PM Structure',
    description:
      'Use a structured PMP study plan for 2026: weekly outline, mock cadence, and pathway links. Talk to a mentor when you need a personalised roadmap.',
    h1: 'PMP study plan 2026',
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

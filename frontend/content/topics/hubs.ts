import type { TopicHubContent } from './types';

const hubs: TopicHubContent[] = [
  {
    slug: 'pmp-exam-preparation',
    path: '/topics/pmp-exam-preparation',
    title: 'PMP exam preparation — knowledge hub',
    description: 'Curated PMP exam preparation guides, pathways, answers, and FAQs on PM Structure.',
    h1: 'PMP exam preparation — PM Structure knowledge hub',
    whatIs:
      'PMP exam preparation is the structured process of meeting PMI eligibility, mastering the Exam Content Outline, and building situational judgment before Pearson VUE.',
    whyMatters:
      'Candidates who treat prep as mock-driven readiness — not passive video consumption — schedule with more confidence and fewer retakes.',
    viewpoint:
      'PM Structure provides independent pathways (Foundation, Professional, Mastery), scenario practice, and 2026 transition guides. We are not PMI or an ATP unless formally stated.',
    resources: [
      { href: '/pmp', label: 'PMP hub' },
      { href: '/pmp-exam-2026', label: 'PMP 2026 guide' },
      { href: '/certifications/pmp', label: 'Certification pathways' },
      { href: '/pmp-enrollment', label: 'Enrollment hub' },
    ],
    relatedAnswers: [
      { href: '/answers/how-to-prepare-for-pmp-in-2026', label: 'How to prepare for PMP in 2026' },
      { href: '/answers/how-long-does-pmp-preparation-take', label: 'How long does prep take?' },
    ],
    ctaHref: '/pmp-readiness-diagnostic',
    ctaLabel: 'Readiness diagnostic',
  },
  {
    slug: 'pmp-exam-2026',
    path: '/topics/pmp-exam-2026',
    title: 'PMP exam 2026 — knowledge hub',
    description: '2026 PMP transition guides, timeline, domain orientation, and preparation on PM Structure.',
    h1: 'PMP exam 2026 — PM Structure knowledge hub',
    whatIs:
      'The 2026 PMP narrative centers on a transition to an updated exam experience, commonly anchored around 9 July 2026. Verify all dates on PMI.org.',
    whyMatters:
      'Timing your exam before or after the transition affects study emphasis, mock selection, and scheduling risk.',
    viewpoint:
      'Our cluster pages explain before/after July decisions without inventing official domain weights. Cross-check PMI publications.',
    resources: [
      { href: '/pmp-exam-2026', label: 'Main 2026 guide' },
      { href: '/pmp-current-vs-new-exam', label: 'Current vs new exam' },
      { href: '/pmp-exam-timeline-2026', label: 'Timeline' },
      { href: '/pmp-before-8-july-2026', label: 'Before 8 July' },
      { href: '/pmp-after-9-july-2026', label: 'After 9 July' },
    ],
    relatedAnswers: [
      { href: '/answers/is-the-pmp-exam-changing-in-2026', label: 'Is the exam changing?' },
      { href: '/answers/when-does-the-new-pmp-exam-start', label: 'When does the new exam start?' },
    ],
    ctaHref: '/pmp-exam-2026',
    ctaLabel: 'Read the 2026 guide',
  },
  {
    slug: 'pmp-readiness',
    path: '/topics/pmp-readiness',
    title: 'PMP readiness — knowledge hub',
    description: 'What PMP readiness means, diagnostics, mocks, and pathway selection on PM Structure.',
    h1: 'PMP readiness — PM Structure knowledge hub',
    whatIs:
      'Readiness is demonstrated through ECO coverage, stable mock performance, and situational judgment — not only course completion.',
    whyMatters:
      'Scheduling too early wastes exam fees; scheduling too late burns momentum. Readiness checkpoints reduce both risks.',
    viewpoint:
      'Use our diagnostic, mock guidance, and tier comparison before booking Pearson VUE. We do not guarantee outcomes.',
    resources: [
      { href: '/pmp-readiness-diagnostic', label: 'Readiness diagnostic' },
      { href: '/pmp-mock-exam', label: 'Mock exams' },
      { href: '/pmp-study-plan-2026', label: 'Study plan 2026' },
    ],
    relatedAnswers: [
      { href: '/answers/what-is-pmp-readiness', label: 'What is PMP readiness?' },
    ],
    ctaHref: '/pmp-readiness-diagnostic',
    ctaLabel: 'Start diagnostic',
  },
  {
    slug: 'pmp-scenario-practice',
    path: '/topics/pmp-scenario-practice',
    title: 'PMP scenario practice — knowledge hub',
    description: 'Situational PMP practice, categories, and pathway placement on PM Structure.',
    h1: 'PMP scenario practice — PM Structure knowledge hub',
    whatIs:
      'Scenario practice presents project situations and asks what a PM should do next — mirroring modern PMP item styles.',
    whyMatters:
      'Candidates who only memorize definitions often underperform on full mocks. Scenarios build application skill.',
    viewpoint:
      'Professional and Mastery pathways include structured scenario sets. See the dedicated scenario practice page for categories.',
    resources: [
      { href: '/pmp-scenario-practice', label: 'Scenario practice page' },
      { href: '/pmp-professional', label: 'Professional pathway' },
      { href: '/pmp-mastery', label: 'Mastery pathway' },
    ],
    relatedAnswers: [
      { href: '/answers/what-is-pmp-scenario-practice', label: 'What is scenario practice?' },
    ],
    ctaHref: '/pmp-scenario-practice',
    ctaLabel: 'Scenario practice overview',
  },
  {
    slug: 'business-environment-domain',
    path: '/topics/business-environment-domain',
    title: 'Business Environment domain — knowledge hub',
    description: 'PMP Business Environment domain orientation, study tips, and related guides.',
    h1: 'Business Environment domain — PM Structure knowledge hub',
    whatIs:
      'The Business Environment domain addresses benefits, compliance, value delivery, and organizational context in project decisions.',
    whyMatters:
      'It is often under-studied relative to Process mechanics, yet appears frequently in situational items.',
    viewpoint:
      'Study Business Environment alongside People and Process. Verify tasks in the current PMI ECO.',
    resources: [
      { href: '/pmp-business-environment-domain', label: 'Domain guide' },
      { href: '/pmp-new-exam-domain-weighting', label: 'Domain weighting orientation' },
    ],
    relatedAnswers: [
      { href: '/answers/what-is-the-pmp-business-environment-domain', label: 'What is this domain?' },
    ],
    ctaHref: '/pmp-business-environment-domain',
    ctaLabel: 'Read domain guide',
  },
  {
    slug: 'value-delivery',
    path: '/topics/value-delivery',
    title: 'Value delivery — knowledge hub',
    description: 'Value delivery themes in PMP preparation and modern project leadership.',
    h1: 'Value delivery — PM Structure knowledge hub',
    whatIs:
      'Value delivery connects project outputs to benefits, outcomes, and stakeholder expectations — a recurring PMP scenario theme.',
    whyMatters:
      'Exam items often test whether you prioritize outcomes and governance over activity completion.',
    viewpoint:
      'We cover value delivery in cluster guides and scenario practice without claiming exclusive PMI definitions.',
    resources: [
      { href: '/pmp-ai-sustainability-value-delivery', label: 'AI, sustainability & value' },
      { href: '/pmp-business-environment-domain', label: 'Business Environment domain' },
    ],
    relatedAnswers: [],
    ctaHref: '/pmp-ai-sustainability-value-delivery',
    ctaLabel: 'Value delivery guide',
  },
  {
    slug: 'ai-in-project-management',
    path: '/topics/ai-in-project-management',
    title: 'AI in project management — knowledge hub',
    description: 'AI themes in PMP preparation: governance, ethics, and decision-making.',
    h1: 'AI in project management — PM Structure knowledge hub',
    whatIs:
      'AI in PM contexts covers how teams govern tools, protect data, and make accountable decisions — not vendor certification trivia.',
    whyMatters:
      'Updated PMP narratives may reference AI; verify scope in the current PMI ECO before over-weighting study time.',
    viewpoint:
      'Prepare for judgment scenarios about AI use, not memorization of headlines. Confirm official PMI guidance.',
    resources: [
      { href: '/pmp-ai-sustainability-value-delivery', label: 'AI & sustainability cluster page' },
      { href: '/pmp-scenario-practice', label: 'Scenario practice' },
    ],
    relatedAnswers: [],
    ctaHref: '/faq?tab=pmp-2026',
    ctaLabel: 'PMP 2026 FAQs',
  },
  {
    slug: 'sustainability-in-project-management',
    path: '/topics/sustainability-in-project-management',
    title: 'Sustainability in project management — knowledge hub',
    description: 'Sustainability themes for PMP candidates and business environment scenarios.',
    h1: 'Sustainability in project management — PM Structure knowledge hub',
    whatIs:
      'Sustainability in PM includes environmental, social, and governance considerations in project choices and benefits.',
    whyMatters:
      'Business Environment scenarios may test long-term impacts, not only short-term delivery metrics.',
    viewpoint:
      'Treat sustainability as part of professional responsibility and benefits thinking — verify PMI task lists.',
    resources: [
      { href: '/pmp-ai-sustainability-value-delivery', label: 'Sustainability & value guide' },
    ],
    relatedAnswers: [],
    ctaHref: '/pmp-ai-sustainability-value-delivery',
    ctaLabel: 'Read cluster guide',
  },
  {
    slug: 'agile-project-management',
    path: '/topics/agile-project-management',
    title: 'Agile project management — knowledge hub',
    description: 'Agile contexts in PMP preparation: teams, delivery, and hybrid considerations.',
    h1: 'Agile project management — PM Structure knowledge hub',
    whatIs:
      'Agile project management emphasizes iterative delivery, feedback, and empowered teams — one lens within the PMP ECO.',
    whyMatters:
      'PMP items frequently blend agile behaviors with governance and stakeholder expectations.',
    viewpoint:
      'Study agile as situational judgment within PMP domains, not as a separate credential unless you are also pursuing PMI-ACP.',
    resources: [
      { href: '/pmp-agile-hybrid-predictive', label: 'Agile, hybrid & predictive' },
      { href: '/certifications/pmi-acp', label: 'PMI-ACP pathway' },
    ],
    relatedAnswers: [],
    ctaHref: '/pmp-agile-hybrid-predictive',
    ctaLabel: 'Agile & hybrid guide',
  },
  {
    slug: 'hybrid-project-management',
    path: '/topics/hybrid-project-management',
    title: 'Hybrid project management — knowledge hub',
    description: 'Hybrid delivery patterns for PMP situational practice and 2026 preparation.',
    h1: 'Hybrid project management — PM Structure knowledge hub',
    whatIs:
      'Hybrid approaches combine predictive planning with adaptive execution — common in enterprise programs.',
    whyMatters:
      'Many PMP scenarios assume you can choose the right approach for context, not apply one methodology everywhere.',
    viewpoint:
      'Use our agile/hybrid/predictive cluster page and scenario practice to train approach selection.',
    resources: [
      { href: '/pmp-agile-hybrid-predictive', label: 'Methodology mix guide' },
      { href: '/pmp-scenario-practice', label: 'Scenario practice' },
    ],
    relatedAnswers: [],
    ctaHref: '/pmp-agile-hybrid-predictive',
    ctaLabel: 'Hybrid guide',
  },
  {
    slug: 'project-governance',
    path: '/topics/project-governance',
    title: 'Project governance — knowledge hub',
    description: 'Governance, compliance, and decision rights for PMP Business Environment preparation.',
    h1: 'Project governance — PM Structure knowledge hub',
    whatIs:
      'Project governance defines decision rights, oversight, and alignment with organizational strategy and benefits.',
    whyMatters:
      'Governance themes appear in Business Environment and professional responsibility scenarios.',
    viewpoint:
      'Link governance study to value delivery and benefits — not only documentation checklists.',
    resources: [
      { href: '/pmp-business-environment-domain', label: 'Business Environment domain' },
      { href: '/pmp-process-domain', label: 'Process domain' },
    ],
    relatedAnswers: [],
    ctaHref: '/pmp-business-environment-domain',
    ctaLabel: 'Business Environment guide',
  },
  {
    slug: 'project-management-certification',
    path: '/topics/project-management-certification',
    title: 'Project management certification — knowledge hub',
    description: 'Compare PMP, PRINCE2, Six Sigma, and readiness pathways on PM Structure.',
    h1: 'Project management certification — PM Structure knowledge hub',
    whatIs:
      'Project management certification validates skills through third-party exams — each with different eligibility, cost, and career fit.',
    whyMatters:
      'Choosing the wrong credential wastes time and fees. Start with role requirements and regional employer demand.',
    viewpoint:
      'We help you compare pathways independently; we are not PMI, AXELOS, or ASQ.',
    resources: [
      { href: '/certifications', label: 'All certifications' },
      { href: '/certifications/compare', label: 'Compare matrix' },
      { href: '/answers/what-is-project-management-certification', label: 'What is PM certification?' },
    ],
    relatedAnswers: [
      { href: '/answers/what-is-project-management-certification', label: 'PM certification overview' },
    ],
    ctaHref: '/certifications/compare',
    ctaLabel: 'Compare pathways',
  },
  {
    slug: 'risk-management',
    path: '/topics/risk-management',
    title: 'Risk management — knowledge hub',
    description: 'Risk themes for PMP Process domain and PMI-RMP preparation.',
    h1: 'Risk management — PM Structure knowledge hub',
    whatIs:
      'Project risk management identifies, analyzes, and responds to uncertainty that affects objectives and delivery.',
    whyMatters:
      'Risk appears in PMP scenarios and is central to PMI-RMP. Weak risk judgment hurts mock scores.',
    viewpoint:
      'Practice qualitative and quantitative responses in scenario sets — not only definitions.',
    resources: [
      { href: '/pmp-process-domain', label: 'Process domain guide' },
      { href: '/certifications/pmi-rmp', label: 'PMI-RMP pathway' },
      { href: '/topics/pmi-rmp-preparation', label: 'PMI-RMP hub' },
    ],
    relatedAnswers: [],
    ctaHref: '/pmp-scenario-practice',
    ctaLabel: 'Scenario practice',
  },
  {
    slug: 'pmi-rmp-preparation',
    path: '/topics/pmi-rmp-preparation',
    title: 'PMI-RMP preparation — knowledge hub',
    description: 'Risk Management Professional exam prep resources on PM Structure.',
    h1: 'PMI-RMP preparation — PM Structure knowledge hub',
    whatIs:
      'PMI-RMP (PMI Risk Management Professional) focuses on project risk identification, analysis, and response.',
    whyMatters:
      'Risk specialists and senior PMs use RMP to signal depth beyond general PMP coverage.',
    viewpoint:
      'Confirm PMI eligibility and handbook requirements before enrolling in any prep pathway.',
    resources: [
      { href: '/certifications/pmi-rmp', label: 'PMI-RMP certification page' },
      { href: '/topics/risk-management', label: 'Risk management hub' },
    ],
    relatedAnswers: [],
    ctaHref: '/certifications/pmi-rmp',
    ctaLabel: 'PMI-RMP pathway',
  },
  {
    slug: 'prince2-preparation',
    path: '/topics/prince2-preparation',
    title: 'PRINCE2 preparation — knowledge hub',
    description: 'PRINCE2 Foundation and Practitioner readiness on PM Structure.',
    h1: 'PRINCE2 preparation — PM Structure knowledge hub',
    whatIs:
      'PRINCE2 is a governance-led method with defined roles, themes, and processes for controlled project delivery.',
    whyMatters:
      'PRINCE2 remains widely requested in UK, GCC, and public-sector roles alongside PMI credentials.',
    viewpoint:
      'Independent prep only — official exams and fees are booked through authorized channels.',
    resources: [
      { href: '/certifications/prince2', label: 'PRINCE2 pathway' },
      { href: '/answers/what-is-prince2-certification', label: 'What is PRINCE2?' },
    ],
    relatedAnswers: [
      { href: '/answers/what-is-prince2-certification', label: 'What is PRINCE2 certification?' },
    ],
    ctaHref: '/certifications/prince2',
    ctaLabel: 'PRINCE2 pathway',
  },
  {
    slug: 'six-sigma-preparation',
    path: '/topics/six-sigma-preparation',
    title: 'Six Sigma preparation — knowledge hub',
    description: 'Lean Six Sigma belt pathways and DMAIC study on PM Structure.',
    h1: 'Six Sigma preparation — PM Structure knowledge hub',
    whatIs:
      'Lean Six Sigma belts (Yellow, Green, Black) certify process improvement capability using DMAIC and statistical tools.',
    whyMatters:
      'Operations, quality, and engineering roles often require Green Belt or higher.',
    viewpoint:
      'Start with Green Belt unless your employer specifies otherwise; verify exam body for your belt.',
    resources: [
      { href: '/certifications/lss-green', label: 'Green Belt pathway' },
      { href: '/answers/what-is-lean-six-sigma-green-belt', label: 'What is Green Belt?' },
    ],
    relatedAnswers: [
      { href: '/answers/what-is-lean-six-sigma-green-belt', label: 'Green Belt answer' },
    ],
    ctaHref: '/certifications/lss-green',
    ctaLabel: 'Green Belt pathway',
  },
  {
    slug: 'exam-readiness',
    path: '/topics/exam-readiness',
    title: 'Exam readiness — knowledge hub',
    description: 'Readiness diagnostics, mocks, and study discipline across PM Structure pathways.',
    h1: 'Exam readiness — PM Structure knowledge hub',
    whatIs:
      'Exam readiness means consistent mock performance, domain coverage, and scheduling confidence — not passive content completion.',
    whyMatters:
      'Candidates who skip readiness measurement often fail or delay exams repeatedly.',
    viewpoint:
      'Use diagnostics and mocks as decision tools; we do not guarantee pass outcomes.',
    resources: [
      { href: '/pmp-readiness-diagnostic', label: 'PMP readiness diagnostic' },
      { href: '/pmp-mock-exam', label: 'Mock exam guide' },
      { href: '/topics/pmp-readiness', label: 'PMP readiness hub' },
    ],
    relatedAnswers: [{ href: '/answers/what-is-pmp-readiness', label: 'What is PMP readiness?' }],
    ctaHref: '/pmp-readiness-diagnostic',
    ctaLabel: 'Take diagnostic',
  },
];

export const TOPIC_HUBS = hubs;

export const TOPIC_PATHS = hubs.map((h) => h.path) as readonly string[];

export const TOPIC_SLUGS = hubs.map((h) => h.slug) as readonly string[];

export function getTopicHub(slug: string): TopicHubContent | undefined {
  return hubs.find((h) => h.slug === slug);
}

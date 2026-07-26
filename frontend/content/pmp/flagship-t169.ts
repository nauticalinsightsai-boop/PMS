/** T-169 flagship copy - use exactly as provided unless a component has a hard limit. */

export const PMP_2026_LAST_REVIEWED = '19 June 2026';

export const PMP_2026_SOURCE_NOTE =
  'Source note: PMP 2026 transition facts should be reviewed against official PMI sources before each major content update.';

export const PMP_2026_PMI_SOURCE_LINKS = [
  {
    href: 'https://www.pmi.org/certifications/project-management-pmp/new-exam',
    label: 'PMI: updated PMP exam',
  },
  {
    href: 'https://www.pmi.org/certifications/project-management-pmp',
    label: 'PMI: PMP certification',
  },
  {
    href: 'https://www.pmi.org/certifications/project-management-pmp/pmp-exam-preparation',
    label: 'PMI: PMP exam preparation',
  },
] as const;

export const T169_CTAS = {
  primary: 'Get My PMP Roadmap',
  secondary: 'Compare certifications',
  waitlist: 'Choose pathway',
  mentor: 'Talk to a Mentor',
} as const;

/** Post–9 July 2026 live exam banner. Verify current ECO on PMI.org. */
export const PMP_EXAM_2026_LIVE_BANNER = {
  message:
    'The updated PMP exam launched 9 July 2026 and is now the current exam. Confirm eligibility and the current exam content outline on PMI.org before you book.',
  ctaLabel: 'Get My PMP Roadmap',
  ctaHref: '/certifications/pmp#cert-roadmap-form',
} as const;

export const T169_HERO = {
  eyebrow: 'PMP 2026 Readiness Pathway',
  h1: 'Prepare for the PMP exam with a clear route, not random study noise.',
  body: 'The PMP exam was updated 9 July 2026. PM Structure helps working professionals map their eligibility, organize study effort aligned to the current exam, and track readiness with mentor-led structure.',
  microcopy:
    'Independent exam-prep and readiness support. PM Structure is not PMI and does not issue PMI certifications. Always verify exam rules and eligibility with PMI before applying or booking.',
} as const;

export const T169_NINETY_DAY_FOCUS = {
  label: '90-Day Focus',
  heading: 'PM Structure is prioritizing PMP 2026 readiness first.',
  body: 'For the next 90 days, the main PM Structure pathway is PMP 2026 readiness. The updated exam launched on 9 July 2026 and is now the current exam, so candidates should rebuild any pre-transition study plan around the current content outline.\n\nOther certification pathways remain available for comparison, guidance, and waitlist interest, but PMP 2026 is the flagship offer until the first funnel is proven.',
  bullets: [
    'Align your study plan and mocks to the current PMP exam content outline.',
    'Map eligibility and training-hour requirements without overclaiming approval.',
    'Build a structured study plan instead of jumping between random resources.',
    'Track mock performance, weak areas, and readiness before booking the exam.',
    'Use mentor-led structure where self-study alone is not enough.',
  ],
} as const;

export const T169_ROADMAP_STEPS = {
  heading: 'How the PMP 2026 readmap works',
  steps: [
    {
      title: 'Check your route',
      body: 'We review your eligibility, target exam date, and readiness level to plan your study route for the current PMP exam.',
    },
    {
      title: 'Map your readiness',
      body: 'We review eligibility basics, study time, weak areas, mock performance, and whether you need self-study, cohort structure, or mentor-led support.',
    },
    {
      title: 'Build the plan',
      body: 'You get a structured study roadmap with clear priorities, practice rhythm, review checkpoints, and a realistic exam-readiness decision point.',
    },
  ],
} as const;

export const T169_WHO_FOR = {
  heading: 'Who this pathway is for',
  bullets: [
    'Working professionals with project experience who are considering PMP.',
    'Engineers, coordinators, planners, PMO staff, and delivery professionals moving into project leadership.',
    'Candidates preparing for the current PMP exam (updated July 2026).',
    'Professionals who need structured preparation aligned to the latest exam content outline.',
    'Professionals in GCC and South Asia who want a structured certification route instead of random self-study.',
  ],
} as const;

export const T169_WHO_NOT_FOR = {
  heading: 'Who this is not for',
  bullets: [
    'Anyone looking for an instant certification without study or experience.',
    'Anyone expecting PM Structure to issue the PMP certification.',
    'Anyone looking for a guaranteed pass claim.',
    'Anyone who has not checked their eligibility against PMI\u2019s official requirements.',
    'Anyone who wants generic video access without structure, tracking, or accountability.',
  ],
} as const;

export const T169_FAQS = [
  {
    question: 'When did the PMP exam change in 2026?',
    answer:
      'The updated PMP exam launched on 9 July 2026. All candidates sitting now should prepare using the current (updated July 2026) exam content outline. Historical timing guidance for pre-July candidates is available for reference.',
  },
  {
    question: 'Which PMP exam version should I prepare for?',
    answer:
      'Prepare for the current PMP exam, which is the updated version that launched 9 July 2026. Use the latest PMI exam content outline (ECO) with updated domain weights: People 33%, Process 41%, Business Environment 26%.',
  },
  {
    question: 'What does PM Structure help with?',
    answer:
      'PM Structure helps you choose the right PMP route, map eligibility basics, organize your study plan, track mock performance, identify weak areas, and decide when you are ready to book the exam. It is designed for professionals who need structure, not just more study material.',
  },
  {
    question: 'Is PM Structure a PMI Authorized Training Partner?',
    answer:
      'PM Structure should only be described as a PMI Authorized Training Partner if that status is formally approved and publicly verifiable. Unless that approval exists, PM Structure must be described as an independent exam-prep and readiness-support platform.',
  },
  {
    question: 'Does PM Structure issue the PMP certification?',
    answer:
      'No. PMP is issued by PMI after candidates meet PMI\u2019s eligibility requirements, apply successfully, and pass the PMP exam. PM Structure provides independent preparation, pathway guidance, and readiness support.',
  },
  {
    question: 'Does PM Structure guarantee that I will pass the PMP exam?',
    answer:
      'No. No responsible exam-prep provider should guarantee a pass. PM Structure helps you prepare with structure, practice, review, and readiness tracking, but exam results depend on your eligibility, preparation quality, exam performance, and PMI\u2019s assessment process.',
  },
  {
    question:
      'Does PM Structure provide 35 hours of project management education/training for PMP eligibility?',
    answer:
      'For PMP exam eligibility, the safer wording is project management education/training hours, not PDUs. PDUs are generally used for maintaining an existing PMI certification after someone has already earned it. PM Structure can help candidates understand the PMP training-hour requirement and organize their preparation record, but candidates should verify current eligibility rules directly with PMI before applying.',
  },
] as const;

/** Jul 21 schedule row: engineer-focused FAQ block (compliance-safe). */
export const T169_ENGINEER_FAQS = [
  {
    question: 'Is PMP useful for engineers moving into project leadership?',
    answer:
      'PMP can help engineers who already manage scope, stakeholders, risk, and delivery transitions show structured project leadership. It is not a substitute for technical depth, but it can support credibility when your role expands beyond pure engineering work.',
  },
  {
    question: 'Should engineers prepare for the PMP exam?',
    answer:
      'PMP can help engineers who manage scope, stakeholders, risk, and delivery transitions show structured project leadership. Prepare using the current (July 2026) exam content outline. Start with the PMP 2026 roadmap to check eligibility and readiness.',
  },
  {
    question: 'Do engineers need more study material or a clearer study route?',
    answer:
      'Most engineers do not need random extra content. They need a route: eligibility check, timeline decision, domain-focused study, mock tracking, and weak-area review before booking the exam.',
  },
] as const;

/** Aug 18 schedule row: trust FAQ block. */
export const T169_TRUST_FAQS = [
  {
    question: 'Does PM Structure guarantee a PMP pass?',
    answer:
      'No. No responsible exam-prep provider should guarantee a pass. PM Structure helps you prepare with structure, practice, review, and readiness tracking.',
  },
  {
    question: 'Is PM Structure a PMI Authorized Training Partner?',
    answer:
      'PM Structure should only be described as a PMI Authorized Training Partner if that status is formally approved and publicly verifiable. Unless that approval exists, describe PM Structure as an independent exam-prep platform.',
  },
  {
    question: 'Does PM Structure issue the PMP certification?',
    answer:
      'No. PMP is issued by PMI after eligibility, application, and exam success. PM Structure provides independent preparation and readiness support.',
  },
] as const;

export const T169_MOCK_TRACKING_CTA = {
  heading: 'Track mocks by weak area, not just score',
  body:
    'A mock score alone does not tell you whether you are ready. PM Structure helps you log attempts, note domain gaps, and decide when to book based on readiness patterns, not guesswork.',
  primaryLabel: 'PMP readiness diagnostic',
  primaryHref: '/pmp-readiness-diagnostic',
  secondaryLabel: 'Mock exam practice pathway',
  secondaryHref: '/pmp-mock-exam',
} as const;

export const T169_CONSIDERATION_FAQS = [
  {
    question: 'What if I am not sure I am eligible yet?',
    answer:
      'Start with eligibility and training-hour clarity before buying more content. Verify requirements on PMI.org and use the roadmap to organize your preparation record.',
  },
  {
    question: 'What if my PMP study materials predate the July 2026 change?',
    answer:
      'Replace pre-transition assumptions with the current PMI handbook and exam content outline before you book. Use the previous-vs-current comparison only to identify material that needs updating.',
  },
  {
    question: 'What should I expect from independent PMP prep support?',
    answer:
      'Structure, mock tracking, mentor-led review where offered, and honest readiness guidance. Not a pass guarantee, not PMI certification issuance, and not a substitute for verifying eligibility with PMI.',
  },
] as const;

export const T169_ELIGIBILITY_SECTION = {
  heading: 'PMP eligibility and training-hour guidance',
  body:
    'PMP candidates must meet PMI\u2019s eligibility requirements before applying for the exam. One part of the application route is project management education/training. PM Structure helps candidates understand the training-hour requirement, organize their preparation record, and avoid confusing eligibility language.',
  complianceNote:
    'PM Structure is an independent exam-prep and readiness-support platform. It does not issue the PMP certification and should not be described as a PMI Authorized Training Partner unless that status is formally approved and publicly verified. Always confirm current eligibility and training requirements directly with PMI before applying.',
  lastReviewed: 'Last reviewed: 18 June 2026',
} as const;

export const T169_COMPLIANCE_ALERT =
  'Important: PMP is issued by PMI, not PM Structure. PM Structure provides independent exam-prep, pathway guidance, and readiness support. Candidates should verify eligibility, exam rules, and training requirements directly with PMI before applying or booking the exam.' as const;

export const T169_FEATURED_CARDS = {
  pmp: {
    badge: 'Featured Pathway',
    title: 'PMP 2026 Readiness Pathway',
    description:
      'Structured PMP 2026 roadmap, eligibility guidance, and mentor-led readiness support.',
    cta: T169_CTAS.primary,
  },
  prince2: {
    badge: 'Secondary Pathway',
    title: 'PRINCE2 Practitioner Pathway',
    description:
      'Process-based project management for structured governance and formal project boards.',
    cta: T169_CTAS.waitlist,
  },
  lssGreen: {
    badge: 'Secondary Pathway',
    title: 'Lean Six Sigma Pathway',
    description:
      'Process improvement, waste reduction, and measurable operational performance gains.',
    cta: T169_CTAS.waitlist,
  },
  pmiRmp: {
    badge: 'Secondary Pathway',
    title: 'PMI-RMP Risk Management Pathway',
    description:
      'Risk identification, response planning, and uncertainty management for project leaders.',
    cta: T169_CTAS.waitlist,
  },
} as const;

export const T169_PMP_PAGE = {
  h1: 'PMP Certification: Credential & Exam Overview',
  intro:
    'The PMP is PMI’s flagship project management credential. This page summarizes the credential and exam overview: eligibility signals, current exam structure after the 9 July 2026 update, and how PM Structure pathways support preparation without replacing PMI’s official rules.',
  disclaimer:
    'Last reviewed: 25 July 2026. PMP exam details, eligibility rules, and training requirements should always be verified with PMI. PM Structure is an independent exam-prep and readiness-support platform.',
  currentVsUpdatedHeading: 'Previous PMP Exam vs Current PMP Exam',
  currentVsUpdatedTable: `| Exam Version | Exam Route | Format | Domain Weights | PM Structure Guidance |
| --- | --- | --- | --- | --- |
| Previous (before 9 July 2026) | Historical | 180 questions, 230 minutes | People 42%, Process 50%, BE 8% | Historical reference only; no longer offered. |
| Current (from 9 July 2026) | Active | 180 questions, 240 minutes | People 33%, Process 41%, BE 26% | Use the PMP 2026 pathway and align study to the current exam structure. |`,
  domainHeading: 'What changed in the current PMP exam?',
  domainBody:
    'The current PMP exam (updated July 2026) keeps the focus on practical project leadership, but the domain balance changed. The Business Environment domain became much more important, and the exam gives more attention to value, outcomes, AI, sustainability, stakeholder engagement, and real project dynamics.',
  domainTable: `| Domain | Current Weight |
| --- | ---: |
| People | 33% |
| Process | 41% |
| Business Environment | 26% |`,
  domainNote:
    'This section is a study-planning summary only. Always verify the official exam content outline and candidate guidance with PMI before booking the exam.',
} as const;

export const T169_SUPPORT_COPY = {
  membership:
    'Unlock tools, community access, and certification discounts while you prepare.',
  community:
    'Join structured study circles, peer discussions, and live sessions on Skool.',
  resourceStore:
    'Professional utilities designed to streamline your certification journey and career advancement.',
} as const;

export const T169_SEO = {
  homeTitle: 'PMP 2026 Preparation & Certification Pathways | PM Structure',
  homeDescription:
    'PM Structure provides independent project-management certification preparation, PMP 2026 readiness support, pathway guidance, study planning, and practical project-management learning.',
  pmpTitle: 'PMP 2026 Readiness Pathway | PM Structure',
  pmpDescription:
    'Prepare for PMP with independent readiness support, eligibility guidance, study planning, mock tracking, and structured preparation from PM Structure.',
} as const;

export const T169_FEATURED_PATHWAYS = {
  title: 'Featured Pathways',
  subtitle:
    'PMP 2026 is the flagship pathway; compare other certifications when you are ready.',
} as const;

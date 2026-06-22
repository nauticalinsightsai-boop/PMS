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

/** Post–9 July 2026 transition banner (Jul 9 schedule row). Verify dates on PMI.org. */
export const PMP_EXAM_2026_LIVE_BANNER = {
  message:
    'The updated PMP exam is now live (from 9 July 2026). Confirm scheduling dates, eligibility, and the current exam content outline on PMI.org before you book.',
  ctaLabel: 'Get My PMP Roadmap',
  ctaHref: '/certifications/pmp#cert-roadmap-form',
} as const;

export const T169_HERO = {
  eyebrow: 'PMP 2026 Readiness Pathway',
  h1: 'Prepare for the PMP exam change with a clear route, not random study noise.',
  body: 'The PMP exam changes on 9 July 2026. PM Structure helps working professionals decide whether they are preparing for the current or updated exam, map their eligibility, organize study effort, and track readiness with mentor-led structure.',
  microcopy:
    'Independent exam-prep and readiness support. PM Structure is not PMI and does not issue PMI certifications. Always verify exam rules and eligibility with PMI before applying or booking.',
} as const;

export const T169_NINETY_DAY_FOCUS = {
  label: '90-Day Focus',
  heading: 'PM Structure is prioritizing PMP 2026 readiness first.',
  body: 'For the next 90 days, the main PM Structure pathway is PMP 2026 readiness. The exam transition creates immediate decisions for candidates: whether to sit before the change, prepare for the updated exam, or rebuild their study plan around the new content outline.\n\nOther certification pathways remain available for comparison, guidance, and waitlist interest, but PMP 2026 is the flagship offer until the first funnel is proven.',
  bullets: [
    'Decide whether the current or updated PMP exam route fits your timeline.',
    'Map eligibility and training-hour requirements without overclaiming approval.',
    'Build a structured study plan instead of jumping between random resources.',
    'Track mock performance, weak areas, and readiness before booking the exam.',
    'Use mentor-led structure where self-study alone is not enough.',
  ],
} as const;

export const T169_ROADMAP_STEPS = {
  heading: 'How the PMP 2026 roadmap works',
  steps: [
    {
      title: 'Check your route',
      body: 'We check whether your target date points toward the current PMP exam or the updated PMP exam from 9 July 2026 onward.',
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
    'Candidates confused by the July 2026 PMP exam change.',
    'Candidates unsure whether to prepare for the current or updated exam.',
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
    question: 'Is the PMP exam changing in 2026?',
    answer:
      'Yes. PMI states that the updated PMP exam launches on 9 July 2026. Candidates planning to sit before 8 July 2026 should prepare for the current exam. Candidates planning to sit from 9 July 2026 onward should prepare for the updated exam content outline.',
  },
  {
    question: 'Should I prepare for the current PMP exam or the updated PMP exam?',
    answer:
      'It depends on your exam timeline, eligibility, study progress, and mock performance. If you are ready to sit before 8 July 2026, the current exam may still be relevant. If your realistic exam date is 9 July 2026 or later, your preparation should align with the updated PMP exam structure.',
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
    question: 'Should engineers prepare for the current or updated PMP exam?',
    answer:
      'Use your realistic exam date. If you can sit before 8 July 2026, prepare for the current exam. If your date is 9 July 2026 or later, align study to the updated exam content outline. Start with the PMP 2026 roadmap before locking a date.',
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
    question: 'What if my exam date is close to the July 2026 change?',
    answer:
      'Treat the transition as a routing decision, not a panic deadline. Compare current vs updated exam preparation before you book.',
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
  h1: 'PMP 2026 Readiness Pathway',
  intro:
    'The PMP exam changes on 9 July 2026. This pathway helps you decide whether to prepare for the current exam or the updated exam, then gives you a structured plan to study, practice, and track readiness.',
  disclaimer:
    'Last reviewed: 19 June 2026. PMP exam details, eligibility rules, and training requirements should always be verified with PMI. PM Structure is an independent exam-prep and readiness-support platform.',
  currentVsUpdatedHeading: 'Current PMP vs Updated PMP Exam',
  currentVsUpdatedTable: `| Candidate Situation | Exam Route | What to Prepare For | PM Structure Guidance |
| --- | --- | --- | --- |
| Sitting before 8 July 2026 | Current PMP exam | Current exam content outline, 180 questions, 230 minutes | Use a focused sprint plan and confirm readiness before booking. |
| Sitting from 9 July 2026 onward | Updated PMP exam | Updated exam content outline, 180 questions, 240 minutes, revised domain weights | Use the PMP 2026 pathway and align study to the updated exam structure. |
| Not sure when to sit | Decision route | Eligibility, timeline, study availability, mock performance, and confidence level | Start with the PMP 2026 roadmap before choosing an exam date. |`,
  domainHeading: 'What changes in the updated PMP exam?',
  domainBody:
    'The updated PMP exam keeps the focus on practical project leadership, but the domain balance changes. The Business Environment domain becomes much more important, and the exam gives more attention to value, outcomes, AI, sustainability, stakeholder engagement, and real project dynamics.',
  domainTable: `| Domain | Updated Weight |
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
  homeTitle: 'PM Structure | PMP 2026 Readiness & Project Certification Pathways',
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

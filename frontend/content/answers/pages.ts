import type { AnswerPageContent } from './types';

const pages: AnswerPageContent[] = [
  {
    slug: 'is-the-pmp-exam-changing-in-2026',
    path: '/answers/is-the-pmp-exam-changing-in-2026',
    question: 'Is the PMP exam changing in 2026?',
    title: 'Is the PMP Exam Changing in 2026? | PM Structure',
    description:
      'The PMP exam changed in July 2026. Learn what changed, how to prepare for the current exam, and where to verify official PMI guidance.',
    shortAnswer:
      'The updated PMP exam launched on 9 July 2026. This is now the current exam for all candidates. Confirm dates and scope on PMI.org before scheduling.',
    detailedAnswer:
      'The PMP credential itself is not going away, but PMI completed a transition to an updated exam experience on 9 July 2026. Download the current PMP handbook and Exam Content Outline from PMI.org to map your study plan.',
    whoApplies: 'Anyone planning PMP readiness in 2026, especially new candidates starting preparation.',
    nextSteps: [
      'Read the PM Structure PMP 2026 guide at /pmp-exam-2026',
      'Compare the previous and current exam at /pmp-current-vs-new-exam',
      'Verify official PMI dates before booking Pearson VUE',
    ],
    relatedCourses: [
      { href: '/pmp-foundation', label: 'PMP Foundation pathway' },
      { href: '/pmp-professional', label: 'PMP Professional pathway' },
    ],
    relatedPages: [
      { href: '/certifications/pmp', label: 'PMP 2026 Readiness Pathway' },
      { href: '/pmp-exam-2026', label: 'PMP exam 2026 guide' },
      { href: '/faq', label: 'PM Structure FAQ' },
      { href: '/pmp-exam-2026', label: 'PMP exam 2026 hub guide' },
      { href: '/pmp-exam-timeline-2026', label: '2026 timeline' },
    ],
    relatedAnswers: [
      { href: '/answers/when-does-the-new-pmp-exam-start', label: 'When does the new PMP exam start?' },
      { href: '/pmp-after-9-july-2026', label: 'How should I prepare for the current PMP exam?' },
    ],
    dateModified: '2026-06-19',
    references: [
      {
        label: 'PMI: PMP certification',
        url: 'https://www.pmi.org/certifications/project-management-pmp',
      },
      {
        label: 'PMI: updated PMP exam',
        url: 'https://www.pmi.org/certifications/project-management-pmp/new-exam',
      },
    ],
    ctaHref: '/certifications/pmp#cert-roadmap-form',
    ctaLabel: 'Get My PMP Roadmap',
    faqs: [
      {
        question: 'Does PM Structure guarantee what will be on my exam?',
        answer: 'No. We provide independent preparation support; always verify official PMI materials.',
      },
    ],
  },
  {
    slug: 'when-does-the-new-pmp-exam-start',
    path: '/answers/when-does-the-new-pmp-exam-start',
    question: 'When does the new PMP exam start?',
    title: 'When does the new PMP exam start?',
    description:
      'The updated PMP exam launched 9 July 2026 and is now the current exam. Verify scheduling with PMI and Pearson VUE.',
    shortAnswer:
      'The updated PMP exam launched 9 July 2026. This is now the current exam for all candidates booking on PMI.org.',
    detailedAnswer:
      'Exam transition dates are set by PMI. The updated format launched 9 July 2026 and is now the standard PMP exam. Verify the live handbook and Pearson VUE scheduling screens for your region before booking.',
    whoApplies: 'All PMP candidates scheduling exams in 2026 and beyond.',
    nextSteps: [
      'Review /pmp-exam-timeline-2026',
      'Use /pmp-after-9-july-2026 to reset your preparation for the current exam',
      'Confirm seat availability at Pearson VUE',
    ],
    relatedCourses: [{ href: '/pmp-professional', label: 'PMP Professional pathway' }],
    relatedPages: [{ href: '/pmp-exam-timeline-2026', label: 'PMP 2026 timeline' }],
    relatedAnswers: [
      { href: '/answers/is-the-pmp-exam-changing-in-2026', label: 'Is the PMP exam changing in 2026?' },
    ],
    ctaHref: '/pmp-exam-2026',
    ctaLabel: 'Read the full 2026 guide',
  },
  {
    slug: 'should-i-take-pmp-before-8-july-2026',
    path: '/answers/should-i-take-pmp-before-8-july-2026',
    question: 'Should I take the PMP before 8 July 2026?',
    title: 'Should I take the PMP before 8 July 2026? (Historical)',
    description:
      'Historical timing guidance for candidates who considered the previous PMP format before the July 2026 transition.',
    shortAnswer:
      'Historical: This question applied before 9 July 2026. The previous exam is no longer offered. Prepare for the current exam using the [PMP 2026 guide](/pmp-exam-2026).',
    detailedAnswer:
      'This was a timing decision for candidates eligible before mid-2026. Candidates who had completed ECO coverage, strong mock scores, and could secure slots before the transition often preferred the pre-transition window. This option is no longer available. Current candidates should prepare for the updated exam (launched July 2026).',
    whoApplies: 'Historical reference: no longer applicable for current candidates.',
    nextSteps: [
      'Read /pmp-after-9-july-2026',
      'Run /pmp-readiness-diagnostic',
      'Book only after two solid timed mocks',
    ],
    relatedCourses: [
      { href: '/pmp-professional', label: 'PMP Professional' },
      { href: '/pmp-mastery', label: 'PMP Mastery' },
    ],
    relatedPages: [{ href: '/pmp-after-9-july-2026', label: 'Current PMP preparation guide' }],
    relatedAnswers: [
      { href: '/answers/should-i-prepare-for-new-pmp-after-9-july-2026', label: 'Prepare after 9 July 2026?' },
    ],
    ctaHref: '/pmp-mock-exam',
    ctaLabel: 'Mock exam guidance',
  },
  {
    slug: 'should-i-prepare-for-new-pmp-after-9-july-2026',
    path: '/answers/should-i-prepare-for-new-pmp-after-9-july-2026',
    question: 'Should I prepare for the new PMP after 9 July 2026?',
    title: 'Preparing for the current PMP exam (updated July 2026)',
    description:
      'How to prepare for the current PMP exam using the updated exam content outline (from 9 July 2026).',
    shortAnswer:
      'Prepare for the current PMP exam, which launched 9 July 2026. Align preparation to the updated exam content outline and revised domain weights.',
    detailedAnswer:
      'Current PMP preparation should emphasize situational judgment, professional responsibility, and modern delivery contexts (including agile, hybrid, and emerging themes referenced in updated PMI materials). Use scenario practice and mocks rather than memorization-only study.',
    whoApplies: 'All current PMP candidates scheduling exams in 2026 and beyond.',
    nextSteps: [
      'Read /pmp-after-9-july-2026',
      'Use /pmp-study-plan-2026 for weekly structure',
      'Increase scenario volume via /pmp-scenario-practice',
    ],
    relatedCourses: [{ href: '/pmp-mastery', label: 'PMP Mastery pathway' }],
    relatedPages: [
      { href: '/pmp-after-9-july-2026', label: 'Current exam preparation guide' },
      { href: '/pmp-agile-hybrid-predictive', label: 'Agile, hybrid & predictive' },
    ],
    relatedAnswers: [
      { href: '/pmp-after-9-july-2026', label: 'Prepare for the current PMP exam' },
    ],
    ctaHref: '/pmp-professional',
    ctaLabel: 'Explore Professional pathway',
  },
  {
    slug: 'what-is-the-pmp-business-environment-domain',
    path: '/answers/what-is-the-pmp-business-environment-domain',
    question: 'What is the PMP Business Environment domain?',
    title: 'What is the PMP Business Environment domain?',
    description:
      'Plain-language explanation of the PMP Business Environment domain and how to study it for 2026.',
    shortAnswer:
      'The Business Environment domain covers organizational context, benefits, compliance, value delivery, and how project decisions support business outcomes.',
    detailedAnswer:
      'In situational PMP questions, Business Environment often tests whether you connect delivery choices to benefits, governance, and stakeholder expectations: not only schedule and budget mechanics. Study it alongside People and Process, and verify task lists in the current PMI Exam Content Outline.',
    whoApplies: 'All PMP candidates, especially those who underestimate non-technical scenarios.',
    nextSteps: [
      'Read /pmp-business-environment-domain',
      'Log mock errors tagged to Business Environment',
      'Review /pmp-ai-sustainability-value-delivery for emerging themes',
    ],
    relatedCourses: [{ href: '/pmp-professional', label: 'PMP Professional pathway' }],
    relatedPages: [
      { href: '/pmp-business-environment-domain', label: 'Business Environment deep dive' },
      { href: '/pmp-new-exam-domain-weighting', label: 'Domain weighting orientation' },
    ],
    relatedAnswers: [
      { href: '/answers/what-is-the-pmp-exam-content-outline', label: 'What is the PMP ECO?' },
    ],
    ctaHref: '/pmp-scenario-practice',
    ctaLabel: 'Scenario practice overview',
  },
  {
    slug: 'how-to-prepare-for-pmp-in-2026',
    path: '/answers/how-to-prepare-for-pmp-in-2026',
    question: 'How do I prepare for the PMP in 2026?',
    title: 'How to prepare for the PMP in 2026',
    description:
      'Step-by-step PMP 2026 preparation: timing, ECO mapping, pathways, mocks, and official verification.',
    shortAnswer:
      'Confirm eligibility, use the current PMI handbook and Exam Content Outline, map the ECO to a weekly plan, pick a pathway tier, and use mocks plus scenario practice before Pearson VUE.',
    detailedAnswer:
      'Start with official PMI eligibility and current handbook rules. Build a weekly schedule that covers all current exam domains, includes timed mocks, and logs weak areas. PM Structure pathways (Foundation, Professional, Mastery) provide structure but do not replace official registration or exam delivery.',
    whoApplies: 'New and experienced project managers targeting PMP in calendar year 2026.',
    nextSteps: [
      'Start at /pmp-exam-2026',
      'Use /pmp-study-plan-2026',
      'Take /pmp-readiness-diagnostic',
    ],
    relatedCourses: [
      { href: '/pmp-foundation', label: 'Foundation' },
      { href: '/pmp-professional', label: 'Professional' },
      { href: '/pmp-mastery', label: 'Mastery' },
    ],
    relatedPages: [{ href: '/pmp', label: 'PMP hub' }],
    relatedAnswers: [
      { href: '/answers/how-long-does-pmp-preparation-take', label: 'How long does PMP prep take?' },
      { href: '/answers/what-is-pmp-readiness', label: 'What is PMP readiness?' },
    ],
    ctaHref: '/pmp-enrollment',
    ctaLabel: 'View enrollment options',
  },
  {
    slug: 'what-is-pmp-readiness',
    path: '/answers/what-is-pmp-readiness',
    question: 'What is PMP readiness?',
    title: 'What is PMP readiness?',
    description:
      'Definition of PMP exam readiness: mocks, domains, situational judgment, and when to schedule.',
    shortAnswer:
      'PMP readiness means consistent performance on timed mocks, ECO coverage, and confidence in situational judgment: not only finishing course videos.',
    detailedAnswer:
      'Readiness is multidimensional: eligibility approved by PMI, study hours completed, domain weak spots remediated, and stable mock scores near your target. PM Structure offers a readiness diagnostic and pathway tiers to structure this process; outcomes still depend on your experience and exam-day execution.',
    whoApplies: 'Candidates deciding when to schedule Pearson VUE.',
    nextSteps: [
      'Use /pmp-readiness-diagnostic',
      'Review /pmp-mock-exam guidance',
      'Pick a tier at /pmp-enrollment',
    ],
    relatedCourses: [{ href: '/pmp-mastery', label: 'PMP Mastery' }],
    relatedPages: [
      { href: '/pmp-readiness-diagnostic', label: 'Readiness diagnostic page' },
      { href: '/topics/exam-readiness', label: 'Exam readiness hub' },
    ],
    relatedAnswers: [
      { href: '/answers/what-is-pmp-scenario-practice', label: 'What is scenario practice?' },
    ],
    references: [
      {
        label: 'PMI PMP Examination Content Outline — July 2026',
        url: 'https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/new-pmp-examination-content-outline-2026.pdf',
      },
    ],
    ctaHref: '/pmp-readiness-diagnostic',
    ctaLabel: 'Start readiness diagnostic',
  },
  {
    slug: 'how-long-does-pmp-preparation-take',
    path: '/answers/how-long-does-pmp-preparation-take',
    question: 'How long does PMP preparation take?',
    title: 'How long does PMP preparation take?',
    description:
      'Typical PMP study duration by pathway tier and factors that shorten or lengthen prep.',
    shortAnswer:
      'Many candidates need several weeks to a few months. PM Structure catalogue guides suggest roughly 2 weeks (Foundation), 6 weeks (Professional), and 12 weeks (Mastery): your pace may differ.',
    detailedAnswer:
      'Duration depends on prior PM experience, weekly study hours, English proficiency, and how quickly you stabilize mock scores. Treat published week ranges as planning guides, not guarantees. Faster timelines are possible for experienced PMs; career-changers often need longer scenario practice.',
    whoApplies: 'Anyone building a 2026 study calendar or employer-sponsored plan.',
    nextSteps: [
      'See /certifications/pmp for tier windows',
      'Build a calendar with /pmp-study-plan-2026',
      'Reassess monthly with mocks',
    ],
    relatedCourses: [
      { href: '/pmp-foundation', label: 'Foundation (~2 weeks guide)' },
      { href: '/pmp-professional', label: 'Professional (~6 weeks guide)' },
    ],
    relatedPages: [{ href: '/pmp-study-plan-2026', label: 'Study plan 2026' }],
    relatedAnswers: [
      { href: '/answers/how-to-prepare-for-pmp-in-2026', label: 'How to prepare for PMP in 2026' },
    ],
    ctaHref: '/faq?tab=pmp-2026',
    ctaLabel: 'Browse PMP FAQs',
  },
  {
    slug: 'what-is-pmp-scenario-practice',
    path: '/answers/what-is-pmp-scenario-practice',
    question: 'What is PMP scenario practice?',
    title: 'What is PMP scenario practice?',
    description:
      'Explanation of situational PMP practice and how it fits Foundation, Professional, and Mastery tiers.',
    shortAnswer:
      'Scenario practice trains how you apply PM concepts in exam-style situations: a core skill for the current PMP exam.',
    detailedAnswer:
      'Instead of isolated definitions, scenarios present a project situation and ask what you should do next. Effective practice tags mistakes by domain (People, Process, Business Environment) and revisits weak ECO tasks. PM Structure provides scenario sets within Professional and Mastery pathways.',
    whoApplies: 'Candidates who understand theory but miss application-style questions on mocks.',
    nextSteps: [
      'Read /pmp-scenario-practice',
      'Upgrade to /pmp-professional when baseline content is done',
      'Pair scenarios with /pmp-mock-exam cadence',
    ],
    relatedCourses: [
      { href: '/pmp-professional', label: 'Professional pathway' },
      { href: '/pmp-mastery', label: 'Mastery pathway' },
    ],
    relatedPages: [{ href: '/pmp-scenario-practice', label: 'Scenario practice page' }],
    relatedAnswers: [
      { href: '/answers/what-is-pmp-readiness', label: 'What is PMP readiness?' },
    ],
    ctaHref: '/pmp-scenario-practice',
    ctaLabel: 'Scenario practice overview',
  },
  {
    slug: 'what-is-the-pmp-exam-content-outline',
    path: '/answers/what-is-the-pmp-exam-content-outline',
    question: 'What is the PMP Exam Content Outline (ECO)?',
    title: 'What is the PMP Exam Content Outline?',
    description:
      'What the PMP ECO is, where to download it, and how to use it in a 2026 study plan.',
    shortAnswer:
      'The ECO is PMI’s published list of domains and tasks used to build the PMP exam. Download the current version from PMI.org and map every study week to it.',
    detailedAnswer:
      'Third-party summaries cannot replace the official ECO PDF. Use the current version to build a coverage checklist, allocate hours by domain, and audit mock mistakes. Replace any pre-transition 2026 material that no longer matches the current outline.',
    whoApplies: 'Every PMP candidate at the start of preparation.',
    nextSteps: [
      'Download the ECO from PMI.org',
      'Map tasks using /pmp-study-plan-2026',
      'Review domain pages on /pmp',
    ],
    relatedCourses: [{ href: '/pmp-foundation', label: 'PMP Foundation' }],
    relatedPages: [
      { href: '/pmp-new-exam-domain-weighting', label: 'Domain weighting orientation' },
      { href: '/pmp-people-domain', label: 'People domain' },
    ],
    relatedAnswers: [
      { href: '/answers/what-is-the-pmp-business-environment-domain', label: 'Business Environment domain' },
    ],
    ctaHref: '/pmp-exam-2026',
    ctaLabel: 'PMP 2026 guide',
  },
  {
    slug: 'is-pm-structure-an-official-pmi-atp',
    path: '/answers/is-pm-structure-an-official-pmi-atp',
    question: 'Is PM Structure a PMI Authorized Training Partner (ATP)?',
    title: 'Is PM Structure a PMI ATP?',
    description:
      'Clarifies PM Structure’s independent exam-prep status and PMI ATP positioning.',
    shortAnswer:
      'No: unless formally confirmed on a live page, PM Structure is an independent exam-preparation platform, not a PMI Authorized Training Partner.',
    detailedAnswer:
      'We provide structured pathways, LMS access, and practice support. PMI owns the PMP credential, exam delivery, and ATP program. Do not assume ATP benefits (such as specific contact-hour claims) unless explicitly stated on the relevant live page and your order confirmation.',
    whoApplies: 'Anyone comparing PMP providers and contact-hour claims.',
    nextSteps: [
      'Read pricing disclaimers at /legal/pricing-disclaimers',
      'Review /certifications/pmp pathways',
      'Verify PMI requirements on PMI.org',
    ],
    relatedCourses: [{ href: '/pmp-foundation', label: 'PMP Foundation' }],
    relatedPages: [{ href: '/faq?tab=about-pathways', label: 'About & pathways FAQs' }],
    relatedAnswers: [
      { href: '/answers/does-pm-structure-guarantee-pmp-success', label: 'Does PM Structure guarantee PMP success?' },
      { href: '/answers/pmp-training-hours-vs-pdus', label: 'PMP training hours vs PDUs' },
    ],
    ctaHref: '/legal/pricing-disclaimers',
    ctaLabel: 'Pricing disclaimers',
  },
  {
    slug: 'pmp-training-hours-vs-pdus',
    path: '/answers/pmp-training-hours-vs-pdus',
    question: 'Are PMP training hours the same as PDUs?',
    title: 'PMP Training Hours vs PDUs | PM Structure',
    description:
      'Direct answer on PMP eligibility training-hour language versus PDUs used for maintaining PMI credentials.',
    shortAnswer:
      'No. PMP eligibility refers to project management education or training hours. PDUs are generally used after you earn a PMI credential to maintain it.',
    detailedAnswer:
      'Confusing training hours with PDUs is a common application mistake. For PMP eligibility, use PMI’s current language on project management education or commercial training hours and verify requirements on PMI.org before applying. PM Structure helps candidates understand the training-hour requirement and organize preparation records; it does not issue PMI credentials or guarantee eligibility approval.',
    whoApplies: 'PMP candidates preparing applications and comparing provider marketing copy.',
    nextSteps: [
      'Read eligibility guidance on /pmp-exam-2026#eligibility-training-hours',
      'Review /faq for training-hour FAQs',
      'Verify current PMI eligibility rules before applying',
    ],
    relatedCourses: [
      { href: '/pmp-foundation', label: 'PMP Foundation pathway' },
      { href: '/pmp-professional', label: 'PMP Professional pathway' },
    ],
    relatedPages: [
      { href: '/certifications/pmp', label: 'PMP 2026 Readiness Pathway' },
      { href: '/legal/pricing-disclaimers', label: 'Pricing disclaimers' },
      { href: '/pmp-exam-2026', label: 'PMP exam 2026 guide' },
    ],
    relatedAnswers: [
      { href: '/answers/is-pm-structure-an-official-pmi-atp', label: 'Is PM Structure a PMI ATP?' },
      { href: '/answers/does-pm-structure-guarantee-pmp-success', label: 'Does PM Structure guarantee a PMP pass?' },
    ],
    dateModified: '2026-06-19',
    references: [
      {
        label: 'PMI: PMP certification',
        url: 'https://www.pmi.org/certifications/project-management-pmp',
      },
    ],
    ctaHref: '/certifications/pmp#cert-roadmap-form',
    ctaLabel: 'Get My PMP Roadmap',
    faqs: [
      {
        question: 'Does PM Structure provide 35 hours of project management education for PMP eligibility?',
        answer:
          'PM Structure can help candidates understand the PMP training-hour requirement and organize their preparation record. Contact-hour or training-hour eligibility is stated only where formally approved. Verify current requirements with PMI before applying.',
      },
    ],
  },
  {
    slug: 'does-pm-structure-guarantee-pmp-success',
    path: '/answers/does-pm-structure-guarantee-pmp-success',
    question: 'Does PM Structure guarantee a PMP pass?',
    title: 'Does PM Structure guarantee a PMP pass?',
    description:
      'Independent answer on exam outcomes, preparation support, and what PM Structure does not promise.',
    shortAnswer: 'No. PM Structure does not guarantee PMP exam passage.',
    detailedAnswer:
      'Exam results depend on your experience, study discipline, mock performance, and test-day conditions. We provide structured preparation: not official exam items, not PMI registration services, and not outcome guarantees.',
    whoApplies: 'Candidates evaluating training providers and refund/guarantee marketing.',
    nextSteps: [
      'Use /pmp-readiness-diagnostic for pathway fit',
      'Track mocks via /pmp-mock-exam guidance',
      'Read /legal/terms',
    ],
    relatedCourses: [{ href: '/pmp-mastery', label: 'PMP Mastery' }],
    relatedPages: [{ href: '/pmp-q-and-a-support', label: 'Q&A support boundaries' }],
    relatedAnswers: [
      { href: '/answers/is-pm-structure-an-official-pmi-atp', label: 'Is PM Structure an official PMI ATP?' },
    ],
    ctaHref: '/pmp-readiness-diagnostic',
    ctaLabel: 'Assess readiness',
  },
  {
    slug: 'how-does-regional-pricing-work-for-pmp',
    path: '/answers/how-does-regional-pricing-work-for-pmp',
    question: 'How does regional pricing work for PMP on PM Structure?',
    title: 'How does regional PMP pricing work?',
    description:
      'Regional scholarship pricing, USD checkout, and what is excluded from PMP tuition.',
    shortAnswer:
      'Regional scholarship tiers depend on verified residence and billing country. Checkout is processed in USD equivalent. Official PMI exam fees are excluded.',
    detailedAnswer:
      'Displayed regional tuition on /certifications/pmp may change with cohort or offers. Scholarship pricing applies only when qualification rules are met. Membership discounts, if shown, apply to platform tuition: not PMI exam fees. Full policy: /legal/regional-pricing.',
    whoApplies: 'International candidates comparing tuition across regions.',
    nextSteps: [
      'Read /legal/regional-pricing',
      'Select region on /certifications/pmp',
      'Continue via /pmp-enrollment',
    ],
    relatedCourses: [
      { href: '/pmp-foundation', label: 'Foundation pricing context' },
      { href: '/pmp-professional', label: 'Professional pricing context' },
    ],
    relatedPages: [{ href: '/legal/pricing-disclaimers', label: 'Pricing disclaimers' }],
    relatedAnswers: [],
    ctaHref: '/certifications/pmp',
    ctaLabel: 'View PMP pathways',
  },
  {
    slug: 'when-do-i-get-lms-access-after-pmp-enrollment',
    path: '/answers/when-do-i-get-lms-access-after-pmp-enrollment',
    question: 'When do I get LMS access after PMP enrollment?',
    title: 'When do I get LMS access after PMP enrollment?',
    description:
      'LMS provisioning timeline and what happens after PMP pathway checkout.',
    shortAnswer:
      'After enrollment is confirmed, learners receive access through the PM Structure learning environment. Timing depends on payment confirmation and onboarding steps in your welcome email.',
    detailedAnswer:
      'Checkout and payment confirmation routes are excluded from search indexing. Private cohort channels and mentor areas are not public pages. If access is delayed, email support@pmstructure.com with your order email.',
    whoApplies: 'New enrollees in Foundation, Professional, or Mastery tiers.',
    nextSteps: [
      'Complete checkout via /pmp-enrollment',
      'Check spam for welcome email',
      'Review tier page for included components',
    ],
    relatedCourses: [
      { href: '/pmp-foundation', label: 'Foundation LMS overview' },
      { href: '/pmp-professional', label: 'Professional LMS overview' },
    ],
    relatedPages: [{ href: '/pmp-enrollment', label: 'Enrollment hub' }],
    relatedAnswers: [],
    ctaHref: '/contact',
    ctaLabel: 'Contact support',
  },
  {
    slug: 'what-is-the-difference-between-pmp-foundation-professional-and-mastery',
    path: '/answers/what-is-the-difference-between-pmp-foundation-professional-and-mastery',
    question: 'What is the difference between PMP Foundation, Professional, and Mastery?',
    title: 'PMP Foundation vs Professional vs Mastery',
    description:
      'Compare PM Structure PMP pathway tiers: fit, practice depth, and when to choose each.',
    shortAnswer:
      'Foundation orients new candidates; Professional adds structured scenario practice and mocks; Mastery provides intensive final preparation and weak-area remediation.',
    detailedAnswer:
      'Foundation is for baseline ECO coverage and study planning. Professional suits active exam prep within roughly 6-12 weeks. Mastery is for high-volume practice and exam-week discipline. Use the comparison table on /pmp and the readiness diagnostic if unsure.',
    whoApplies: 'Candidates choosing their first PMP pathway tier.',
    nextSteps: [
      'Compare on /pmp',
      'Read each tier page',
      'Take /pmp-readiness-diagnostic',
    ],
    relatedCourses: [
      { href: '/pmp-foundation', label: 'Foundation' },
      { href: '/pmp-professional', label: 'Professional' },
      { href: '/pmp-mastery', label: 'Mastery' },
    ],
    relatedPages: [{ href: '/certifications/pmp', label: 'PMP certification page' }],
    relatedAnswers: [
      { href: '/answers/what-is-pmp-readiness', label: 'What is PMP readiness?' },
    ],
    ctaHref: '/pmp-enrollment',
    ctaLabel: 'Choose a pathway',
  },
  {
    slug: 'what-are-the-pmp-eligibility-requirements',
    path: '/answers/what-are-the-pmp-eligibility-requirements',
    question: 'What are the PMP eligibility requirements?',
    title: 'What are the PMP eligibility requirements?',
    description:
      'Independent overview of PMI PMP eligibility: experience hours, education, and how to verify before applying.',
    shortAnswer:
      'PMI requires a combination of project leadership experience and education (35 contact hours for most applicants). Exact rules change: verify on PMI.org before you apply.',
    detailedAnswer:
      'PM Structure does not grant eligibility. Use PMI’s eligibility calculator and handbook. Our pathways assume you are pursuing or have met PMI requirements before scheduling Pearson VUE.',
    whoApplies: 'Anyone researching whether they can apply for the PMP.',
    nextSteps: [
      'Confirm eligibility on PMI.org',
      'Read /certifications/pmp',
      'Take /pmp-readiness-diagnostic',
    ],
    relatedCourses: [{ href: '/pmp-foundation', label: 'PMP Foundation' }],
    relatedPages: [{ href: '/pmp-exam-2026', label: 'PMP 2026 guide' }],
    relatedAnswers: [{ href: '/answers/how-to-prepare-for-pmp-in-2026', label: 'How to prepare in 2026' }],
    ctaHref: '/certifications/pmp',
    ctaLabel: 'View PMP pathway',
  },
  {
    slug: 'what-is-the-pmp-people-domain',
    path: '/answers/what-is-the-pmp-people-domain',
    question: 'What is the PMP People domain?',
    title: 'What is the PMP People domain?',
    description: 'Explain the People domain in the PMP Exam Content Outline and how to study it.',
    shortAnswer:
      'The People domain covers leadership, team performance, conflict, and stakeholder engagement: a core third of the PMP ECO.',
    detailedAnswer:
      'Study People alongside Process and Business Environment using scenario practice, not definition memorization alone. Domain weights are published by PMI: verify the current ECO before exam day.',
    whoApplies: 'PMP candidates mapping study time across ECO domains.',
    nextSteps: ['Read /pmp-people-domain', 'Use /pmp-scenario-practice', 'Review /topics/pmp-exam-preparation'],
    relatedCourses: [{ href: '/pmp-professional', label: 'PMP Professional' }],
    relatedPages: [{ href: '/pmp-people-domain', label: 'People domain guide' }],
    relatedAnswers: [
      { href: '/answers/what-is-the-pmp-business-environment-domain', label: 'Business Environment domain' },
    ],
    ctaHref: '/pmp-study-plan-2026',
    ctaLabel: '2026 study plan',
  },
  {
    slug: 'what-is-the-pmp-process-domain',
    path: '/answers/what-is-the-pmp-process-domain',
    question: 'What is the PMP Process domain?',
    title: 'What is the PMP Process domain?',
    description: 'Explain the Process domain in the PMP ECO and preparation focus on PM Structure.',
    shortAnswer:
      'The Process domain addresses delivery, scope, schedule, cost, quality, risk, and integration: often the largest ECO weight.',
    detailedAnswer:
      'Candidates should connect Process tasks to situational judgment questions. Use timed mocks after covering People and Business Environment themes.',
    whoApplies: 'PMP applicants building a domain-based study plan.',
    nextSteps: ['Read /pmp-process-domain', 'Schedule /pmp-mock-exam', 'Read /topics/pmp-scenario-practice'],
    relatedCourses: [{ href: '/pmp-mastery', label: 'PMP Mastery' }],
    relatedPages: [{ href: '/pmp-process-domain', label: 'Process domain guide' }],
    relatedAnswers: [{ href: '/answers/what-is-pmp-scenario-practice', label: 'Scenario practice' }],
    ctaHref: '/pmp-professional',
    ctaLabel: 'Professional pathway',
  },
  {
    slug: 'what-is-pmp-mock-exam-practice',
    path: '/answers/what-is-pmp-mock-exam-practice',
    question: 'What is PMP mock exam practice?',
    title: 'What is PMP mock exam practice?',
    description: 'How timed PMP mocks build readiness and when to use them on PM Structure.',
    shortAnswer:
      'Mock exams simulate timed PMP-style scenarios so you practice judgment under pressure: not just content recall.',
    detailedAnswer:
      'Use mocks after domain coverage and when scores stabilize. PM Structure publishes mock guidance on /pmp-mock-exam; we do not guarantee pass outcomes.',
    whoApplies: 'Candidates 4-8 weeks from their target exam window.',
    nextSteps: ['Read /pmp-mock-exam', 'Take /pmp-readiness-diagnostic', 'Review mock scores weekly'],
    relatedCourses: [{ href: '/pmp-mastery', label: 'PMP Mastery' }],
    relatedPages: [{ href: '/pmp-scenario-practice', label: 'Scenario practice' }],
    relatedAnswers: [{ href: '/answers/what-is-pmp-readiness', label: 'What is PMP readiness?' }],
    ctaHref: '/pmp-mock-exam',
    ctaLabel: 'Mock exam guide',
  },
  {
    slug: 'how-do-i-enroll-in-pmp-on-pm-structure',
    path: '/answers/how-do-i-enroll-in-pmp-on-pm-structure',
    question: 'How do I enroll in PMP on PM Structure?',
    title: 'How do I enroll in PMP on PM Structure?',
    description: 'Steps to choose a tier, complete checkout, and access LMS content.',
    shortAnswer:
      'Select a tier on /certifications/pmp or a dedicated course page, complete regional checkout, then follow LMS access instructions in your confirmation email.',
    detailedAnswer:
      'Enrollment URLs are noindex and session-specific. Start from /pmp-enrollment or the certification page, confirm regional tuition, then complete payment. Support can help with access issues at support@pmstructure.com.',
    whoApplies: 'Learners ready to purchase a PMP pathway tier.',
    nextSteps: ['Visit /pmp-enrollment', 'Compare tiers on /pmp', 'Read pricing disclaimers'],
    relatedCourses: [
      { href: '/pmp-foundation', label: 'Foundation' },
      { href: '/pmp-professional', label: 'Professional' },
    ],
    relatedPages: [
      { href: '/certifications/pmp', label: 'PMP certification page' },
      { href: '/legal/pricing-disclaimers', label: 'Pricing disclaimers' },
    ],
    relatedAnswers: [
      { href: '/answers/how-does-regional-pricing-work-for-pmp', label: 'Regional pricing' },
      { href: '/answers/when-do-i-get-lms-access-after-pmp-enrollment', label: 'LMS access timing' },
    ],
    ctaHref: '/certifications/pmp',
    ctaLabel: 'Start enrollment',
  },
  {
    slug: 'what-is-project-management-certification',
    path: '/answers/what-is-project-management-certification',
    question: 'What is project management certification?',
    title: 'What is project management certification?',
    description: 'Overview of PM credentials (PMP, PRINCE2, Six Sigma) and independent prep on PM Structure.',
    shortAnswer:
      'Project management certification validates experience and knowledge through third-party exams such as PMP, PRINCE2, or Lean Six Sigma belts.',
    detailedAnswer:
      'PM Structure offers independent exam preparation: not the official exam or credential itself. Compare pathways at /certifications and choose based on career goals, eligibility, and employer demand.',
    whoApplies: 'Career changers evaluating whether certification is worth pursuing.',
    nextSteps: ['Browse /certifications', 'Use /certifications/compare', 'Read /topics/project-management-certification'],
    relatedCourses: [{ href: '/pmp-foundation', label: 'PMP Foundation' }],
    relatedPages: [{ href: '/certifications', label: 'All pathways' }],
    relatedAnswers: [{ href: '/answers/how-to-prepare-for-pmp-in-2026', label: 'Prepare for PMP in 2026' }],
    ctaHref: '/certifications/compare',
    ctaLabel: 'Compare pathways',
  },
  {
    slug: 'what-is-prince2-certification',
    path: '/answers/what-is-prince2-certification',
    question: 'What is PRINCE2 certification?',
    title: 'What is PRINCE2 certification?',
    description: 'PRINCE2 Foundation and Practitioner explained for PM Structure learners.',
    shortAnswer:
      'PRINCE2 is a structured project management method with Foundation and Practitioner levels, administered by PeopleCert on behalf of AXELOS.',
    detailedAnswer:
      'PM Structure provides independent PRINCE2 exam preparation pathways. Official exams and fees are separate. See /certifications for PRINCE2 tiers and regional tuition.',
    whoApplies: 'Professionals comparing PRINCE2 vs PMI credentials.',
    nextSteps: ['View /certifications/prince2', 'Compare at /certifications/compare', 'Read /topics/prince2-preparation'],
    relatedCourses: [{ href: '/certifications/prince2', label: 'PRINCE2 pathway' }],
    relatedPages: [{ href: '/certifications', label: 'Certifications hub' }],
    relatedAnswers: [{ href: '/answers/what-is-project-management-certification', label: 'PM certification overview' }],
    ctaHref: '/certifications/prince2',
    ctaLabel: 'PRINCE2 pathway',
  },
  {
    slug: 'what-is-lean-six-sigma-green-belt',
    path: '/answers/what-is-lean-six-sigma-green-belt',
    question: 'What is Lean Six Sigma Green Belt?',
    title: 'What is Lean Six Sigma Green Belt?',
    description: 'Green Belt role, exam prep, and pathways on PM Structure.',
    shortAnswer:
      'Lean Six Sigma Green Belt certifies practitioners who lead process improvement projects using DMAIC and basic statistical tools.',
    detailedAnswer:
      'Green Belt is a common entry point before Black Belt. PM Structure offers structured preparation; verify exam body requirements for your chosen belt.',
    whoApplies: 'Process improvement professionals and engineers.',
    nextSteps: ['View /certifications/lss-green', 'Compare belts on /certifications', 'Read /topics/six-sigma-preparation'],
    relatedCourses: [{ href: '/certifications/lss-green', label: 'Green Belt pathway' }],
    relatedPages: [{ href: '/certifications/compare', label: 'Compare certifications' }],
    relatedAnswers: [{ href: '/answers/what-is-project-management-certification', label: 'PM certification overview' }],
    ctaHref: '/certifications/lss-green',
    ctaLabel: 'Green Belt pathway',
  },
  {
    slug: 'how-many-pmp-mock-exams-should-i-take',
    path: '/answers/how-many-pmp-mock-exams-should-i-take',
    question: 'How many PMP mock exams should I take?',
    title: 'How many PMP mock exams should I take?',
    description: 'Guidance on mock exam volume for PMP readiness on PM Structure.',
    shortAnswer:
      'Most candidates benefit from multiple timed mocks with error logging; exact count depends on baseline, exam date, and domain gaps.',
    detailedAnswer:
      'Use mocks to validate timing and situational judgment, not only knowledge recall. After each mock, log misses by domain and revisit ECO tasks before the next attempt.',
    whoApplies: 'PMP candidates using Professional or Mastery pathways.',
    nextSteps: ['Read /pmp-mock-exam', 'Use /pmp-scenario-practice', 'Run /pmp-readiness-diagnostic'],
    relatedCourses: [{ href: '/pmp-mastery', label: 'PMP Mastery' }],
    relatedPages: [{ href: '/pmp-mock-exam', label: 'Mock exam guidance' }],
    relatedAnswers: [{ href: '/answers/what-is-pmp-scenario-practice', label: 'Scenario practice' }],
    ctaHref: '/pmp-mock-exam',
    ctaLabel: 'Mock exam hub',
    relatedFaqIds: ['pmp26-study-06'],
  },
  {
    slug: 'what-are-the-pmp-2026-domain-weights',
    path: '/answers/what-are-the-pmp-2026-domain-weights',
    question: 'What are the PMP 2026 domain weights?',
    title: 'What are the PMP 2026 domain weights?',
    description: 'Orientation on PMP domain weighting for 2026 exam planning.',
    shortAnswer:
      'Current PMP exam (launched 9 July 2026): People 33%, Process 41%, Business Environment 26%. The previous exam used People 42%, Process 50%, Business Environment 8%. Verify the latest official ECO on PMI.org before booking.',
    detailedAnswer:
      'Domain weights guide study time allocation. Per PMI’s 2026 Exam Content Outline, the updated exam shifts emphasis toward Business Environment. PM Structure summarizes orientation at /pmp-new-exam-domain-weighting; always confirm against the latest Exam Content Outline.',
    whoApplies: 'Candidates building a 2026 study plan.',
    dateModified: '2026-06-19',
    nextSteps: ['/pmp-new-exam-domain-weighting', '/pmp-exam-2026', 'Verify PMI.org ECO'],
    relatedCourses: [{ href: '/pmp-professional', label: 'PMP Professional' }],
    relatedPages: [{ href: '/pmp-new-exam-domain-weighting', label: 'Domain weighting guide' }],
    relatedAnswers: [{ href: '/answers/what-is-the-pmp-business-environment-domain', label: 'Business Environment domain' }],
    ctaHref: '/pmp-exam-2026',
    ctaLabel: 'PMP 2026 guide',
  },
  {
    slug: 'current-pmp-exam-vs-new-pmp-exam',
    path: '/answers/current-pmp-exam-vs-new-pmp-exam',
    question: 'What is the difference between the previous and current PMP exams?',
    title: 'Previous PMP exam vs current PMP exam',
    description: 'Compare the previous PMP exam with the current exam launched in July 2026.',
    shortAnswer:
      'The current PMP exam launched on 9 July 2026 with revised domain weights and updated ECO emphasis. Use the comparison to replace obsolete materials, and verify the latest documents on PMI.org.',
    detailedAnswer:
      'The previous exam is no longer offered. Current candidates should use the comparison only to identify outdated assumptions, then prepare against the current exam at /pmp-exam-2026.',
    whoApplies: 'Current candidates reviewing study material created before July 2026.',
    nextSteps: ['/pmp-exam-2026', '/pmp-after-9-july-2026', '/pmp-readiness-diagnostic'],
    relatedCourses: [{ href: '/pmp-professional', label: 'PMP Professional' }],
    relatedPages: [{ href: '/pmp-current-vs-new-exam', label: 'Previous vs current exam' }],
    relatedAnswers: [{ href: '/answers/is-the-pmp-exam-changing-in-2026', label: 'Is PMP changing in 2026?' }],
    ctaHref: '/pmp-readiness-diagnostic',
    ctaLabel: 'Readiness diagnostic',
  },
  {
    slug: 'which-pm-structure-pmp-pathway-should-i-choose',
    path: '/answers/which-pm-structure-pmp-pathway-should-i-choose',
    question: 'Which PM Structure PMP pathway should I choose?',
    title: 'Which PM Structure PMP pathway should I choose?',
    description: 'Foundation vs Professional vs Mastery pathway selection.',
    shortAnswer:
      'Use the readiness diagnostic and pathway comparison on /pmp. Foundation for orientation, Professional for active prep, Mastery for intensive practice.',
    detailedAnswer:
      'Pathway fit depends on experience, hours per week, and exam date. Do not over-buy tier; align mocks and scenario volume to your weak domains.',
    whoApplies: 'New PM Structure PMP enrollees.',
    nextSteps: ['/pmp-readiness-diagnostic', '/pmp', 'Compare tiers on pathway table'],
    relatedCourses: [
      { href: '/pmp-foundation', label: 'Foundation' },
      { href: '/pmp-professional', label: 'Professional' },
      { href: '/pmp-mastery', label: 'Mastery' },
    ],
    relatedPages: [{ href: '/pmp', label: 'PMP hub' }],
    relatedAnswers: [{ href: '/answers/what-is-the-difference-between-pmp-foundation-professional-and-mastery', label: 'Tier comparison' }],
    ctaHref: '/pmp-readiness-diagnostic',
    ctaLabel: 'Start diagnostic',
  },
  {
    slug: 'what-is-pmp-foundation',
    path: '/answers/what-is-pmp-foundation',
    question: 'What is PMP Foundation on PM Structure?',
    title: 'What is PMP Foundation?',
    description: 'PMP Foundation pathway overview on PM Structure.',
    shortAnswer:
      'Foundation orients candidates to ECO topics and baseline practice before intensive mocks.',
    detailedAnswer:
      'Foundation suits candidates new to formal PMP prep or returning after a long gap. See /pmp-foundation for scope, duration, and enrollment.',
    whoApplies: 'Early-stage PMP candidates.',
    nextSteps: ['/pmp-foundation', '/pmp-readiness-diagnostic'],
    relatedCourses: [{ href: '/pmp-foundation', label: 'Foundation pathway' }],
    relatedPages: [{ href: '/pmp', label: 'PMP hub' }],
    relatedAnswers: [{ href: '/answers/what-is-the-difference-between-pmp-foundation-professional-and-mastery', label: 'Compare tiers' }],
    ctaHref: '/pmp-foundation',
    ctaLabel: 'Foundation pathway',
  },
  {
    slug: 'what-is-pmp-professional',
    path: '/answers/what-is-pmp-professional',
    question: 'What is PMP Professional on PM Structure?',
    title: 'What is PMP Professional?',
    description: 'PMP Professional pathway for active exam preparation.',
    shortAnswer:
      'Professional adds structured mocks and scenario practice for candidates actively preparing to sit PMP.',
    detailedAnswer:
      'Professional is the common choice for working professionals with a target exam date within several months. Details at /pmp-professional.',
    whoApplies: 'Candidates with PMI approval or near approval.',
    nextSteps: ['/pmp-professional', '/pmp-scenario-practice'],
    relatedCourses: [{ href: '/pmp-professional', label: 'Professional pathway' }],
    relatedPages: [{ href: '/certifications/pmp', label: 'PMP certification page' }],
    relatedAnswers: [{ href: '/answers/how-long-does-pmp-preparation-take', label: 'Prep duration' }],
    ctaHref: '/pmp-professional',
    ctaLabel: 'Professional pathway',
  },
  {
    slug: 'what-is-pmp-mastery',
    path: '/answers/what-is-pmp-mastery',
    question: 'What is PMP Mastery on PM Structure?',
    title: 'What is PMP Mastery?',
    description: 'PMP Mastery intensive pathway overview.',
    shortAnswer:
      'Mastery targets intensive practice, mock review, and exam-week discipline for candidates close to their test date.',
    detailedAnswer:
      'Choose Mastery when you need maximum scenario volume and structured review before Pearson VUE. See /pmp-mastery.',
    whoApplies: 'Candidates within weeks of their target exam window.',
    nextSteps: ['/pmp-mastery', '/pmp-mock-exam'],
    relatedCourses: [{ href: '/pmp-mastery', label: 'Mastery pathway' }],
    relatedPages: [{ href: '/pmp-scenario-practice', label: 'Scenario practice' }],
    relatedAnswers: [{ href: '/answers/how-many-pmp-mock-exams-should-i-take', label: 'Mock exam count' }],
    ctaHref: '/pmp-mastery',
    ctaLabel: 'Mastery pathway',
  },
  {
    slug: 'is-the-new-pmp-exam-harder',
    path: '/answers/is-the-new-pmp-exam-harder',
    question: 'Is the new PMP exam harder?',
    title: 'Is the current PMP exam harder than the previous exam?',
    description: 'Independent answer on whether the current PMP exam launched in July 2026 is harder than the previous format.',
    shortAnswer:
      'Neither format is universally harder: difficulty depends on your experience, study approach, and how well you match the updated Exam Content Outline.',
    detailedAnswer:
      'Labels like “harder” often reflect unfamiliar item styles rather than impossible content. Candidates strong in situational judgment and ECO coverage may adapt quickly; those relying on memorized formulas alone may struggle on any format. Compare narratives at /pmp-current-vs-new-exam and verify scope on PMI.org.',
    whoApplies: 'Candidates deciding whether to rush before July 2026 or prepare for the new format.',
    cautions: ['PMI may update the ECO; confirm official materials before scheduling.'],
    nextSteps: ['/pmp-current-vs-new-exam', '/answers/current-pmp-exam-vs-new-pmp-exam', '/pmp-readiness-diagnostic'],
    relatedCourses: [{ href: '/pmp-professional', label: 'PMP Professional' }],
    relatedPages: [{ href: '/pmp-exam-2026', label: 'PMP 2026 guide' }],
    relatedAnswers: [{ href: '/answers/current-pmp-exam-vs-new-pmp-exam', label: 'Previous vs current exam' }],
    ctaHref: '/pmp-readiness-diagnostic',
    ctaLabel: 'Assess readiness',
  },
  {
    slug: 'should-i-rush-pmp-before-july-2026',
    path: '/answers/should-i-rush-pmp-before-july-2026',
    question: 'Should I rush PMP before July 2026?',
    title: 'Should I rush PMP before July 2026? (Historical)',
    description:
      'Historical timing guidance about rushing before the PMP transition (no longer applicable).',
    shortAnswer:
      'Historical: This question applied before 9 July 2026. The previous exam is no longer offered. Prepare for the current exam without rushing.',
    detailedAnswer:
      'This was timing guidance for candidates considering whether to rush before the July 2026 transition. Rushing to beat a calendar date without readiness often led to failed attempts and lost fees. This decision is no longer relevant. Current candidates should prepare properly for the updated exam (launched July 2026) without artificial deadline pressure.',
    whoApplies: 'Historical reference: no longer applicable for current candidates.',
    nextSteps: ['/pmp-after-9-july-2026', '/pmp-exam-2026', '/pmp-readiness-diagnostic'],
    relatedCourses: [{ href: '/pmp-mastery', label: 'PMP Mastery' }],
    relatedPages: [{ href: '/pmp-after-9-july-2026', label: 'Current PMP preparation guide' }],
    relatedAnswers: [{ href: '/answers/how-to-prepare-for-pmp-in-2026', label: 'How to prepare for PMP in 2026' }],
    ctaHref: '/pmp-readiness-diagnostic',
    ctaLabel: 'Readiness diagnostic',
  },
  {
    slug: 'can-i-prepare-for-pmp-in-30-days',
    path: '/answers/can-i-prepare-for-pmp-in-30-days',
    question: 'Can I prepare for PMP in 30 days?',
    title: 'Can I prepare for PMP in 30 days?',
    description: 'Realistic 30-day PMP prep expectations and when a short timeline works.',
    shortAnswer:
      'A 30-day sprint is realistic only for experienced PMs with prior ECO exposure, daily study hours, and strong baseline mocks: not for first-time candidates.',
    detailedAnswer:
      'Most working professionals need several months. If you must sit within 30 days, prioritize timed mocks, error logs, and weak-domain drills over passive video consumption.',
    whoApplies: 'Candidates with an imminent exam window or employer deadline.',
    nextSteps: ['/answers/how-long-does-pmp-preparation-take', '/pmp-study-plan-2026', '/pmp-mock-exam'],
    relatedCourses: [{ href: '/pmp-mastery', label: 'PMP Mastery' }],
    relatedPages: [{ href: '/pmp-study-plan-2026', label: 'Study plan 2026' }],
    relatedAnswers: [{ href: '/answers/what-is-the-best-pmp-study-plan', label: 'Best PMP study plan' }],
    ctaHref: '/pmp-readiness-diagnostic',
    ctaLabel: 'Check readiness',
  },
  {
    slug: 'what-is-the-best-pmp-study-plan',
    path: '/answers/what-is-the-best-pmp-study-plan',
    question: 'What is the best PMP study plan?',
    title: 'What is the best PMP study plan?',
    description: 'How to structure a PMP study plan aligned to the ECO and your exam date.',
    shortAnswer:
      'The best plan maps weekly hours to ECO domains, includes timed mocks with review, and adjusts as mock data reveals gaps.',
    detailedAnswer:
      'Start with eligibility and target exam date, then allocate time by domain weight (verify on PMI.org). Alternate content review with scenario practice and full mocks in the final weeks.',
    whoApplies: 'Candidates starting or resetting PMP preparation.',
    nextSteps: ['/pmp-study-plan-2026', '/answers/how-to-prepare-for-pmp-in-2026', '/pmp-readiness-diagnostic'],
    relatedCourses: [
      { href: '/pmp-foundation', label: 'Foundation' },
      { href: '/pmp-professional', label: 'Professional' },
    ],
    relatedPages: [{ href: '/pmp-study-plan-2026', label: 'Study plan hub' }],
    relatedAnswers: [{ href: '/answers/how-to-prepare-for-pmp-in-2026', label: 'How to prepare in 2026' }],
    ctaHref: '/pmp-study-plan-2026',
    ctaLabel: 'View study plan',
    relatedFaqIds: ['pmp26-study-01'],
  },
  {
    slug: 'what-should-i-do-after-a-low-pmp-mock-score',
    path: '/answers/what-should-i-do-after-a-low-pmp-mock-score',
    question: 'What should I do after a low PMP mock score?',
    title: 'What should I do after a low PMP mock score?',
    description: 'Steps to recover from a disappointing PMP mock exam result.',
    shortAnswer:
      'Log misses by domain, revisit ECO tasks for weak areas, and retake a timed mock only after targeted review: do not schedule the real exam yet.',
    detailedAnswer:
      'A low mock is diagnostic data, not a verdict. Separate knowledge gaps from timing errors. Use scenario practice for judgment items and schedule the real exam when scores stabilize above your personal threshold.',
    whoApplies: 'Candidates using mocks on Professional or Mastery pathways.',
    nextSteps: ['/pmp-mock-exam', '/pmp-scenario-practice', '/topics/mock-exam-review'],
    relatedCourses: [{ href: '/pmp-mastery', label: 'PMP Mastery' }],
    relatedPages: [{ href: '/pmp-scenario-practice', label: 'Scenario practice' }],
    relatedAnswers: [{ href: '/answers/how-many-pmp-mock-exams-should-i-take', label: 'How many mocks?' }],
    ctaHref: '/pmp-mock-exam',
    ctaLabel: 'Mock exam guidance',
  },
  {
    slug: 'pmp-for-construction-and-infrastructure',
    path: '/answers/pmp-for-construction-and-infrastructure',
    question: 'Is PMP useful for construction and infrastructure professionals?',
    title: 'PMP for Construction & Infrastructure Professionals | PM Structure',
    description:
      'How PMP can support construction and infrastructure professionals moving into structured project leadership without replacing technical or site experience.',
    shortAnswer:
      'PMP can help construction and infrastructure professionals who already manage scope, contractors, safety interfaces, and staged delivery show structured project leadership, especially when the role expands beyond pure technical delivery.',
    detailedAnswer:
      'Capital projects, utilities, transport, and built-environment roles often include phased delivery, multi-disciplinary coordination, and stakeholder governance. PMP does not replace engineering depth or site experience. It can support credibility when you need a recognized project leadership framework for promotions, client-facing roles, or PMO transitions. Verify PMI eligibility and current exam rules before applying; align study materials to the exam introduced in July 2026.',
    whoApplies:
      'Construction managers, infrastructure project leads, planners, and engineers moving into broader delivery or PMO-facing roles in GCC and global markets.',
    nextSteps: [
      'Start with the PMP 2026 guide at /pmp-exam-2026',
      'Review engineer-focused FAQs at /pmp-2026-pathway#pmp-engineer-faq',
      'Verify eligibility on PMI.org before booking',
    ],
    relatedCourses: [
      { href: '/pmp-professional', label: 'PMP Professional pathway' },
      { href: '/pmp-mastery', label: 'PMP Mastery pathway' },
    ],
    relatedPages: [
      { href: '/pmp-exam-2026', label: 'PMP exam 2026 guide' },
      { href: '/certifications/pmp', label: 'PMP readiness pathway' },
      { href: '/pmp-study-plan-2026', label: 'Study plan 2026' },
    ],
    relatedAnswers: [
      {
        href: '/answers/is-the-pmp-exam-changing-in-2026',
        label: 'Is the PMP exam changing in 2026?',
      },
      { href: '/answers/what-is-pmp-readiness', label: 'What is PMP readiness?' },
    ],
    dateModified: '2026-06-22',
    ctaHref: '/certifications/pmp#cert-roadmap-form',
    ctaLabel: 'Get My PMP Roadmap',
    faqs: [
      {
        question: 'Does PM Structure issue PMP for construction professionals?',
        answer:
          'No. PMP is issued by PMI after eligibility, application, and exam success. PM Structure provides independent preparation support.',
      },
    ],
  },
  {
    slug: 'is-pmp-a-shortcut-for-credibility',
    path: '/answers/is-pmp-a-shortcut-for-credibility',
    question: 'Is PMP a shortcut for professional credibility?',
    title: 'Is PMP a Shortcut for Credibility? | PM Structure',
    description:
      'PMP is not a fast track around experience. Learn how structured prep can support credibility without overclaiming.',
    shortAnswer:
      'No. PMP is not a shortcut. PMI requires eligible project leadership experience and a rigorous exam. Structured prep can organize your study route and readiness decision so certification supports your real background instead of replacing it.',
    detailedAnswer:
      'Credibility comes from delivery outcomes, stakeholder trust, and experience, not a certificate alone. PMP can help professionals who already lead projects communicate that capability in a recognized framework. Avoid providers promising guaranteed passes or confusing application training hours with PDU marketing. Verify eligibility on PMI.org, track mocks by weak area, and book when readiness patterns support it, not when marketing creates urgency.',
    whoApplies: 'Professionals evaluating whether PMP fits their career direction in 2026.',
    nextSteps: [
      'Compare pathways at /certifications/compare',
      'Read the PMP 2026 guide at /pmp-exam-2026',
      'Review the PMP readiness pathway at /certifications/pmp',
    ],
    relatedCourses: [{ href: '/pmp-foundation', label: 'PMP Foundation pathway' }],
    relatedPages: [
      { href: '/certifications/pmp', label: 'PMP readiness pathway' },
      { href: '/pmp-2026-pathway#pmp-trust-faq', label: 'Trust and expectations FAQs' },
    ],
    relatedAnswers: [
      { href: '/answers/pmp-training-hours-vs-pdus', label: 'PMP training hours vs PDUs' },
      { href: '/answers/what-is-pmp-readiness', label: 'What is PMP readiness?' },
    ],
    dateModified: '2026-06-22',
    ctaHref: '/pmp-exam-2026',
    ctaLabel: 'Read the PMP 2026 guide',
  },
  {
    slug: 'corporate-pmp-2026-readiness-for-teams',
    path: '/answers/corporate-pmp-2026-readiness-for-teams',
    question: 'How can teams plan corporate PMP 2026 readiness?',
    title: 'Corporate PMP 2026 Readiness for Teams | PM Structure',
    description:
      'Orientation for PMOs and delivery leaders aligning team PMP readiness to the current July 2026 exam without pass guarantees.',
    shortAnswer:
      'Team PMP readiness is a delivery capability issue: align roles and materials to the current exam, verify individual eligibility, structure mock review cadence, and avoid bulk certificate chasing without governance context.',
    detailedAnswer:
      'Organizations often ask for PMP coverage without mapping who needs certification versus who needs delivery coaching. A sensible team plan identifies target roles, exam timelines, study structure, and mock accountability, then verifies each candidate against PMI eligibility. PM Structure can support structured readiness conversations for PMOs and delivery leads. We do not guarantee passes, issue PMI credentials, or replace your internal performance management.',
    whoApplies: 'PMO leads, HR L&D partners, and delivery directors planning 2026 certification support.',
    nextSteps: [
      'Email support@pmstructure.com for team roadmap conversations',
      'Share /pmp-exam-2026 with candidates deciding exam routes',
      'Use /pmp-readiness-diagnostic for individual readiness orientation',
    ],
    relatedCourses: [
      { href: '/pmp-professional', label: 'PMP Professional pathway' },
      { href: '/pmp-mastery', label: 'PMP Mastery pathway' },
    ],
    relatedPages: [
      { href: '/pm-service', label: 'PM services' },
      { href: '/certifications/pmp', label: 'PMP readiness pathway' },
      { href: '/pmp-exam-2026', label: 'PMP 2026 guide' },
    ],
    relatedAnswers: [
      { href: '/answers/what-is-pmp-readiness', label: 'What is PMP readiness?' },
      { href: '/answers/how-long-does-pmp-preparation-take', label: 'How long does PMP prep take?' },
    ],
    dateModified: '2026-06-22',
    ctaHref: 'mailto:support@pmstructure.com',
    ctaLabel: 'Request team roadmap',
    faqs: [
      {
        question: 'Does PM Structure guarantee team pass rates?',
        answer:
          'No. We provide structured preparation support; exam results depend on eligibility, preparation quality, and individual performance.',
      },
    ],
  },
];

export const ANSWER_PAGES = pages;

export const ANSWER_PATHS = pages.map((p) => p.path) as readonly string[];

export const ANSWER_SLUGS = pages.map((p) => p.slug) as readonly string[];

export function getAnswerPage(slug: string): AnswerPageContent | undefined {
  return pages.find((p) => p.slug === slug);
}

import type { AnswerPageContent } from './types';

const pages: AnswerPageContent[] = [
  {
    slug: 'is-the-pmp-exam-changing-in-2026',
    path: '/answers/is-the-pmp-exam-changing-in-2026',
    question: 'Is the PMP exam changing in 2026?',
    title: 'Is the PMP Exam Changing in 2026? | PM Structure',
    description:
      'Yes. The PMP exam changes in July 2026. Learn what the change means, whether to prepare for the current or updated exam, and how to plan your PMP route.',
    shortAnswer:
      'Yes. The updated PMP exam launches on 9 July 2026. Candidates planning to take the current PMP exam version need to sit before 8 July 2026. Confirm dates and scope on PMI.org before scheduling.',
    detailedAnswer:
      'The PMP credential itself is not going away, but PMI has described a transition to an updated exam experience. Third-party summaries: including this page: are orientation only. Download the current PMP handbook and Exam Content Outline from PMI.org, then map your study plan to the format you will actually sit.',
    whoApplies: 'Anyone planning PMP readiness in 2026, especially candidates deciding whether to test before or after mid-2026.',
    nextSteps: [
      'Read the PM Structure PMP 2026 guide at /pmp-exam-2026',
      'Compare current vs new narratives at /pmp-current-vs-new-exam',
      'Verify official PMI dates before booking Pearson VUE',
    ],
    relatedCourses: [
      { href: '/pmp-foundation', label: 'PMP Foundation pathway' },
      { href: '/pmp-professional', label: 'PMP Professional pathway' },
    ],
    relatedPages: [
      { href: '/certifications/pmp', label: 'PMP 2026 Readiness Pathway' },
      { href: '/topics/pmp-exam-2026', label: 'PMP exam 2026 guide' },
      { href: '/faq', label: 'PM Structure FAQ' },
      { href: '/pmp-exam-2026', label: 'PMP exam 2026 hub guide' },
      { href: '/pmp-exam-timeline-2026', label: '2026 timeline' },
    ],
    relatedAnswers: [
      { href: '/answers/when-does-the-new-pmp-exam-start', label: 'When does the new PMP exam start?' },
      { href: '/answers/should-i-take-pmp-before-8-july-2026', label: 'Should I take PMP before 8 July 2026?' },
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
    ctaLabel: 'Get My PMP 2026 Roadmap',
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
      'Answer on the July 2026 PMP transition date and how to confirm scheduling with PMI and Pearson VUE.',
    shortAnswer:
      'PM Structure orients candidates to a key transition date of 9 July 2026 for the updated PMP format. Always confirm on PMI.org before you book.',
    detailedAnswer:
      'Exam transition dates can be updated by PMI. Treat 9 July 2026 as the planning anchor used across PM Structure guides, then verify the live handbook and Pearson VUE scheduling screens for your region. If you are nearly ready, testing before the transition may reduce uncertainty; if you need more time, plan for the post-transition experience.',
    whoApplies: 'Candidates choosing an exam window in the second half of 2026.',
    nextSteps: [
      'Review /pmp-exam-timeline-2026',
      'Decide before vs after July using /pmp-before-8-july-2026 and /pmp-after-9-july-2026',
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
    title: 'Should I take the PMP before 8 July 2026?',
    description:
      'Decision guide for candidates considering the current PMP format before the July 2026 transition.',
    shortAnswer:
      'Consider testing before the transition if you are already exam-ready, have strong mock scores, and can secure a Pearson VUE slot before mid-2026.',
    detailedAnswer:
      'This is a timing decision, not a quality judgment. Candidates who have completed ECO coverage, score consistently on timed mocks, and want to avoid format uncertainty often prefer the pre-transition window. If you still have major domain gaps or limited study hours per week, preparing for the post-transition exam may be less risky than rushing.',
    whoApplies: 'PMP applicants approved by PMI who can realistically sit before mid-2026.',
    nextSteps: [
      'Read /pmp-before-8-july-2026',
      'Run /pmp-readiness-diagnostic',
      'Book only after two solid timed mocks',
    ],
    relatedCourses: [
      { href: '/pmp-professional', label: 'PMP Professional' },
      { href: '/pmp-mastery', label: 'PMP Mastery' },
    ],
    relatedPages: [{ href: '/pmp-before-8-july-2026', label: 'Before 8 July guide' }],
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
    title: 'Should I prepare for the new PMP after 9 July 2026?',
    description:
      'When it makes sense to target the post-July 2026 PMP exam and how to align practice.',
    shortAnswer:
      'Yes: if you need more study time, missed the pre-transition window, or want to align preparation to the updated exam narrative PMI describes for post-9 July 2026.',
    detailedAnswer:
      'Post-transition preparation should emphasize situational judgment, professional responsibility, and modern delivery contexts (including agile, hybrid, and emerging themes referenced in updated PMI materials). Use scenario practice and mocks rather than memorization-only study.',
    whoApplies: 'Candidates scheduling on or after the transition window who are not yet exam-ready.',
    nextSteps: [
      'Read /pmp-after-9-july-2026',
      'Use /pmp-study-plan-2026 for weekly structure',
      'Increase scenario volume via /pmp-scenario-practice',
    ],
    relatedCourses: [{ href: '/pmp-mastery', label: 'PMP Mastery pathway' }],
    relatedPages: [
      { href: '/pmp-after-9-july-2026', label: 'After 9 July guide' },
      { href: '/pmp-agile-hybrid-predictive', label: 'Agile, hybrid & predictive' },
    ],
    relatedAnswers: [
      { href: '/answers/should-i-take-pmp-before-8-july-2026', label: 'Take PMP before 8 July?' },
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
      'Confirm eligibility, choose pre- or post-July timing, map the ECO to a weekly plan, pick a pathway tier, and use mocks plus scenario practice before Pearson VUE.',
    detailedAnswer:
      'Start with official PMI eligibility and handbook rules. Then decide exam timing using the July 2026 transition guides. Build a weekly schedule that covers all domains, includes timed mocks, and logs weak areas. PM Structure pathways (Foundation, Professional, Mastery) provide structure but do not replace official registration or exam delivery.',
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
    relatedPages: [{ href: '/pmp-readiness-diagnostic', label: 'Readiness diagnostic page' }],
    relatedAnswers: [
      { href: '/answers/what-is-pmp-scenario-practice', label: 'What is scenario practice?' },
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
      'Scenario practice trains how you apply PM concepts in exam-style situations: the skill tested on current and transitioning PMP formats.',
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
      'Third-party summaries cannot replace the official ECO PDF. Use it to build a coverage checklist, allocate hours by domain, and audit mock mistakes. When PMI updates the outline, refresh your plan: especially around 2026 transition messaging.',
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
    ],
    ctaHref: '/legal/pricing-disclaimers',
    ctaLabel: 'Pricing disclaimers',
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
      'Updated PMP exam (from 9 July 2026): People 33%, Process 41%, Business Environment 26%. Current exam: People 42%, Process 50%, Business Environment 8%. Verify on PMI.org before booking.',
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
    question: 'What is the difference between the current PMP exam and the new PMP exam?',
    title: 'Current PMP exam vs new PMP exam',
    description: 'Compare pre- and post-July 2026 PMP exam narratives.',
    shortAnswer:
      'The transition around 9 July 2026 shifts emphasis in exam narratives and ECO tasks. Compare guides on PM Structure and verify on PMI.org.',
    detailedAnswer:
      'Neither format is inherently easier: readiness and timing matter more than labels. Use /pmp-current-vs-new-exam for a structured comparison.',
    whoApplies: 'Candidates choosing when to sit PMP in 2026.',
    nextSteps: ['/pmp-current-vs-new-exam', '/pmp-before-8-july-2026', '/pmp-after-9-july-2026'],
    relatedCourses: [{ href: '/pmp-professional', label: 'PMP Professional' }],
    relatedPages: [{ href: '/pmp-current-vs-new-exam', label: 'Current vs new hub' }],
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
    title: 'Is the new PMP exam harder?',
    description: 'Independent answer on whether the post-2026 PMP format is harder than the current exam.',
    shortAnswer:
      'Neither format is universally harder: difficulty depends on your experience, study approach, and how well you match the updated Exam Content Outline.',
    detailedAnswer:
      'Labels like “harder” often reflect unfamiliar item styles rather than impossible content. Candidates strong in situational judgment and ECO coverage may adapt quickly; those relying on memorized formulas alone may struggle on any format. Compare narratives at /pmp-current-vs-new-exam and verify scope on PMI.org.',
    whoApplies: 'Candidates deciding whether to rush before July 2026 or prepare for the new format.',
    cautions: ['PMI may update the ECO; confirm official materials before scheduling.'],
    nextSteps: ['/pmp-current-vs-new-exam', '/answers/current-pmp-exam-vs-new-pmp-exam', '/pmp-readiness-diagnostic'],
    relatedCourses: [{ href: '/pmp-professional', label: 'PMP Professional' }],
    relatedPages: [{ href: '/pmp-exam-2026', label: 'PMP 2026 guide' }],
    relatedAnswers: [{ href: '/answers/current-pmp-exam-vs-new-pmp-exam', label: 'Current vs new exam' }],
    ctaHref: '/pmp-readiness-diagnostic',
    ctaLabel: 'Assess readiness',
  },
  {
    slug: 'should-i-rush-pmp-before-july-2026',
    path: '/answers/should-i-rush-pmp-before-july-2026',
    question: 'Should I rush PMP before July 2026?',
    title: 'Should I rush PMP before July 2026?',
    description: 'When rushing before the PMP transition helps: and when it hurts.',
    shortAnswer:
      'Rush only if you are already exam-ready with strong timed mocks and a booked Pearson VUE slot; otherwise prepare properly for the post-transition format.',
    detailedAnswer:
      'Rushing to beat a calendar date without readiness often leads to failed attempts and lost fees. If you still have major domain gaps or inconsistent mock scores, extending prep is usually safer than cramming.',
    whoApplies: 'PMI-eligible candidates considering a pre-July 2026 test date.',
    nextSteps: ['/answers/should-i-take-pmp-before-8-july-2026', '/pmp-before-8-july-2026', '/pmp-readiness-diagnostic'],
    relatedCourses: [{ href: '/pmp-mastery', label: 'PMP Mastery' }],
    relatedPages: [{ href: '/pmp-before-8-july-2026', label: 'Before 8 July guide' }],
    relatedAnswers: [{ href: '/answers/should-i-take-pmp-before-8-july-2026', label: 'Take PMP before 8 July?' }],
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
];

export const ANSWER_PAGES = pages;

export const ANSWER_PATHS = pages.map((p) => p.path) as readonly string[];

export const ANSWER_SLUGS = pages.map((p) => p.slug) as readonly string[];

export function getAnswerPage(slug: string): AnswerPageContent | undefined {
  return pages.find((p) => p.slug === slug);
}
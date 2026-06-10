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
      { href: '/pmp-faq', label: 'PMP FAQ hub' },
      { href: '/certifications/pmp', label: 'Certification pathways' },
      { href: '/pmp-foundation', label: 'PMP Foundation' },
      { href: '/pmp-professional', label: 'PMP Professional' },
      { href: '/pmp-mastery', label: 'PMP Mastery' },
      { href: '/pmp-readiness-diagnostic', label: 'Readiness diagnostic' },
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
      { href: '/answers/should-i-rush-pmp-before-july-2026', label: 'Should I rush before July?' },
    ],
    howExamReadiness:
      '2026 transition planning shows up in timing decisions, mock selection, and domain emphasis — verify every date on PMI.org before you schedule.',
    sourceTodo: 'Confirm PMP transition dates and ECO updates on PMI.org before treating any third-party summary as final.',
    references: [{ label: 'PMI.org — PMP certification', href: 'https://www.pmi.org/certifications/project-management-pmp' }],
    relatedCourses: [
      { href: '/pmp-foundation', label: 'PMP Foundation pathway' },
      { href: '/pmp-professional', label: 'PMP Professional pathway' },
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
  {
    slug: 'pmp-domain-weighting',
    path: '/topics/pmp-domain-weighting',
    title: 'PMP domain weighting — knowledge hub',
    description: 'How PMP domain weights guide study time — verify on PMI.org.',
    h1: 'PMP domain weighting — PM Structure knowledge hub',
    whatIs:
      'Domain weighting describes how PMI allocates exam emphasis across People, Process, and Business Environment. Percentages change with the ECO.',
    whyMatters: 'Misallocated study hours leave weak domains exposed on exam day.',
    viewpoint:
      'We summarize orientation at /pmp-new-exam-domain-weighting with sourceTodo reminders. Always confirm on PMI.org.',
    sourceTodo: 'Confirm latest ECO domain percentages on PMI.org.',
    resources: [
      { href: '/pmp-new-exam-domain-weighting', label: 'Domain weighting guide' },
      { href: '/pmp-people-domain', label: 'People domain' },
      { href: '/pmp-process-domain', label: 'Process domain' },
    ],
    relatedAnswers: [
      { href: '/answers/what-are-the-pmp-2026-domain-weights', label: '2026 domain weights' },
    ],
    ctaHref: '/pmp-exam-2026',
    ctaLabel: 'PMP 2026 guide',
  },
  {
    slug: 'pmp-people-domain',
    path: '/topics/pmp-people-domain',
    title: 'PMP People domain — knowledge hub',
    description: 'People domain tasks, stakeholder focus, and study resources.',
    h1: 'PMP People domain — PM Structure knowledge hub',
    whatIs:
      'The People domain covers team leadership, conflict, stakeholder engagement, and collaboration tasks in the ECO.',
    whyMatters: 'Situational judgment items often cluster around people and stakeholder scenarios.',
    viewpoint: 'Pair domain reading with scenario practice — not flashcards alone.',
    resources: [
      { href: '/pmp-people-domain', label: 'People domain guide' },
      { href: '/topics/stakeholder-engagement', label: 'Stakeholder engagement hub' },
    ],
    relatedAnswers: [{ href: '/answers/what-is-the-pmp-people-domain', label: 'What is the People domain?' }],
    ctaHref: '/pmp-scenario-practice',
    ctaLabel: 'Scenario practice',
  },
  {
    slug: 'pmp-process-domain',
    path: '/topics/pmp-process-domain',
    title: 'PMP Process domain — knowledge hub',
    description: 'Process domain coverage, planning, execution, and monitoring tasks.',
    h1: 'PMP Process domain — PM Structure knowledge hub',
    whatIs:
      'The Process domain spans initiating through closing — scope, schedule, cost, quality, risk, and integration.',
    whyMatters: 'It is typically the largest share of PMP exam tasks.',
    viewpoint: 'Use mocks to see how process knowledge appears in situational items.',
    resources: [
      { href: '/pmp-process-domain', label: 'Process domain guide' },
      { href: '/pmp-mock-exam', label: 'Mock exams' },
    ],
    relatedAnswers: [{ href: '/answers/what-is-the-pmp-process-domain', label: 'What is the Process domain?' }],
    ctaHref: '/pmp-professional',
    ctaLabel: 'Professional pathway',
  },
  {
    slug: 'stakeholder-engagement',
    path: '/topics/stakeholder-engagement',
    title: 'Stakeholder engagement — knowledge hub',
    description: 'Stakeholder analysis and engagement for PMP and project delivery.',
    h1: 'Stakeholder engagement — PM Structure knowledge hub',
    whatIs:
      'Stakeholder engagement is identifying, analyzing, and managing stakeholder expectations throughout the project lifecycle.',
    whyMatters: 'PMP items frequently test how you handle conflicting stakeholder needs.',
    viewpoint: 'Link People domain study to realistic scenario practice.',
    resources: [
      { href: '/pmp-people-domain', label: 'People domain' },
      { href: '/pmp-scenario-practice', label: 'Scenario practice' },
    ],
    relatedAnswers: [{ href: '/answers/what-is-the-pmp-people-domain', label: 'People domain answer' }],
    ctaHref: '/pmp-scenario-practice',
    ctaLabel: 'Practice scenarios',
  },
  {
    slug: 'project-delivery-readiness',
    path: '/topics/project-delivery-readiness',
    title: 'Project delivery readiness — knowledge hub',
    description: 'Readiness for delivering projects and passing credential exams.',
    h1: 'Project delivery readiness — PM Structure knowledge hub',
    whatIs:
      'Delivery readiness combines skills, governance, and exam confidence — not just certificate completion.',
    whyMatters: 'Teams and candidates who measure readiness reduce rework and retakes.',
    viewpoint: 'Use diagnostics before committing to exam dates or pathway tiers.',
    resources: [
      { href: '/pmp-readiness-diagnostic', label: 'PMP diagnostic' },
      { href: '/topics/pmp-readiness', label: 'PMP readiness hub' },
    ],
    relatedAnswers: [{ href: '/answers/what-is-pmp-readiness', label: 'What is PMP readiness?' }],
    ctaHref: '/pmp-readiness-diagnostic',
    ctaLabel: 'Take diagnostic',
  },
  {
    slug: 'mock-exam-review',
    path: '/topics/mock-exam-review',
    title: 'Mock exam review — knowledge hub',
    description: 'How to review PMP mock exams and improve scores.',
    h1: 'Mock exam review — PM Structure knowledge hub',
    whatIs:
      'Mock review is structured analysis of misses — by domain, item type, and timing — between attempts.',
    whyMatters: 'Mocks without review repeat the same mistakes.',
    viewpoint: 'We do not guarantee pass outcomes; mocks are decision tools.',
    resources: [
      { href: '/pmp-mock-exam', label: 'Mock exam hub' },
      { href: '/answers/what-should-i-do-after-a-low-pmp-mock-score', label: 'After a low score' },
    ],
    relatedAnswers: [
      { href: '/answers/how-many-pmp-mock-exams-should-i-take', label: 'How many mocks?' },
      { href: '/answers/what-should-i-do-after-a-low-pmp-mock-score', label: 'Low mock score' },
    ],
    ctaHref: '/pmp-mock-exam',
    ctaLabel: 'Mock guidance',
  },
  {
    slug: 'pmp-study-plan',
    path: '/topics/pmp-study-plan',
    title: 'PMP study plan — knowledge hub',
    description: 'Study planning resources for PMP candidates on PM Structure.',
    h1: 'PMP study plan — PM Structure knowledge hub',
    whatIs:
      'A PMP study plan maps available hours to ECO domains, mocks, and review cycles until scheduling confidence.',
    whyMatters: 'Unplanned prep drifts — especially for working professionals.',
    viewpoint: 'Adjust weekly; verify domain weights on PMI.org.',
    resources: [
      { href: '/pmp-study-plan-2026', label: '2026 study plan' },
      { href: '/answers/what-is-the-best-pmp-study-plan', label: 'Best study plan answer' },
    ],
    relatedAnswers: [
      { href: '/answers/what-is-the-best-pmp-study-plan', label: 'Best study plan' },
      { href: '/answers/how-to-prepare-for-pmp-in-2026', label: 'Prepare in 2026' },
    ],
    ctaHref: '/pmp-study-plan-2026',
    ctaLabel: 'View study plan',
  },
  {
    slug: 'predictive-project-management',
    path: '/topics/predictive-project-management',
    title: 'Predictive project management — knowledge hub',
    description: 'Predictive, agile, and hybrid approaches in PMP context.',
    h1: 'Predictive project management — PM Structure knowledge hub',
    whatIs:
      'Predictive (plan-driven) approaches emphasize upfront planning and baseline control — one pillar of PMP situational judgment.',
    whyMatters: 'PMP items test when predictive vs adaptive approaches fit.',
    viewpoint: 'Read alongside agile and hybrid hubs; avoid siloed study.',
    resources: [
      { href: '/pmp-agile-hybrid-predictive', label: 'Agile, hybrid, predictive guide' },
      { href: '/topics/agile-project-management', label: 'Agile hub' },
    ],
    relatedAnswers: [{ href: '/answers/how-to-prepare-for-pmp-in-2026', label: 'Prepare in 2026' }],
    ctaHref: '/pmp-agile-hybrid-predictive',
    ctaLabel: 'Read guide',
  },
  {
    slug: 'project-value-delivery',
    path: '/topics/project-value-delivery',
    title: 'Project value delivery — knowledge hub',
    description: 'Delivering measurable value — complements the value-delivery topic hub.',
    h1: 'Project value delivery — PM Structure knowledge hub',
    whatIs:
      'Value delivery connects outputs to outcomes and benefits — central to Business Environment and portfolio thinking.',
    whyMatters: 'Exam items increasingly frame decisions around value, not only scope or schedule.',
    viewpoint: 'Pair with /topics/value-delivery for certification context vs delivery practice.',
    resources: [
      { href: '/topics/value-delivery', label: 'Value delivery (certification angle)' },
      { href: '/pmp-business-environment-domain', label: 'Business Environment domain' },
    ],
    relatedAnswers: [
      { href: '/answers/what-is-the-pmp-business-environment-domain', label: 'Business Environment domain' },
    ],
    ctaHref: '/pmp-business-environment-domain',
    ctaLabel: 'Business Environment guide',
  },
];

export const TOPIC_HUBS = hubs;

export const TOPIC_PATHS = hubs.map((h) => h.path) as readonly string[];

export const TOPIC_SLUGS = hubs.map((h) => h.slug) as readonly string[];

export function getTopicHub(slug: string): TopicHubContent | undefined {
  return hubs.find((h) => h.slug === slug);
}

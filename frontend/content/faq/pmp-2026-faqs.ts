import type { FaqEntry } from './types';

type PmpFaqInput = Omit<FaqEntry, 'clusterId'> & { pmpCategory: string };

function pmp(input: PmpFaqInput): FaqEntry {
  return {
    clusterId: 'pmp2026',
    status: 'published',
    schemaEligible: true,
    complianceRisk: 'low',
    ...input,
  };
}

/** Phase 1: 75 PMP 2026 FAQs across 10 categories (Run 11). */
export const PMP_2026_FAQS: FaqEntry[] = [
  // — PMP Exam Change 2026 (6) —
  pmp({
    id: 'pmp26-change-01',
    pmpCategory: 'PMP Exam Change 2026',
    question: 'Is the PMP exam changing in 2026?',
    answer:
      'PMI has communicated an updated PMP exam experience with a transition around 9 July 2026. Confirm dates and scope on PMI.org before scheduling. See [/pmp-exam-2026](/pmp-exam-2026).',
    relatedPage: '/pmp-exam-2026',
    sourceUrl: 'https://www.pmi.org',
    sourceTodo: 'Verify current PMI announcement wording and dates.',
  }),
  pmp({
    id: 'pmp26-change-02',
    pmpCategory: 'PMP Exam Change 2026',
    question: 'When does the new PMP exam start?',
    answer:
      'PM Structure orients candidates to a key transition date of 9 July 2026 for the updated format. Always verify on PMI.org and Pearson VUE before booking.',
    relatedPage: '/pmp-exam-timeline-2026',
  }),
  pmp({
    id: 'pmp26-change-03',
    pmpCategory: 'PMP Exam Change 2026',
    question: 'What is the PMP 2026 transition timeline?',
    answer:
      'Use our timeline page to map study windows against before/after July dates. See [/pmp-exam-timeline-2026](/pmp-exam-timeline-2026) and [/pmp-current-vs-new-exam](/pmp-current-vs-new-exam).',
    relatedPage: '/pmp-exam-timeline-2026',
  }),
  pmp({
    id: 'pmp26-change-04',
    pmpCategory: 'PMP Exam Change 2026',
    question: 'Will PMP domain weights change in 2026?',
    answer:
      'Domain emphasis may shift in updated materials. Treat any weights on third-party sites as orientation only until confirmed in the current PMI Exam Content Outline. See [/pmp-new-exam-domain-weighting](/pmp-new-exam-domain-weighting).',
    relatedPage: '/pmp-new-exam-domain-weighting',
    sourceTodo: 'Cross-check domain percentages with latest PMI ECO.',
  }),
  pmp({
    id: 'pmp26-change-05',
    pmpCategory: 'PMP Exam Change 2026',
    question: 'Does PM Structure teach the 2026 PMP exam?',
    answer:
      'Yes — our PMP pathways cover concepts relevant to current and transitioning exam narratives. We are an independent prep platform, not PMI or an ATP unless formally stated elsewhere.',
    relatedPage: '/pmp',
    complianceRisk: 'medium',
  }),
  pmp({
    id: 'pmp26-change-06',
    pmpCategory: 'PMP Exam Change 2026',
    question: 'Where should I verify official PMP 2026 information?',
    answer:
      'Use PMI.org, the PMP handbook, the Exam Content Outline, and Pearson VUE scheduling pages. PM Structure guides are supplementary.',
    sourceUrl: 'https://www.pmi.org/certifications/project-management-pmp',
  }),
  pmp({
    id: 'pmp26-change-07',
    pmpCategory: 'PMP Exam Change 2026',
    question: 'Will my PMP certificate expire because of the 2026 exam change?',
    answer:
      'Credential maintenance rules are set by PMI, not exam format transitions. Check PMI continuing certification requirements.',
    sourceUrl: 'https://www.pmi.org',
  }),
  pmp({
    id: 'pmp26-change-08',
    pmpCategory: 'PMP Exam Change 2026',
    question: 'Do employers care which PMP exam format I took?',
    answer:
      'Employers generally recognize the PMP credential itself. Focus on readiness and official PMI registration.',
  }),
  pmp({
    id: 'pmp26-change-09',
    pmpCategory: 'PMP Exam Change 2026',
    question: 'Can I switch exam format after booking Pearson VUE?',
    answer:
      'Reschedule and cancellation rules are set by PMI and Pearson VUE. Review policies before booking.',
    sourceUrl: 'https://www.pearsonvue.com/pmi',
  }),
  pmp({
    id: 'pmp26-change-10',
    pmpCategory: 'PMP Exam Change 2026',
    question: 'What pages should I read first for PMP 2026?',
    answer:
      'Start with [/pmp-exam-2026](/pmp-exam-2026), then timeline and current-vs-new guides on [/pmp](/pmp).',
    relatedPage: '/pmp-exam-2026',
  }),

  // — Current Exam Before 8 July 2026 (5) —
  pmp({
    id: 'pmp26-before-01',
    pmpCategory: 'Current Exam Before 8 July 2026',
    question: 'Should I take the PMP before 8 July 2026?',
    answer:
      'If you are exam-ready and want to sit the current format, testing before the transition may reduce uncertainty. See [/pmp-before-8-july-2026](/pmp-before-8-july-2026).',
    relatedPage: '/pmp-before-8-july-2026',
  }),
  pmp({
    id: 'pmp26-before-02',
    pmpCategory: 'Current Exam Before 8 July 2026',
    question: 'Who benefits from sitting PMP before the July 2026 transition?',
    answer:
      'Candidates with strong mock scores, completed ECO review, and a clear Pearson VUE slot before mid-2026 often prefer the current format.',
    relatedPage: '/pmp-before-8-july-2026',
  }),
  pmp({
    id: 'pmp26-before-03',
    pmpCategory: 'Current Exam Before 8 July 2026',
    question: 'How do I prepare quickly for PMP before July 2026?',
    answer:
      'Use a compressed study plan, daily mocks, and Professional or Mastery tiers for scenario practice. See [/pmp-study-plan-2026](/pmp-study-plan-2026).',
    relatedPage: '/pmp-study-plan-2026',
    relatedCourse: '/pmp-professional',
  }),
  pmp({
    id: 'pmp26-before-04',
    pmpCategory: 'Current Exam Before 8 July 2026',
    question: 'Can I still book the current PMP exam format?',
    answer:
      'Availability depends on PMI and Pearson VUE scheduling in your region. Confirm seat availability and format at booking time.',
    sourceUrl: 'https://www.pearsonvue.com/pmi',
  }),
  pmp({
    id: 'pmp26-before-05',
    pmpCategory: 'Current Exam Before 8 July 2026',
    question: 'What if I am not ready before July 2026?',
    answer:
      'Plan for the post-transition format and align practice to situational judgment. See [/pmp-after-9-july-2026](/pmp-after-9-july-2026).',
    relatedPage: '/pmp-after-9-july-2026',
  }),

  // — New Exam From 9 July 2026 (5) —
  pmp({
    id: 'pmp26-after-01',
    pmpCategory: 'New Exam From 9 July 2026',
    question: 'Should I prepare for the new PMP exam after 9 July 2026?',
    answer:
      'If you need more study time or miss the pre-transition window, prepare for the updated experience. See [/pmp-after-9-july-2026](/pmp-after-9-july-2026).',
    relatedPage: '/pmp-after-9-july-2026',
  }),
  pmp({
    id: 'pmp26-after-02',
    pmpCategory: 'New Exam From 9 July 2026',
    question: 'How is the new PMP exam different?',
    answer:
      'Expect continued emphasis on situational judgment, professional responsibility, and modern delivery contexts. Compare narratives on [/pmp-current-vs-new-exam](/pmp-current-vs-new-exam).',
    relatedPage: '/pmp-current-vs-new-exam',
  }),
  pmp({
    id: 'pmp26-after-03',
    pmpCategory: 'New Exam From 9 July 2026',
    question: 'Does the new PMP exam include more agile content?',
    answer:
      'Agile, hybrid, and predictive contexts remain part of PMP preparation. See [/pmp-agile-hybrid-predictive](/pmp-agile-hybrid-predictive).',
    relatedPage: '/pmp-agile-hybrid-predictive',
  }),
  pmp({
    id: 'pmp26-after-04',
    pmpCategory: 'New Exam From 9 July 2026',
    question: 'Will AI topics appear on the new PMP exam?',
    answer:
      'AI and emerging themes may appear in updated materials. Treat specifics as orientation until confirmed in PMI publications. See [/pmp-ai-sustainability-value-delivery](/pmp-ai-sustainability-value-delivery).',
    relatedPage: '/pmp-ai-sustainability-value-delivery',
    sourceTodo: 'Verify AI/sustainability scope in latest ECO.',
  }),
  pmp({
    id: 'pmp26-after-05',
    pmpCategory: 'New Exam From 9 July 2026',
    question: 'How long should I study for the post-July 2026 PMP exam?',
    answer:
      'Most candidates need several weeks to months depending on experience. Use [/pmp-readiness-diagnostic](/pmp-readiness-diagnostic) and [/pmp-study-plan-2026](/pmp-study-plan-2026).',
    relatedPage: '/pmp-study-plan-2026',
  }),

  // — PMP Exam Content Outline (4) —
  pmp({
    id: 'pmp26-eco-01',
    pmpCategory: 'PMP Exam Content Outline',
    question: 'What is the PMP Exam Content Outline (ECO)?',
    answer:
      'The ECO lists tasks and domains PMI uses to build the PMP exam. Download the current version from PMI.org and map it to your study plan.',
    sourceUrl: 'https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/pmp-examination-content-outline.pdf',
  }),
  pmp({
    id: 'pmp26-eco-02',
    pmpCategory: 'PMP Exam Content Outline',
    question: 'How do I use the ECO for PMP study planning?',
    answer:
      'List each domain, estimate hours, schedule mocks, and log weak areas. Our study plan template is at [/pmp-study-plan-2026](/pmp-study-plan-2026).',
    relatedPage: '/pmp-study-plan-2026',
  }),
  pmp({
    id: 'pmp26-eco-03',
    pmpCategory: 'PMP Exam Content Outline',
    question: 'Do PM Structure lessons follow the PMP ECO?',
    answer:
      'Pathway content is structured around ECO themes, but you must verify alignment against the latest PMI outline before relying on any third-party summary.',
    relatedPage: '/certifications/pmp',
  }),
  pmp({
    id: 'pmp26-eco-04',
    pmpCategory: 'PMP Exam Content Outline',
    question: 'How often does the PMP ECO change?',
    answer:
      'PMI updates the outline periodically. Check PMI.org when you start studying and again before scheduling Pearson VUE.',
    sourceUrl: 'https://www.pmi.org',
  }),

  // — Domain Weighting + People/Process/BE (8) —
  pmp({
    id: 'pmp26-dom-01',
    pmpCategory: 'Domain Weighting + People/Process/BE',
    question: 'What are the PMP exam domains?',
    answer:
      'PMP is organized around People, Process, and Business Environment domains in current PMI framing. See domain pages on our site for orientation.',
    relatedPage: '/pmp-new-exam-domain-weighting',
  }),
  pmp({
    id: 'pmp26-dom-02',
    pmpCategory: 'Domain Weighting + People/Process/BE',
    question: 'What is the PMP People domain?',
    answer:
      'People covers team leadership, conflict, stakeholder engagement, and team performance. See [/pmp-people-domain](/pmp-people-domain).',
    relatedPage: '/pmp-people-domain',
  }),
  pmp({
    id: 'pmp26-dom-03',
    pmpCategory: 'Domain Weighting + People/Process/BE',
    question: 'What is the PMP Process domain?',
    answer:
      'Process covers planning, execution, monitoring, risk, quality, and delivery decisions. See [/pmp-process-domain](/pmp-process-domain).',
    relatedPage: '/pmp-process-domain',
  }),
  pmp({
    id: 'pmp26-dom-04',
    pmpCategory: 'Domain Weighting + People/Process/BE',
    question: 'What is the PMP Business Environment domain?',
    answer:
      'Business Environment covers benefits, compliance, value delivery, and organizational context. See [/pmp-business-environment-domain](/pmp-business-environment-domain).',
    relatedPage: '/pmp-business-environment-domain',
  }),
  pmp({
    id: 'pmp26-dom-05',
    pmpCategory: 'Domain Weighting + People/Process/BE',
    question: 'How are PMP domain weights used in study plans?',
    answer:
      'Allocate more time to higher-weight domains while maintaining minimum coverage everywhere. Verify weights on PMI.org — do not rely on outdated percentages.',
    relatedPage: '/pmp-new-exam-domain-weighting',
    sourceTodo: 'Confirm domain weights from latest ECO.',
  }),
  pmp({
    id: 'pmp26-dom-06',
    pmpCategory: 'Domain Weighting + People/Process/BE',
    question: 'Which PMP domain is hardest for most candidates?',
    answer:
      'Many candidates report Process or Business Environment as weak areas, but your diagnostics and mocks should drive your plan — not generalizations.',
    relatedPage: '/pmp-readiness-diagnostic',
  }),
  pmp({
    id: 'pmp26-dom-07',
    pmpCategory: 'Domain Weighting + People/Process/BE',
    question: 'How do I improve my weakest PMP domain?',
    answer:
      'Tag mock errors by domain, revisit ECO tasks, then use scenario sets in Professional or Mastery. See [/pmp-scenario-practice](/pmp-scenario-practice).',
    relatedPage: '/pmp-scenario-practice',
    relatedCourse: '/pmp-mastery',
  }),
  pmp({
    id: 'pmp26-dom-08',
    pmpCategory: 'Domain Weighting + People/Process/BE',
    question: 'Do domain weights differ before and after July 2026?',
    answer:
      'Weights may change with ECO updates. Compare using [/pmp-current-vs-new-exam](/pmp-current-vs-new-exam) and official PMI sources.',
    relatedPage: '/pmp-current-vs-new-exam',
  }),
  pmp({
    id: 'pmp26-dom-09',
    pmpCategory: 'Domain Weighting + People/Process/BE',
    question: 'How many questions come from each PMP domain?',
    answer:
      'PMI does not publish a fixed per-domain question count for live exams. Use ECO task coverage and mocks instead of guessing splits.',
    sourceTodo: 'Do not publish invented per-domain question counts.',
  }),
  pmp({
    id: 'pmp26-dom-10',
    pmpCategory: 'Domain Weighting + People/Process/BE',
    question: 'Should I study People or Process first?',
    answer:
      'Follow your diagnostic weak areas. Many plans alternate domains weekly to avoid fatigue.',
    relatedPage: '/pmp-readiness-diagnostic',
  }),
  pmp({
    id: 'pmp26-dom-11',
    pmpCategory: 'Domain Weighting + People/Process/BE',
    question: 'What professional responsibility topics appear on PMP?',
    answer:
      'Ethics, fairness, and stakeholder trust appear across domains — especially in situational scenarios. Use scenario practice, not isolated memorization.',
    relatedPage: '/pmp-scenario-practice',
  }),

  // — AI, Sustainability, Value Delivery (6) —
  pmp({
    id: 'pmp26-ai-01',
    pmpCategory: 'AI, Sustainability, Value Delivery',
    question: 'Does the PMP exam cover artificial intelligence?',
    answer:
      'Updated exam narratives may reference AI in project contexts. Verify scope in the current ECO. Orientation: [/pmp-ai-sustainability-value-delivery](/pmp-ai-sustainability-value-delivery).',
    relatedPage: '/pmp-ai-sustainability-value-delivery',
  }),
  pmp({
    id: 'pmp26-ai-02',
    pmpCategory: 'AI, Sustainability, Value Delivery',
    question: 'Does PMP cover sustainability in projects?',
    answer:
      'Sustainability and social responsibility themes may appear in business environment scenarios. Confirm in PMI materials.',
    relatedPage: '/pmp-ai-sustainability-value-delivery',
  }),
  pmp({
    id: 'pmp26-ai-03',
    pmpCategory: 'AI, Sustainability, Value Delivery',
    question: 'What is value delivery in PMP context?',
    answer:
      'Value delivery connects outcomes, benefits, and stakeholder expectations to project decisions — a common theme in situational questions.',
    relatedPage: '/pmp-ai-sustainability-value-delivery',
  }),
  pmp({
    id: 'pmp26-ai-04',
    pmpCategory: 'AI, Sustainability, Value Delivery',
    question: 'How should I study AI topics for PMP?',
    answer:
      'Focus on governance, ethics, and decision-making around AI tools — not vendor-specific certifications. Use scenario practice, not memorization of headlines.',
    relatedPage: '/pmp-scenario-practice',
  }),
  pmp({
    id: 'pmp26-ai-05',
    pmpCategory: 'AI, Sustainability, Value Delivery',
    question: 'Are AI questions guaranteed on my PMP exam?',
    answer:
      'No third party can guarantee which tasks appear. Prepare broadly across the ECO and verify official PMI guidance.',
    complianceRisk: 'medium',
  }),
  pmp({
    id: 'pmp26-ai-06',
    pmpCategory: 'AI, Sustainability, Value Delivery',
    question: 'Where does PM Structure cover AI and sustainability for PMP?',
    answer:
      'Themes are woven into pathway content and cluster guides. Start at [/pmp-exam-2026](/pmp-exam-2026) and your tier page.',
    relatedPage: '/pmp-exam-2026',
  }),

  // — Eligibility, Application, 35 Contact Hours (8) —
  pmp({
    id: 'pmp26-elig-01',
    pmpCategory: 'Eligibility, Application, 35 Contact Hours',
    question: 'What are PMP eligibility requirements?',
    answer:
      'PMI sets education and project leadership experience requirements. Confirm the current handbook on PMI.org before applying.',
    sourceUrl: 'https://www.pmi.org/certifications/project-management-pmp/earn-the-pmp',
  }),
  pmp({
    id: 'pmp26-elig-02',
    pmpCategory: 'Eligibility, Application, 35 Contact Hours',
    question: 'How do I apply for the PMP exam?',
    answer:
      'Create a PMI account, submit experience details, obtain approval, then schedule via Pearson VUE. PM Structure does not submit applications on your behalf.',
    sourceUrl: 'https://www.pmi.org',
  }),
  pmp({
    id: 'pmp26-elig-03',
    pmpCategory: 'Eligibility, Application, 35 Contact Hours',
    question: 'What are the 35 contact hours for PMP?',
    answer:
      'PMI requires 35 contact hours of project management education for most candidates. Verify current rules in the PMP handbook.',
    sourceUrl: 'https://www.pmi.org',
  }),
  pmp({
    id: 'pmp26-elig-04',
    pmpCategory: 'Eligibility, Application, 35 Contact Hours',
    question: 'Does PM Structure provide PMI contact hours?',
    answer:
      'We state contact-hour eligibility only where formally approved. See [pricing disclaimers](/legal/pricing-disclaimers) and your order confirmation.',
    complianceRisk: 'medium',
  }),
  pmp({
    id: 'pmp26-elig-05',
    pmpCategory: 'Eligibility, Application, 35 Contact Hours',
    question: 'How long is PMP application approval?',
    answer:
      'PMI audit and review timelines vary. Apply early before your target exam date.',
    sourceUrl: 'https://www.pmi.org',
  }),
  pmp({
    id: 'pmp26-elig-06',
    pmpCategory: 'Eligibility, Application, 35 Contact Hours',
    question: 'Can I sit PMP without project management experience?',
    answer:
      'PMP requires qualifying project leadership experience per PMI rules. CAPM may suit earlier-career candidates — see [/certifications/capm](/certifications/capm).',
    relatedPage: '/certifications/capm',
  }),
  pmp({
    id: 'pmp26-elig-07',
    pmpCategory: 'Eligibility, Application, 35 Contact Hours',
    question: 'Does the 2026 exam change affect PMP eligibility?',
    answer:
      'Eligibility is set by PMI policy, not exam format. Confirm the current handbook.',
    relatedPage: '/pmp-exam-2026',
  }),
  pmp({
    id: 'pmp26-elig-08',
    pmpCategory: 'Eligibility, Application, 35 Contact Hours',
    question: 'Where do I schedule the PMP exam?',
    answer:
      'After PMI approval, schedule at Pearson VUE. PM Structure does not deliver the official exam.',
    sourceUrl: 'https://www.pearsonvue.com/pmi',
  }),

  // — Study Plan, Scenario, Mock, Diagnostic (10) —
  pmp({
    id: 'pmp26-study-01',
    pmpCategory: 'Study Plan, Scenario, Mock, Diagnostic',
    question: 'How do I prepare for PMP in 2026?',
    answer:
      'Map the ECO, pick a pathway tier, schedule mocks, and decide pre- or post-July timing. Start at [/pmp-exam-2026](/pmp-exam-2026).',
    relatedPage: '/pmp-exam-2026',
  }),
  pmp({
    id: 'pmp26-study-02',
    pmpCategory: 'Study Plan, Scenario, Mock, Diagnostic',
    question: 'What is a PMP study plan for 2026?',
    answer:
      'A weekly schedule covering domains, mocks, and review. Template: [/pmp-study-plan-2026](/pmp-study-plan-2026).',
    relatedPage: '/pmp-study-plan-2026',
  }),
  pmp({
    id: 'pmp26-study-03',
    pmpCategory: 'Study Plan, Scenario, Mock, Diagnostic',
    question: 'What is PMP readiness?',
    answer:
      'Readiness means consistent mock performance, domain coverage, and confidence in situational judgment — not only finishing videos.',
    relatedPage: '/pmp-readiness-diagnostic',
  }),
  pmp({
    id: 'pmp26-study-04',
    pmpCategory: 'Study Plan, Scenario, Mock, Diagnostic',
    question: 'What is PMP scenario practice?',
    answer:
      'Scenario practice trains how you apply PM concepts under exam conditions. Overview: [/pmp-scenario-practice](/pmp-scenario-practice).',
    relatedPage: '/pmp-scenario-practice',
  }),
  pmp({
    id: 'pmp26-study-05',
    pmpCategory: 'Study Plan, Scenario, Mock, Diagnostic',
    question: 'When should I take a PMP mock exam?',
    answer:
      'After initial content review and before booking Pearson VUE. Guidance: [/pmp-mock-exam](/pmp-mock-exam).',
    relatedPage: '/pmp-mock-exam',
  }),
  pmp({
    id: 'pmp26-study-06',
    pmpCategory: 'Study Plan, Scenario, Mock, Diagnostic',
    question: 'How many PMP mock exams should I take?',
    answer:
      'Most candidates benefit from multiple timed attempts with error logging — exact count depends on your baseline and exam date.',
    relatedPage: '/pmp-mock-exam',
  }),
  pmp({
    id: 'pmp26-study-07',
    pmpCategory: 'Study Plan, Scenario, Mock, Diagnostic',
    question: 'What is the PMP readiness diagnostic on PM Structure?',
    answer:
      'A structured orientation covering timing, experience, and pathway fit. See [/pmp-readiness-diagnostic](/pmp-readiness-diagnostic).',
    relatedPage: '/pmp-readiness-diagnostic',
  }),
  pmp({
    id: 'pmp26-study-08',
    pmpCategory: 'Study Plan, Scenario, Mock, Diagnostic',
    question: 'How many hours per week should I study for PMP?',
    answer:
      'Common ranges are 8–15 hours for intensive prep, but your diagnostic and work schedule should set the target.',
    relatedPage: '/pmp-readiness-diagnostic',
  }),
  pmp({
    id: 'pmp26-study-09',
    pmpCategory: 'Study Plan, Scenario, Mock, Diagnostic',
    question: 'How long does PMP preparation take?',
    answer:
      'Catalogue guides suggest roughly 2 weeks (Foundation), 6 weeks (Professional), and 12 weeks (Mastery) — your pace may differ.',
    relatedPage: '/certifications/pmp',
  }),
  pmp({
    id: 'pmp26-study-10',
    pmpCategory: 'Study Plan, Scenario, Mock, Diagnostic',
    question: 'Does PM Structure guarantee I will pass PMP?',
    answer:
      'No. We provide structured preparation; outcomes depend on your effort, experience, and exam-day performance.',
    complianceRisk: 'high',
  }),
  pmp({
    id: 'pmp26-study-11',
    pmpCategory: 'Study Plan, Scenario, Mock, Diagnostic',
    question: 'What is the best PMP study schedule for working professionals?',
    answer:
      'Block 60–90 minute sessions, one mock per week, and weekend domain review. Customize via [/pmp-study-plan-2026](/pmp-study-plan-2026).',
    relatedPage: '/pmp-study-plan-2026',
  }),
  pmp({
    id: 'pmp26-study-12',
    pmpCategory: 'Study Plan, Scenario, Mock, Diagnostic',
    question: 'Should I memorize PMP formulas?',
    answer:
      'Understand when formulas apply in scenarios; rote memorization alone is insufficient for situational exams.',
    relatedPage: '/pmp-scenario-practice',
  }),
  pmp({
    id: 'pmp26-study-13',
    pmpCategory: 'Study Plan, Scenario, Mock, Diagnostic',
    question: 'How do I review PMP mock exam mistakes?',
    answer:
      'Log each miss by domain and error type (knowledge vs misread), then revisit ECO tasks before the next mock. See [/pmp-mock-exam](/pmp-mock-exam).',
    relatedPage: '/pmp-mock-exam',
  }),

  // — Foundation / Professional / Mastery tiers (6) —
  pmp({
    id: 'pmp26-tier-01',
    pmpCategory: 'Foundation / Professional / Mastery tiers',
    question: 'What is the PMP Foundation pathway?',
    answer:
      'Foundation orients new candidates to ECO topics and baseline practice. Details: [/pmp-foundation](/pmp-foundation).',
    relatedCourse: '/pmp-foundation',
  }),
  pmp({
    id: 'pmp26-tier-02',
    pmpCategory: 'Foundation / Professional / Mastery tiers',
    question: 'What is the PMP Professional pathway?',
    answer:
      'Professional adds structured mocks and scenario practice for active exam prep. Details: [/pmp-professional](/pmp-professional).',
    relatedCourse: '/pmp-professional',
  }),
  pmp({
    id: 'pmp26-tier-03',
    pmpCategory: 'Foundation / Professional / Mastery tiers',
    question: 'What is the PMP Mastery pathway?',
    answer:
      'Mastery targets intensive practice and exam-week discipline. Details: [/pmp-mastery](/pmp-mastery).',
    relatedCourse: '/pmp-mastery',
  }),
  pmp({
    id: 'pmp26-tier-04',
    pmpCategory: 'Foundation / Professional / Mastery tiers',
    question: 'Which PMP tier should I choose?',
    answer:
      'Use the comparison table on [/pmp](/pmp) and the [/pmp-readiness-diagnostic](/pmp-readiness-diagnostic).',
    relatedPage: '/pmp',
  }),
  pmp({
    id: 'pmp26-tier-05',
    pmpCategory: 'Foundation / Professional / Mastery tiers',
    question: 'Can I upgrade from Foundation to Professional?',
    answer:
      'Contact support with your order email to discuss tier changes per published policy. See [/pmp-enrollment](/pmp-enrollment).',
    relatedPage: '/pmp-enrollment',
  }),
  pmp({
    id: 'pmp26-tier-06',
    pmpCategory: 'Foundation / Professional / Mastery tiers',
    question: 'Does Mastery include mentor support?',
    answer:
      'Mastery is designed for intensive readiness; mentor review availability is described on the Mastery page and order flow.',
    relatedCourse: '/pmp-mastery',
  }),

  // — Pricing, Regional Access, LMS, Disclaimer (7) —
  pmp({
    id: 'pmp26-price-01',
    pmpCategory: 'Pricing, Regional Access, LMS, Disclaimer',
    question: 'How much does PMP preparation cost on PM Structure?',
    answer:
      'Tuition varies by tier and region. Regional scholarship pricing applies when residence and billing country qualify. See [/certifications/pmp](/certifications/pmp) and [regional pricing](/legal/regional-pricing).',
    relatedPage: '/certifications/pmp',
  }),
  pmp({
    id: 'pmp26-price-02',
    pmpCategory: 'Pricing, Regional Access, LMS, Disclaimer',
    question: 'Are PMI exam fees included in PM Structure tuition?',
    answer:
      'No. Official PMP exam fees are paid to PMI/Pearson VUE separately.',
    complianceRisk: 'medium',
  }),
  pmp({
    id: 'pmp26-price-03',
    pmpCategory: 'Pricing, Regional Access, LMS, Disclaimer',
    question: 'Is PM Structure a PMI Authorized Training Partner (ATP)?',
    answer:
      'No — unless formally confirmed on a live page, we are an independent exam-preparation platform.',
    complianceRisk: 'high',
  }),
  pmp({
    id: 'pmp26-price-04',
    pmpCategory: 'Pricing, Regional Access, LMS, Disclaimer',
    question: 'How does regional pricing work for PMP pathways?',
    answer:
      'Scholarship tiers depend on verified residence and billing country. Checkout is USD-equivalent. [Regional pricing policy](/legal/regional-pricing).',
  }),
  pmp({
    id: 'pmp26-price-05',
    pmpCategory: 'Pricing, Regional Access, LMS, Disclaimer',
    question: 'When do I get LMS access after PMP enrollment?',
    answer:
      'After enrollment is confirmed, access is provisioned through the PM Structure learning environment. Private cohort areas are not indexed for search.',
    relatedPage: '/pmp-enrollment',
  }),
  pmp({
    id: 'pmp26-price-06',
    pmpCategory: 'Pricing, Regional Access, LMS, Disclaimer',
    question: 'Where do I enroll in a PMP pathway?',
    answer:
      'Start at [/pmp-enrollment](/pmp-enrollment) or your tier page. Checkout routes are excluded from search indexing.',
    relatedPage: '/pmp-enrollment',
  }),
  pmp({
    id: 'pmp26-price-07',
    pmpCategory: 'Pricing, Regional Access, LMS, Disclaimer',
    question: 'What support is included with PMP pathways?',
    answer:
      'Q&A and cohort support depend on tier. Boundaries: [/pmp-q-and-a-support](/pmp-q-and-a-support).',
    relatedPage: '/pmp-q-and-a-support',
  }),
];

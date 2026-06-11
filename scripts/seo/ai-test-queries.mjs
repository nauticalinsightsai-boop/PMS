/** Phase 19: 80+ AI visibility test queries (10 groups). */
export const AI_TEST_QUERIES = [
  // G1: Entity / brand (8)
  { group: 'G1', query: 'What is PM Structure?', expected: 'https://pmstructure.com/' },
  { group: 'G1', query: 'Is PM Structure a PMP training provider?', expected: 'https://pmstructure.com/pmp' },
  { group: 'G1', query: 'What certifications does PM Structure offer?', expected: 'https://pmstructure.com/certifications' },
  { group: 'G1', query: 'PM Structure independent exam prep platform', expected: 'https://pmstructure.com/legal/pricing-disclaimers' },
  { group: 'G1', query: 'Who runs PM Structure?', expected: 'https://pmstructure.com/about' },
  { group: 'G1', query: 'PM Structure membership benefits', expected: 'https://pmstructure.com/membership' },
  { group: 'G1', query: 'PM Structure contact support', expected: 'https://pmstructure.com/contact' },
  { group: 'G1', query: 'PM Structure regional scholarship pricing', expected: 'https://pmstructure.com/legal/regional-pricing' },

  // G2: PMP 2026 transition (10)
  { group: 'G2', query: 'Is the PMP exam changing in 2026?', expected: 'https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026' },
  { group: 'G2', query: 'When does the new PMP exam start?', expected: 'https://pmstructure.com/answers/when-does-the-new-pmp-exam-start' },
  { group: 'G2', query: 'PMP exam 2026 transition timeline', expected: 'https://pmstructure.com/pmp-exam-timeline-2026' },
  { group: 'G2', query: 'Is the new PMP exam harder?', expected: 'https://pmstructure.com/answers/is-the-new-pmp-exam-harder' },
  { group: 'G2', query: 'Should I rush PMP before July 2026?', expected: 'https://pmstructure.com/answers/should-i-rush-pmp-before-july-2026' },
  { group: 'G2', query: 'Current PMP exam vs new PMP exam', expected: 'https://pmstructure.com/answers/current-pmp-exam-vs-new-pmp-exam' },
  { group: 'G2', query: 'PMP July 2026 transition what changes', expected: 'https://pmstructure.com/pmp-exam-2026' },
  { group: 'G2', query: 'PMP domain weights 2026', expected: 'https://pmstructure.com/answers/what-are-the-pmp-2026-domain-weights' },
  { group: 'G2', query: 'PMP exam content outline 2026', expected: 'https://pmstructure.com/answers/what-is-the-pmp-exam-content-outline' },
  { group: 'G2', query: 'How to prepare for PMP in 2026', expected: 'https://pmstructure.com/answers/how-to-prepare-for-pmp-in-2026' },

  // G3: Domains / ECO (8)
  { group: 'G3', query: 'What is the PMP People domain?', expected: 'https://pmstructure.com/answers/what-is-the-pmp-people-domain' },
  { group: 'G3', query: 'What is the PMP Process domain?', expected: 'https://pmstructure.com/answers/what-is-the-pmp-process-domain' },
  { group: 'G3', query: 'What is the PMP Business Environment domain?', expected: 'https://pmstructure.com/answers/what-is-the-pmp-business-environment-domain' },
  { group: 'G3', query: 'PMP agile hybrid predictive exam', expected: 'https://pmstructure.com/pmp-agile-hybrid-predictive' },
  { group: 'G3', query: 'PMP AI sustainability value delivery', expected: 'https://pmstructure.com/pmp-ai-sustainability-value-delivery' },
  { group: 'G3', query: 'PMP new exam domain weighting', expected: 'https://pmstructure.com/pmp-new-exam-domain-weighting' },
  { group: 'G3', query: 'PMP people domain study guide', expected: 'https://pmstructure.com/pmp-people-domain' },
  { group: 'G3', query: 'PMP process domain practice', expected: 'https://pmstructure.com/pmp-process-domain' },

  // G4: Readiness / mocks (8)
  { group: 'G4', query: 'What is PMP readiness?', expected: 'https://pmstructure.com/answers/what-is-pmp-readiness' },
  { group: 'G4', query: 'PMP readiness diagnostic PM Structure', expected: 'https://pmstructure.com/pmp-readiness-diagnostic' },
  { group: 'G4', query: 'How many PMP mock exams should I take?', expected: 'https://pmstructure.com/answers/how-many-pmp-mock-exams-should-i-take' },
  { group: 'G4', query: 'What should I do after a low PMP mock score?', expected: 'https://pmstructure.com/answers/what-should-i-do-after-a-low-pmp-mock-score' },
  { group: 'G4', query: 'PMP scenario practice questions', expected: 'https://pmstructure.com/answers/what-is-pmp-scenario-practice' },
  { group: 'G4', query: 'PMP mock exam practice on PM Structure', expected: 'https://pmstructure.com/pmp-mock-exam' },
  { group: 'G4', query: 'How long does PMP preparation take?', expected: 'https://pmstructure.com/answers/how-long-does-pmp-preparation-take' },
  { group: 'G4', query: 'Best PMP study plan working professionals', expected: 'https://pmstructure.com/answers/what-is-the-best-pmp-study-plan' },

  // G5: Pathways (10)
  { group: 'G5', query: 'Which PM Structure PMP pathway should I choose?', expected: 'https://pmstructure.com/answers/which-pm-structure-pmp-pathway-should-i-choose' },
  { group: 'G5', query: 'What is PMP Foundation on PM Structure?', expected: 'https://pmstructure.com/answers/what-is-pmp-foundation' },
  { group: 'G5', query: 'What is PMP Professional on PM Structure?', expected: 'https://pmstructure.com/answers/what-is-pmp-professional' },
  { group: 'G5', query: 'What is PMP Mastery on PM Structure?', expected: 'https://pmstructure.com/answers/what-is-pmp-mastery' },
  { group: 'G5', query: 'Difference between PMP Foundation Professional Mastery', expected: 'https://pmstructure.com/answers/what-is-the-difference-between-pmp-foundation-professional-and-mastery' },
  { group: 'G5', query: 'PMP Foundation pathway duration', expected: 'https://pmstructure.com/pmp-foundation' },
  { group: 'G5', query: 'PMP Professional pathway mocks', expected: 'https://pmstructure.com/pmp-professional' },
  { group: 'G5', query: 'PMP Mastery intensive prep', expected: 'https://pmstructure.com/pmp-mastery' },
  { group: 'G5', query: 'PMP certification pathway pricing', expected: 'https://pmstructure.com/certifications/pmp' },
  { group: 'G5', query: 'PMP study plan 2026 PM Structure', expected: 'https://pmstructure.com/pmp-study-plan-2026' },

  // G6: Regional pricing (8)
  { group: 'G6', query: 'How does regional pricing work for PMP?', expected: 'https://pmstructure.com/answers/how-does-regional-pricing-work-for-pmp' },
  { group: 'G6', query: 'PM Structure India Pakistan scholarship pricing', expected: 'https://pmstructure.com/legal/regional-pricing' },
  { group: 'G6', query: 'Are PMI exam fees included in PM Structure tuition?', expected: 'https://pmstructure.com/legal/pricing-disclaimers' },
  { group: 'G6', query: 'PM Structure checkout USD equivalent', expected: 'https://pmstructure.com/legal/regional-pricing' },
  { group: 'G6', query: 'PMP tuition South Asia residence billing', expected: 'https://pmstructure.com/legal/regional-pricing' },
  { group: 'G6', query: 'PM Structure pricing disclaimers', expected: 'https://pmstructure.com/legal/pricing-disclaimers' },
  { group: 'G6', query: 'Regional pricing GCC Europe UK', expected: 'https://pmstructure.com/legal/regional-pricing' },
  { group: 'G6', query: 'PM Structure membership discount pricing', expected: 'https://pmstructure.com/membership' },

  // G7: Enrollment / LMS (8)
  { group: 'G7', query: 'How do I enroll in PMP on PM Structure?', expected: 'https://pmstructure.com/answers/how-do-i-enroll-in-pmp-on-pm-structure' },
  { group: 'G7', query: 'When do I get LMS access after PMP enrollment?', expected: 'https://pmstructure.com/answers/when-do-i-get-lms-access-after-pmp-enrollment' },
  { group: 'G7', query: 'PMP enrollment hub PM Structure', expected: 'https://pmstructure.com/pmp-enrollment' },
  { group: 'G7', query: 'PMP Q and A support tier', expected: 'https://pmstructure.com/pmp-q-and-a-support' },
  { group: 'G7', query: 'Upgrade PMP Foundation to Professional', expected: 'https://pmstructure.com/pmp-enrollment' },
  { group: 'G7', query: 'PMP pathway consultation booking', expected: 'https://pmstructure.com/contact' },
  { group: 'G7', query: 'PMP eligibility requirements PMI', expected: 'https://pmstructure.com/answers/what-are-the-pmp-eligibility-requirements' },
  { group: 'G7', query: 'Can I prepare for PMP in 30 days?', expected: 'https://pmstructure.com/answers/can-i-prepare-for-pmp-in-30-days' },

  // G8: Compliance (8)
  { group: 'G8', query: 'Is PM Structure an official PMI ATP?', expected: 'https://pmstructure.com/answers/is-pm-structure-an-official-pmi-atp' },
  { group: 'G8', query: 'Does PM Structure guarantee PMP success?', expected: 'https://pmstructure.com/answers/does-pm-structure-guarantee-pmp-success' },
  { group: 'G8', query: 'Is PM Structure affiliated with PMI?', expected: 'https://pmstructure.com/answers/is-pm-structure-an-official-pmi-atp' },
  { group: 'G8', query: 'PM Structure independent platform disclaimer', expected: 'https://pmstructure.com/legal/pricing-disclaimers' },
  { group: 'G8', query: 'PM Structure not PMI authorized training partner', expected: 'https://pmstructure.com/pmp-faq' },
  { group: 'G8', query: 'PM Structure refund policy', expected: 'https://pmstructure.com/legal/refunds' },
  { group: 'G8', query: 'PM Structure privacy policy forms', expected: 'https://pmstructure.com/legal/privacy' },
  { group: 'G8', query: 'PM Structure terms and conditions', expected: 'https://pmstructure.com/legal/terms' },

  // G9: Before / after July 2026 (8)
  { group: 'G9', query: 'Should I take PMP before July 2026?', expected: 'https://pmstructure.com/answers/should-i-take-pmp-before-8-july-2026' },
  { group: 'G9', query: 'Should I prepare for new PMP after 9 July 2026?', expected: 'https://pmstructure.com/answers/should-i-prepare-for-new-pmp-after-9-july-2026' },
  { group: 'G9', query: 'PMP before 8 July 2026 guide', expected: 'https://pmstructure.com/pmp-before-8-july-2026' },
  { group: 'G9', query: 'PMP after 9 July 2026 preparation', expected: 'https://pmstructure.com/pmp-after-9-july-2026' },
  { group: 'G9', query: 'Wait for new PMP exam after July', expected: 'https://pmstructure.com/pmp-after-9-july-2026' },
  { group: 'G9', query: 'PMP exam timing decision July 2026', expected: 'https://pmstructure.com/pmp-exam-timeline-2026' },
  { group: 'G9', query: 'Prepare post-July PMP how long study', expected: 'https://pmstructure.com/pmp-after-9-july-2026' },
  { group: 'G9', query: 'Book PMP before transition July 2026', expected: 'https://pmstructure.com/pmp-before-8-july-2026' },

  // G10: FAQ / answers / topics (10)
  { group: 'G10', query: 'PMP exam preparation FAQs', expected: 'https://pmstructure.com/pmp-faq' },
  { group: 'G10', query: 'PMP exam 2026 topic hub', expected: 'https://pmstructure.com/topics/pmp-exam-2026' },
  { group: 'G10', query: 'PMP readiness topic hub', expected: 'https://pmstructure.com/topics/pmp-readiness' },
  { group: 'G10', query: 'PMP scenario practice topic', expected: 'https://pmstructure.com/topics/pmp-scenario-practice' },
  { group: 'G10', query: 'Project management certification overview', expected: 'https://pmstructure.com/answers/what-is-project-management-certification' },
  { group: 'G10', query: 'PRINCE2 certification PM Structure', expected: 'https://pmstructure.com/answers/what-is-prince2-certification' },
  { group: 'G10', query: 'Lean Six Sigma green belt PM Structure', expected: 'https://pmstructure.com/answers/what-is-lean-six-sigma-green-belt' },
  { group: 'G10', query: 'PM Structure direct answer pages', expected: 'https://pmstructure.com/answers' },
  { group: 'G10', query: 'PMP frequently asked questions 2026', expected: 'https://pmstructure.com/pmp-faq' },
  { group: 'G10', query: 'PMP exam preparation topics', expected: 'https://pmstructure.com/topics/pmp-exam-preparation' },
];
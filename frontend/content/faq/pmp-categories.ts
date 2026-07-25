/** 27 PMP FAQ categories for /pmp-faq (Phase 10 spec). */
export type PmpCategoryId =
  | 'pmp-exam-change-2026'
  | 'current-exam-before-july-2026'
  | 'new-exam-from-july-2026'
  | 'pmp-exam-content-outline'
  | 'pmp-domain-weighting'
  | 'pmp-people-domain'
  | 'pmp-process-domain'
  | 'pmp-business-environment-domain'
  | 'pmp-current-vs-new-exam'
  | 'agile-hybrid-predictive'
  | 'ai-in-project-management'
  | 'sustainability-in-project-management'
  | 'value-delivery'
  | 'eligibility-application-contact-hours'
  | 'study-plan'
  | 'pmp-readiness'
  | 'scenario-practice'
  | 'mock-exams'
  | 'pmp-foundation'
  | 'pmp-professional'
  | 'pmp-mastery'
  | 'foundation-professional-mastery-comparison'
  | 'regional-pricing'
  | 'lms-access'
  | 'independent-platform-disclaimer'
  | 'guarantee-disclaimer'
  | 'enrollment-and-support';

export type PmpFaqCategory = {
  id: PmpCategoryId;
  label: string;
  hubH2: string;
  order: number;
};

export const PMP_FAQ_CATEGORIES: PmpFaqCategory[] = [
  { id: 'pmp-exam-change-2026', label: 'PMP Exam Change 2026', hubH2: 'PMP exam change 2026', order: 1 },
  { id: 'current-exam-before-july-2026', label: 'Previous Exam Before 9 July 2026', hubH2: 'PMP exam change 2026', order: 2 },
  { id: 'new-exam-from-july-2026', label: 'Current Exam From 9 July 2026', hubH2: 'PMP exam change 2026', order: 3 },
  { id: 'pmp-current-vs-new-exam', label: 'Previous vs Current PMP Exam', hubH2: 'PMP exam change 2026', order: 4 },
  { id: 'pmp-exam-content-outline', label: 'PMP Exam Content Outline', hubH2: 'Exam content & domains', order: 5 },
  { id: 'pmp-domain-weighting', label: 'PMP Domain Weighting', hubH2: 'Exam content & domains', order: 6 },
  { id: 'pmp-people-domain', label: 'PMP People Domain', hubH2: 'Exam content & domains', order: 7 },
  { id: 'pmp-process-domain', label: 'PMP Process Domain', hubH2: 'Exam content & domains', order: 8 },
  { id: 'pmp-business-environment-domain', label: 'PMP Business Environment Domain', hubH2: 'Exam content & domains', order: 9 },
  { id: 'agile-hybrid-predictive', label: 'Agile, Hybrid and Predictive Delivery', hubH2: 'Modern exam themes', order: 10 },
  { id: 'ai-in-project-management', label: 'AI in Project Management', hubH2: 'Modern exam themes', order: 11 },
  { id: 'sustainability-in-project-management', label: 'Sustainability in Project Management', hubH2: 'Modern exam themes', order: 12 },
  { id: 'value-delivery', label: 'Value Delivery', hubH2: 'Modern exam themes', order: 13 },
  { id: 'eligibility-application-contact-hours', label: 'Eligibility, Application & Training-Hour Guidance', hubH2: 'Eligibility & application', order: 14 },
  { id: 'study-plan', label: 'Study Plan', hubH2: 'Readiness & study planning', order: 15 },
  { id: 'pmp-readiness', label: 'PMP Readiness', hubH2: 'Readiness & study planning', order: 16 },
  { id: 'scenario-practice', label: 'Scenario Practice', hubH2: 'Practice & mock exams', order: 17 },
  { id: 'mock-exams', label: 'Mock Exams', hubH2: 'Practice & mock exams', order: 18 },
  { id: 'pmp-foundation', label: 'PMP Foundation', hubH2: 'Pathways & tiers', order: 19 },
  { id: 'pmp-professional', label: 'PMP Professional', hubH2: 'Pathways & tiers', order: 20 },
  { id: 'pmp-mastery', label: 'PMP Mastery', hubH2: 'Pathways & tiers', order: 21 },
  { id: 'foundation-professional-mastery-comparison', label: 'Foundation vs Professional vs Mastery', hubH2: 'Pathways & tiers', order: 22 },
  { id: 'regional-pricing', label: 'Regional Pricing', hubH2: 'Pricing, LMS & policies', order: 23 },
  { id: 'lms-access', label: 'LMS Access', hubH2: 'Pricing, LMS & policies', order: 24 },
  { id: 'independent-platform-disclaimer', label: 'Independent Platform Disclaimer', hubH2: 'Pricing, LMS & policies', order: 25 },
  { id: 'guarantee-disclaimer', label: 'Guarantee Disclaimer', hubH2: 'Pricing, LMS & policies', order: 26 },
  { id: 'enrollment-and-support', label: 'Enrollment and Support', hubH2: 'Pricing, LMS & policies', order: 27 },
];

/** Legacy bucket labels → spec category id (Run 11 → Phase 10). */
export const LEGACY_PMP_CATEGORY_MAP: Record<string, PmpCategoryId> = {
  'PMP Exam Change 2026': 'pmp-exam-change-2026',
  'Current Exam Before 8 July 2026': 'current-exam-before-july-2026',
  'New Exam From 9 July 2026': 'new-exam-from-july-2026',
  'PMP Exam Content Outline': 'pmp-exam-content-outline',
  'Domain Weighting + People/Process/BE': 'pmp-domain-weighting',
  'AI, Sustainability, Value Delivery': 'ai-in-project-management',
  'Eligibility, Application, Training-Hour Guidance': 'eligibility-application-contact-hours',
  'Study Plan, Scenario, Mock, Diagnostic': 'study-plan',
  'Foundation / Professional / Mastery tiers': 'pmp-foundation',
  'Pricing, Regional Access, LMS, Disclaimer': 'regional-pricing',
};

export function getPmpCategoryById(id: PmpCategoryId): PmpFaqCategory | undefined {
  return PMP_FAQ_CATEGORIES.find((c) => c.id === id);
}

export function getPmpCategoryLabel(id: PmpCategoryId): string {
  return getPmpCategoryById(id)?.label ?? id;
}

/** Unique H2 groups for /pmp-faq page (stable order). */
export const PMP_FAQ_HUB_H2_GROUPS: { h2: string; categoryIds: PmpCategoryId[] }[] = (() => {
  const h2Order = [
    'PMP exam change 2026',
    'Exam content & domains',
    'Modern exam themes',
    'Eligibility & application',
    'Readiness & study planning',
    'Practice & mock exams',
    'Pathways & tiers',
    'Pricing, LMS & policies',
  ];
  return h2Order.map((h2) => ({
    h2,
    categoryIds: PMP_FAQ_CATEGORIES.filter((c) => c.hubH2 === h2)
      .sort((a, b) => a.order - b.order)
      .map((c) => c.id),
  }));
})();

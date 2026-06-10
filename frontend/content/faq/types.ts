export type FaqClusterId =
  | 'about'
  | 'pathways'
  | 'timeline'
  | 'delivery'
  | 'pricing'
  | 'membership'
  | 'consultation'
  | 'exams'
  | 'privacy'
  | 'support'
  | 'geo'
  | 'pmp2026';

export type FaqComplianceRisk = 'low' | 'medium' | 'high';

export type FaqStatus = 'published' | 'draft';

export type FaqEntry = {
  id: string;
  clusterId: FaqClusterId;
  question: string;
  answer: string;
  complianceRisk?: FaqComplianceRisk;
  sourceUrl?: string;
  sourceTodo?: string;
  relatedCourse?: string;
  relatedPage?: string;
  schemaEligible?: boolean;
  status?: FaqStatus;
  /** Run 11 subcategory label for PMP 2026 FAQs */
  pmpCategory?: string;
};

export type FaqCluster = {
  id: FaqClusterId;
  title: string;
  description?: string;
};

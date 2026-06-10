import type { PmpCategoryId } from './pmp-categories';

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

export type FaqStatus = 'published' | 'planned' | 'draft';

export type FaqRecommendedNextStep =
  | 'readiness-diagnostic'
  | 'foundation'
  | 'professional'
  | 'mastery'
  | 'pmp-2026'
  | 'contact'
  | 'enroll';

export type FaqEntry = {
  id: string;
  clusterId: FaqClusterId;
  question: string;
  answer: string;
  shortAnswer?: string;
  fullAnswer?: string;
  complianceRisk?: FaqComplianceRisk;
  sourceUrl?: string;
  sourceTodo?: string;
  sourcePage?: string;
  sourceRequired?: boolean;
  relatedCourse?: string;
  relatedPage?: string;
  relatedPages?: string[];
  relatedAnswerSlug?: string;
  relatedTopicSlug?: string;
  canonicalUrl?: string;
  recommendedNextStep?: FaqRecommendedNextStep;
  dateModified?: string;
  version?: string;
  schemaEligible?: boolean;
  status?: FaqStatus;
  /** Phase 10: spec category id for PMP 2026 FAQs */
  pmpCategory?: PmpCategoryId | string;
};

export type FaqCluster = {
  id: FaqClusterId;
  title: string;
  description?: string;
};

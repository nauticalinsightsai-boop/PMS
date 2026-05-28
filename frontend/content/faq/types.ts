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
  | 'geo';

export type FaqEntry = {
  id: string;
  clusterId: FaqClusterId;
  question: string;
  answer: string;
};

export type FaqCluster = {
  id: FaqClusterId;
  title: string;
  description?: string;
};

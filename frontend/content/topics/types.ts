export type TopicResource = {
  href: string;
  label: string;
};

export type TopicFaq = {
  question: string;
  answer: string;
};

export type TopicReference = {
  label: string;
  href: string;
};

export type TopicStatus = 'published' | 'planned' | 'draft';

export type TopicHubContent = {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  whatIs: string;
  whyMatters: string;
  howExamReadiness?: string;
  viewpoint: string;
  sourceTodo?: string;
  cautions?: string[];
  references?: TopicReference[];
  relatedFaqIds?: string[];
  relatedCourses?: TopicResource[];
  targetQuery?: string;
  dateModified?: string;
  version?: string;
  status?: TopicStatus;
  resources: TopicResource[];
  relatedAnswers: TopicResource[];
  faqs?: TopicFaq[];
  ctaHref: string;
  ctaLabel: string;
};

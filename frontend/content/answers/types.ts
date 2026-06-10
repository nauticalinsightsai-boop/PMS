export type AnswerStatus = 'published' | 'planned' | 'draft';

export type AnswerLink = {
  href: string;
  label: string;
};

export type AnswerFaq = {
  question: string;
  answer: string;
};

export type AnswerReference = {
  label: string;
  url: string;
};

export type AnswerPageContent = {
  slug: string;
  path: string;
  question: string;
  title: string;
  description: string;
  shortAnswer: string;
  detailedAnswer: string;
  whoApplies?: string;
  cautions?: string[];
  sourceTodo?: string;
  references?: AnswerReference[];
  relatedFaqIds?: string[];
  dateModified?: string;
  status?: AnswerStatus;
  nextSteps: string[];
  relatedCourses: AnswerLink[];
  relatedPages: AnswerLink[];
  relatedAnswers: AnswerLink[];
  ctaHref: string;
  ctaLabel: string;
  faqs?: AnswerFaq[];
};

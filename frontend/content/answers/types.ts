export type AnswerLink = {
  href: string;
  label: string;
};

export type AnswerFaq = {
  question: string;
  answer: string;
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
  nextSteps: string[];
  relatedCourses: AnswerLink[];
  relatedPages: AnswerLink[];
  relatedAnswers: AnswerLink[];
  ctaHref: string;
  ctaLabel: string;
  faqs?: AnswerFaq[];
};

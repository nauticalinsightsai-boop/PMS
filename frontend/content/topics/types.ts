export type TopicResource = {
  href: string;
  label: string;
};

export type TopicFaq = {
  question: string;
  answer: string;
};

export type TopicHubContent = {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  whatIs: string;
  whyMatters: string;
  viewpoint: string;
  resources: TopicResource[];
  relatedAnswers: TopicResource[];
  faqs?: TopicFaq[];
  ctaHref: string;
  ctaLabel: string;
};

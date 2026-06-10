export type PmpFaq = {
  question: string;
  answer: string;
};

export type PmpSection = {
  id: string;
  heading: string;
  body: string;
};

export type PmpRelatedLink = {
  href: string;
  label: string;
};

export type PmpHubCard = {
  path: string;
  title: string;
  description: string;
};

export type PmpPageContent = {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  directAnswer: string;
  sections: PmpSection[];
  faqs?: PmpFaq[];
  relatedLinks: PmpRelatedLink[];
};

export type PmpServiceKind = 'diagnostic' | 'scenario' | 'mock' | 'support' | 'enrollment';

export type PmpServiceContent = {
  slug: string;
  path: string;
  kind: PmpServiceKind;
  title: string;
  description: string;
  h1: string;
  directAnswer: string;
  sections: PmpSection[];
  faqs?: PmpFaq[];
  ctaHref?: string;
  ctaLabel?: string;
};

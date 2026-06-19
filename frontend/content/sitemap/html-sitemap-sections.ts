export type HtmlSitemapLink = {
  href: string;
  label: string;
};

export type HtmlSitemapSection = {
  title: string;
  links: HtmlSitemapLink[];
};

/** Curated public indexable pages for /sitemap — not an auto-dump of all routes. */
export const HTML_SITEMAP_SECTIONS: HtmlSitemapSection[] = [
  {
    title: 'PMP 2026 readiness',
    links: [
      { href: '/certifications/pmp', label: 'PMP certification pathway' },
      { href: '/answers/is-the-pmp-exam-changing-in-2026', label: 'Is the PMP exam changing in 2026?' },
      { href: '/topics/pmp-exam-2026', label: 'PMP exam 2026 topic hub' },
      { href: '/faq', label: 'FAQ' },
      { href: '/certifications/compare', label: 'Compare certification pathways' },
      { href: '/pmp', label: 'PMP hub' },
      { href: '/pmp-exam-2026', label: 'PMP exam 2026 guide' },
      { href: '/pmp-current-vs-new-exam', label: 'Current vs new PMP exam' },
      { href: '/pmp-exam-timeline-2026', label: 'PMP exam timeline 2026' },
      { href: '/pmp-study-plan-2026', label: 'PMP study plan 2026' },
      { href: '/pmp-foundation', label: 'PMP Foundation pathway' },
      { href: '/pmp-professional', label: 'PMP Professional pathway' },
      { href: '/pmp-mastery', label: 'PMP Mastery pathway' },
      { href: '/pmp-readiness-diagnostic', label: 'PMP readiness diagnostic' },
    ],
  },
  {
    title: 'Certifications',
    links: [
      { href: '/certifications', label: 'Certification hub' },
      { href: '/certifications/pmi-rmp', label: 'PMI-RMP' },
      { href: '/certifications/pgmp', label: 'PgMP' },
      { href: '/certifications/prince2-practitioner', label: 'PRINCE2 Practitioner' },
      { href: '/certifications/lss-yellow', label: 'Lean Six Sigma Yellow Belt' },
      { href: '/certifications/lss-black', label: 'Lean Six Sigma Black Belt' },
    ],
  },
  {
    title: 'Answers & topics',
    links: [
      { href: '/answers', label: 'Direct answers index' },
      { href: '/topics', label: 'Topic hubs index' },
    ],
  },
  {
    title: 'Community & services',
    links: [
      { href: '/community', label: 'Community' },
      { href: '/membership', label: 'Membership' },
      { href: '/pm-service', label: 'PM Service' },
      { href: '/newsletter', label: 'Newsletter' },
      { href: '/blog', label: 'Blog' },
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/legal', label: 'Legal hub' },
      { href: '/legal/terms', label: 'Terms & Conditions' },
      { href: '/legal/privacy', label: 'Privacy Policy' },
      { href: '/legal/cookies', label: 'Cookie Policy' },
      { href: '/legal/refunds', label: 'Refunds & Cancellations' },
      { href: '/legal/services', label: 'Services Terms' },
    ],
  },
];

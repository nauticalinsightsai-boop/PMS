import { FAQ_HUB_PATH } from '@/constants/faq';

export const LEGAL_SLUGS = [
  'terms',
  'privacy',
  'cookies',
  'services',
  'pricing-disclaimers',
  'refunds',
  'membership-terms',
  'regional-pricing',
  'accessibility',
  'acceptable-use',
  'marketing',
  'subprocessors',
  'dmca',
  'tax',
  'security',
  'complaints',
  'ai',
  'dpa',
] as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export function isLegalSlug(slug: string): slug is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(slug);
}

export type LegalPolicyCard = {
  slug: LegalSlug;
  title: string;
  description: string;
  href: string;
};

export const LEGAL_HUB_PATH = '/legal';

export const LEGAL_LEGACY_SLUG_ALIASES = {
  pricing: 'pricing-disclaimers',
} as const;

export function getLegalDocumentPath(slug: LegalSlug): string {
  return `${LEGAL_HUB_PATH}/${slug}`;
}

export const LEGAL_POLICY_CARDS: LegalPolicyCard[] = [
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    description: 'Site use, accounts, intellectual property, and limitation of liability.',
    href: getLegalDocumentPath('terms'),
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect personal data, with regional addenda.',
    href: getLegalDocumentPath('privacy'),
  },
  {
    slug: 'cookies',
    title: 'Cookie Policy',
    description: 'Cookies, local storage, analytics consent, and how to manage preferences.',
    href: getLegalDocumentPath('cookies'),
  },
  {
    slug: 'services',
    title: 'Services Terms',
    description: 'Advisory, consultation, training, and booking terms.',
    href: getLegalDocumentPath('services'),
  },
  {
    slug: 'pricing-disclaimers',
    title: 'Pricing & disclaimers',
    description: 'Exam fees, trademarks, accreditation, and regional pricing.',
    href: getLegalDocumentPath('pricing-disclaimers'),
  },
];

/** Footer / portal / email */
export const FOOTER_LEGAL_LINKS = [
  { href: FAQ_HUB_PATH, label: 'FAQ', shortLabel: 'FAQ' },
  { href: LEGAL_HUB_PATH, label: 'Legal hub', shortLabel: 'Legal' },
  { href: getLegalDocumentPath('privacy'), label: 'Privacy Policy', shortLabel: 'Privacy' },
  { href: getLegalDocumentPath('terms'), label: 'Terms & Conditions', shortLabel: 'Terms' },
] as const;

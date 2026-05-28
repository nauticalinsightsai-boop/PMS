import type { LegalDocument } from './types';
import { termsDocument } from './terms';
import { cookiesDocument } from './cookies';
import { servicesDocument } from './services';
import { pricingDisclaimersDocument } from './pricing-disclaimers';
import { refundsDocument } from './refunds';
import { membershipTermsDocument } from './membership-terms';
import { regionalPricingDocument } from './regional-pricing';
import { accessibilityDocument } from './accessibility';
import { acceptableUseDocument } from './acceptable-use';
import { marketingDocument } from './marketing';
import { subprocessorsDocument } from './subprocessors';
import { dmcaDocument } from './dmca';
import { taxDocument } from './tax';
import { securityDocument } from './security';
import { complaintsDocument } from './complaints';
import { aiDocument } from './ai';
import { dpaDocument } from './dpa';

/** Slugs served by `app/(site)/legal/[slug]/page.tsx` (not privacy subtree). */
export const DYNAMIC_LEGAL_SLUGS = [
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

export type DynamicLegalSlug = (typeof DYNAMIC_LEGAL_SLUGS)[number];

const registry: Record<DynamicLegalSlug, LegalDocument> = {
  refunds: refundsDocument,
  'membership-terms': membershipTermsDocument,
  'regional-pricing': regionalPricingDocument,
  accessibility: accessibilityDocument,
  'acceptable-use': acceptableUseDocument,
  marketing: marketingDocument,
  subprocessors: subprocessorsDocument,
  dmca: dmcaDocument,
  tax: taxDocument,
  security: securityDocument,
  complaints: complaintsDocument,
  ai: aiDocument,
  dpa: dpaDocument,
};

export function getLegalDocumentBySlug(slug: string): LegalDocument | null {
  if ((DYNAMIC_LEGAL_SLUGS as readonly string[]).includes(slug)) {
    return registry[slug as DynamicLegalSlug];
  }
  switch (slug) {
    case 'terms':
      return termsDocument;
    case 'cookies':
      return cookiesDocument;
    case 'services':
      return servicesDocument;
    case 'pricing-disclaimers':
      return pricingDisclaimersDocument;
    default:
      return null;
  }
}

export function getAllLegalDocumentPaths(): string[] {
  return [
    '/legal',
    '/legal/terms',
    '/legal/privacy',
    '/legal/cookies',
    '/legal/services',
    '/legal/pricing-disclaimers',
    ...DYNAMIC_LEGAL_SLUGS.map((s) => `/legal/${s}`),
  ];
}

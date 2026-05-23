import type { GccCountryLegalSlug, LegalDocument, LegalHubCard, LegalRegionSlug } from './types';
import { termsDocument } from './terms';
import { cookiesDocument } from './cookies';
import { servicesDocument } from './services';
import { pricingDisclaimersDocument } from './pricing-disclaimers';
import { privacyGlobalDocument } from './privacy/global';
import { privacyEuDocument } from './privacy/eu';
import { privacyUkDocument } from './privacy/uk';
import { privacyUsDocument } from './privacy/us';
import { privacyGccDocument } from './privacy/gcc';
import { privacyIndiaDocument } from './privacy/india';
import { privacyPakistanDocument } from './privacy/pakistan';
import {
  getGccCountryPrivacyDocument,
  GCC_COUNTRY_SLUGS,
} from './privacy/gcc-countries';
import type { RegionId } from '@/types/regional-catalogue';
import type { GccCountryCode } from '@/types/regional-catalogue';

export * from './types';
export { LEGAL_DRAFT_NOTICE, LEGAL_LAST_UPDATED } from './shared';

const privacyRegionalAddenda: Record<LegalRegionSlug, LegalDocument | null> = {
  global: null,
  eu: privacyEuDocument,
  uk: privacyUkDocument,
  us: privacyUsDocument,
  gcc: privacyGccDocument,
  india: privacyIndiaDocument,
  pakistan: privacyPakistanDocument,
};

export const legalHubCards: LegalHubCard[] = [
  {
    title: 'Terms & Conditions',
    description: 'Website use, accounts, payments, and liability.',
    href: '/legal/terms',
  },
  {
    title: 'Privacy Policy',
    description: 'How we collect and use personal data, with regional addenda.',
    href: '/legal/privacy',
  },
  {
    title: 'Cookie Policy',
    description: 'Cookies, local storage, and how to manage consent.',
    href: '/legal/cookies',
  },
  {
    title: 'Services Terms',
    description: 'Advisory, consultation, and training engagements.',
    href: '/legal/services',
  },
  {
    title: 'Pricing & disclaimers',
    description: 'Exam fees, trademarks, accreditation, and regional pricing.',
    href: '/legal/pricing-disclaimers',
  },
];

export function getTermsDocument(): LegalDocument {
  return termsDocument;
}

export function getCookiesDocument(): LegalDocument {
  return cookiesDocument;
}

export function getServicesDocument(): LegalDocument {
  return servicesDocument;
}

export function getPricingDisclaimersDocument(): LegalDocument {
  return pricingDisclaimersDocument;
}

/** Merges global baseline with a regional addendum (and optional GCC country supplement). */
export function getPrivacyDocument(
  region: LegalRegionSlug,
  gccCountry?: GccCountryLegalSlug | null,
): LegalDocument {
  const addendum = privacyRegionalAddenda[region];
  const countryDoc =
    region === 'gcc' && gccCountry ? getGccCountryPrivacyDocument(gccCountry) : null;

  const sections = [
    ...privacyGlobalDocument.sections,
    ...(addendum
      ? [
          {
            id: 'regional-divider',
            heading: 'Regional addendum',
            body: addendum.jurisdictionNote,
          },
          ...addendum.sections,
        ]
      : []),
    ...(countryDoc
      ? [
          {
            id: 'country-divider',
            heading: 'Country supplement',
            body: countryDoc.jurisdictionNote,
          },
          ...countryDoc.sections,
        ]
      : []),
  ];

  const title =
    region === 'global'
      ? privacyGlobalDocument.title
      : countryDoc
        ? countryDoc.title
        : addendum?.title ?? privacyGlobalDocument.title;

  return {
    slug: `privacy-${region}${gccCountry ? `-${gccCountry}` : ''}`,
    title,
    lastUpdated: privacyGlobalDocument.lastUpdated,
    jurisdictionNote:
      countryDoc?.jurisdictionNote ??
      addendum?.jurisdictionNote ??
      privacyGlobalDocument.jurisdictionNote,
    sections,
  };
}

export function regionIdToLegalSlug(regionId: RegionId): LegalRegionSlug {
  switch (regionId) {
    case 'europe':
      return 'eu';
    case 'uk':
      return 'uk';
    case 'gcc':
      return 'gcc';
    case 'india':
      return 'india';
    case 'pakistan':
      return 'pakistan';
    default:
      return 'global';
  }
}

export function gccCountryCodeToLegalSlug(code: GccCountryCode | null): GccCountryLegalSlug | null {
  if (!code) return null;
  return code.toLowerCase() as GccCountryLegalSlug;
}

export function resolveDefaultPrivacyPath(
  regionId: RegionId,
  gccCountry: GccCountryCode | null,
): string {
  const legal = regionIdToLegalSlug(regionId);
  if (legal === 'gcc' && gccCountry) {
    const slug = gccCountryCodeToLegalSlug(gccCountry);
    if (slug) return `/legal/privacy/gcc/${slug}`;
  }
  if (legal === 'global') return '/legal/privacy';
  return `/legal/privacy/${legal}`;
}

export const PRIVACY_REGION_OPTIONS: { slug: LegalRegionSlug; label: string; href: string }[] = [
  { slug: 'global', label: 'Global', href: '/legal/privacy' },
  { slug: 'eu', label: 'EU / EEA', href: '/legal/privacy/eu' },
  { slug: 'uk', label: 'United Kingdom', href: '/legal/privacy/uk' },
  { slug: 'us', label: 'United States', href: '/legal/privacy/us' },
  { slug: 'gcc', label: 'GCC', href: '/legal/privacy/gcc' },
  { slug: 'india', label: 'India', href: '/legal/privacy/india' },
  { slug: 'pakistan', label: 'Pakistan', href: '/legal/privacy/pakistan' },
];

export { GCC_COUNTRY_SLUGS, getGccCountryPrivacyDocument };

import type { GccCountryLegalSlug, LegalDocument } from '../types';
import { LEGAL_CONTACT_EMAIL, LEGAL_LAST_UPDATED, section } from '../shared';

const GCC_COUNTRY_NAMES: Record<GccCountryLegalSlug, string> = {
  ae: 'United Arab Emirates',
  sa: 'Saudi Arabia',
  qa: 'Qatar',
  bh: 'Bahrain',
  kw: 'Kuwait',
  om: 'Oman',
};

function buildGccCountryDoc(country: GccCountryLegalSlug): LegalDocument {
  const name = GCC_COUNTRY_NAMES[country];
  return {
    slug: `privacy-gcc-${country}`,
    title: `Privacy Policy (${name})`,
    lastUpdated: LEGAL_LAST_UPDATED,
    jurisdictionNote: `Country supplement for ${name}. Template reference only — confirm with local counsel.`,
    sections: [
      section(
        'local',
        '1. Local framework',
        `${name} has national data protection requirements. This supplement highlights that residents may have rights regarding access, correction, and objection to processing under applicable local law.`,
      ),
      section(
        'processing',
        '2. Processing on our platform',
        'We process contact, transaction, and technical data as described in our Global Privacy Policy when you use PM Structure from this country.',
      ),
      section(
        'contact',
        '3. Contact',
        `Questions: ${LEGAL_CONTACT_EMAIL}.`,
      ),
    ],
  };
}

export const gccCountryPrivacyDocuments: Record<GccCountryLegalSlug, LegalDocument> = {
  ae: buildGccCountryDoc('ae'),
  sa: buildGccCountryDoc('sa'),
  qa: buildGccCountryDoc('qa'),
  bh: buildGccCountryDoc('bh'),
  kw: buildGccCountryDoc('kw'),
  om: buildGccCountryDoc('om'),
};

export function getGccCountryPrivacyDocument(country: string): LegalDocument | null {
  const slug = country.toLowerCase() as GccCountryLegalSlug;
  return gccCountryPrivacyDocuments[slug] ?? null;
}

export const GCC_COUNTRY_SLUGS = Object.keys(gccCountryPrivacyDocuments) as GccCountryLegalSlug[];

import type { GccCountryLegalSlug, LegalDocument } from '../types';
import { LEGAL_LAST_UPDATED, legalSupportSection, section } from '../shared';

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
    jurisdictionNote: `Privacy supplement for residents accessing PM Structure from ${name}.`,
    sections: [
      section(
        'local',
        '1. Local framework',
        `${name} has national data protection requirements. Residents may have rights regarding access, correction, and objection to processing under applicable local law.`,
      ),
      section(
        'processing',
        '2. Processing on our platform',
        'We process contact, transaction, and technical data as described in our [Global Privacy Policy](/legal/privacy) when you use PM Structure from this country. Regional pricing may show a global reference alongside Gulf regional rules.',
      ),
      section(
        'rights',
        '3. Exercising rights',
        'Email support with subject line including your country and the request type (access, correction, or complaint).',
      ),
      section(
        'retention',
        '4. Retention',
        'Retention periods follow our global policy unless local law requires a different minimum or maximum period.',
      ),
      section(
        'contact',
        '5. Contact',
        legalSupportSection(`${name} privacy`),
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

export function getGccCountryPrivacyDocument(country: GccCountryLegalSlug): LegalDocument {
  return gccCountryPrivacyDocuments[country];
}

export const GCC_COUNTRY_SLUGS = Object.keys(gccCountryPrivacyDocuments) as GccCountryLegalSlug[];

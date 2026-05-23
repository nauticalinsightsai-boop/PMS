import type { LegalDocument } from '../types';
import { LEGAL_LAST_UPDATED, section } from '../shared';

export const privacyGccDocument: LegalDocument = {
  slug: 'privacy-gcc',
  title: 'Privacy Policy (GCC)',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote:
    'Addendum for Gulf Cooperation Council countries. Country-specific supplements are available for UAE, Saudi Arabia, Qatar, Bahrain, Kuwait, and Oman.',
  sections: [
    section(
      'overview',
      '1. Overview',
      'This addendum applies when you select a GCC region or reside in a GCC member state. National personal data protection laws may apply in addition to this notice.',
    ),
    section(
      'rights',
      '2. Your rights',
      'Depending on your country you may have rights to access, correct, delete, or restrict processing of your personal data, and to withdraw consent where processing is consent-based.',
    ),
    section(
      'country',
      '3. Country supplements',
      'Select your country from the region switcher or visit the country-specific pages linked below for additional local references (template — counsel to confirm per jurisdiction).',
    ),
    section(
      'transfers',
      '4. Cross-border processing',
      'Your data may be processed on servers outside your country with safeguards appropriate to local law.',
    ),
  ],
};

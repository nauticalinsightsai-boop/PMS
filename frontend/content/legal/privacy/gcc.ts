import type { LegalDocument } from '../types';
import { LEGAL_LAST_UPDATED, legalSupportSection, section } from '../shared';

export const privacyGccDocument: LegalDocument = {
  slug: 'privacy-gcc',
  title: 'Privacy Policy (GCC)',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote:
    'Overview for Gulf Cooperation Council countries. Select your country in the region switcher for country-specific supplements.',
  sections: [
    section(
      'scope',
      '1. Scope',
      'This page applies when you select a GCC country in the region modal (UAE, Saudi Arabia, Qatar, Bahrain, Kuwait, Oman). National data protection laws vary; country pages below summarise local considerations.',
    ),
    section(
      'processing',
      '2. What we process',
      'We process contact, transaction, technical, and regional pricing data as described in our [Global Privacy Policy](/legal/privacy) when you use PM Structure from the GCC.',
    ),
    section(
      'rights',
      '3. Your rights',
      'Depending on your country you may have rights to access, correct, or object to certain processing. Email support to exercise rights.',
    ),
    section(
      'countries',
      '4. Country supplements',
      'Visit your country page from the privacy hub: UAE, Saudi Arabia, Qatar, Bahrain, Kuwait, and Oman each have a short supplement linked from [/legal/privacy](/legal/privacy).',
    ),
    section(
      'transfers',
      '5. Cross-border processing',
      'Data may be processed on cloud infrastructure outside your country with contractual safeguards where required.',
    ),
    section(
      'contact',
      '6. Contact',
      legalSupportSection('GCC privacy'),
    ),
  ],
};

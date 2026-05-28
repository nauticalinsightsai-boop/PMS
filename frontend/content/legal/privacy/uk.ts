import type { LegalDocument } from '../types';
import { LEGAL_LAST_UPDATED, LEGAL_SUPPORT_EMAIL, legalSupportSection, section } from '../shared';

export const privacyUkDocument: LegalDocument = {
  slug: 'privacy-uk',
  title: 'Privacy Policy (United Kingdom)',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'Addendum for individuals in the United Kingdom (UK GDPR).',
  sections: [
    section(
      'rights',
      '1. Your UK GDPR rights',
      'You have rights of access, rectification, erasure, restriction, portability, and to object to certain processing. You may withdraw consent for consent-based processing at any time.',
    ),
    section(
      'children',
      '2. Children',
      'Our services are not directed at children under 13. Purchases require you to be 18+ or the age of majority. We do not knowingly collect personal data from children under 13.',
    ),
    section(
      'complaints',
      '3. ICO',
      'You may complain to the Information Commissioner’s Office (ico.org.uk) if you believe we have not handled your data lawfully.',
    ),
    section(
      'transfers',
      '4. International transfers',
      'Where data is transferred outside the UK, we use appropriate safeguards such as UK International Data Transfer Agreements or adequacy regulations where applicable.',
    ),
    section(
      'requests',
      '5. How to exercise rights',
      `Email ${LEGAL_SUPPORT_EMAIL} with subject “UK privacy request” and enough detail to identify your account. We respond within one month unless an extension is permitted.`,
    ),
    section(
      'contact',
      '6. Contact',
      legalSupportSection('UK privacy'),
    ),
  ],
};

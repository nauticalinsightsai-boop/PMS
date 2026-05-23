import type { LegalDocument } from '../types';
import { LEGAL_CONTACT_EMAIL, LEGAL_LAST_UPDATED, section } from '../shared';

export const privacyUkDocument: LegalDocument = {
  slug: 'privacy-uk',
  title: 'Privacy Policy (United Kingdom)',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'Addendum for UK residents (UK GDPR and Data Protection Act 2018).',
  sections: [
    section(
      'rights',
      '1. Your UK rights',
      'You have rights under UK data protection law including access, correction, erasure, restriction, objection, and data portability in applicable cases.',
    ),
    section(
      'ico',
      '2. ICO complaints',
      'You may complain to the Information Commissioner’s Office (ICO) at ico.org.uk if you believe we have not handled your data lawfully.',
    ),
    section(
      'contact',
      '3. Contact',
      `UK-related requests: ${LEGAL_CONTACT_EMAIL}.`,
    ),
  ],
};

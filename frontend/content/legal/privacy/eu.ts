import type { LegalDocument } from '../types';
import { LEGAL_CONTACT_EMAIL, LEGAL_LAST_UPDATED, section } from '../shared';

export const privacyEuDocument: LegalDocument = {
  slug: 'privacy-eu',
  title: 'Privacy Policy (EU / EEA)',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'Addendum for individuals in the European Union and European Economic Area (GDPR).',
  sections: [
    section(
      'rights',
      '1. Your GDPR rights',
      'You have the right to access, rectification, erasure, restriction, portability, and to object to processing based on legitimate interests. You may withdraw consent at any time for consent-based processing.',
    ),
    section(
      'complaints',
      '2. Supervisory authority',
      'You may lodge a complaint with your local data protection authority. A list is available from the European Data Protection Board.',
    ),
    section(
      'dpo',
      '3. Data protection contact',
      `For GDPR requests contact ${LEGAL_CONTACT_EMAIL}. A Data Protection Officer will be named here if required by law.`,
    ),
    section(
      'transfers',
      '4. Transfers outside the EEA',
      'Where we transfer data outside the EEA, we use appropriate safeguards such as Standard Contractual Clauses approved by the European Commission.',
    ),
  ],
};

import type { LegalDocument } from '../types';
import { LEGAL_CONTACT_EMAIL, LEGAL_LAST_UPDATED, section } from '../shared';
import { REGION_COPY } from '@/lib/brand-voice';

export const privacyPakistanDocument: LegalDocument = {
  slug: 'privacy-pakistan',
  title: 'Privacy Policy (Pakistan)',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'Addendum for individuals in Pakistan.',
  sections: [
    section(
      'notice',
      '1. Notice',
      'We process personal data to deliver preparation services, verify regional scholarship eligibility, and respond to your enquiries.',
    ),
    section(
      'scholarship',
      '2. Regional scholarship pricing',
      REGION_COPY.southAsiaNote,
    ),
    section(
      'rights',
      '3. Rights',
      'You may request access, correction, or deletion of your personal data subject to applicable Pakistani law.',
    ),
    section(
      'contact',
      '4. Contact',
      `Pakistan-related requests: ${LEGAL_CONTACT_EMAIL}.`,
    ),
  ],
};

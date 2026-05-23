import type { LegalDocument } from '../types';
import { LEGAL_CONTACT_EMAIL, LEGAL_LAST_UPDATED, section } from '../shared';
import { REGION_COPY } from '@/lib/brand-voice';

export const privacyIndiaDocument: LegalDocument = {
  slug: 'privacy-india',
  title: 'Privacy Policy (India)',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'Addendum for individuals in India (Digital Personal Data Protection Act, 2023).',
  sections: [
    section(
      'notice',
      '1. Notice',
      'We process personal data for providing exam-preparation services, regional scholarship pricing verification, and communications you request.',
    ),
    section(
      'scholarship',
      '2. Regional scholarship pricing',
      REGION_COPY.southAsiaNote,
    ),
    section(
      'rights',
      '3. Rights',
      'You may have rights to access, correct, erase, and grievance redressal under applicable Indian law. Contact us to exercise rights.',
    ),
    section(
      'contact',
      '4. Contact',
      `India-related requests: ${LEGAL_CONTACT_EMAIL}.`,
    ),
  ],
};

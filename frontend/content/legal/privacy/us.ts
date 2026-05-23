import type { LegalDocument } from '../types';
import { LEGAL_CONTACT_EMAIL, LEGAL_LAST_UPDATED, section } from '../shared';

export const privacyUsDocument: LegalDocument = {
  slug: 'privacy-us',
  title: 'Privacy Policy (United States)',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote:
    'Addendum for US residents including California (CCPA/CPRA-style disclosures).',
  sections: [
    section(
      'categories',
      '1. Categories collected',
      'Identifiers (name, email), commercial information (orders), internet activity (logs/cookies), and geolocation derived from region selection.',
    ),
    section(
      'sell',
      '2. Sale or sharing',
      'We do not sell personal information. We do not share personal information for cross-context behavioural advertising as defined under California law.',
    ),
    section(
      'rights',
      '3. Your rights',
      'Depending on your state you may request access, deletion, correction, or opt-out of certain processing. Contact us to exercise rights.',
    ),
    section(
      'contact',
      '4. Contact',
      `US privacy requests: ${LEGAL_CONTACT_EMAIL}. We will verify your identity before fulfilling requests.`,
    ),
  ],
};

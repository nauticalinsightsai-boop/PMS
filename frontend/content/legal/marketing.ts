import type { LegalDocument } from './types';
import { LEGAL_LAST_UPDATED, legalSupportSection, section } from './shared';

export const marketingDocument: LegalDocument = {
  slug: 'marketing',
  title: 'Marketing & Communications',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'Newsletter, email, and promotional communications.',
  sections: [
    section(
      'consent',
      '1. Consent',
      'We send marketing email only when you opt in (e.g. newsletter signup). You can unsubscribe via the link in every email.',
    ),
    section(
      'content',
      '2. Content',
      'Messages may include exam prep tips, product updates, and regional pricing information. We do not sell your email to third-party marketers.',
    ),
    section(
      'transactional',
      '3. Transactional messages',
      'Order confirmations, access instructions, and consultation updates are service messages and may be sent without separate marketing consent.',
    ),
    section(
      'data',
      '4. Data use',
      'See [Privacy Policy](/legal/privacy) for how we process email addresses and preferences.',
    ),
    section(
      'contact',
      '5. Contact',
      legalSupportSection('marketing and newsletters'),
    ),
  ],
};

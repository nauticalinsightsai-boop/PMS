import type { LegalDocument } from './types';
import { LEGAL_LAST_UPDATED, LEGAL_SUPPORT_EMAIL, legalSupportSection, section } from './shared';

export const dmcaDocument: LegalDocument = {
  slug: 'dmca',
  title: 'Copyright & DMCA',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'Copyright complaints and counter-notice procedure.',
  sections: [
    section(
      'notice',
      '1. Copyright notice',
      'If you believe content on our site infringes your copyright, send a written notice with: (a) identification of the copyrighted work; (b) URL of the infringing material; (c) your contact details; (d) a statement of good-faith belief; (e) a statement under penalty of perjury that the information is accurate; (f) your physical or electronic signature.',
    ),
    section(
      'agent',
      '2. Designated contact',
      `Email ${LEGAL_SUPPORT_EMAIL} — Subject: DMCA Notice.`,
    ),
    section(
      'counter',
      '3. Counter-notice',
      'If your content was removed in error, you may submit a counter-notice with the information required under applicable law. We will forward it to the complainant where appropriate.',
    ),
    section(
      'repeat',
      '4. Repeat infringers',
      'We may terminate accounts of repeat infringers where appropriate.',
    ),
    section(
      'contact',
      '5. Contact',
      legalSupportSection('copyright'),
    ),
  ],
};

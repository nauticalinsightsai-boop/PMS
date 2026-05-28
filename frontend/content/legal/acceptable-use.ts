import type { LegalDocument } from './types';
import { LEGAL_LAST_UPDATED, LEGAL_SUPPORT_EMAIL, legalSupportSection, section } from './shared';
import { BRAND } from '@/lib/brand-voice';

export const acceptableUseDocument: LegalDocument = {
  slug: 'acceptable-use',
  title: 'Acceptable Use & Community Guidelines',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'Rules for community forums, study circles, and user conduct.',
  sections: [
    section(
      'respect',
      '1. Respectful conduct',
      'Treat other learners and staff with respect. No harassment, hate speech, or discrimination.',
    ),
    section(
      'exam-integrity',
      '2. Exam integrity',
      'Do not share live exam questions, brain dumps, or content that violates certification body rules. Discuss concepts and practice scenarios only.',
    ),
    section(
      'ip',
      '3. Intellectual property',
      'Do not redistribute course materials, templates, or mocks outside your personal licence.',
    ),
    section(
      'spam',
      '4. Spam & abuse',
      'No unsolicited marketing, phishing, or automated scraping of the platform.',
    ),
    section(
      'report',
      '5. Reporting violations',
      `Report violations to ${LEGAL_SUPPORT_EMAIL} with links, usernames, and a description. We review reports and may remove content or suspend accounts.`,
    ),
    section(
      'enforcement',
      '6. Enforcement',
      `${BRAND.name} may remove content or suspend accounts that violate these guidelines or our Terms.`,
    ),
    section(
      'contact',
      '7. Contact',
      legalSupportSection('community guidelines'),
    ),
  ],
};

import type { LegalDocument } from '../types';
import { LEGAL_LAST_UPDATED, LEGAL_SUPPORT_EMAIL, legalSupportSection, section } from '../shared';

export const privacyIndiaDocument: LegalDocument = {
  slug: 'privacy-india',
  title: 'Privacy Policy (India)',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'Addendum for individuals in India (DPDP Act and related rules, as applicable).',
  sections: [
    section(
      'scope',
      '1. Scope',
      'This supplement applies when you access PM Structure from India or when Indian law applies to our processing of your personal data.',
    ),
    section(
      'rights',
      '2. Your rights',
      'You may have rights to access, correction, erasure, grievance redressal, and nomination of a contact in certain circumstances under applicable Indian law.',
    ),
    section(
      'children',
      '3. Children',
      'Our services are not directed at children. Purchases require you to be 18+ or the age of majority. We do not knowingly collect personal data from children without appropriate authority.',
    ),
    section(
      'grievance',
      '4. Grievance contact',
      `For privacy grievances under Indian law, email ${LEGAL_SUPPORT_EMAIL} with subject “India privacy grievance”, your name, and a description of the issue. We acknowledge and work to resolve complaints in line with applicable timelines.`,
    ),
    section(
      'retention',
      '5. Retention',
      'We retain data as described in our [Global Privacy Policy](/legal/privacy) and delete or anonymise when no longer required, subject to legal retention obligations.',
    ),
    section(
      'contact',
      '6. Contact',
      legalSupportSection('India privacy'),
    ),
  ],
};

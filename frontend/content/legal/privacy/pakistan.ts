import type { LegalDocument } from '../types';
import { LEGAL_LAST_UPDATED, legalSupportSection, section } from '../shared';

export const privacyPakistanDocument: LegalDocument = {
  slug: 'privacy-pakistan',
  title: 'Privacy Policy (Pakistan)',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'Addendum for individuals in Pakistan.',
  sections: [
    section(
      'scope',
      '1. Scope',
      'This supplement applies when you access PM Structure from Pakistan or when Pakistani law applies to our processing.',
    ),
    section(
      'rights',
      '2. Your rights',
      'You may have rights regarding access, correction, and objection to processing under applicable Pakistani law. Our [Global Privacy Policy](/legal/privacy) describes what we collect and why.',
    ),
    section(
      'scholarship',
      '3. Regional scholarship pricing',
      'South Asia regional scholarship pricing applies when residence and billing country match Pakistan, as described in [Regional pricing](/legal/regional-pricing).',
    ),
    section(
      'retention',
      '4. Retention',
      'We retain personal data only as long as needed for the purposes described globally, unless law requires longer retention.',
    ),
    section(
      'requests',
      '5. Privacy requests',
      'Email support with subject “Pakistan privacy request” and enough detail to identify your account.',
    ),
    section(
      'contact',
      '6. Contact',
      legalSupportSection('Pakistan privacy'),
    ),
  ],
};

import type { LegalDocument } from '../types';
import { LEGAL_LAST_UPDATED, LEGAL_SUPPORT_EMAIL, legalSupportSection, section } from '../shared';

export const privacyEuDocument: LegalDocument = {
  slug: 'privacy-eu',
  title: 'Privacy Policy (EU / EEA)',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'Addendum for individuals in the European Union and European Economic Area (GDPR).',
  sections: [
    section(
      'rights',
      '1. Your GDPR rights',
      'You have the right to access, rectification, erasure, restriction, portability, and to object to processing based on legitimate interests. You may withdraw consent at any time for consent-based processing (e.g. marketing, analytics cookies).',
    ),
    section(
      'bases',
      '2. Lawful bases (summary)',
      '• Contract — orders and account services.\n• Consent — newsletters and non-essential cookies.\n• Legitimate interests — security and service improvement (balanced against your rights).\n• Legal obligation — compliance and record-keeping.',
    ),
    section(
      'children',
      '3. Children',
      'Our services are not directed at children under 16. In some member states, parental consent may be required for information society services offered to children aged 13–16. We do not knowingly process children’s data for marketing.',
    ),
    section(
      'retention',
      '4. Retention',
      'We retain personal data only as long as needed for the purposes in our [Global Privacy Policy](/legal/privacy), unless a longer period is required by law.',
    ),
    section(
      'complaints',
      '5. Supervisory authority',
      'You may lodge a complaint with your local data protection authority. A list is available from the European Data Protection Board (edpb.europa.eu).',
    ),
    section(
      'transfers',
      '6. Transfers outside the EEA',
      'Where we transfer data outside the EEA, we use appropriate safeguards such as Standard Contractual Clauses approved by the European Commission.',
    ),
    section(
      'requests',
      '7. How to exercise rights',
      `Email ${LEGAL_SUPPORT_EMAIL} with subject “GDPR request”, your country, and the right you wish to exercise. We respond within one month where GDPR applies, and may extend by two further months for complex requests.`,
    ),
    section(
      'contact',
      '8. Contact',
      legalSupportSection('EU/EEA privacy'),
    ),
  ],
};

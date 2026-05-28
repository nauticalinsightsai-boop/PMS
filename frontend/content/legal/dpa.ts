import type { LegalDocument } from './types';
import { LEGAL_LAST_UPDATED, LEGAL_SUPPORT_EMAIL, legalSupportSection, section } from './shared';
import { BRAND } from '@/lib/brand-voice';

export const dpaDocument: LegalDocument = {
  slug: 'dpa',
  title: 'Data Processing Agreement',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'For corporate training and enterprise customers where we process personal data on your behalf.',
  sections: [
    section(
      'purpose',
      '1. Purpose',
      `This Data Processing Agreement (“DPA”) applies when ${BRAND.name} processes personal data on behalf of a business customer under a written services agreement (e.g. cohort licensing or corporate pathway access).`,
    ),
    section(
      'roles',
      '2. Roles',
      'The customer is typically the controller for learner and employee data. We act as processor and process personal data only on documented instructions to deliver the contracted service.',
    ),
    section(
      'security',
      '3. Security',
      'We implement appropriate technical and organisational measures, including access controls, encryption in transit where supported, and subprocessors vetted for security. See [Security](/legal/security).',
    ),
    section(
      'subprocessors',
      '4. Subprocessors',
      'Customer authorises use of subprocessors listed at [/legal/subprocessors](/legal/subprocessors). We provide notice of material changes via this page and the privacy policy last-updated date.',
    ),
    section(
      'breach',
      '5. Personal data breaches',
      'We notify the customer without undue delay after becoming aware of a personal data breach affecting customer data, with information required to meet the customer’s regulatory obligations.',
    ),
    section(
      'audit',
      '6. Audits',
      'Upon reasonable request and subject to confidentiality, we provide information necessary to demonstrate compliance with this DPA, supplemented by security documentation where available.',
    ),
    section(
      'request',
      '7. Request a signed DPA',
      `Email ${LEGAL_SUPPORT_EMAIL} with your entity name, registered address, scope of processing (learner count, regions, duration), and the services agreement reference. We will provide a countersigned DPA where applicable.`,
    ),
    section(
      'contact',
      '8. Contact',
      legalSupportSection('enterprise data processing'),
    ),
  ],
};

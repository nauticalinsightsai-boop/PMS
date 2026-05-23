import type { LegalDocument } from '../types';
import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_CONTROLLER_PLACEHOLDER,
  LEGAL_LAST_UPDATED,
  section,
} from '../shared';
import { BRAND } from '@/lib/brand-voice';

export const privacyGlobalDocument: LegalDocument = {
  slug: 'privacy-global',
  title: 'Privacy Policy (Global)',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote:
    'Baseline privacy notice for all visitors. Select your region for additional rights and disclosures.',
  sections: [
    section(
      'controller',
      '1. Who we are',
      `Controller: ${LEGAL_CONTROLLER_PLACEHOLDER}. Contact: ${LEGAL_CONTACT_EMAIL}. This policy explains how ${BRAND.name} processes personal data on our website and services.`,
    ),
    section(
      'collect',
      '2. Data we collect',
      '• Identity & contact: name, email, phone when you contact us, subscribe, or checkout.\n• Account: login credentials and profile if you register.\n• Transaction: order history, residence/billing country, regional pricing verification.\n• Technical: IP address, browser type, device data, cookies (see Cookie Policy).\n• Communications: messages you send us and newsletter preferences.\n• Region selection: country/region you choose for pricing.',
    ),
    section(
      'use',
      '3. How we use data',
      'To provide pathways and services, process payments, verify regional eligibility, send newsletters you opt into, improve the site, comply with law, and respond to enquiries.',
    ),
    section(
      'bases',
      '4. Legal bases (where GDPR applies)',
      'Contract (delivering your order), consent (marketing/newsletter), legitimate interests (security, analytics where permitted), and legal obligation.',
    ),
    section(
      'sharing',
      '5. Sharing',
      'We use processors for hosting, email, payments (e.g. Stripe), and analytics (if enabled). We do not sell personal data. We may disclose data if required by law.',
    ),
    section(
      'retention',
      '6. Retention',
      'We keep data only as long as needed for the purposes above, then delete or anonymise unless law requires longer retention.',
    ),
    section(
      'transfers',
      '7. International transfers',
      'Data may be processed outside your country with appropriate safeguards (e.g. standard contractual clauses) where required.',
    ),
    section(
      'rights',
      '8. Your rights',
      'Depending on your location you may have rights to access, correct, delete, restrict, object, or port your data, and withdraw consent. See regional addenda for local procedures.',
    ),
    section(
      'children',
      '9. Children',
      'Our services are not directed at children under 16. We do not knowingly collect their data.',
    ),
    section(
      'changes',
      '10. Changes',
      'We will post updates on this page with a new “Last updated” date.',
    ),
  ],
};

import type { LegalDocument } from './types';
import { LEGAL_LAST_UPDATED, LEGAL_SUPPORT_EMAIL, legalSupportSection, section } from './shared';
import { BRAND } from '@/lib/brand-voice';

export const refundsDocument: LegalDocument = {
  slug: 'refunds',
  title: 'Refunds & Cancellations',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'How refunds and cancellations work for tuition, membership, and services.',
  sections: [
    section(
      'overview',
      '1. Overview',
      `${BRAND.name} refund and cancellation rules depend on the product purchased (certification pathway, membership, or advisory services). The summary below applies unless your checkout or order confirmation states otherwise.`,
    ),
    section(
      'pathways',
      '2. Certification pathways',
      '• Before access: you may request cancellation within 14 days of purchase if you have not started the LMS or downloaded substantial materials.\n• After access begins: refunds are generally not available except where required by law or where we cancel the offering.\n• Email support with your order email and offering ID.',
    ),
    section(
      'membership',
      '3. Membership',
      'Membership fees renew according to the plan you select. Cancel before the next billing date to avoid renewal; access continues until the end of the paid period. Partial refunds for unused months are not guaranteed unless stated at signup or required by law.',
    ),
    section(
      'services',
      '4. Advisory & consultation',
      'Cancelled consultations with at least 24 hours notice may be rescheduled. No-shows or late cancellations may forfeit the session fee per your booking confirmation.',
    ),
    section(
      'verification',
      '5. Scholarship verification',
      'If regional scholarship verification fails at checkout, update residence and billing country to match your region or select a different region before paying. If you were charged in error, email support immediately with your order email.',
    ),
    section(
      'process',
      '6. How to request a refund',
      `Email ${LEGAL_SUPPORT_EMAIL} with your name, order email, offering ID, and reason. We respond within 10 business days. For chargebacks, contact support first so we can resolve billing disputes.`,
    ),
    section(
      'law',
      '7. Mandatory rights',
      `Nothing in this policy limits statutory consumer rights in your country. See also our [Terms & Conditions](/legal/terms).`,
    ),
    section(
      'contact',
      '8. Contact',
      legalSupportSection('refunds'),
    ),
  ],
};

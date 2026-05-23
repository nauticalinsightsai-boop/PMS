import type { LegalDocument } from './types';
import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_CONTROLLER_PLACEHOLDER,
  LEGAL_LAST_UPDATED,
  LEGAL_SUPPORT_EMAIL,
  section,
} from './shared';
import { BRAND, DISCLAIMERS } from '@/lib/brand-voice';

export const termsDocument: LegalDocument = {
  slug: 'terms',
  title: 'Terms & Conditions',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'Global website terms. Regional privacy addenda apply where required.',
  sections: [
    section(
      'acceptance',
      '1. Acceptance',
      `By accessing ${BRAND.name} (${BRAND.website}), creating an account, purchasing preparation pathways, or using advisory services, you agree to these Terms & Conditions. If you do not agree, do not use the platform.`,
    ),
    section(
      'eligibility',
      '2. Eligibility',
      'You must be at least 18 years old (or the age of majority in your jurisdiction) and able to enter a binding contract. You are responsible for ensuring certification eligibility with the relevant certification body before scheduling an official exam.',
    ),
    section(
      'services',
      '3. Services',
      `${BRAND.name} provides independent exam-preparation content, structured readiness pathways, membership resources, community access, and optional advisory or training services. We are not an official certification body unless expressly stated in writing for a specific offering.`,
    ),
    section(
      'payments',
      '4. Payments & refunds',
      'Tuition, membership, and service fees are shown at checkout with applicable regional pricing. Official exam fees, certification-body fees, taxes, and third-party charges are excluded unless stated otherwise. Refund and cancellation rules for paid offerings will be stated at checkout and in order confirmations. Contact support for billing disputes.',
    ),
    section(
      'ip',
      '5. Intellectual property',
      'All site content, templates, branding, and course materials are owned by or licensed to us. You receive a limited, non-transferable licence for personal study. You may not resell, scrape, or redistribute materials without written permission.',
    ),
    section(
      'disclaimers',
      '6. Exam prep & outcomes',
      `${DISCLAIMERS.accreditation} ${BRAND.name} does not guarantee exam passes, certification awards, PDU/contact-hour approval, or employment outcomes.`,
    ),
    section(
      'liability',
      '7. Limitation of liability',
      'To the fullest extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from use of the platform. Our aggregate liability for any claim relating to a paid order is limited to the amount you paid for that order in the twelve months before the claim.',
    ),
    section(
      'law',
      '8. Governing law',
      'These terms are governed by the laws specified in your order confirmation or, if none, the laws of England and Wales, without regard to conflict-of-law rules. Courts in London, UK shall have exclusive jurisdiction unless mandatory consumer law in your country requires otherwise.',
    ),
    section(
      'changes',
      '9. Changes',
      'We may update these terms. Material changes will be posted on this page with an updated “Last updated” date. Continued use after changes constitutes acceptance.',
    ),
    section(
      'contact',
      '10. Contact',
      `Data controller / operator (placeholder): ${LEGAL_CONTROLLER_PLACEHOLDER}. Questions: ${LEGAL_CONTACT_EMAIL} or ${LEGAL_SUPPORT_EMAIL}.`,
    ),
  ],
};

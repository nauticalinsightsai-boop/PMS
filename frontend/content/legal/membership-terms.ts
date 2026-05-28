import type { LegalDocument } from './types';
import { LEGAL_LAST_UPDATED, LEGAL_SUPPORT_EMAIL, legalSupportSection, section } from './shared';
import { BRAND, REGION_COPY } from '@/lib/brand-voice';

export const membershipTermsDocument: LegalDocument = {
  slug: 'membership-terms',
  title: 'Membership Terms',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'Terms for Free, Professional, and Mastery membership plans.',
  sections: [
    section(
      'plans',
      '1. Plans',
      `${BRAND.name} offers membership tiers with different community, resource, and support access. Features and prices are shown on the [Membership](/membership) page and at checkout.`,
    ),
    section(
      'cert-benefit',
      '2. Certification tuition benefit',
      `Active members may receive ${REGION_COPY.membershipDiscountNote} on eligible certification pathways when membership is selected at checkout. This benefit applies to displayed regional tuition, not official exam fees.`,
    ),
    section(
      'billing',
      '3. Billing & renewal',
      `Paid memberships bill monthly or annually as selected. Renewal charges automatically unless you cancel before the renewal date in account settings or by emailing ${LEGAL_SUPPORT_EMAIL}.`,
    ),
    section(
      'cancel',
      '4. Cancellation',
      'You may cancel at any time; access continues until the end of the current paid period. We do not prorate unused time unless required by law. See [Refunds](/legal/refunds).',
    ),
    section(
      'conduct',
      '5. Community conduct',
      'Members must follow our [Acceptable Use](/legal/acceptable-use) policy in forums and study circles. We may suspend membership for violations.',
    ),
    section(
      'contact',
      '6. Contact',
      legalSupportSection('membership billing'),
    ),
  ],
};

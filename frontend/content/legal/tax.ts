import type { LegalDocument } from './types';
import { LEGAL_LAST_UPDATED, legalSupportSection, section } from './shared';
import { REGION_COPY } from '@/lib/brand-voice';

export const taxDocument: LegalDocument = {
  slug: 'tax',
  title: 'Tax & Invoicing',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'Taxes, invoices, and checkout currency.',
  sections: [
    section(
      'currency',
      '1. Checkout currency',
      REGION_COPY.checkoutNote,
    ),
    section(
      'taxes',
      '2. Taxes',
      'Displayed prices may exclude VAT, GST, or sales tax unless stated at checkout. You are responsible for any applicable taxes in your jurisdiction unless we are required to collect them.',
    ),
    section(
      'invoices',
      '3. Invoices',
      'Order confirmations serve as receipts. Business customers may request invoices with entity details by emailing support after purchase with order email and billing entity name.',
    ),
    section(
      'business',
      '4. Tax IDs',
      'If you need a VAT/GST ID on an invoice, include it in your support request. We will accommodate where our billing systems allow.',
    ),
    section(
      'contact',
      '5. Contact',
      legalSupportSection('tax and invoicing'),
    ),
  ],
};

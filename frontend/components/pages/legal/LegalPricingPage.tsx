'use client';

import { getPricingDisclaimersDocument } from '@/content/legal';
import { LegalDocumentLayout } from '@/components/legal/LegalDocumentLayout';

export function LegalPricingPage() {
  return <LegalDocumentLayout document={getPricingDisclaimersDocument()} />;
}

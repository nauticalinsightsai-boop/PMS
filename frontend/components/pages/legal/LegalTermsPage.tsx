'use client';

import { getTermsDocument } from '@/content/legal';
import { LegalDocumentLayout } from '@/components/legal/LegalDocumentLayout';

export function LegalTermsPage() {
  return <LegalDocumentLayout document={getTermsDocument()} />;
}

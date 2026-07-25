'use client';

import { getCookiesDocument } from '@/content/legal';
import { LegalDocumentLayout } from '@/components/legal/LegalDocumentLayout';

export function LegalCookiesPage() {
  return <LegalDocumentLayout document={getCookiesDocument()} />;
}

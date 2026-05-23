'use client';

import { getServicesDocument } from '@/content/legal';
import { LegalDocumentLayout } from '@/components/legal/LegalDocumentLayout';

export function LegalServicesPage() {
  return <LegalDocumentLayout document={getServicesDocument()} />;
}

import type { Metadata } from 'next';
import { LegalTermsPage } from '@/components/pages/legal/LegalTermsPage';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = buildPhase2PageMetadata('/legal/terms')!;

export default function Page() {
  return <LegalTermsPage />;
}

import type { Metadata } from 'next';
import { LegalPrivacyPage } from '@/components/pages/legal/LegalPrivacyPage';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = buildPhase2PageMetadata('/legal/privacy')!;

export default function Page() {
  return <LegalPrivacyPage />;
}

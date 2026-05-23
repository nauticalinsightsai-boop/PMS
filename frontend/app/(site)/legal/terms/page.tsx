import type { Metadata } from 'next';
import { LegalTermsPage } from '@/components/pages/legal/LegalTermsPage';
import { BRAND } from '@/lib/brand-voice';

export const metadata: Metadata = {
  title: `Terms & Conditions | ${BRAND.name}`,
};

export default function Page() {
  return <LegalTermsPage />;
}

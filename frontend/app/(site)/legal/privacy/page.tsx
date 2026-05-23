import type { Metadata } from 'next';
import { LegalPrivacyPage } from '@/components/pages/legal/LegalPrivacyPage';
import { BRAND } from '@/lib/brand-voice';

export const metadata: Metadata = {
  title: `Privacy Policy | ${BRAND.name}`,
};

export default function Page() {
  return <LegalPrivacyPage />;
}

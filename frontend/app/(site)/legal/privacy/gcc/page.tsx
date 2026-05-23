import type { Metadata } from 'next';
import { LegalPrivacyRegionPage } from '@/components/pages/legal/LegalPrivacyPage';
import { BRAND } from '@/lib/brand-voice';

export const metadata: Metadata = {
  title: `Privacy Policy (GCC) | ${BRAND.name}`,
};

export default function Page() {
  return <LegalPrivacyRegionPage region="gcc" />;
}

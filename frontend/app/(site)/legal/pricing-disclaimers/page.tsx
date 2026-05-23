import type { Metadata } from 'next';
import { LegalPricingPage } from '@/components/pages/legal/LegalPricingPage';
import { BRAND } from '@/lib/brand-voice';

export const metadata: Metadata = {
  title: `Pricing & disclaimers | ${BRAND.name}`,
};

export default function Page() {
  return <LegalPricingPage />;
}

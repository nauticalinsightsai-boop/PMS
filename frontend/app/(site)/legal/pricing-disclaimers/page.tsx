import { LegalPricingPage } from '@/components/pages/legal/LegalPricingPage';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Pricing & Certification Disclaimers',
  description: 'Review PM Structure pricing, certification, trademark, exam-fee, and accreditation disclaimers.',
  path: '/legal/pricing-disclaimers',
});

export default function Page() {
  return <LegalPricingPage />;
}

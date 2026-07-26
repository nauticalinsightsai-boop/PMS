import { LegalPricingPage } from '@/components/pages/legal/LegalPricingPage';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Pricing & disclaimers',
  description:
    'Pricing, scholarship, and regional fee disclaimers for PM Structure certification pathways and related services.',
  path: '/legal/pricing-disclaimers',
});

export default function Page() {
  return <LegalPricingPage />;
}

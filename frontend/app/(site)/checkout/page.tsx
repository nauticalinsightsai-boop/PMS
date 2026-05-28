import { CheckoutPage } from '@/components/pages/Checkout';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Checkout',
  description: 'Complete your certification pathway purchase.',
  path: '/checkout',
  robots: { index: false, follow: false },
});

export default function Page() {
  return <CheckoutPage />;
}

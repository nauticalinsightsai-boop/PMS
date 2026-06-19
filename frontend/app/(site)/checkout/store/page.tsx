import { StoreCheckoutPage } from '@/components/pages/StoreCheckout';
import { buildPageMetadata } from '@/lib/site-metadata';
import { getStripePublishableKey } from '@/lib/stripe-publishable-key.server';

export const metadata = buildPageMetadata({
  title: 'Store checkout',
  description: 'Purchase PM Structure digital resources securely.',
  robots: { index: false, follow: false },
  path: '/checkout/store',
});

export default function Page() {
  const publishableKeyHint = getStripePublishableKey();
  return <StoreCheckoutPage publishableKeyHint={publishableKeyHint || null} />;
}

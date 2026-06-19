import { MembershipCheckoutPage } from '@/components/pages/MembershipCheckout';
import { buildPageMetadata } from '@/lib/site-metadata';
import { getStripePublishableKey } from '@/lib/stripe-publishable-key.server';

export const metadata = buildPageMetadata({
  title: 'Membership checkout',
  description: 'Complete your PM Structure membership purchase securely.',
  robots: { index: false, follow: false },
  path: '/membership/checkout',
});

export default function Page() {
  const publishableKeyHint = getStripePublishableKey();
  return <MembershipCheckoutPage publishableKeyHint={publishableKeyHint || null} />;
}

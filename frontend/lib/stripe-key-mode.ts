export function isStripeTestPublishableKey(key: string): boolean {
  return key.trim().startsWith('pk_test_');
}

export function isStripeLivePublishableKey(key: string): boolean {
  return key.trim().startsWith('pk_live_');
}

export function isProductionMarketingHost(hostname?: string): boolean {
  const h = (hostname ?? (typeof window !== 'undefined' ? window.location.hostname : '')).toLowerCase();
  return h === 'pmstructure.com' || h === 'www.pmstructure.com';
}

export const STRIPE_TEST_KEYS_ON_LIVE_SITE_MESSAGE =
  'Checkout is in Stripe test mode on the live site. Set pk_live_ and sk_live_ keys in your production environment, then redeploy.';

export function assertPublishableKeyAllowedOnHost(key: string, hostname?: string): string | null {
  if (!key.startsWith('pk_')) return 'Stripe publishable key is missing or invalid.';
  if (isProductionMarketingHost(hostname) && isStripeTestPublishableKey(key)) {
    return STRIPE_TEST_KEYS_ON_LIVE_SITE_MESSAGE;
  }
  return null;
}

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

/** Choose the best publishable key from server hint, client bundle, and /config/stripe. */
export function pickStripePublishableKey(options: {
  hint?: string | null;
  env?: string;
  api?: string;
  hostname?: string;
}): string {
  const hint = options.hint?.trim() ?? '';
  const env = options.env?.trim() ?? '';
  const api = options.api?.trim() ?? '';
  const onLiveSite = isProductionMarketingHost(options.hostname);

  if (onLiveSite) {
    if (hint.startsWith('pk_live_')) return hint;
    if (api.startsWith('pk_live_')) return api;
    if (env.startsWith('pk_live_')) return env;
    if (api.startsWith('pk_')) return api;
    if (env.startsWith('pk_')) return env;
    if (hint.startsWith('pk_')) return hint;
    return '';
  }

  if (hint.startsWith('pk_')) return hint;
  if (api.startsWith('pk_')) return api;
  if (env.startsWith('pk_')) return env;
  return '';
}

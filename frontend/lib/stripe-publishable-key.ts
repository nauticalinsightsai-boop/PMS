/**
 * Resolve Stripe publishable key for embedded checkout (server + build-time).
 * Accepts NEXT_PUBLIC_* (client bundle) or STRIPE_PUBLISHABLE_KEY (server-only on Vercel).
 */
export function getStripePublishableKey(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    process.env.STRIPE_PUBLISHABLE_KEY,
  ];

  for (const candidate of candidates) {
    const key = candidate?.trim() ?? '';
    if (key.startsWith('pk_')) return key;
  }

  return '';
}

export function stripePublishableKeyUnavailableMessage(): string {
  if (process.env.NODE_ENV === 'production') {
    return 'Stripe checkout is temporarily unavailable. Our team has been notified — please try again shortly or contact support@pmstructure.com.';
  }

  return 'Stripe checkout is unavailable. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to repo root .env.local, then restart with: npm run dev:fresh';
}

import Stripe from 'stripe';
import { ensureMonorepoEnv } from '@/lib/ensure-monorepo-env';

let stripeClient: Stripe | null = null;

export function isStripeConfigured(): boolean {
  ensureMonorepoEnv();
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  return Boolean(key && /^(sk_|rk_)/.test(key));
}

/** Human-readable misconfiguration (invalid key shape, wrong product, etc.). */
export function getStripeSecretKeyIssue(): string | null {
  ensureMonorepoEnv();
  const key = process.env.STRIPE_SECRET_KEY?.trim() ?? '';
  if (!key) return 'STRIPE_SECRET_KEY is not configured';
  if (!/^(sk_|rk_)/.test(key)) {
    return 'STRIPE_SECRET_KEY must start with sk_ (secret) or rk_ (restricted)';
  }
  if (/^sk_(live|test)_mk_/i.test(key)) {
    return 'STRIPE_SECRET_KEY is invalid. Use Stripe Dashboard → Developers → API keys → Secret key (starts with sk_live_51...).';
  }
  if (!/^(sk|rk)_(test|live)_/.test(key)) return 'STRIPE_SECRET_KEY format is invalid';
  return null;
}

export function isStripeTestMode(): boolean {
  ensureMonorepoEnv();
  const key = process.env.STRIPE_SECRET_KEY?.trim() ?? '';
  return key.startsWith('sk_test_') || key.startsWith('rk_test_');
}

export function getStripe(): Stripe {
  if (!isStripeConfigured()) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!.trim(), {
      typescript: true,
    });
  }
  return stripeClient;
}

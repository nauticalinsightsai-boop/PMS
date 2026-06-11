import Stripe from 'stripe';
import { ensureMonorepoEnv } from '@/lib/ensure-monorepo-env';

let stripeClient: Stripe | null = null;

export function isStripeConfigured(): boolean {
  ensureMonorepoEnv();
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  return Boolean(key && key.startsWith('sk_'));
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

import { ensureMonorepoEnv } from '@/lib/ensure-monorepo-env';
import { jsonOk } from '@/lib/response-helpers.js';

export async function GET() {
  ensureMonorepoEnv();
  return jsonOk({
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? '',
  });
}

import { ensureMonorepoEnv } from '@/lib/ensure-monorepo-env';
import { jsonOk } from '@/lib/response-helpers.js';

function readPublishableKey(): string {
  ensureMonorepoEnv();
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

export async function GET() {
  return jsonOk({
    stripePublishableKey: readPublishableKey(),
  });
}

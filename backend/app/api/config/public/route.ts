import { ensureMonorepoEnv, readMonorepoPublishableKey } from '@/lib/ensure-monorepo-env';
import { jsonOk } from '@/lib/response-helpers.js';

export async function GET() {
  ensureMonorepoEnv();
  return jsonOk({
    stripePublishableKey: readMonorepoPublishableKey(),
  });
}

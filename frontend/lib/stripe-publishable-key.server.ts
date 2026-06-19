/** Server-only Stripe publishable key (runtime env + repo root .env.local). */
export { readMonorepoPublishableKey as getStripePublishableKey } from '../../backend/lib/ensure-monorepo-env';

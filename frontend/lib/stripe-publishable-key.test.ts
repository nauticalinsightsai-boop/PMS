import { afterEach, describe, expect, it } from 'vitest';
import { getStripePublishableKey } from './stripe-publishable-key';

describe('getStripePublishableKey', () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    delete process.env.STRIPE_PUBLISHABLE_KEY;
  });

  it('prefers NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', () => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_live_public';
    process.env.STRIPE_PUBLISHABLE_KEY = 'pk_live_server';
    expect(getStripePublishableKey()).toBe('pk_live_public');
  });

  it('falls back to STRIPE_PUBLISHABLE_KEY', () => {
    process.env.STRIPE_PUBLISHABLE_KEY = 'pk_live_server';
    expect(getStripePublishableKey()).toBe('pk_live_server');
  });

  it('returns empty when unset', () => {
    expect(getStripePublishableKey()).toBe('');
  });
});

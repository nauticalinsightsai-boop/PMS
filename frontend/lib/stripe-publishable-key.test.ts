import { afterEach, describe, expect, it } from 'vitest';
import { readStripePublishableKeyFromEnv } from './stripe-publishable-key';
import { getStripePublishableKey } from './stripe-publishable-key.server';

describe('readStripePublishableKeyFromEnv', () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    delete process.env.STRIPE_PUBLISHABLE_KEY;
  });

  it('prefers NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', () => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_live_public';
    process.env.STRIPE_PUBLISHABLE_KEY = 'pk_live_server';
    expect(readStripePublishableKeyFromEnv()).toBe('pk_live_public');
  });

  it('falls back to STRIPE_PUBLISHABLE_KEY', () => {
    process.env.STRIPE_PUBLISHABLE_KEY = 'pk_live_server';
    expect(readStripePublishableKeyFromEnv()).toBe('pk_live_server');
  });

  it('returns empty when unset', () => {
    expect(readStripePublishableKeyFromEnv()).toBe('');
  });
});

describe('getStripePublishableKey (server)', () => {
  it('loads publishable key from repo root .env.local when env is empty', () => {
    delete process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    delete process.env.STRIPE_PUBLISHABLE_KEY;
    const key = getStripePublishableKey();
    expect(key.startsWith('pk_')).toBe(true);
  });
});

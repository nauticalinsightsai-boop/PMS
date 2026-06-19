import { afterEach, describe, expect, it } from 'vitest';
import { pickStripePublishableKey } from './stripe-key-mode';
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

describe('pickStripePublishableKey', () => {
  it('prefers live API key on production host', () => {
    expect(
      pickStripePublishableKey({
        hint: 'pk_test_hint',
        env: 'pk_test_env',
        api: 'pk_live_api',
        hostname: 'pmstructure.com',
      }),
    ).toBe('pk_live_api');
  });

  it('uses server hint on production when live', () => {
    expect(
      pickStripePublishableKey({
        hint: 'pk_live_hint',
        env: '',
        api: 'pk_live_api',
        hostname: 'pmstructure.com',
      }),
    ).toBe('pk_live_hint');
  });

  it('prefers API on localhost when bundle env is empty', () => {
    expect(
      pickStripePublishableKey({
        hint: '',
        env: '',
        api: 'pk_test_api',
        hostname: 'localhost',
      }),
    ).toBe('pk_test_api');
  });
});

describe('getStripePublishableKey (server)', () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    delete process.env.STRIPE_PUBLISHABLE_KEY;
  });

  it('reads publishable key from process env', () => {
    process.env.STRIPE_PUBLISHABLE_KEY = 'pk_test_from_env';
    expect(getStripePublishableKey()).toBe('pk_test_from_env');
  });
});

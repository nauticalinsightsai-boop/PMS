import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  retrieve: vi.fn(),
  expire: vi.fn(),
  recordEvent: vi.fn(),
  setStatus: vi.fn(),
}));

vi.mock('@/lib/stripe', () => ({
  getStripe: () => ({ checkout: { sessions: { retrieve: mocks.retrieve, expire: mocks.expire } } }),
  isStripeConfigured: () => true,
}));
vi.mock('@/lib/supabase-admin', () => ({ isSupabaseConfigured: true }));
vi.mock('@/lib/scholarship-store', () => ({
  listExpiredScholarshipReservations: vi.fn(async () => []),
  recordScholarshipEvent: mocks.recordEvent,
  setScholarshipReservationStatus: mocks.setStatus,
}));

import { expireScholarshipReservation } from './scholarship-expiry';

const expiredRow = {
  id: '11111111-1111-4111-8111-111111111111', visitor_hash: 'a'.repeat(64),
  offering_id: 'pmp-preparation-professional', site_cert_id: 'pmp',
  tier_slug: 'professional' as const, tier_id: 'professional', market: 'global' as const,
  country_code: 'US', delivery_mode: 'mentor_led' as const, currency: 'usd',
  base_unit_amount: 89_900, final_unit_amount: 76_415,
  base_usd_cents: 89_900, final_usd_cents: 76_415, discount_bps: 1500 as const,
  status: 'checkout_open' as const, expires_at: '2000-01-01T00:15:00.000Z',
  stripe_session_id: 'cs_open', idempotency_key: 'scholarship:test',
  expired_at: null, completed_at: null, rejection_reason: null,
  created_at: '2000-01-01T00:00:00.000Z', updated_at: '2000-01-01T00:00:00.000Z',
};

describe('server-authoritative scholarship expiration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.retrieve.mockResolvedValue({ id: 'cs_open', status: 'open' });
    mocks.expire.mockResolvedValue({ id: 'cs_open', status: 'expired' });
    mocks.setStatus.mockResolvedValue(true);
    mocks.recordEvent.mockResolvedValue(undefined);
  });

  it('explicitly expires an open Stripe session before marking the reservation expired', async () => {
    await expect(expireScholarshipReservation(expiredRow)).resolves.toBe(true);
    expect(mocks.expire).toHaveBeenCalledWith('cs_open');
    expect(mocks.expire.mock.invocationCallOrder[0]).toBeLessThan(mocks.setStatus.mock.invocationCallOrder[0]);
    expect(mocks.setStatus).toHaveBeenCalledWith(expect.objectContaining({ status: 'expired' }));
    expect(mocks.recordEvent).toHaveBeenCalledWith(expect.objectContaining({ eventName: 'expired' }));
  });

  it('fails closed without expiring the reservation when Stripe expiration fails', async () => {
    mocks.expire.mockRejectedValueOnce(new Error('provider unavailable'));
    await expect(expireScholarshipReservation(expiredRow)).resolves.toBe(false);
    expect(mocks.setStatus).not.toHaveBeenCalled();
  });
});

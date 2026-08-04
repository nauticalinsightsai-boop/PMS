import type Stripe from 'stripe';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getReservation: vi.fn(),
  recordEvent: vi.fn(),
  setStatus: vi.fn(),
}));

vi.mock('@/lib/scholarship-store', () => ({
  getScholarshipReservation: mocks.getReservation,
  recordScholarshipEvent: mocks.recordEvent,
  setScholarshipReservationStatus: mocks.setStatus,
}));

import {
  ScholarshipWebhookMismatchError,
  hasExactScholarshipCoupon,
  validateScholarshipPaidSession,
} from './scholarship-webhook';

const expiresAt = '2099-01-01T00:15:00.000Z';
const reservation = {
  id: '11111111-1111-4111-8111-111111111111',
  visitor_hash: 'a'.repeat(64),
  offering_id: 'pmp-preparation-professional',
  site_cert_id: 'pmp',
  tier_slug: 'professional' as const,
  tier_id: 'professional',
  market: 'global' as const,
  country_code: 'US',
  delivery_mode: 'mentor_led' as const,
  currency: 'usd',
  base_unit_amount: 89_900,
  final_unit_amount: 76_415,
  base_usd_cents: 89_900,
  final_usd_cents: 76_415,
  discount_bps: 1500 as const,
  status: 'checkout_open' as const,
  expires_at: expiresAt,
  stripe_session_id: 'cs_live_scholarship',
  idempotency_key: 'scholarship:test',
  expired_at: null,
  completed_at: null,
  rejection_reason: null,
  created_at: '2099-01-01T00:00:00.000Z',
  updated_at: '2099-01-01T00:00:00.000Z',
};

function exactCoupon(overrides: Record<string, unknown> = {}) {
  return {
    id: 'SCH15',
    name: 'PM Structure Scholarship 15%',
    valid: true,
    livemode: true,
    percent_off: 15,
    amount_off: null,
    duration: 'forever',
    max_redemptions: null,
    redeem_by: null,
    applies_to: { products: [] },
    ...overrides,
  };
}

function paidSession(overrides: Record<string, unknown> = {}): Stripe.Checkout.Session {
  const metadata = {
    offeringId: reservation.offering_id,
    siteCertId: reservation.site_cert_id,
    tierSlug: reservation.tier_slug,
    tierId: reservation.tier_id,
    deliveryMode: 'mentor_led',
    paymentType: 'scholarship_mentor_led',
    scholarshipReservationId: reservation.id,
    scholarshipMarket: reservation.market,
    scholarshipCountry: reservation.country_code,
    scholarshipDiscountBps: String(reservation.discount_bps),
    scholarshipBaseUnitAmount: String(reservation.base_unit_amount),
    scholarshipFinalUnitAmount: String(reservation.final_unit_amount),
    scholarshipBaseUsdCents: String(reservation.base_usd_cents),
    scholarshipFinalUsdCents: String(reservation.final_usd_cents),
    scholarshipExpiresAt: reservation.expires_at,
  };
  return {
    id: reservation.stripe_session_id,
    currency: 'usd',
    amount_subtotal: 89_900,
    amount_total: 76_415,
    allow_promotion_codes: false,
    discounts: [{ coupon: exactCoupon() }],
    customer_details: { address: { country: 'US' } },
    metadata,
    ...overrides,
  } as unknown as Stripe.Checkout.Session;
}

describe('scholarship webhook validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getReservation.mockResolvedValue(reservation);
    mocks.setStatus.mockResolvedValue(true);
    mocks.recordEvent.mockResolvedValue(undefined);
  });

  it('accepts only the exact live, unrestricted, forever SCH15 coupon', () => {
    expect(hasExactScholarshipCoupon(paidSession())).toBe(true);
    expect(hasExactScholarshipCoupon(paidSession({ discounts: [{ coupon: exactCoupon({ id: 'SCH10' }) }] }))).toBe(false);
    expect(hasExactScholarshipCoupon(paidSession({ discounts: [{ coupon: exactCoupon({ percent_off: 20 }) }] }))).toBe(false);
    expect(hasExactScholarshipCoupon(paidSession({ discounts: [{ coupon: exactCoupon({ livemode: false }) }] }))).toBe(false);
    expect(hasExactScholarshipCoupon(paidSession({ discounts: [{ coupon: exactCoupon({ applies_to: { products: ['prod_1'] } }) }] }))).toBe(false);
  });

  it('completes a fully matching paid reservation and records a PII-free event', async () => {
    await expect(validateScholarshipPaidSession({
      session: paidSession(),
      completedAtMs: new Date('2099-01-01T00:10:00.000Z').getTime(),
    })).resolves.toBe(true);
    expect(mocks.setStatus).toHaveBeenCalledWith(expect.objectContaining({
      reservationId: reservation.id,
      status: 'completed',
    }));
    expect(mocks.recordEvent).toHaveBeenCalledWith({
      eventName: 'completed',
      reservationId: reservation.id,
      offeringId: reservation.offering_id,
      market: reservation.market,
      dedupeKey: `completed:${reservation.id}`,
    });
  });

  it.each([
    ['amount', { amount_total: 76_416 }],
    ['country', { customer_details: { address: { country: 'CA' } } }],
    ['coupon', { discounts: [{ coupon: exactCoupon({ id: 'SCH20' }) }] }],
    ['promotion field', { allow_promotion_codes: true }],
    ['session identity', { id: 'cs_tampered' }],
  ])('rejects a %s mismatch and closes the durable reservation', async (_name, overrides) => {
    await expect(validateScholarshipPaidSession({
      session: paidSession(overrides),
      completedAtMs: new Date('2099-01-01T00:10:00.000Z').getTime(),
    })).rejects.toBeInstanceOf(ScholarshipWebhookMismatchError);
    expect(mocks.setStatus).toHaveBeenCalledWith(expect.objectContaining({
      reservationId: reservation.id,
      status: 'rejected',
      reason: 'webhook_amount_country_or_metadata_mismatch',
    }));
  });

  it('rejects a payment completed after the authoritative 15-minute expiry', async () => {
    await expect(validateScholarshipPaidSession({
      session: paidSession(),
      completedAtMs: new Date('2099-01-01T00:15:00.001Z').getTime(),
    })).rejects.toMatchObject({ reason: 'reservation_expired' });
  });
});

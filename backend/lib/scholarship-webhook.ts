import type Stripe from 'stripe';
import { SCHOLARSHIP_DISCOUNT_BPS } from '@/lib/scholarship-core';
import { resolveScholarshipPrice, resolveScholarshipRouteIdentity } from '@/lib/scholarship-pricing';
import {
  getScholarshipReservation,
  recordScholarshipEvent,
  setScholarshipReservationStatus,
} from '@/lib/scholarship-store';

export class ScholarshipWebhookMismatchError extends Error {
  constructor(public readonly reason: string) {
    super(`Scholarship checkout validation failed: ${reason}`);
    this.name = 'ScholarshipWebhookMismatchError';
  }
}

function same(metadata: Stripe.Metadata | null, key: string, expected: string | number): boolean {
  return metadata?.[key] === String(expected);
}

export function hasExactScholarshipCoupon(session: Stripe.Checkout.Session): boolean {
  const discounts = session.discounts ?? [];
  if (discounts.length !== 1) return false;
  const coupon = discounts[0]?.coupon;
  if (!coupon || typeof coupon === 'string') return false;
  return Boolean(
    coupon.id === 'SCH15' &&
    coupon.name === 'PM Structure Scholarship 15%' &&
    coupon.valid &&
    coupon.livemode &&
    coupon.percent_off === 15 &&
    coupon.amount_off === null &&
    coupon.duration === 'forever' &&
    coupon.max_redemptions === null &&
    coupon.redeem_by === null &&
    (!coupon.applies_to || coupon.applies_to.products.length === 0)
  );
}

export async function validateScholarshipPaidSession(params: {
  session: Stripe.Checkout.Session;
  completedAtMs: number;
}): Promise<boolean> {
  const reservationId = params.session.metadata?.scholarshipReservationId;
  if (!reservationId) return false;
  const reservation = await getScholarshipReservation(reservationId);
  const reject = async (reason: string): Promise<never> => {
    if (reservation) {
      await setScholarshipReservationStatus({
        reservationId,
        from: ['active', 'checkout_open'],
        status: 'rejected',
        reason: `webhook_${reason}`,
      });
    }
    throw new ScholarshipWebhookMismatchError(reason);
  };
  if (!reservation) return reject('reservation_missing');

  const identity = resolveScholarshipRouteIdentity({
    offeringId: reservation.offering_id,
    siteCertId: reservation.site_cert_id,
    tierSlug: reservation.tier_slug,
    market: reservation.market,
  });
  const price = identity
    ? resolveScholarshipPrice(identity.offering, reservation.market, reservation.country_code)
    : null;
  const billingCountry = params.session.customer_details?.address?.country?.toUpperCase() ?? null;
  const metadata = params.session.metadata;
  const matches = Boolean(
    identity && price &&
    reservation.stripe_session_id === params.session.id &&
    reservation.delivery_mode === 'mentor_led' &&
    reservation.discount_bps === SCHOLARSHIP_DISCOUNT_BPS &&
    reservation.currency === price.currency &&
    reservation.base_unit_amount === price.baseUnitAmount &&
    reservation.final_unit_amount === price.finalUnitAmount &&
    reservation.base_usd_cents === price.baseUsdCents &&
    reservation.final_usd_cents === price.finalUsdCents &&
    params.session.currency?.toLowerCase() === reservation.currency &&
    params.session.amount_subtotal === reservation.base_unit_amount &&
    params.session.amount_total === reservation.final_unit_amount &&
    params.session.allow_promotion_codes !== true &&
    hasExactScholarshipCoupon(params.session) &&
    billingCountry === reservation.country_code &&
    same(metadata, 'offeringId', reservation.offering_id) &&
    same(metadata, 'siteCertId', reservation.site_cert_id) &&
    same(metadata, 'tierSlug', reservation.tier_slug) &&
    same(metadata, 'tierId', reservation.tier_id) &&
    same(metadata, 'deliveryMode', 'mentor_led') &&
    same(metadata, 'paymentType', 'scholarship_mentor_led') &&
    same(metadata, 'scholarshipReservationId', reservation.id) &&
    same(metadata, 'scholarshipMarket', reservation.market) &&
    same(metadata, 'scholarshipCountry', reservation.country_code) &&
    same(metadata, 'scholarshipDiscountBps', reservation.discount_bps) &&
    same(metadata, 'scholarshipBaseUnitAmount', reservation.base_unit_amount) &&
    same(metadata, 'scholarshipFinalUnitAmount', reservation.final_unit_amount) &&
    same(metadata, 'scholarshipBaseUsdCents', reservation.base_usd_cents) &&
    same(metadata, 'scholarshipFinalUsdCents', reservation.final_usd_cents) &&
    same(metadata, 'scholarshipExpiresAt', reservation.expires_at)
  );
  if (!matches) return reject('amount_country_or_metadata_mismatch');
  if (params.completedAtMs > new Date(reservation.expires_at).getTime()) {
    return reject('reservation_expired');
  }
  if (reservation.status === 'expired' || reservation.status === 'rejected') {
    return reject('reservation_not_open');
  }
  if (reservation.status !== 'completed') {
    const completedAt = new Date(params.completedAtMs).toISOString();
    const changed = await setScholarshipReservationStatus({
      reservationId,
      from: ['active', 'checkout_open'],
      status: 'completed',
      completedAt,
    });
    if (changed) {
      await recordScholarshipEvent({
        eventName: 'completed',
        reservationId,
        offeringId: reservation.offering_id,
        market: reservation.market,
        dedupeKey: `completed:${reservation.id}`,
      });
    }
  }
  return true;
}

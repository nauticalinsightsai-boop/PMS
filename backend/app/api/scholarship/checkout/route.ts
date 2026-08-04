import {
  createScholarshipStripeEmbeddedCheckoutSession,
  expireStripeCheckoutSessionBestEffort,
} from '@/lib/checkout-session';
import { requestOrigin } from '@/lib/request-origin';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { expireScholarshipReservation } from '@/lib/scholarship-expiry';
import {
  resolveScholarshipPrice,
  resolveScholarshipRouteIdentity,
  scholarshipCountryDecision,
} from '@/lib/scholarship-pricing';
import {
  attachScholarshipCheckout,
  getScholarshipReservation,
  recordScholarshipEvent,
  setScholarshipReservationStatus,
} from '@/lib/scholarship-store';
import {
  SCHOLARSHIP_VISITOR_COOKIE,
  readCookieValue,
  scholarshipVisitorHash,
  verifyScholarshipVisitorCookie,
} from '@/lib/scholarship-visitor';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store, private' },
  });
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) return json({ error: 'Card payments are not configured.' }, 503);
  if (!isSupabaseConfigured) return json({ error: 'Durable scholarship reservations are unavailable.' }, 503);

  let reservationId = '';
  try {
    const body = await request.json().catch(() => ({}));
    reservationId = typeof body.reservationId === 'string' ? body.reservationId : '';
    const colorScheme = body.colorScheme === 'dark' ? 'dark' : 'light';
    if (!/^[0-9a-f-]{36}$/i.test(reservationId)) {
      return json({ error: 'A valid scholarship reservation is required.' }, 400);
    }
    const cookie = readCookieValue(request, SCHOLARSHIP_VISITOR_COOKIE);
    const visitorId = cookie ? verifyScholarshipVisitorCookie(cookie) : null;
    if (!visitorId) return json({ error: 'Invalid scholarship reservation identity.' }, 403);

    let reservation = await getScholarshipReservation(reservationId);
    if (!reservation || reservation.visitor_hash !== scholarshipVisitorHash(visitorId)) {
      return json({ error: 'Scholarship reservation not found.' }, 404);
    }
    if (new Date(reservation.expires_at).getTime() <= Date.now()) {
      await expireScholarshipReservation(reservation);
      return json({ error: 'This scholarship reservation has expired.', expired: true }, 410);
    }
    if (reservation.status === 'expired' || reservation.status === 'rejected') {
      return json({ error: 'This scholarship reservation is no longer valid.' }, 410);
    }
    if (reservation.status === 'completed') {
      return json({ error: 'This scholarship checkout is already completed.' }, 409);
    }

    const identity = resolveScholarshipRouteIdentity({
      offeringId: reservation.offering_id,
      siteCertId: reservation.site_cert_id,
      tierSlug: reservation.tier_slug,
      market: reservation.market,
    });
    const country = scholarshipCountryDecision(
      reservation.market,
      reservation.country_code,
      reservation.country_code,
    );
    const price = identity && country.eligible
      ? resolveScholarshipPrice(identity.offering, reservation.market, reservation.country_code)
      : null;
    if (
      !identity || !country.eligible || !price ||
      reservation.delivery_mode !== 'mentor_led' ||
      reservation.discount_bps !== 1500 ||
      reservation.currency !== price.currency ||
      reservation.base_unit_amount !== price.baseUnitAmount ||
      reservation.final_unit_amount !== price.finalUnitAmount ||
      reservation.base_usd_cents !== price.baseUsdCents ||
      reservation.final_usd_cents !== price.finalUsdCents
    ) {
      await setScholarshipReservationStatus({
        reservationId,
        from: ['active', 'checkout_open'],
        status: 'rejected',
        reason: 'reservation_validation_mismatch',
      });
      return json({ error: 'Scholarship reservation validation failed.' }, 409);
    }

    if (reservation.stripe_session_id) {
      const existing = await getStripe().checkout.sessions.retrieve(reservation.stripe_session_id);
      if (existing.status === 'open' && existing.client_secret) {
        return json({
          session: { sessionId: existing.id, clientSecret: existing.client_secret },
          reservationId,
          expiresAt: reservation.expires_at,
        });
      }
      if (existing.status === 'complete') {
        return json({ error: 'This scholarship checkout is already completed.' }, 409);
      }
      return json({ error: 'This scholarship checkout is no longer open.' }, 410);
    }

    const origin = requestOrigin(request);
    const returnUrl = `${origin}/certifications/${reservation.site_cert_id}/${reservation.tier_slug}/enroll/success?offering=${encodeURIComponent(reservation.offering_id)}&scholarship=${encodeURIComponent(reservation.id)}&session_id={CHECKOUT_SESSION_ID}`;
    const metadata = {
      offeringId: reservation.offering_id,
      siteCertId: reservation.site_cert_id,
      tierSlug: reservation.tier_slug,
      tierId: reservation.tier_id,
      paymentType: 'scholarship_mentor_led',
      deliveryMode: 'mentor_led',
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
    const session = await createScholarshipStripeEmbeddedCheckoutSession({
      offeringId: reservation.offering_id,
      currency: reservation.currency,
      unitAmount: reservation.base_unit_amount,
      referenceUsdCents: reservation.base_usd_cents,
      returnUrl,
      colorScheme,
      expiresAt: Math.floor(Date.now() / 1000) + 31 * 60,
      idempotencyKey: reservation.idempotency_key,
      productName: `${identity.offering.courseName}: ${reservation.tier_slug} (Mentor-led scholarship)`,
      productDescription: `15% mentor-led scholarship · reserved until ${reservation.expires_at}`,
      metadata,
    });
    if (!session.clientSecret) return json({ error: 'Could not start secure checkout.' }, 503);

    reservation = await attachScholarshipCheckout({ reservationId, stripeSessionId: session.sessionId });
    const { error: orderError } = await supabaseAdmin.from('orders').insert({
      offering_id: reservation.offering_id,
      region_id: reservation.market === 'gcc' ? 'gcc' : 'global',
      email: 'pending@checkout.local',
      usd_cents: reservation.final_usd_cents,
      status: 'pending',
      stripe_session_id: session.sessionId,
      metadata: {
        ...metadata,
        checkoutCurrency: reservation.currency,
        checkoutUnitAmount: reservation.final_unit_amount,
        checkoutDisplay: price.finalDisplay,
        originalDisplay: price.baseDisplay,
      },
    });
    if (orderError && (orderError as { code?: string }).code !== '23505') {
      await expireStripeCheckoutSessionBestEffort(session.sessionId);
      await setScholarshipReservationStatus({
        reservationId,
        from: ['active', 'checkout_open'],
        status: 'rejected',
        reason: 'order_record_failed',
      });
      return json({ error: 'Could not create the required order record.' }, 503);
    }
    await recordScholarshipEvent({
      eventName: 'checkout_started',
      reservationId,
      offeringId: reservation.offering_id,
      market: reservation.market,
      dedupeKey: `checkout_started:${reservation.id}`,
    });
    return json({
      session: { sessionId: session.sessionId, clientSecret: session.clientSecret },
      reservationId,
      expiresAt: reservation.expires_at,
    });
  } catch (error) {
    console.error('[scholarship/checkout] creation failed', { reservationId, error });
    return json({ error: 'Could not start scholarship checkout.' }, 503);
  }
}

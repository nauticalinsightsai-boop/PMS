import { randomUUID } from 'node:crypto';
import {
  SCHOLARSHIP_RESERVATION_SECONDS,
  normalizeScholarshipMarket,
} from '@/lib/scholarship-core';
import { expireScholarshipReservation } from '@/lib/scholarship-expiry';
import {
  resolveScholarshipPrice,
  resolveScholarshipRouteIdentity,
  scholarshipCountryDecision,
} from '@/lib/scholarship-pricing';
import {
  createScholarshipReservation,
  findScholarshipReservation,
  getScholarshipReservation,
  recordScholarshipEvent,
  type ScholarshipReservationRow,
} from '@/lib/scholarship-store';
import {
  SCHOLARSHIP_VISITOR_COOKIE,
  createScholarshipVisitorCookieValue,
  readCookieValue,
  scholarshipVisitorCookieHeader,
  scholarshipVisitorHash,
  verifyScholarshipVisitorCookie,
} from '@/lib/scholarship-visitor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function json(body: unknown, status = 200, cookieValue?: string): Response {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, private',
  });
  if (cookieValue) headers.set('Set-Cookie', scholarshipVisitorCookieHeader(cookieValue));
  return new Response(JSON.stringify(body), { status, headers });
}

function publicReservation(row: ScholarshipReservationRow) {
  return {
    id: row.id,
    offeringId: row.offering_id,
    siteCertId: row.site_cert_id,
    tierSlug: row.tier_slug,
    market: row.market,
    countryCode: row.country_code,
    deliveryMode: row.delivery_mode,
    currency: row.currency,
    baseUnitAmount: row.base_unit_amount,
    finalUnitAmount: row.final_unit_amount,
    baseUsdCents: row.base_usd_cents,
    finalUsdCents: row.final_usd_cents,
    discountPercent: 15,
    status: row.status,
    expiresAt: row.expires_at,
    stripeSessionId: row.stripe_session_id,
  };
}

async function currentRow(row: ScholarshipReservationRow): Promise<ScholarshipReservationRow> {
  if (
    (row.status === 'active' || row.status === 'checkout_open') &&
    new Date(row.expires_at).getTime() <= Date.now()
  ) {
    await expireScholarshipReservation(row);
    return (await getScholarshipReservation(row.id)) ?? row;
  }
  return row;
}

function visitorFromRequest(request: Request):
  | { ok: true; visitorId: string; cookieValue: string | null }
  | { ok: false; absent: boolean } {
  const raw = readCookieValue(request, SCHOLARSHIP_VISITOR_COOKIE);
  if (!raw) return { ok: false, absent: true };
  const visitorId = verifyScholarshipVisitorCookie(raw);
  return visitorId
    ? { ok: true, visitorId, cookieValue: null }
    : { ok: false, absent: false };
}

function fallbackFor(params: {
  siteCertId: string;
  tierSlug: string;
  market: 'gcc' | 'global';
  reason: string;
}) {
  const ordinaryUrl = `/certifications/${params.siteCertId}/${params.tierSlug}/enroll`;
  if (params.reason === 'global_required') {
    return { ordinaryUrl, alternateScholarshipUrl: `${ordinaryUrl}/gcc` };
  }
  if (params.reason === 'gcc_required') {
    return { ordinaryUrl, alternateScholarshipUrl: `${ordinaryUrl}/global` };
  }
  return { ordinaryUrl, alternateScholarshipUrl: null };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const offeringId = url.searchParams.get('offeringId') ?? '';
    const siteCertId = url.searchParams.get('siteCertId') ?? '';
    const tierSlug = url.searchParams.get('tierSlug') ?? '';
    const market = normalizeScholarshipMarket(url.searchParams.get('market') ?? '');
    if (!market || !offeringId || !siteCertId || !tierSlug) {
      return json({ error: 'Invalid scholarship route identity.' }, 400);
    }
    const identity = resolveScholarshipRouteIdentity({ offeringId, siteCertId, tierSlug, market });
    if (!identity) return json({ error: 'Unsupported scholarship route.' }, 404);
    const visitor = visitorFromRequest(request);
    if (!visitor.ok) {
      return visitor.absent
        ? json({ reservation: null }, 200)
        : json({ error: 'Invalid scholarship reservation identity.' }, 400);
    }
    const row = await findScholarshipReservation({
      visitorHash: scholarshipVisitorHash(visitor.visitorId),
      offeringId,
      market,
    });
    return json({ reservation: row ? publicReservation(await currentRow(row)) : null });
  } catch (error) {
    console.error('[scholarship/reservation] lookup failed', error);
    return json({ error: 'Scholarship reservation service is unavailable.' }, 503);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const offeringId = typeof body.offeringId === 'string' ? body.offeringId : '';
    const siteCertId = typeof body.siteCertId === 'string' ? body.siteCertId.toLowerCase() : '';
    const tierSlug = typeof body.tierSlug === 'string' ? body.tierSlug.toLowerCase() : '';
    const market = normalizeScholarshipMarket(typeof body.market === 'string' ? body.market : '');
    const residenceCountry = typeof body.residenceCountry === 'string' ? body.residenceCountry : '';
    const billingCountry = typeof body.billingCountry === 'string' ? body.billingCountry : '';
    if (!market || !offeringId || !siteCertId || !tierSlug) {
      return json({ error: 'Invalid scholarship route identity.' }, 400);
    }
    const identity = resolveScholarshipRouteIdentity({ offeringId, siteCertId, tierSlug, market });
    if (!identity) return json({ error: 'Unsupported scholarship route.' }, 404);

    const decision = scholarshipCountryDecision(market, residenceCountry, billingCountry);
    if (!decision.eligible) {
      return json({
        eligible: false,
        reason: decision.reason,
        ...fallbackFor({ siteCertId, tierSlug, market, reason: decision.reason }),
      }, 403);
    }

    const price = resolveScholarshipPrice(identity.offering, market, decision.countryCode);
    if (!price) return json({ error: 'No exact mentor-led scholarship price is available.' }, 409);

    const existingVisitor = visitorFromRequest(request);
    if (!existingVisitor.ok && !existingVisitor.absent) {
      return json({ error: 'Invalid scholarship reservation identity.' }, 400);
    }
    const cookieValue = existingVisitor.ok ? null : createScholarshipVisitorCookieValue();
    const visitorId = existingVisitor.ok
      ? existingVisitor.visitorId
      : verifyScholarshipVisitorCookie(cookieValue!);
    if (!visitorId) return json({ error: 'Could not create reservation identity.' }, 503);

    const visitorHash = scholarshipVisitorHash(visitorId);
    const existing = await findScholarshipReservation({ visitorHash, offeringId, market });
    const row = existing ?? await createScholarshipReservation({
      visitorHash,
      offeringId,
      siteCertId,
      tierSlug: identity.level,
      tierId: identity.offering.tierId,
      market,
      countryCode: decision.countryCode,
      price,
      expiresAt: new Date(Date.now() + SCHOLARSHIP_RESERVATION_SECONDS * 1000).toISOString(),
      idempotencyKey: `scholarship:${randomUUID()}`,
    });
    if (!existing) {
      await recordScholarshipEvent({
        eventName: 'reservation_started',
        reservationId: row.id,
        offeringId,
        market,
        dedupeKey: `reservation_started:${row.id}`,
        metadata: { countryCode: decision.countryCode },
      });
    }
    return json({ eligible: true, reservation: publicReservation(await currentRow(row)) }, 200, cookieValue ?? undefined);
  } catch (error) {
    console.error('[scholarship/reservation] creation failed', error);
    return json({ error: 'Scholarship reservation service is unavailable.' }, 503);
  }
}

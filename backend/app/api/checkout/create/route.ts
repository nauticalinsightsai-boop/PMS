import { getOfferingById, resolveCheckoutUsdCents } from '@/lib/regional-catalogue';
import { isPaymentBlockedStatus } from '@/lib/enrollment-eligibility';
import { membershipPriceUsdCents } from '@/lib/membership-pricing';
import { createStripePaymentSession } from '@/lib/checkout-session';
import { resolveRegionalCheckoutPrice } from '@/lib/regional-checkout-price';
import { safeRedirectUrl } from '@/lib/safe-redirect-url';
import { isStripeConfigured } from '@/lib/stripe';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import { jsonError, jsonOk } from '@/lib/response-helpers.js';
import type { RegionId } from '@/lib/regional-catalogue';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const {
    offeringId,
    regionId,
    residenceCountry,
    billingCountry,
    email,
    gccCountry,
    hasMembership,
    successUrl,
    cancelUrl,
  } = body as {
    offeringId?: string;
    regionId?: RegionId;
    residenceCountry?: string;
    billingCountry?: string;
    email?: string;
    gccCountry?: string | null;
    hasMembership?: boolean;
    successUrl?: string;
    cancelUrl?: string;
  };

  if (!offeringId || !regionId || !email) {
    return jsonError('offeringId, regionId, and email are required', 400);
  }

  const offering = getOfferingById(offeringId);
  if (!offering) return jsonError('Offering not found', 404);

  const status = offering.regional[regionId].status;

  if (isPaymentBlockedStatus(status)) {
    return jsonError('Checkout not available for this offering in your region', 403);
  }

  const regional = resolveRegionalCheckoutPrice(offering, regionId, gccCountry);
  if (!regional) return jsonError('Price unavailable', 400);

  let unitAmount = regional.unitAmount;
  let referenceUsdCents = regional.usdCents ?? resolveCheckoutUsdCents(offering, regionId);

  if (hasMembership && referenceUsdCents) {
    const memberUsdCents = membershipPriceUsdCents(referenceUsdCents);
    if (memberUsdCents != null) {
      unitAmount = Math.round(regional.unitAmount * 0.8);
      referenceUsdCents = memberUsdCents;
    }
  }

  const origin = request.headers.get('origin') ?? 'http://localhost:3000';

  const defaultSuccess = `${origin}/checkout/success?offering=${offeringId}&session_id={CHECKOUT_SESSION_ID}`;
  const defaultCancel = `${origin}/checkout/cancel?offering=${offeringId}`;

  const session = await createStripePaymentSession({
    offeringId,
    currency: regional.currency,
    unitAmount,
    referenceUsdCents,
    email,
    successUrl: safeRedirectUrl(origin, successUrl, defaultSuccess),
    cancelUrl: safeRedirectUrl(origin, cancelUrl, defaultCancel),
    productName: `${offering.courseName}: ${offering.tierId.replace(/_/g, ' ')}`,
    productDescription: `Pathway tuition (${regional.display})`,
    metadata: {
      offeringId,
      regionId,
      paymentType: 'full_tuition',
      residenceCountry: residenceCountry ?? '',
      billingCountry: billingCountry ?? '',
      gccCountry: gccCountry ?? '',
      hasMembership: hasMembership ? 'true' : 'false',
      checkoutCurrency: regional.currency,
      checkoutDisplay: regional.display,
    },
  });

  if (!session.url && isStripeConfigured()) {
    return jsonError('Could not start checkout. Try again or contact support.', 503);
  }

  if (isSupabaseConfigured) {
    const { error } = await supabaseAdmin.from('orders').insert({
      offering_id: offeringId,
      region_id: regionId,
      email,
      usd_cents: referenceUsdCents ?? session.usdCents,
      status: 'pending',
      stripe_session_id: session.sessionId,
      metadata: {
        residenceCountry,
        billingCountry,
        gccCountry,
        hasMembership: !!hasMembership,
        checkoutCurrency: regional.currency,
        checkoutUnitAmount: unitAmount,
        checkoutDisplay: regional.display,
      },
    });
    if (error) {
      console.error('[checkout/create] orders insert failed:', error.message);
      return jsonError('Could not create order record', 503);
    }
  }

  return jsonOk({
    session,
    currency: regional.currency,
    unitAmount,
    displayAmount: regional.display,
    usdCents: referenceUsdCents,
    hasMembership: !!hasMembership,
  });
}
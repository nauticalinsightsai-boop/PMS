import { requestOrigin } from '@/lib/request-origin';
import { getOfferingById } from '@/lib/regional-catalogue';
import {
  createStripeEmbeddedCheckoutSession,
  createStripePaymentSession,
  expireStripeCheckoutSessionBestEffort,
} from '@/lib/checkout-session';
import {
  assertFullTuitionEligible,
  requiresConsultationApproval,
} from '@/lib/enrollment-eligibility';
import { isConsultationApproved } from '@/lib/consultation-approval';
import {
  isDeliveryFullChargeMode,
  parseEnrollmentPaymentMode,
  type EnrollmentPaymentMode,
} from '@/lib/enrollment-pricing';
import {
  formatRegionalDepositDisplay,
  resolveRegionalCheckoutPrice,
  resolveRegionalDepositPrice,
} from '@/lib/regional-checkout-price';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import { jsonError, jsonOk } from '@/lib/response-helpers.js';
import { safeRedirectUrl } from '@/lib/safe-redirect-url';
import { isStripeConfigured, isStripeTestMode, getStripeSecretKeyIssue } from '@/lib/stripe';
import type { RegionId } from '@/lib/regional-catalogue';

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return jsonError('Card payments are not configured. Contact support@pmstructure.com.', 503);
  }

  const keyIssue = getStripeSecretKeyIssue();
  if (keyIssue) {
    console.error('[checkout/seat-deposit]', keyIssue);
    return jsonError(
      'Card payments are misconfigured. Contact support@pmstructure.com.',
      503,
    );
  }

  try {
  const origin = requestOrigin(request);
  const liveSite =
    origin.includes('pmstructure.com') ||
    (process.env.NEXT_PUBLIC_SITE_URL?.includes('pmstructure.com') ?? false);
  if (liveSite && isStripeTestMode()) {
    console.error('[checkout/seat-deposit] Stripe test secret key on live site');
    return jsonError(
      'Live checkout is misconfigured (Stripe test keys). Contact support@pmstructure.com.',
      503,
    );
  }

  const body = await request.json().catch(() => ({}));
  const {
    offeringId,
    siteCertId,
    tierSlug,
    regionId,
    email,
    name,
    uiMode,
    colorScheme,
    successUrl,
    cancelUrl,
    returnUrl,
    paymentMode: rawPaymentMode,
    gccCountry,
  } = body as {
    offeringId?: string;
    siteCertId?: string;
    tierSlug?: string;
    regionId?: RegionId;
    email?: string;
    name?: string;
    uiMode?: 'embedded' | 'redirect';
    colorScheme?: 'light' | 'dark';
    successUrl?: string;
    cancelUrl?: string;
    returnUrl?: string;
    paymentMode?: EnrollmentPaymentMode;
    gccCountry?: string | null;
  };

  if (!offeringId || !siteCertId || !tierSlug || !regionId) {
    return jsonError('offeringId, siteCertId, tierSlug, and regionId are required', 400);
  }

  const trimmedEmail = email?.trim() ?? '';
  if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return jsonError('A valid email is required', 400);
  }

  const offering = getOfferingById(offeringId);
  if (!offering) return jsonError('Offering not found', 404);

  const status = offering.regional[regionId]?.status;
  if (
    requiresConsultationApproval(status) &&
    (!trimmedEmail || !(await isConsultationApproved(trimmedEmail, offeringId)))
  ) {
    return jsonError(
      'Consultation approval is required before checkout for this pathway.',
      403,
    );
  }

  const paymentMode = parseEnrollmentPaymentMode(rawPaymentMode, offering.tierId);
  const priceBook = paymentMode === 'self_paced' ? 'self_paced' : 'mentor';
  const fullRegional = resolveRegionalCheckoutPrice(offering, regionId, gccCountry, {
    priceBook,
  });
  if (!fullRegional) return jsonError('Price unavailable', 400);

  if (paymentMode === 'full_tuition' || paymentMode === 'mentor_led' || paymentMode === 'self_paced') {
    const eligibility = assertFullTuitionEligible(offering, regionId);
    if (!eligibility.ok) return jsonError(eligibility.message, 403);
  }

  const isDeposit = paymentMode === 'seat_deposit';
  const checkoutRegional = isDeposit
    ? resolveRegionalDepositPrice(fullRegional)
    : fullRegional;
  const depositDisplay = formatRegionalDepositDisplay(fullRegional.display);

  const tierLabel = offering.tierId.replace(/_/g, ' ') || tierSlug.replace(/-/g, ' ');
  const embedded = uiMode !== 'redirect';
  const checkoutScheme = colorScheme === 'dark' ? 'dark' : 'light';

  const defaultReturn = `${origin}/certifications/${siteCertId}/${tierSlug}/enroll/success?offering=${encodeURIComponent(offeringId)}&session_id={CHECKOUT_SESSION_ID}`;
  const defaultSuccess = `${origin}/certifications/${siteCertId}/${tierSlug}/enroll/success?offering=${encodeURIComponent(offeringId)}&session_id={CHECKOUT_SESSION_ID}`;
  const defaultCancel = `${origin}/certifications/${siteCertId}/${tierSlug}/enroll?offering=${encodeURIComponent(offeringId)}`;

  const deliveryLabel =
    paymentMode === 'self_paced'
      ? 'Self-paced online'
      : paymentMode === 'mentor_led'
        ? 'Mentor-led'
        : null;

  const shared = {
    offeringId,
    currency: checkoutRegional.currency,
    unitAmount: checkoutRegional.unitAmount,
    referenceUsdCents: fullRegional.usdCents,
    email: trimmedEmail || undefined,
    productName: isDeposit
      ? `Seat reservation deposit: ${offering.courseName}`
      : deliveryLabel
        ? `${offering.courseName}: ${tierLabel} (${deliveryLabel})`
        : `${offering.courseName}: ${tierLabel}`,
    productDescription: isDeposit
      ? `${tierLabel} pathway · 25% deposit (${depositDisplay}) · remaining tuition due at onboarding`
      : deliveryLabel
        ? `${deliveryLabel} · ${fullRegional.display}`
        : `Full pathway tuition (${fullRegional.display})`,
    metadata: {
      offeringId,
      siteCertId,
      tierSlug,
      regionId,
      paymentType: paymentMode,
      checkoutCurrency: checkoutRegional.currency,
      checkoutDisplay: isDeposit ? depositDisplay : fullRegional.display,
      ...(name?.trim() ? { customerName: name.trim() } : {}),
    },
  };

  const session = embedded
    ? await createStripeEmbeddedCheckoutSession({
        ...shared,
        returnUrl: safeRedirectUrl(origin, returnUrl, defaultReturn),
        colorScheme: checkoutScheme,
      })
    : await createStripePaymentSession({
        ...shared,
        successUrl: safeRedirectUrl(origin, successUrl, defaultSuccess),
        cancelUrl: safeRedirectUrl(origin, cancelUrl, defaultCancel),
      });

  if (embedded && !session.clientSecret) {
    return jsonError('Could not start embedded checkout. Try again or contact support.', 503);
  }
  if (!embedded && !session.url) {
    return jsonError('Could not start checkout. Try again or contact support.', 503);
  }

  if (isSupabaseConfigured) {
    const { error } = await supabaseAdmin.from('orders').insert({
      offering_id: offeringId,
      region_id: regionId,
      email: trimmedEmail || 'pending@checkout.local',
      usd_cents: fullRegional.usdCents ?? session.usdCents,
      status: 'pending',
      stripe_session_id: session.sessionId,
      metadata: {
        paymentType: paymentMode,
        siteCertId,
        tierSlug,
        customerName: name?.trim() ?? null,
        uiMode: embedded ? 'embedded' : 'redirect',
        checkoutCurrency: checkoutRegional.currency,
        checkoutUnitAmount: checkoutRegional.unitAmount,
        checkoutDisplay: isDeposit ? depositDisplay : fullRegional.display,
        depositFraction: isDeposit ? 0.25 : null,
        deliveryMode: isDeliveryFullChargeMode(paymentMode) ? paymentMode : null,
      },
    });
    if (error) {
      console.error('[checkout/seat-deposit] orders insert failed:', error.message);
      await expireStripeCheckoutSessionBestEffort(session.sessionId);
      return jsonError('Could not create order record', 503);
    }
  }

  return jsonOk({
    session: {
      sessionId: session.sessionId,
      url: session.url,
      clientSecret: session.clientSecret,
    },
    currency: checkoutRegional.currency,
    unitAmount: checkoutRegional.unitAmount,
    displayAmount: isDeposit ? depositDisplay : fullRegional.display,
    fullDisplay: fullRegional.display,
    depositDisplay,
    usdCents: fullRegional.usdCents,
    paymentMode,
  });
  } catch (err) {
    console.error('[checkout/seat-deposit] session create failed:', err);
    const stripeMessage =
      err && typeof err === 'object' && 'message' in err
        ? String((err as { message: string }).message)
        : '';
    if (stripeMessage.toLowerCase().includes('invalid api key')) {
      return jsonError(
        'Card payments are misconfigured (invalid Stripe secret key). Contact support@pmstructure.com.',
        503,
      );
    }
    return jsonError('Could not start checkout. Try again or contact support@pmstructure.com.', 503);
  }
}

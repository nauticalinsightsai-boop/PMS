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
import {
  isScholarshipOfferType,
  resolveEliteScholarshipPrice,
  SCHOLARSHIP_OFFER_TYPE,
  scholarshipPayFraction,
  scholarshipOfferError,
} from '@/lib/scholarship-offer';
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
    offerType: rawOfferType,
    unitAmount: claimedUnitAmount,
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
    offerType?: string;
    unitAmount?: number;
  };

  const isScholarshipInvite = isScholarshipOfferType(rawOfferType);

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

  if (isScholarshipInvite) {
    const offerErr = scholarshipOfferError(offering.tierId, regionId);
    if (offerErr) return jsonError(offerErr, 400);
  }

  const paymentMode: EnrollmentPaymentMode = isScholarshipInvite
    ? 'mentor_led'
    : parseEnrollmentPaymentMode(rawPaymentMode, offering.tierId);
  const priceBook = paymentMode === 'self_paced' ? 'self_paced' : 'mentor';
  let fullRegional = resolveRegionalCheckoutPrice(offering, regionId, gccCountry, {
    priceBook,
  });
  if (!fullRegional) return jsonError('Price unavailable', 400);

  if (paymentMode === 'full_tuition' || paymentMode === 'mentor_led' || paymentMode === 'self_paced') {
    const eligibility = assertFullTuitionEligible(offering, regionId);
    if (!eligibility.ok) return jsonError(eligibility.message, 403);
  }

  const isDeposit = !isScholarshipInvite && paymentMode === 'seat_deposit';
  let checkoutRegional = isDeposit
    ? resolveRegionalDepositPrice(fullRegional)
    : { ...fullRegional };
  let checkoutDisplay = isDeposit
    ? formatRegionalDepositDisplay(fullRegional.display)
    : fullRegional.display;
  let scholarshipDiscountPercent: number | null = null;
  let globalMentorBaseline = fullRegional;

  if (isScholarshipInvite) {
    // Elite invite: Global −15% USD, or GCC −35% vs Global converted to country currency.
    const globalMentor = resolveRegionalCheckoutPrice(offering, 'global', null, {
      priceBook: 'mentor',
    });
    if (!globalMentor) return jsonError('Global mentor price unavailable', 400);
    globalMentorBaseline = globalMentor;
    const elite = resolveEliteScholarshipPrice({
      globalUsdMajor: globalMentor.majorAmount,
      regionId,
      gccCountry,
    });
    if (!elite) return jsonError('Scholarship price unavailable', 400);
    scholarshipDiscountPercent = elite.discountPct;
    if (
      typeof claimedUnitAmount === 'number' &&
      Number.isFinite(claimedUnitAmount) &&
      Math.round(claimedUnitAmount) !== elite.unitAmount
    ) {
      return jsonError('Scholarship amount mismatch. Refresh and try again.', 400);
    }
    checkoutDisplay = elite.display;
    checkoutRegional = {
      currency: elite.currency,
      unitAmount: elite.unitAmount,
      majorAmount: elite.majorAmount,
      display: elite.display,
      currencyCode: elite.currencyCode,
      usdCents:
        globalMentor.usdCents != null
          ? Math.round(globalMentor.usdCents * scholarshipPayFraction(regionId))
          : Math.round(elite.globalUsdMajor * 100 * scholarshipPayFraction(regionId)),
    };
    fullRegional = {
      ...globalMentor,
      // Keep Global baseline for audit; checkoutRegional holds charged amount/currency.
    };
  }

  const depositDisplay = formatRegionalDepositDisplay(fullRegional.display);

  const tierLabel = offering.tierId.replace(/_/g, ' ') || tierSlug.replace(/-/g, ' ');
  const embedded = uiMode !== 'redirect';
  const checkoutScheme = colorScheme === 'dark' ? 'dark' : 'light';

  const defaultReturn = `${origin}/certifications/${siteCertId}/${tierSlug}/enroll/success?offering=${encodeURIComponent(offeringId)}&session_id={CHECKOUT_SESSION_ID}`;
  const defaultSuccess = `${origin}/certifications/${siteCertId}/${tierSlug}/enroll/success?offering=${encodeURIComponent(offeringId)}&session_id={CHECKOUT_SESSION_ID}`;
  const defaultCancel = isScholarshipInvite
    ? `${origin}/certifications/${siteCertId}/${tierSlug}/enroll/scholarship?offering=${encodeURIComponent(offeringId)}`
    : `${origin}/certifications/${siteCertId}/${tierSlug}/enroll?offering=${encodeURIComponent(offeringId)}`;

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
      : isScholarshipInvite
        ? `${offering.courseName}: ${tierLabel} (Mentor-led scholarship)`
        : deliveryLabel
          ? `${offering.courseName}: ${tierLabel} (${deliveryLabel})`
          : `${offering.courseName}: ${tierLabel}`,
    productDescription: isDeposit
      ? `${tierLabel} pathway · 25% deposit (${depositDisplay}) · remaining tuition due at onboarding`
      : isScholarshipInvite
        ? `Mentor-led Elite scholarship (−${scholarshipDiscountPercent}%) · ${checkoutDisplay}`
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
      checkoutDisplay: isDeposit ? depositDisplay : checkoutDisplay,
      ...(isScholarshipInvite
        ? {
            offerType: SCHOLARSHIP_OFFER_TYPE,
            discountPct: String(scholarshipDiscountPercent),
            deliveryMode: 'mentor_led',
            originalMentorUnitAmount: String(globalMentorBaseline.unitAmount),
            ...(gccCountry ? { gccCountry: String(gccCountry).toUpperCase() } : {}),
          }
        : {}),
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
      usd_cents: isScholarshipInvite
        ? (checkoutRegional.usdCents ?? fullRegional.usdCents ?? session.usdCents)
        : (fullRegional.usdCents ?? session.usdCents),
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
        checkoutDisplay: isDeposit ? depositDisplay : checkoutDisplay,
        depositFraction: isDeposit ? 0.25 : null,
        deliveryMode: isDeliveryFullChargeMode(paymentMode) ? paymentMode : null,
        ...(isScholarshipInvite
          ? {
              offerType: SCHOLARSHIP_OFFER_TYPE,
              discountPct: scholarshipDiscountPercent,
              originalMentorUnitAmount: globalMentorBaseline.unitAmount,
              originalMentorDisplay: globalMentorBaseline.display,
              ...(gccCountry ? { gccCountry: String(gccCountry).toUpperCase() } : {}),
            }
          : {}),
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
    displayAmount: isDeposit ? depositDisplay : checkoutDisplay,
    fullDisplay: isScholarshipInvite ? checkoutDisplay : fullRegional.display,
    depositDisplay,
    usdCents: isScholarshipInvite
      ? (checkoutRegional.usdCents ?? fullRegional.usdCents)
      : fullRegional.usdCents,
    paymentMode,
    ...(isScholarshipInvite
      ? {
          offerType: SCHOLARSHIP_OFFER_TYPE,
          discountPct: scholarshipDiscountPercent,
          originalMentorUnitAmount: globalMentorBaseline.unitAmount,
          ...(gccCountry ? { gccCountry: String(gccCountry).toUpperCase() } : {}),
        }
      : {}),
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

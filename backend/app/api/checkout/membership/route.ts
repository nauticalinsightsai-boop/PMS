import { requestOrigin } from '@/lib/request-origin';
import {
  createStripeEmbeddedCheckoutSession,
  expireStripeCheckoutSessionBestEffort,
} from '@/lib/checkout-session';
import {
  resolveMembershipCheckoutPrice,
  type MembershipBilling,
  type MembershipTierId,
} from '@/lib/membership-checkout-price';
import { getCmsMembershipUsd } from '@/lib/membership-cms-pricing';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import { jsonError, jsonOk } from '@/lib/response-helpers.js';
import { safeRedirectUrl } from '@/lib/safe-redirect-url';
import { isStripeConfigured } from '@/lib/stripe';
import type { RegionId } from '@/lib/regional-catalogue';

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return jsonError('Card payments are not configured. Contact support@pmstructure.com.', 503);
  }

  const body = await request.json().catch(() => ({}));
  const { tier, billing, regionId, gccCountry, colorScheme, returnUrl } = body as {
    tier?: MembershipTierId;
    billing?: MembershipBilling;
    regionId?: RegionId;
    gccCountry?: string | null;
    colorScheme?: 'light' | 'dark';
    returnUrl?: string;
  };

  if (!tier || !billing || !regionId) {
    return jsonError('tier, billing, and regionId are required', 400);
  }
  if (tier !== 'professional' && tier !== 'mastery') {
    return jsonError('Invalid membership tier', 400);
  }
  if (billing !== 'monthly' && billing !== 'yearly') {
    return jsonError('Invalid billing cycle', 400);
  }

  const cmsUsd = await getCmsMembershipUsd(tier, billing);
  const price = resolveMembershipCheckoutPrice(tier, billing, regionId, gccCountry, cmsUsd);
  if (!price) return jsonError('Price unavailable', 400);

  const origin = requestOrigin(request);
  const defaultReturn = `${origin}/membership/checkout/success?tier=${tier}&billing=${billing}&session_id={CHECKOUT_SESSION_ID}`;
  const tierLabel = tier === 'professional' ? 'Professional' : 'Mastery';
  const billingLabel = billing === 'monthly' ? 'Monthly' : 'Yearly';

  const session = await createStripeEmbeddedCheckoutSession({
    offeringId: `membership_${tier}_${billing}`,
    currency: price.currency,
    unitAmount: price.unitAmount,
    referenceUsdCents: price.usdReference,
    productName: `${tierLabel} Membership · ${billingLabel}`,
    productDescription: `${price.display} · PM Structure membership`,
    metadata: {
      paymentType: 'membership',
      membershipTier: tier,
      billingCycle: billing,
      regionId,
      checkoutCurrency: price.currency,
      checkoutDisplay: price.display,
    },
    returnUrl: safeRedirectUrl(origin, returnUrl, defaultReturn),
    colorScheme: colorScheme === 'dark' ? 'dark' : 'light',
  });

  if (!session.clientSecret) {
    return jsonError('Could not start checkout. Try again or contact support.', 503);
  }

  if (isSupabaseConfigured) {
    const { error } = await supabaseAdmin.from('orders').insert({
      offering_id: `membership_${tier}`,
      region_id: regionId,
      email: 'pending@checkout.local',
      usd_cents: price.usdReference,
      status: 'pending',
      stripe_session_id: session.sessionId,
      metadata: {
        paymentType: 'membership',
        membershipTier: tier,
        billingCycle: billing,
        checkoutCurrency: price.currency,
        checkoutUnitAmount: price.unitAmount,
        checkoutDisplay: price.display,
      },
    });
    if (error) {
      console.error('[checkout/membership] order insert failed', error);
      await expireStripeCheckoutSessionBestEffort(session.sessionId);
      return jsonError('Could not record checkout. Try again or contact support.', 503);
    }
  }

  return jsonOk({
    session: {
      sessionId: session.sessionId,
      clientSecret: session.clientSecret,
    },
    displayAmount: price.display,
    currency: price.currency,
    unitAmount: price.unitAmount,
  });
}

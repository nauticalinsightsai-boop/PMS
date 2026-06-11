import { getOfferingById } from '@/lib/regional-catalogue';
import {
  createStripeEmbeddedCheckoutSession,
  createStripePaymentSession,
} from '@/lib/checkout-session';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import { jsonError, jsonOk } from '@/lib/response-helpers.js';
import { safeRedirectUrl } from '@/lib/safe-redirect-url';
import { isStripeConfigured } from '@/lib/stripe';
import type { RegionId } from '@/lib/regional-catalogue';

const DEPOSIT_BY_TIER_PATTERN: { match: (slug: string) => boolean; amount: number }[] = [
  { match: (slug) => slug.includes('mastery'), amount: 500 },
  { match: (slug) => slug.includes('professional') || slug.includes('foundation'), amount: 250 },
];

function resolveSeatDepositUsd(tierSlug: string): number {
  const slug = tierSlug.toLowerCase();
  return DEPOSIT_BY_TIER_PATTERN.find((row) => row.match(slug))?.amount ?? 250;
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return jsonError('Card payments are not configured. Contact support@pmstructure.com.', 503);
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
    successUrl,
    cancelUrl,
    returnUrl,
  } = body as {
    offeringId?: string;
    siteCertId?: string;
    tierSlug?: string;
    regionId?: RegionId;
    email?: string;
    name?: string;
    uiMode?: 'embedded' | 'redirect';
    successUrl?: string;
    cancelUrl?: string;
    returnUrl?: string;
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

  const depositUsd = resolveSeatDepositUsd(tierSlug);
  const usdCents = depositUsd * 100;
  const tierLabel = offering.tierId.replace(/_/g, ' ') || tierSlug.replace(/-/g, ' ');
  const embedded = uiMode !== 'redirect';

  const origin = request.headers.get('origin') ?? 'http://localhost:3000';
  const defaultReturn = `${origin}/certifications/${siteCertId}/${tierSlug}/enroll/success?offering=${encodeURIComponent(offeringId)}&session_id={CHECKOUT_SESSION_ID}`;
  const defaultSuccess = `${origin}/certifications/${siteCertId}/${tierSlug}/enroll/success?offering=${encodeURIComponent(offeringId)}&session_id={CHECKOUT_SESSION_ID}`;
  const defaultCancel = `${origin}/certifications/${siteCertId}/${tierSlug}/enroll?offering=${encodeURIComponent(offeringId)}`;

  const shared = {
    offeringId,
    usdCents,
    email: trimmedEmail || undefined,
    productName: `Seat reservation deposit — ${offering.courseName}`,
    productDescription: `${tierLabel} pathway · remaining tuition due at onboarding`,
    metadata: {
      offeringId,
      siteCertId,
      tierSlug,
      regionId,
      paymentType: 'seat_deposit',
      ...(name?.trim() ? { customerName: name.trim() } : {}),
    },
  };

  const session = embedded
    ? await createStripeEmbeddedCheckoutSession({
        ...shared,
        returnUrl: safeRedirectUrl(origin, returnUrl, defaultReturn),
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
      usd_cents: usdCents,
      status: 'pending',
      stripe_session_id: session.sessionId,
      metadata: {
        paymentType: 'seat_deposit',
        siteCertId,
        tierSlug,
        customerName: name?.trim() ?? null,
        uiMode: embedded ? 'embedded' : 'redirect',
      },
    });
    if (error) {
      console.error('[checkout/seat-deposit] orders insert failed:', error.message);
      return jsonError('Could not create order record', 503);
    }
  }

  return jsonOk({
    session: {
      sessionId: session.sessionId,
      url: session.url,
      clientSecret: session.clientSecret,
    },
    usdCents,
    depositUsd,
  });
}

/** Stripe placeholder — wire STRIPE_SECRET_KEY when ready. */

export interface CheckoutSessionResult {
  sessionId: string;
  url: string | null;
  usdCents: number;
  offeringId: string;
}

export async function createStripeCheckoutSession(params: {
  offeringId: string;
  usdCents: number;
  email: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<CheckoutSessionResult> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return {
      sessionId: `mock_${Date.now()}`,
      url: null,
      usdCents: params.usdCents,
      offeringId: params.offeringId,
    };
  }

  // Real Stripe integration can replace this stub when keys are configured.
  return {
    sessionId: `pending_stripe_${params.offeringId}`,
    url: null,
    usdCents: params.usdCents,
    offeringId: params.offeringId,
  };
}

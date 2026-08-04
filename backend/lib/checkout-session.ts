import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { stripeCheckoutBranding } from '@/lib/stripe-checkout-branding';

export interface CheckoutSessionResult {
  sessionId: string;
  url: string | null;
  clientSecret: string | null;
  unitAmount: number;
  currency: string;
  offeringId: string;
  /** @deprecated Use unitAmount + currency */
  usdCents: number;
}

export type StripeLineItemParams = {
  currency: string;
  unitAmount: number;
  /** USD cents reference for orders / analytics */
  referenceUsdCents?: number | null;
  email?: string;
  successUrl: string;
  cancelUrl: string;
  productName: string;
  productDescription?: string;
  metadata: Record<string, string>;
  offeringId: string;
};

export type StripeEmbeddedLineItemParams = Omit<StripeLineItemParams, 'successUrl' | 'cancelUrl'> & {
  returnUrl: string;
  colorScheme?: 'light' | 'dark';
};

export type ScholarshipStripeEmbeddedLineItemParams = StripeEmbeddedLineItemParams & {
  expiresAt: number;
  idempotencyKey: string;
};

type StripeLineItemCore = Pick<
  StripeLineItemParams,
  'currency' | 'unitAmount' | 'referenceUsdCents' | 'productName' | 'productDescription'
>;

function fallbackUsdCents(params: StripeLineItemCore): number {
  if (params.referenceUsdCents != null) return params.referenceUsdCents;
  if (params.currency === 'usd') return params.unitAmount;
  return params.unitAmount;
}

function lineItem(params: StripeLineItemCore) {
  return {
    price_data: {
      currency: params.currency,
      unit_amount: params.unitAmount,
      product_data: {
        name: params.productName,
        ...(params.productDescription ? { description: params.productDescription } : {}),
      },
    },
    quantity: 1,
  };
}

export async function createStripePaymentSession(
  params: StripeLineItemParams,
): Promise<CheckoutSessionResult> {
  const usdCents = fallbackUsdCents(params);

  if (!isStripeConfigured()) {
    return {
      sessionId: `checkout_${Date.now()}_${params.offeringId}`,
      url: null,
      clientSecret: null,
      unitAmount: params.unitAmount,
      currency: params.currency,
      usdCents,
      offeringId: params.offeringId,
    };
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    ...(params.email?.trim() ? { customer_email: params.email.trim() } : {}),
    line_items: [lineItem(params)],
    metadata: params.metadata,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });

  return {
    sessionId: session.id,
    url: session.url,
    clientSecret: null,
    unitAmount: params.unitAmount,
    currency: params.currency,
    usdCents,
    offeringId: params.offeringId,
  };
}

export async function createStripeEmbeddedCheckoutSession(
  params: StripeEmbeddedLineItemParams,
): Promise<CheckoutSessionResult> {
  const usdCents = fallbackUsdCents(params);

  if (!isStripeConfigured()) {
    return {
      sessionId: `checkout_${Date.now()}_${params.offeringId}`,
      url: null,
      clientSecret: null,
      unitAmount: params.unitAmount,
      currency: params.currency,
      usdCents,
      offeringId: params.offeringId,
    };
  }

  const stripe = getStripe();
  const branding = stripeCheckoutBranding(params.colorScheme ?? 'light');
  const baseParams = {
    mode: 'payment' as const,
    ui_mode: 'embedded' as const,
    redirect_on_completion: 'if_required' as const,
    return_url: params.returnUrl,
    ...(params.email?.trim() ? { customer_email: params.email.trim() } : {}),
    line_items: [lineItem(params)],
    metadata: {
      ...params.metadata,
      colorScheme: params.colorScheme ?? 'light',
      checkoutCurrency: params.currency,
      checkoutUnitAmount: String(params.unitAmount),
    },
  };

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      ...baseParams,
      branding_settings: branding,
    } as Parameters<typeof stripe.checkout.sessions.create>[0]);
  } catch {
    session = await stripe.checkout.sessions.create(baseParams);
  }

  return {
    sessionId: session.id,
    url: null,
    clientSecret: session.client_secret,
    unitAmount: params.unitAmount,
    currency: params.currency,
    usdCents,
    offeringId: params.offeringId,
  };
}

export async function createScholarshipStripeEmbeddedCheckoutSession(
  params: ScholarshipStripeEmbeddedLineItemParams,
): Promise<CheckoutSessionResult> {
  const usdCents = fallbackUsdCents(params);
  if (!isStripeConfigured()) {
    return {
      sessionId: `checkout_${Date.now()}_${params.offeringId}`,
      url: null,
      clientSecret: null,
      unitAmount: params.unitAmount,
      currency: params.currency,
      usdCents,
      offeringId: params.offeringId,
    };
  }
  const session = await getStripe().checkout.sessions.create(
    {
      mode: 'payment',
      ui_mode: 'embedded',
      redirect_on_completion: 'if_required',
      return_url: params.returnUrl,
      billing_address_collection: 'required',
      // Owner decision: fixed SCH15 only — no promotion-code field, no SCH10/SCH20 choice.
      allow_promotion_codes: false,
      discounts: [{ coupon: 'SCH15' }],
      expires_at: params.expiresAt,
      ...(params.email?.trim() ? { customer_email: params.email.trim() } : {}),
      line_items: [lineItem(params)],
      metadata: {
        ...params.metadata,
        colorScheme: params.colorScheme ?? 'light',
        checkoutCurrency: params.currency,
        checkoutUnitAmount: String(params.unitAmount),
      },
    },
    { idempotencyKey: params.idempotencyKey },
  );
  return {
    sessionId: session.id,
    url: null,
    clientSecret: session.client_secret,
    unitAmount: params.unitAmount,
    currency: params.currency,
    usdCents,
    offeringId: params.offeringId,
  };
}

/**
 * Best-effort containment for a Stripe Checkout Session that cannot be backed
 * by the required durable order record. The route still returns failure even
 * when expiration itself fails so no client success state is exposed.
 */
export async function expireStripeCheckoutSessionBestEffort(sessionId: string): Promise<void> {
  if (!sessionId?.startsWith('cs_') || !isStripeConfigured()) return;
  try {
    await getStripe().checkout.sessions.expire(sessionId);
  } catch (error) {
    console.error('[checkout-session] could not expire orphan checkout session', {
      sessionId,
      error,
    });
  }
}

/** @deprecated Use {@link createStripePaymentSession} */
export async function createCheckoutSession(params: {
  offeringId: string;
  usdCents: number;
  email: string;
  successUrl: string;
  cancelUrl: string;
  productName?: string;
  productDescription?: string;
  metadata?: Record<string, string>;
}): Promise<CheckoutSessionResult> {
  return createStripePaymentSession({
    offeringId: params.offeringId,
    currency: 'usd',
    unitAmount: params.usdCents,
    referenceUsdCents: params.usdCents,
    email: params.email,
    successUrl: params.successUrl,
    cancelUrl: params.cancelUrl,
    productName: params.productName ?? 'PM Structure pathway enrollment',
    productDescription: params.productDescription,
    metadata: {
      offeringId: params.offeringId,
      paymentType: 'full_tuition',
      ...(params.metadata ?? {}),
    },
  });
}

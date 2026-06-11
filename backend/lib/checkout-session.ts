import { getStripe, isStripeConfigured } from '@/lib/stripe';

export interface CheckoutSessionResult {
  sessionId: string;
  url: string | null;
  clientSecret: string | null;
  usdCents: number;
  offeringId: string;
}

export type StripeLineItemParams = {
  usdCents: number;
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
};

export async function createStripePaymentSession(
  params: StripeLineItemParams,
): Promise<CheckoutSessionResult> {
  if (!isStripeConfigured()) {
    return {
      sessionId: `checkout_${Date.now()}_${params.offeringId}`,
      url: null,
      clientSecret: null,
      usdCents: params.usdCents,
      offeringId: params.offeringId,
    };
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    ...(params.email?.trim() ? { customer_email: params.email.trim() } : {}),
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: params.usdCents,
          product_data: {
            name: params.productName,
            ...(params.productDescription ? { description: params.productDescription } : {}),
          },
        },
        quantity: 1,
      },
    ],
    metadata: params.metadata,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });

  return {
    sessionId: session.id,
    url: session.url,
    clientSecret: null,
    usdCents: params.usdCents,
    offeringId: params.offeringId,
  };
}

export async function createStripeEmbeddedCheckoutSession(
  params: StripeEmbeddedLineItemParams,
): Promise<CheckoutSessionResult> {
  if (!isStripeConfigured()) {
    return {
      sessionId: `checkout_${Date.now()}_${params.offeringId}`,
      url: null,
      clientSecret: null,
      usdCents: params.usdCents,
      offeringId: params.offeringId,
    };
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    ui_mode: 'embedded',
    redirect_on_completion: 'if_required',
    return_url: params.returnUrl,
    ...(params.email?.trim() ? { customer_email: params.email.trim() } : {}),
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: params.usdCents,
          product_data: {
            name: params.productName,
            ...(params.productDescription ? { description: params.productDescription } : {}),
          },
        },
        quantity: 1,
      },
    ],
    metadata: params.metadata,
  });

  return {
    sessionId: session.id,
    url: null,
    clientSecret: session.client_secret,
    usdCents: params.usdCents,
    offeringId: params.offeringId,
  };
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
    usdCents: params.usdCents,
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

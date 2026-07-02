import { requestOrigin } from '@/lib/request-origin';
import { createStripeEmbeddedCheckoutSession } from '@/lib/checkout-session';
import { resolveStoreCheckoutPrice } from '@/lib/store-checkout';
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
  const { productId, regionId, colorScheme, returnUrl } = body as {
    productId?: string;
    regionId?: RegionId;
    colorScheme?: 'light' | 'dark';
    returnUrl?: string;
  };

  if (!productId) return jsonError('productId is required', 400);

  const price = resolveStoreCheckoutPrice(productId);
  if (!price) return jsonError('Product not found', 404);

  const origin = requestOrigin(request);
  const defaultReturn = `${origin}/checkout/store/success?product=${encodeURIComponent(productId)}&session_id={CHECKOUT_SESSION_ID}`;

  const session = await createStripeEmbeddedCheckoutSession({
    offeringId: productId,
    currency: price.currency,
    unitAmount: price.unitAmount,
    referenceUsdCents: Math.round(price.product.price * 100),
    productName: price.product.title,
    productDescription: price.product.description.slice(0, 200),
    metadata: {
      paymentType: 'store',
      productId,
      regionId: regionId ?? 'global',
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
    await supabaseAdmin.from('orders').insert({
      offering_id: productId,
      region_id: regionId ?? 'global',
      email: 'pending@checkout.local',
      usd_cents: Math.round(price.product.price * 100),
      status: 'pending',
      stripe_session_id: session.sessionId,
      metadata: {
        paymentType: 'store',
        productId,
        productTitle: price.product.title,
        checkoutCurrency: price.currency,
        checkoutUnitAmount: price.unitAmount,
        checkoutDisplay: price.display,
      },
    });
  }

  return jsonOk({
    session: {
      sessionId: session.sessionId,
      clientSecret: session.clientSecret,
    },
    displayAmount: price.display,
    productTitle: price.product.title,
  });
}

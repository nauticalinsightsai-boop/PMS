'use client';

import * as React from 'react';
import { loadStripe, type StripeEmbeddedCheckout } from '@stripe/stripe-js';
import { useRegion } from '@/contexts/RegionContext';
import { useSiteColorScheme } from '@/hooks/useSiteColorScheme';
import { CONVERSION_EVENTS, trackConversionEvent } from '@/lib/analytics/conversion-events';
import type { EnrollmentPaymentMode } from '@/lib/enrollment/seat-reservation';
import { createEnrollmentEmbeddedCheckout, fetchStripePublishableKey } from '@/services/enrollment';
import { stripePublishableKeyUnavailableMessage } from '@/lib/stripe-publishable-key';
import { cn } from '@/lib/utils';

function getStripePublishableKeyFromEnv(): string {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? '';
  return key.startsWith('pk_') ? key : '';
}

type Props = {
  offeringId: string;
  siteCertId: string;
  tierSlug: string;
  paymentMode: EnrollmentPaymentMode;
  className?: string;
};

export function StripeEmbeddedSeatCheckout({
  offeringId,
  siteCertId,
  tierSlug,
  paymentMode,
  className = '',
}: Props) {
  const { regionId, gccCountry } = useRegion();
  const colorScheme = useSiteColorScheme();
  const mountRef = React.useRef<HTMLDivElement>(null);
  const checkoutRef = React.useRef<StripeEmbeddedCheckout | null>(null);
  const [status, setStatus] = React.useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    let cancelled = false;

    async function initEmbeddedCheckout() {
      const publishableKey =
        getStripePublishableKeyFromEnv() || (await fetchStripePublishableKey());
      if (!publishableKey) {
        setStatus('error');
        setErrorMessage(stripePublishableKeyUnavailableMessage());
        return;
      }

      setStatus('loading');
      setErrorMessage(null);

      const result = await createEnrollmentEmbeddedCheckout({
        offeringId,
        siteCertId,
        tierSlug,
        regionId,
        gccCountry,
        paymentMode,
        colorScheme,
      });

      if (cancelled) return;

      if (result.error || !result.data?.session?.clientSecret) {
        setStatus('error');
        setErrorMessage(result.error ?? 'Could not load checkout. Try again or contact support.');
        return;
      }

      const stripe = await loadStripe(publishableKey);
      if (cancelled || !stripe || !mountRef.current) return;

      checkoutRef.current?.destroy();
      mountRef.current.innerHTML = '';

      const checkout = await stripe.initEmbeddedCheckout({
        clientSecret: result.data.session.clientSecret,
      });

      if (cancelled) {
        checkout.destroy();
        return;
      }

      checkoutRef.current = checkout;
      checkout.mount(mountRef.current);
      trackConversionEvent(CONVERSION_EVENTS.START_CHECKOUT, {
        offering_id: offeringId,
        payment_type: paymentMode === 'full_tuition' ? 'full_tuition_embedded' : 'seat_deposit_embedded',
      });
      setStatus('ready');
    }

    void initEmbeddedCheckout();

    return () => {
      cancelled = true;
      checkoutRef.current?.destroy();
      checkoutRef.current = null;
    };
  }, [offeringId, siteCertId, tierSlug, regionId, gccCountry, colorScheme, paymentMode]);

  return (
    <div
      className={cn(
        'seat-deposit-stripe-embedded relative w-full min-w-0 overflow-hidden rounded-lg bg-card text-card-foreground',
        className,
      )}
      data-color-scheme={colorScheme}
      data-payment-mode={paymentMode}
    >
      {status === 'loading' && (
        <div className="absolute inset-0 z-10 flex min-h-[420px] items-center justify-center bg-card/95 text-sm text-muted-foreground backdrop-blur-[1px]">
          Loading secure checkout…
        </div>
      )}
      {status === 'error' && errorMessage && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-6 text-center text-sm text-destructive">
          {errorMessage}
        </div>
      )}
      {status !== 'error' && (
        <div ref={mountRef} className="w-full min-h-[420px] bg-card" aria-label="Stripe payment form" />
      )}
    </div>
  );
}

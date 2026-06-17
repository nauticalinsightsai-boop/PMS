'use client';

import * as React from 'react';
import { loadStripe, type StripeEmbeddedCheckout } from '@stripe/stripe-js';
import { useRegion } from '@/contexts/RegionContext';
import { useSiteColorScheme } from '@/hooks/useSiteColorScheme';
import { CONVERSION_EVENTS, trackConversionEvent } from '@/lib/analytics/conversion-events';
import type { EnrollmentPaymentMode } from '@/lib/enrollment/seat-reservation';
import { createEnrollmentEmbeddedCheckout, fetchStripePublishableKey } from '@/services/enrollment';
import { assertPublishableKeyAllowedOnHost } from '@/lib/stripe-key-mode';
import { stripePublishableKeyUnavailableMessage } from '@/lib/stripe-publishable-key';
import { cn } from '@/lib/utils';

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
      setStatus('loading');
      setErrorMessage(null);

      try {
        const publishableKey = await fetchStripePublishableKey();
        if (cancelled) return;

        const keyError = assertPublishableKeyAllowedOnHost(publishableKey);
        if (!publishableKey || keyError) {
          setStatus('error');
          setErrorMessage(keyError ?? stripePublishableKeyUnavailableMessage());
          return;
        }

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
        if (cancelled) return;

        if (!stripe || !mountRef.current) {
          setStatus('error');
          setErrorMessage(
            'Could not load Stripe checkout. Disable ad blockers and refresh, or contact support@pmstructure.com.',
          );
          return;
        }

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
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        const message =
          err instanceof TypeError && err.message === 'Failed to fetch'
            ? typeof window !== 'undefined' &&
                (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
              ? 'Could not reach checkout. Start the dev server (npm run dev) and refresh this page.'
              : 'Could not reach checkout. Check your connection and refresh, or contact support@pmstructure.com.'
            : err instanceof Error
              ? err.message
              : 'Could not load checkout. Try again or contact support.';
        setErrorMessage(message);
      }
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

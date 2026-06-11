'use client';

import * as React from 'react';
import { loadStripe, type StripeEmbeddedCheckout } from '@stripe/stripe-js';
import { useRegion } from '@/contexts/RegionContext';
import { CONVERSION_EVENTS, trackConversionEvent } from '@/lib/analytics/conversion-events';
import { createSeatDepositEmbeddedCheckout, fetchStripePublishableKey } from '@/services/enrollment';
import { cn } from '@/lib/utils';

function getStripePublishableKeyFromEnv(): string {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? '';
}

type Props = {
  offeringId: string;
  siteCertId: string;
  tierSlug: string;
  className?: string;
};

export function StripeEmbeddedSeatCheckout({
  offeringId,
  siteCertId,
  tierSlug,
  className = '',
}: Props) {
  const { regionId } = useRegion();
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
        setErrorMessage(
          'Stripe publishable key is not configured. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env.local and restart npm run dev.',
        );
        return;
      }

      setStatus('loading');
      setErrorMessage(null);

      const result = await createSeatDepositEmbeddedCheckout({
        offeringId,
        siteCertId,
        tierSlug,
        regionId,
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
        payment_type: 'seat_deposit_embedded',
      });
      setStatus('ready');
    }

    void initEmbeddedCheckout();

    return () => {
      cancelled = true;
      checkoutRef.current?.destroy();
      checkoutRef.current = null;
    };
  }, [offeringId, siteCertId, tierSlug, regionId]);

  return (
    <div className={cn('seat-deposit-stripe-embedded relative w-full min-w-0', className)}>
      {status === 'loading' && (
        <div className="absolute inset-0 z-10 flex min-h-[420px] items-center justify-center bg-white/90 text-sm text-slate-500 dark:bg-slate-950/90">
          Loading secure checkout…
        </div>
      )}
      {status === 'error' && errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {errorMessage}
        </div>
      )}
      {status !== 'error' && (
        <div ref={mountRef} className="w-full min-h-[420px]" aria-label="Stripe payment form" />
      )}
    </div>
  );
}

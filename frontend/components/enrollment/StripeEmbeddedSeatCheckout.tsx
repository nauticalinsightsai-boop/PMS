'use client';

import * as React from 'react';
import { loadStripe, type StripeEmbeddedCheckout } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { useRegion } from '@/contexts/RegionContext';
import { useSiteColorScheme } from '@/hooks/useSiteColorScheme';
import { inferPackageType } from '@/lib/analytics/pms-events';
import {
  createCheckoutAttemptId,
  trackCheckoutInitiated,
  trackCheckoutSessionCreated,
} from '@/lib/analytics/track-checkout-journey';
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
  publishableKeyHint?: string | null;
  /** Invite scholarship only — server recomputes −15% mentor-led price. */
  offerType?: 'scholarship_invite';
};

export function StripeEmbeddedSeatCheckout({
  offeringId,
  siteCertId,
  tierSlug,
  paymentMode,
  className = '',
  publishableKeyHint = null,
  offerType,
}: Props) {
  const { regionId, gccCountry } = useRegion();
  const colorScheme = useSiteColorScheme();
  const mountRef = React.useRef<HTMLDivElement>(null);
  const checkoutRef = React.useRef<StripeEmbeddedCheckout | null>(null);
  const [status, setStatus] = React.useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const selectionKey = `${offeringId}:${tierSlug}:${paymentMode}:${regionId}:${gccCountry ?? ''}:${offerType ?? ''}`;
  const [checkoutAttempt, setCheckoutAttempt] = React.useState<{
    id: string;
    selectionKey: string;
  } | null>(null);
  const activeAttempt =
    checkoutAttempt?.selectionKey === selectionKey ? checkoutAttempt : null;
  const paymentType =
    paymentMode === 'self_paced'
      ? 'self_paced_embedded'
      : paymentMode === 'mentor_led'
        ? 'mentor_led_embedded'
        : paymentMode === 'full_tuition'
          ? 'full_tuition_embedded'
          : 'seat_deposit_embedded';

  const handleStartCheckout = React.useCallback(() => {
    if (activeAttempt) return;
    const attemptId = createCheckoutAttemptId();
    trackCheckoutInitiated({
      checkoutAttemptId: attemptId,
      packageType: inferPackageType(offeringId, tierSlug),
      offeringId,
      paymentType,
      items: [
        {
          item_id: offeringId,
          item_name: siteCertId,
          item_category: 'certification_preparation',
          quantity: 1,
        },
      ],
      pagePath: typeof window !== 'undefined' ? window.location.pathname : undefined,
    });
    setCheckoutAttempt({ id: attemptId, selectionKey });
  }, [
    activeAttempt,
    offeringId,
    paymentType,
    selectionKey,
    siteCertId,
    tierSlug,
  ]);

  React.useEffect(() => {
    if (!activeAttempt) return;
    const mountNode = mountRef.current;
    if (!mountNode) return;

    let cancelled = false;

    async function initEmbeddedCheckout() {
      setStatus('loading');
      setErrorMessage(null);

      try {
        const publishableKey = await fetchStripePublishableKey(publishableKeyHint);
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
          ...(offerType ? { offerType } : {}),
        });

        if (cancelled) return;

        if (result.error || !result.data?.session?.clientSecret) {
          setStatus('error');
          setErrorMessage(result.error ?? 'Could not load checkout. Try again or contact support.');
          return;
        }

        trackCheckoutSessionCreated({
          checkoutAttemptId: activeAttempt.id,
          packageType: inferPackageType(offeringId, tierSlug),
          offeringId,
          paymentType,
          items: [
            {
              item_id: offeringId,
              item_name: siteCertId,
              item_category: 'certification_preparation',
              quantity: 1,
            },
          ],
          pagePath: typeof window !== 'undefined' ? window.location.pathname : undefined,
        });

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
  }, [
    activeAttempt,
    offeringId,
    siteCertId,
    tierSlug,
    regionId,
    gccCountry,
    colorScheme,
    paymentMode,
    paymentType,
    publishableKeyHint,
    offerType,
  ]);

  if (!activeAttempt) {
    return (
      <div
        className={cn(
          'seat-deposit-stripe-embedded flex min-h-[220px] w-full min-w-0 items-center justify-center overflow-hidden rounded-lg bg-card px-4 text-card-foreground',
          className,
        )}
        data-color-scheme={colorScheme}
        data-payment-mode={paymentMode}
      >
        <Button
          type="button"
          variant="brand"
          size="lg"
          className="w-full max-w-sm rounded-xl"
          onClick={handleStartCheckout}
        >
          Start secure checkout
        </Button>
      </div>
    );
  }

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

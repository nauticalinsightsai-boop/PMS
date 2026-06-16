'use client';

import * as React from 'react';
import { loadStripe, type StripeEmbeddedCheckout } from '@stripe/stripe-js';
import { useSiteColorScheme } from '@/hooks/useSiteColorScheme';
import { cn } from '@/lib/utils';
import { fetchStripePublishableKey } from '@/services/checkout';
import { assertPublishableKeyAllowedOnHost } from '@/lib/stripe-key-mode';
import { stripePublishableKeyUnavailableMessage } from '@/lib/stripe-publishable-key';

type Props = {
  loadClientSecret: () => Promise<string | null>;
  deps: React.DependencyList;
  className?: string;
  onReady?: () => void;
  minHeightClass?: string;
};

export function StripeEmbeddedCheckoutPanel({
  loadClientSecret,
  deps,
  className = '',
  onReady,
  minHeightClass = 'min-h-[420px]',
}: Props) {
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
      const publishableKey = await fetchStripePublishableKey();
      const keyError = assertPublishableKeyAllowedOnHost(publishableKey);
      if (!publishableKey || keyError) {
        setStatus('error');
        setErrorMessage(keyError ?? stripePublishableKeyUnavailableMessage());
        return;
      }

      setStatus('loading');
      setErrorMessage(null);

      const clientSecret = await loadClientSecret();
      if (cancelled) return;

      if (!clientSecret) {
        setStatus('error');
        setErrorMessage('Could not load checkout. Try again or contact support.');
        return;
      }

      const stripe = await loadStripe(publishableKey);
      if (cancelled || !stripe || !mountRef.current) return;

      checkoutRef.current?.destroy();
      mountRef.current.innerHTML = '';

      const checkout = await stripe.initEmbeddedCheckout({ clientSecret });
      if (cancelled) {
        checkout.destroy();
        return;
      }

      checkoutRef.current = checkout;
      checkout.mount(mountRef.current);
      onReady?.();
      setStatus('ready');
    }

    void initEmbeddedCheckout();

    return () => {
      cancelled = true;
      checkoutRef.current?.destroy();
      checkoutRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps passed explicitly
  }, [colorScheme, ...deps]);

  return (
    <div
      className={cn(
        'stripe-embedded-checkout relative w-full min-w-0 overflow-hidden rounded-lg bg-card text-card-foreground',
        className,
      )}
      data-color-scheme={colorScheme}
    >
      {status === 'loading' && (
        <div
          className={cn(
            'absolute inset-0 z-10 flex items-center justify-center bg-card/95 text-sm text-muted-foreground backdrop-blur-[1px]',
            minHeightClass,
          )}
        >
          Loading secure checkout…
        </div>
      )}
      {status === 'error' && errorMessage && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-6 text-center text-sm text-destructive">
          {errorMessage}
        </div>
      )}
      {status !== 'error' && (
        <div
          ref={mountRef}
          className={cn('w-full bg-card', minHeightClass)}
          aria-label="Stripe payment form"
        />
      )}
    </div>
  );
}

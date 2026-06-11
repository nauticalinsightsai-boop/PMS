'use client';

import * as React from 'react';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { CONVERSION_EVENTS, trackConversionEvent } from '@/lib/analytics/conversion-events';
import { SEAT_DEPOSIT_STRIPE_PAYMENT_LINK } from '@/lib/enrollment/seat-reservation';
import { cn } from '@/lib/utils';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'buy-button-id'?: string;
          'publishable-key'?: string;
        },
        HTMLElement
      >;
    }
  }
}

const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? '';
const STRIPE_BUY_BUTTON_ID = process.env.NEXT_PUBLIC_STRIPE_BUY_BUTTON_ID?.trim() ?? '';

type Props = {
  depositLabel: string;
  paymentLinkUrl?: string;
  className?: string;
};

export function StripePaymentLinkEmbed({
  depositLabel,
  paymentLinkUrl = SEAT_DEPOSIT_STRIPE_PAYMENT_LINK,
  className = '',
}: Props) {
  const useBuyButton = Boolean(STRIPE_PUBLISHABLE_KEY && STRIPE_BUY_BUTTON_ID);

  const handleContinue = React.useCallback(() => {
    if (!paymentLinkUrl) return;
    trackConversionEvent(CONVERSION_EVENTS.START_CHECKOUT, { payment_type: 'seat_deposit_link' });
    trackConversionEvent(CONVERSION_EVENTS.CLICK_PAYMENT, { payment_type: 'seat_deposit_link' });
    window.location.assign(paymentLinkUrl);
  }, [paymentLinkUrl]);

  if (!paymentLinkUrl) {
    return (
      <p className="text-sm text-red-600">Payment link is not configured. Contact support@pmstructure.com.</p>
    );
  }

  if (useBuyButton) {
    return (
      <div className={cn('seat-deposit-stripe-embed w-full min-w-0', className)}>
        <Script src="https://js.stripe.com/v3/buy-button.js" strategy="afterInteractive" />
        <div className="flex min-h-[120px] items-center justify-center">
          <stripe-buy-button
            buy-button-id={STRIPE_BUY_BUTTON_ID}
            publishable-key={STRIPE_PUBLISHABLE_KEY}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('seat-deposit-stripe-embed w-full min-w-0 space-y-4', className)}>
      <div className="rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-5 dark:border-slate-800 dark:bg-slate-900/40">
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Stripe hosts checkout for your {depositLabel} seat deposit — name, email, and card details are collected on
          their secure page.
        </p>
        <ul className="mt-3 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <li>• Deposit reserves your seat for 15 minutes</li>
          <li>• Remaining tuition is due at onboarding</li>
          <li>• You&apos;ll return here after payment to view confirmation</li>
        </ul>
      </div>

      <Button
        type="button"
        variant="brand"
        size="lg"
        className="w-full rounded-xl"
        onClick={handleContinue}
      >
        Pay {depositLabel} · continue to Stripe
      </Button>

      <p className="text-center text-[11px] text-slate-500 dark:text-slate-400">
        Secure payment via{' '}
        <a href={paymentLinkUrl} className="font-semibold text-brand-orange hover:underline">
          Stripe Checkout
        </a>
      </p>
    </div>
  );
}

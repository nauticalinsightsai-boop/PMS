'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegion } from '@/contexts/RegionContext';
import { inferPackageType } from '@/lib/analytics/pms-events';
import {
  createCheckoutAttemptId,
  trackCheckoutInitiated,
  trackCheckoutSessionCreated,
} from '@/lib/analytics/track-checkout-journey';
import { createSeatDepositCheckout } from '@/services/enrollment';
import { cn } from '@/lib/utils';

type Props = {
  offeringId: string;
  siteCertId: string;
  tierSlug: string;
  depositLabel: string;
  className?: string;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function SeatDepositCheckout({
  offeringId,
  siteCertId,
  tierSlug,
  depositLabel,
  className = '',
}: Props) {
  const { regionId } = useRegion();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const canPay = name.trim().length >= 2 && isValidEmail(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPay) {
      setError('Enter your name and a valid email to continue.');
      return;
    }

    setError(null);
    setLoading(true);
    const checkoutAttemptId = createCheckoutAttemptId();
    const measurementContext = {
      checkoutAttemptId,
      packageType: inferPackageType(offeringId, tierSlug),
      offeringId,
      paymentType: 'seat_deposit_redirect',
      items: [
        {
          item_id: offeringId,
          item_name: siteCertId,
          item_category: 'certification_preparation',
          quantity: 1,
        },
      ],
      pagePath: typeof window !== 'undefined' ? window.location.pathname : undefined,
    } as const;
    trackCheckoutInitiated(measurementContext);

    try {
      const result = await createSeatDepositCheckout({
        offeringId,
        siteCertId,
        tierSlug,
        regionId,
        email: email.trim(),
        name: name.trim(),
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      const checkoutUrl = result.data?.session?.url;
      if (checkoutUrl) {
        trackCheckoutSessionCreated(measurementContext);
        window.location.href = checkoutUrl;
        return;
      }

      setError('Checkout is unavailable. Contact support@pmstructure.com.');
    } catch {
      setError('Payment request failed. Try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="seat-deposit-name">Name</Label>
          <Input
            id="seat-deposit-name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seat-deposit-email">Email</Label>
          <Input
            id="seat-deposit-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="brand"
        size="lg"
        className="w-full rounded-xl"
        disabled={!canPay || loading}
      >
        {loading ? 'Redirecting to secure checkout…' : `Pay ${depositLabel} · reserve your seat`}
      </Button>

      <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
        Secure card payment via Stripe. You&apos;ll return here after checkout to view confirmation.
      </p>
    </form>
  );
}

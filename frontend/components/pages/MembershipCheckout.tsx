'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useRef, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { useRegion } from '@/contexts/RegionContext';
import { useSiteColorScheme } from '@/hooks/useSiteColorScheme';
import { membershipCheckoutHref, type MembershipCheckoutBilling, type MembershipCheckoutTier } from '@/lib/membership-checkout';
import { MEMBERSHIP_PRICING } from '@/lib/membership-plans';
import { getRegionalMembershipAmounts } from '@/lib/membership-regional-pricing';
import { createMembershipEmbeddedCheckout } from '@/services/checkout';
import { cn } from '@/lib/utils';
import {
  createCheckoutAttemptId,
  trackCheckoutInitiated,
  trackCheckoutSessionCreated,
} from '@/lib/analytics/track-checkout-journey';

const StripeEmbeddedCheckoutPanel = dynamic(
  () =>
    import('@/components/checkout/StripeEmbeddedCheckoutPanel').then((mod) => ({
      default: mod.StripeEmbeddedCheckoutPanel,
    })),
  { ssr: false, loading: () => <div className="min-h-[320px] animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" /> },
);
function isValidTier(tier: string | null): tier is MembershipCheckoutTier {
  return tier === 'professional' || tier === 'mastery';
}

function isValidBilling(billing: string | null): billing is MembershipCheckoutBilling {
  return billing === 'monthly' || billing === 'yearly';
}

function MembershipCheckoutContent({ publishableKeyHint = null }: { publishableKeyHint?: string | null }) {
  const searchParams = useSearchParams();
  const tierParam = searchParams.get('tier');
  const billingParam = searchParams.get('billing') ?? 'monthly';
  const { regionId, gccCountry, regionLabel } = useRegion();
  const colorScheme = useSiteColorScheme();

  const tier = isValidTier(tierParam) ? tierParam : null;
  const billing = isValidBilling(billingParam) ? billingParam : 'monthly';
  const [checkoutAttemptId, setCheckoutAttemptId] = useState<string | null>(null);
  const sessionCreatedAttemptRef = useRef<string | null>(null);

  const handleStartCheckout = useCallback(() => {
    if (!tier || checkoutAttemptId) return;
    const attemptId = createCheckoutAttemptId();
    trackCheckoutInitiated({
      checkoutAttemptId: attemptId,
      packageType: 'membership',
      offeringId: `membership_${tier}_${billing}`,
      paymentType: billing,
      pagePath:
        typeof window !== 'undefined' ? window.location.pathname : '/membership/checkout',
    });
    setCheckoutAttemptId(attemptId);
  }, [billing, checkoutAttemptId, tier]);

  const loadClientSecret = useCallback(async () => {
    if (!tier || !checkoutAttemptId) return null;
    const result = await createMembershipEmbeddedCheckout({
      tier,
      billing,
      regionId,
      gccCountry,
      colorScheme,
    });
    const clientSecret = result.data?.session?.clientSecret ?? null;
    if (clientSecret && sessionCreatedAttemptRef.current !== checkoutAttemptId) {
      sessionCreatedAttemptRef.current = checkoutAttemptId;
      trackCheckoutSessionCreated({
        checkoutAttemptId,
        packageType: 'membership',
        offeringId: `membership_${tier}_${billing}`,
        paymentType: billing,
        pagePath:
          typeof window !== 'undefined' ? window.location.pathname : '/membership/checkout',
      });
    }
    return clientSecret;
  }, [tier, billing, regionId, gccCountry, colorScheme, checkoutAttemptId]);

  if (!tier) {
    return (
      <section className={sectionSurface('blend', 'py-24')}>
        <SectionAmbience tone="blend" />
        <div className="container relative z-10 mx-auto max-w-lg text-center">
          <h1 className="font-heading text-hero font-bold mb-4">Choose a membership plan</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Select Professional or Mastery on the membership page to continue to checkout.
          </p>
          <Link href="/membership" className={cn(buttonVariants({ variant: 'brand', size: 'lg' }))}>
            View membership plans
          </Link>
        </div>
      </section>
    );
  }

  const pricing = MEMBERSHIP_PRICING[tier];
  const usdAmount = billing === 'monthly' ? pricing.monthlyUsd : pricing.yearlyUsd;
  const regional = getRegionalMembershipAmounts(
    pricing.monthlyUsd,
    pricing.yearlyUsd,
    regionId,
    gccCountry,
  );
  const displayPrice = billing === 'monthly' ? regional.monthly : regional.yearly;
  const tierLabel = tier === 'professional' ? 'Professional' : 'Mastery';
  const billingLabel = billing === 'monthly' ? 'monthly' : 'yearly';

  return (
    <section className={sectionSurface('blend', 'py-16 md:py-24')}>
      <SectionAmbience tone="blend" />
      <div className="container relative z-10 mx-auto max-w-xl">
        <div className="mb-8 text-center">
          <p className="text-label text-brand-orange mb-2">Secure checkout</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">
            Join {tierLabel} · {billingLabel}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {displayPrice}
            {billing === 'monthly' ? '/month' : '/year'} · {regionLabel} pricing
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Reference: ${usdAmount} USD {billing === 'monthly' ? 'per month' : 'per year'}
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          {checkoutAttemptId ? (
            <StripeEmbeddedCheckoutPanel
              loadClientSecret={loadClientSecret}
              deps={[tier, billing, regionId, gccCountry, colorScheme, checkoutAttemptId]}
              publishableKeyHint={publishableKeyHint}
            />
          ) : (
            <div className="flex min-h-[220px] items-center justify-center">
              <Button
                type="button"
                variant="brand"
                size="lg"
                className="w-full max-w-sm rounded-2xl"
                onClick={handleStartCheckout}
              >
                Start secure checkout
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <Link
            href={membershipCheckoutHref(tier, billing === 'monthly' ? 'yearly' : 'monthly')}
            className="text-brand-orange font-bold hover:underline"
          >
            Switch to {billing === 'monthly' ? 'yearly' : 'monthly'} billing
          </Link>
          <Link href="/membership" className="text-slate-500 font-semibold hover:underline">
            Back to plans
          </Link>
        </div>
      </div>
    </section>
  );
}

export function MembershipCheckoutPage({ publishableKeyHint = null }: { publishableKeyHint?: string | null }) {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-lg py-24 text-center">Loading checkout…</div>}>
      <MembershipCheckoutContent publishableKeyHint={publishableKeyHint} />
    </Suspense>
  );
}

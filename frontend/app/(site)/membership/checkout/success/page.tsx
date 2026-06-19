'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { OnboardingCalendlyCta } from '@/components/checkout/OnboardingCalendlyCta';
import { buttonVariants } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { verifyCheckoutSession } from '@/services/checkout';
import { cn } from '@/lib/utils';
import { PMS_SKOOL_COMMUNITY_JOIN_URL, externalHrefLinkProps } from '@/config/pms-site';
import { trackPurchaseOnce } from '@/lib/analytics/track-purchase-once';

function MembershipCheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const tier = searchParams.get('tier');
  const billing = searchParams.get('billing');
  const sessionId = searchParams.get('session_id');
  const [paymentVerified, setPaymentVerified] = useState<boolean | null>(null);

  useEffect(() => {
    if (!sessionId?.startsWith('cs_')) return;
    let cancelled = false;
    void verifyCheckoutSession(sessionId).then((result) => {
      if (!cancelled) setPaymentVerified(result.data?.paid ?? false);
    });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId?.startsWith('cs_') || paymentVerified !== true) return;
    trackPurchaseOnce({
      transactionId: sessionId,
      packageType: 'membership',
    });
  }, [sessionId, paymentVerified]);

  const tierLabel =
    tier === 'professional' ? 'Professional' : tier === 'mastery' ? 'Mastery' : 'Membership';
  const billingLabel = billing === 'yearly' ? 'yearly' : 'monthly';

  return (
    <section className={sectionSurface('blend', 'py-24')}>
      <SectionAmbience tone="blend" />
      <div className="container relative z-10 mx-auto max-w-lg text-center">
        <h1 className="font-heading text-hero font-bold mb-4">Welcome to {tierLabel}</h1>
        {sessionId && paymentVerified === false && (
          <p className="text-amber-700 dark:text-amber-300 mb-4 text-sm leading-relaxed">
            We&apos;re still confirming your payment. If this persists, contact support with your checkout reference.
          </p>
        )}
        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Thank you for joining {tierLabel} ({billingLabel} billing). Confirmation and onboarding details will be sent
          to the email address you provided at checkout.
        </p>
        {(paymentVerified === true || !sessionId) && (
          <OnboardingCalendlyCta
            offeringId={tier ? `membership_${tier}` : null}
            utmMedium="membership"
            className="mb-8 w-full max-w-sm mx-auto"
          />
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/membership" className={cn(buttonVariants({ size: 'lg', variant: 'brand' }))}>
            Membership overview
          </Link>
          <Link
            href={PMS_SKOOL_COMMUNITY_JOIN_URL}
            {...externalHrefLinkProps(PMS_SKOOL_COMMUNITY_JOIN_URL)}
            className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
          >
            Explore community
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-lg py-24 text-center">Loading…</div>}>
      <MembershipCheckoutSuccessContent />
    </Suspense>
  );
}

'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { verifiedPurchaseMoney, verifyCheckoutSession } from '@/services/enrollment';
import { MessageCircle } from 'lucide-react';
import { OnboardingCalendlyCta } from '@/components/checkout/OnboardingCalendlyCta';
import { buttonVariants } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { PMS_SUPPORT_EMAIL, getPmsWhatsAppDisplay, getPmsWhatsAppUrl, isWhatsAppConfigured } from '@/config/pms-site';
import { getOfferingById } from '@/lib/regional-catalogue';
import { cn } from '@/lib/utils';
import { inferPackageType } from '@/lib/analytics/pms-events';
import { trackPurchaseOnce } from '@/lib/analytics/track-purchase-once';
import { trackContactClick } from '@/lib/analytics/track-contact-click';

function ProgramEnrollmentSuccessContent({
  siteCertId,
  tierSlug: _tierSlug,
  certName,
}: {
  siteCertId: string;
  tierSlug: string;
  certName: string;
}) {
  const searchParams = useSearchParams();
  const offeringId = searchParams.get('offering');
  const sessionId = searchParams.get('session_id');
  const offering = offeringId ? getOfferingById(offeringId) : undefined;
  const whatsappReady = isWhatsAppConfigured();
  const [paymentVerified, setPaymentVerified] = useState<boolean | null>(null);
  const [paymentType, setPaymentType] = useState<string | null>(null);
  const [verifiedMoney, setVerifiedMoney] = useState<{ currency: string; value: number } | null>(null);

  useEffect(() => {
    if (!sessionId?.startsWith('cs_')) return;
    let cancelled = false;
    void verifyCheckoutSession(sessionId).then((result) => {
      if (!cancelled) {
        setPaymentVerified(result.data?.paid ?? false);
        setPaymentType(result.data?.paymentType ?? null);
        const money = verifiedPurchaseMoney(result.data);
        setVerifiedMoney(money ? { currency: money.currency, value: money.value } : null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId?.startsWith('cs_') || paymentVerified !== true || !offering || !verifiedMoney) return;
    trackPurchaseOnce({
      transactionId: sessionId,
      packageType: inferPackageType(offeringId ?? undefined, offering.tierId),
      currency: verifiedMoney.currency,
      value: verifiedMoney.value,
      items: [
        {
          item_id: offeringId ?? offering.offeringId,
          item_name: offering.courseName,
          item_category: 'certification_preparation',
          quantity: 1,
        },
      ],
    });
  }, [sessionId, paymentVerified, verifiedMoney, offering, offeringId]);

  const paidInFull = paymentType === 'full_tuition';

  return (
    <section className={sectionSurface('blend', 'py-24')}>
      <SectionAmbience tone="blend" />
      <div className="container relative z-10 mx-auto max-w-lg text-center">
        <p className="text-label text-brand-orange mb-2">{certName}</p>
        <h1 className="font-heading text-hero font-bold mb-4">
          {paidInFull ? 'Enrollment confirmed' : 'Your seat is reserved'}
        </h1>
        {sessionId && paymentVerified === false && (
          <p className="text-amber-700 dark:text-amber-300 mb-4 text-sm leading-relaxed">
            We&apos;re still confirming your payment. If this message persists, email {PMS_SUPPORT_EMAIL} with your
            checkout reference.
          </p>
        )}
        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          {paidInFull ? (
            <>
              Thank you for your full pathway payment. Confirmation and next steps will be sent to the email address
              you provided, including onboarding call scheduling.
            </>
          ) : (
            <>
              Thank you for your deposit. Confirmation and next steps will be sent to the email address you provided,
              including onboarding call scheduling.
            </>
          )}
        </p>
        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          A team member may reach out if we need anything else to provision your pathway. If you have questions in the
          meantime, we&apos;re here to help.
        </p>
        {offering && (
          <p className="text-sm font-semibold text-brand-orange mb-6">
            {offering.courseName} · {offering.tierId.replace(/_/g, ' ')}
          </p>
        )}

        {(paymentVerified === true || !sessionId) && (
          <OnboardingCalendlyCta offeringId={offeringId} className="mb-8 w-full" />
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-left dark:border-slate-800 dark:bg-slate-950/50 mb-8 space-y-3">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Need help?</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Email{' '}
            <a
              href={`mailto:${PMS_SUPPORT_EMAIL}`}
              onClick={() =>
                trackContactClick({
                  contactMethod: 'email',
                  contactContext: 'support',
                  ctaText: 'Enrollment support email',
                })
              }
              className="text-brand-orange font-bold hover:underline"
            >
              {PMS_SUPPORT_EMAIL}
            </a>{' '}
            with your enrollment email and we&apos;ll respond as soon as we can.
          </p>
          {whatsappReady && (
            <a
              href={getPmsWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackContactClick({
                  contactMethod: 'whatsapp',
                  contactContext: 'support',
                  ctaText: 'Enrollment WhatsApp',
                })
              }
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'w-full justify-center gap-2 rounded-2xl border-emerald-200 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-200',
              )}
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              WhatsApp: {getPmsWhatsAppDisplay()}
            </a>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/certifications/${siteCertId}`}
            className={cn(buttonVariants({ size: 'lg', variant: 'brand' }))}
          >
            Back to {certName}
          </Link>
          <Link
            href="/certifications"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
          >
            All pathways
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ProgramEnrollmentSuccessPage({
  siteCertId,
  tierSlug,
  certName,
}: {
  siteCertId: string;
  tierSlug: string;
  certName: string;
}) {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-lg py-24 text-center">Loading…</div>}>
      <ProgramEnrollmentSuccessContent
        siteCertId={siteCertId}
        tierSlug={tierSlug}
        certName={certName}
      />
    </Suspense>
  );
}

'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { MessageCircle } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { PMS_SUPPORT_EMAIL, PMS_WHATSAPP_URL, isWhatsAppConfigured } from '@/config/pms-site';
import { getOfferingById } from '@/lib/regional-catalogue';
import { cn } from '@/lib/utils';

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
  const offering = offeringId ? getOfferingById(offeringId) : undefined;
  const whatsappReady = isWhatsAppConfigured();

  return (
    <section className={sectionSurface('blend', 'py-24')}>
      <SectionAmbience tone="blend" />
      <div className="container relative z-10 mx-auto max-w-lg text-center">
        <p className="text-label text-brand-orange mb-2">{certName}</p>
        <h1 className="font-heading text-hero font-bold mb-4">You&apos;re enrolled</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Thank you for enrolling. Full enrollment details will be sent to the email address you provided, including
          next steps and access instructions.
        </p>
        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          A team member may reach out if we need anything else to provision your pathway. If you have questions in the
          meantime, we&apos;re here to help.
        </p>
        {offering && (
          <p className="text-sm font-semibold text-brand-orange mb-6">
            {offering.courseName} · {offering.tier}
          </p>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-left dark:border-slate-800 dark:bg-slate-950/50 mb-8 space-y-3">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Need help?</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Email{' '}
            <a href={`mailto:${PMS_SUPPORT_EMAIL}`} className="text-brand-orange font-bold hover:underline">
              {PMS_SUPPORT_EMAIL}
            </a>{' '}
            with your enrollment email and we&apos;ll respond as soon as we can.
          </p>
          {whatsappReady && (
            <a
              href={PMS_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'w-full justify-center gap-2 rounded-2xl border-emerald-200 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-200',
              )}
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Message us on WhatsApp
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

'use client';

import Link from 'next/link';
import { ProgramEnrollmentForm } from '@/components/enrollment/ProgramEnrollmentForm';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { buttonVariants } from '@/components/ui/button';
import { CTAS } from '@/lib/brand-voice';
import { T176_PAYMENT_DISCLAIMER } from '@/content/t176-claims';
import { cn } from '@/lib/utils';

type ProgramEnrollmentPageProps = {
  siteCertId: string;
  tierSlug: string;
  offeringId: string;
  certName: string;
  publishableKeyHint?: string | null;
};

export function ProgramEnrollmentPage({
  siteCertId,
  tierSlug,
  offeringId,
  certName,
  publishableKeyHint = null,
}: ProgramEnrollmentPageProps) {
  return (
    <section className={sectionSurface('blend', 'py-12 md:py-24')}>
      <SectionAmbience tone="blend" />
      <div className="container relative z-10 mx-auto w-full max-w-lg px-4 lg:max-w-7xl">
        <div className="lg:max-w-3xl">
          <p className="text-label text-brand-orange mb-2">{certName}</p>
          <h1 className="font-heading text-hero font-bold mb-2">{CTAS.pathwayReserveSeat}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm leading-relaxed md:text-base">
            Reserve your seat with a 25% deposit, or pay full pathway tuition today. Pricing for your region is shown
            below: choose the option that works best for you.
          </p>
        </div>
        <ProgramEnrollmentForm
          offeringId={offeringId}
          siteCertId={siteCertId}
          tierSlug={tierSlug}
          publishableKeyHint={publishableKeyHint}
        />
        <p className="mt-6 text-xs leading-relaxed text-slate-500 dark:text-slate-400 lg:max-w-3xl">
          {T176_PAYMENT_DISCLAIMER}
        </p>
        <div className="mt-8 lg:max-w-3xl">
          <Link
            href={`/certifications/${siteCertId}`}
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-slate-500')}
          >
            ← Back to pathway
          </Link>
        </div>
      </div>
    </section>
  );
}
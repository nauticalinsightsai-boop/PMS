'use client';

import Link from 'next/link';
import { ProgramEnrollmentForm } from '@/components/enrollment/ProgramEnrollmentForm';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ProgramEnrollmentPageProps = {
  siteCertId: string;
  tierSlug: string;
  offeringId: string;
  certName: string;
};

export function ProgramEnrollmentPage({
  siteCertId,
  tierSlug,
  offeringId,
  certName,
}: ProgramEnrollmentPageProps) {
  return (
    <section className={sectionSurface('blend', 'py-24')}>
      <SectionAmbience tone="blend" />
      <div className="container relative z-10 mx-auto max-w-lg">
        <p className="text-label text-brand-orange mb-2">{certName}</p>
        <h1 className="font-heading text-hero font-bold mb-2">Program enrollment</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm">
          Secure your place on this pathway. Regional scholarship pricing applies when your residence and billing
          countries match your selected region.
        </p>
        <ProgramEnrollmentForm offeringId={offeringId} siteCertId={siteCertId} tierSlug={tierSlug} />
        <div className="mt-8">
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

'use client';

import Link from 'next/link';
import { ProgramEnrollmentForm } from '@/components/enrollment/ProgramEnrollmentForm';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { buttonVariants } from '@/components/ui/button';
import { enrollmentDescriptionForTier, enrollmentHeadingForTier } from '@/lib/enrollment/enrollment-copy';
import {
  ELITE_SCHOLARSHIP_HEADING,
  eliteScholarshipDescription,
} from '@/lib/enrollment/scholarship-offer';
import { pathwayPaymentDisclaimer } from '@/content/t176-claims';
import { getOfferingById } from '@/lib/regional-catalogue';
import { cn } from '@/lib/utils';
import { useRegion } from '@/contexts/RegionContext';

type ProgramEnrollmentPageProps = {
  siteCertId: string;
  tierSlug: string;
  offeringId: string;
  certName: string;
  publishableKeyHint?: string | null;
  /** Invite-only Elite scholarship checkout (Global −15% / GCC −35% vs Global). */
  scholarshipMode?: boolean;
};

export function ProgramEnrollmentPage({
  siteCertId,
  tierSlug,
  offeringId,
  certName,
  publishableKeyHint = null,
  scholarshipMode = false,
}: ProgramEnrollmentPageProps) {
  const offering = getOfferingById(offeringId);
  const preparationName = offering?.courseName?.trim() || `${certName} Preparation`;
  const { regionId } = useRegion();

  return (
    <section className={sectionSurface('blend', 'py-12 md:py-24')}>
      <SectionAmbience tone="blend" />
      <div className="container relative z-10 mx-auto w-full max-w-lg px-4 lg:max-w-7xl">
        <div className="lg:max-w-3xl">
          <p className="text-label text-brand-orange mb-2">{certName}</p>
          <h1 className="font-heading text-hero font-bold mb-2">
            {scholarshipMode ? ELITE_SCHOLARSHIP_HEADING : enrollmentHeadingForTier(tierSlug)}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm leading-relaxed md:text-base">
            {scholarshipMode
              ? eliteScholarshipDescription(regionId)
              : enrollmentDescriptionForTier(tierSlug)}
          </p>
        </div>
        <ProgramEnrollmentForm
          offeringId={offeringId}
          siteCertId={siteCertId}
          tierSlug={tierSlug}
          publishableKeyHint={publishableKeyHint}
          scholarshipMode={scholarshipMode}
        />
        <p className="mt-6 text-xs leading-relaxed text-slate-500 dark:text-slate-400 lg:max-w-3xl">
          {pathwayPaymentDisclaimer(preparationName)}
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

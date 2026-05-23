'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { getOfferingById } from '@/lib/regional-catalogue';
import { cn } from '@/lib/utils';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const offeringId = searchParams.get('offering');
  const offering = offeringId ? getOfferingById(offeringId) : undefined;

  return (
    <section className={sectionSurface('blend', 'py-24')}>
      <SectionAmbience tone="blend" />
      <div className="container relative z-10 mx-auto max-w-lg text-center">
        <h1 className="font-heading text-hero font-bold mb-4">Thank you</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Your checkout session was created. Complete payment when Stripe is configured.
        </p>
        {offering && (
          <p className="text-sm font-semibold text-brand-orange mb-8">
            {offering.courseName} · {offering.tierId.replace(/_/g, ' ')}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/certifications" className={cn(buttonVariants({ size: 'lg', variant: 'brand' }))}>
            Back to pathways
          </Link>
          {offeringId && (
            <Link
              href={`/checkout?offering=${encodeURIComponent(offeringId)}`}
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            >
              View checkout
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-lg py-24 text-center">Loading…</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

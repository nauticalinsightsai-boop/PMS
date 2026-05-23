'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { getOfferingById } from '@/lib/regional-catalogue';
import { cn } from '@/lib/utils';

function CheckoutCancelContent() {
  const searchParams = useSearchParams();
  const offeringId = searchParams.get('offering');
  const offering = offeringId ? getOfferingById(offeringId) : undefined;
  const retryHref = offeringId
    ? `/checkout?offering=${encodeURIComponent(offeringId)}`
    : '/certifications';

  return (
    <section className={sectionSurface('cool', 'py-24')}>
      <SectionAmbience tone="cool" />
      <div className="container relative z-10 mx-auto max-w-lg text-center">
        <h1 className="font-heading text-hero font-bold mb-4">Checkout cancelled</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          No charge was made. You can return to your pathway when ready.
        </p>
        {offering && (
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-8">
            {offering.courseName} · {offering.tierId.replace(/_/g, ' ')}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={retryHref} className={cn(buttonVariants({ size: 'lg', variant: 'brand' }))}>
            {offeringId ? 'Retry checkout' : 'Browse pathways'}
          </Link>
          <Link href="/certifications" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
            Browse pathways
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-lg py-24 text-center">Loading…</div>}>
      <CheckoutCancelContent />
    </Suspense>
  );
}

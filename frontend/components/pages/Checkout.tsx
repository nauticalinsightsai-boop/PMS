'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CheckoutOfferingRedirect } from '@/components/checkout/CheckoutOfferingRedirect';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { enrollmentPathForOffering } from '@/lib/enrollment-routes';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const offeringId = searchParams.get('offering');
  const enrollPath = offeringId ? enrollmentPathForOffering(offeringId) : null;

  if (enrollPath) {
    return <CheckoutOfferingRedirect />;
  }

  return <CheckoutForm />;
}

export function CheckoutPage() {
  return (
    <section className={sectionSurface('blend', 'py-24')}>
      <SectionAmbience tone="blend" />
      <div className="container relative z-10 mx-auto max-w-lg">
        <h1 className="font-heading text-hero font-bold mb-8">Checkout</h1>
        <Suspense fallback={<p>Loading checkout…</p>}>
          <CheckoutContent />
        </Suspense>
      </div>
    </section>
  );
}

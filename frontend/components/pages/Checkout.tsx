'use client';

import { Suspense } from 'react';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';

export function CheckoutPage() {
  return (
    <section className={sectionSurface('blend', 'py-24')}>
      <SectionAmbience tone="blend" />
      <div className="container relative z-10 mx-auto max-w-md">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>
        <Suspense fallback={<p>Loading checkout…</p>}>
          <CheckoutForm />
        </Suspense>
      </div>
    </section>
  );
}

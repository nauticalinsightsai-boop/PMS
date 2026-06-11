'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { StripeEmbeddedCheckoutPanel } from '@/components/checkout/StripeEmbeddedCheckoutPanel';
import { useRegion } from '@/contexts/RegionContext';
import { useSiteColorScheme } from '@/hooks/useSiteColorScheme';
import { defaultStoreCatalog } from '@pms/site-content/store';
import { createStoreEmbeddedCheckout } from '@/services/checkout';
import { cn } from '@/lib/utils';

function StoreCheckoutContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const { regionId, gccCountry } = useRegion();
  const colorScheme = useSiteColorScheme();

  const product = productId
    ? defaultStoreCatalog().products.find((p) => p.id === productId && p.visible)
    : undefined;

  const loadClientSecret = useCallback(async () => {
    if (!productId) return null;
    const result = await createStoreEmbeddedCheckout({
      productId,
      regionId,
      gccCountry,
      colorScheme,
    });
    return result.data?.session?.clientSecret ?? null;
  }, [productId, regionId, gccCountry, colorScheme]);

  if (!productId || !product) {
    return (
      <section className={sectionSurface('blend', 'py-24')}>
        <SectionAmbience tone="blend" />
        <div className="container relative z-10 mx-auto max-w-lg text-center">
          <h1 className="font-heading text-hero font-bold mb-4">Product not found</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Choose a resource from the store to purchase.
          </p>
          <Link href="/community?view=store" className={cn(buttonVariants({ variant: 'brand', size: 'lg' }))}>
            Browse store
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={sectionSurface('blend', 'py-16 md:py-24')}>
      <SectionAmbience tone="blend" />
      <div className="container relative z-10 mx-auto max-w-xl">
        <div className="mb-8 text-center">
          <p className="text-label text-brand-orange mb-2">Secure checkout</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">{product.title}</h1>
          <p className="text-slate-600 dark:text-slate-400">{product.displayPrice}</p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <StripeEmbeddedCheckoutPanel
            loadClientSecret={loadClientSecret}
            deps={[productId, regionId, gccCountry, colorScheme]}
          />
        </div>

        <div className="mt-6 text-center">
          <Link href="/community?view=store" className="text-brand-orange font-bold hover:underline text-sm">
            Back to store
          </Link>
        </div>
      </div>
    </section>
  );
}

export function StoreCheckoutPage() {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-lg py-24 text-center">Loading checkout…</div>}>
      <StoreCheckoutContent />
    </Suspense>
  );
}

'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useRef, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { useRegion } from '@/contexts/RegionContext';
import { useSiteColorScheme } from '@/hooks/useSiteColorScheme';
import { defaultStoreCatalog } from '@pms/site-content/store';
import { createStoreEmbeddedCheckout } from '@/services/checkout';
import { cn } from '@/lib/utils';
import {
  createCheckoutAttemptId,
  trackCheckoutInitiated,
  trackCheckoutSessionCreated,
} from '@/lib/analytics/track-checkout-journey';

const StripeEmbeddedCheckoutPanel = dynamic(
  () =>
    import('@/components/checkout/StripeEmbeddedCheckoutPanel').then((mod) => ({
      default: mod.StripeEmbeddedCheckoutPanel,
    })),
  { ssr: false, loading: () => <div className="min-h-[320px] animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" /> },
);

function StoreCheckoutContent({ publishableKeyHint = null }: { publishableKeyHint?: string | null }) {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const { regionId, gccCountry } = useRegion();
  const colorScheme = useSiteColorScheme();

  const product = productId
    ? defaultStoreCatalog().products.find((p) => p.id === productId && p.visible)
    : undefined;
  const [checkoutAttemptId, setCheckoutAttemptId] = useState<string | null>(null);
  const sessionCreatedAttemptRef = useRef<string | null>(null);

  const handleStartCheckout = useCallback(() => {
    if (!product || checkoutAttemptId) return;
    const attemptId = createCheckoutAttemptId();
    trackCheckoutInitiated({
      checkoutAttemptId: attemptId,
      packageType: 'resource',
      offeringId: product.id,
      currency: 'USD',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.title,
          item_category: 'resource',
          price: product.price,
          quantity: 1,
        },
      ],
      pagePath:
        typeof window !== 'undefined' ? window.location.pathname : '/checkout/store',
    });
    setCheckoutAttemptId(attemptId);
  }, [checkoutAttemptId, product]);

  const loadClientSecret = useCallback(async () => {
    if (!productId || !product || !checkoutAttemptId) return null;
    const result = await createStoreEmbeddedCheckout({
      productId,
      regionId,
      gccCountry,
      colorScheme,
    });
    const clientSecret = result.data?.session?.clientSecret ?? null;
    if (clientSecret && sessionCreatedAttemptRef.current !== checkoutAttemptId) {
      sessionCreatedAttemptRef.current = checkoutAttemptId;
      trackCheckoutSessionCreated({
        checkoutAttemptId,
        packageType: 'resource',
        offeringId: product.id,
        currency: 'USD',
        value: product.price,
        items: [
          {
            item_id: product.id,
            item_name: product.title,
            item_category: 'resource',
            price: product.price,
            quantity: 1,
          },
        ],
        pagePath:
          typeof window !== 'undefined' ? window.location.pathname : '/checkout/store',
      });
    }
    return clientSecret;
  }, [productId, product, regionId, gccCountry, colorScheme, checkoutAttemptId]);

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
          {checkoutAttemptId ? (
            <StripeEmbeddedCheckoutPanel
              loadClientSecret={loadClientSecret}
              deps={[productId, regionId, gccCountry, colorScheme, checkoutAttemptId]}
              publishableKeyHint={publishableKeyHint}
            />
          ) : (
            <div className="flex min-h-[220px] items-center justify-center">
              <Button
                type="button"
                variant="brand"
                size="lg"
                className="w-full max-w-sm rounded-2xl"
                onClick={handleStartCheckout}
              >
                Start secure checkout
              </Button>
            </div>
          )}
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

export function StoreCheckoutPage({ publishableKeyHint = null }: { publishableKeyHint?: string | null }) {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-lg py-24 text-center">Loading checkout…</div>}>
      <StoreCheckoutContent publishableKeyHint={publishableKeyHint} />
    </Suspense>
  );
}

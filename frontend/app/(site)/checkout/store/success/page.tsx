'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { defaultStoreCatalog } from '@pms/site-content/store';
import { verifyCheckoutSession } from '@/services/checkout';
import { cn } from '@/lib/utils';
import { trackCheckoutSuccessView } from '@/lib/analytics/track-checkout-journey';
import { trackPurchaseOnce } from '@/lib/analytics/track-purchase-once';

function StoreCheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const sessionId = searchParams.get('session_id');
  const [paymentVerified, setPaymentVerified] = useState<boolean | null>(null);
  const successViewTracked = useRef(false);

  const product = productId
    ? defaultStoreCatalog().products.find((p) => p.id === productId)
    : undefined;

  useEffect(() => {
    if (!sessionId?.startsWith('cs_')) return;
    let cancelled = false;
    void verifyCheckoutSession(sessionId).then((result) => {
      if (cancelled) return;
      const verified = result.data;
      setPaymentVerified(verified?.paid ?? false);
      if (
        verified?.paid === true &&
        verified.durableTransactionId &&
        verified.durablePurchaseEventId
      ) {
        trackPurchaseOnce({
          serverVerifiedPaid: true,
          durableTransactionId: verified.durableTransactionId,
          durablePurchaseEventId: verified.durablePurchaseEventId,
          packageType: 'resource',
          currency: verified.currency ?? undefined,
          value: verified.value ?? undefined,
          items: [
            {
              item_id: product?.id ?? productId ?? 'resource',
              item_name: product?.title ?? 'PM Structure resource',
              item_category: 'resource',
              price: product?.price,
              quantity: 1,
            },
          ],
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [product?.id, product?.price, product?.title, productId, sessionId]);

  useEffect(() => {
    if (
      !sessionId?.startsWith('cs_') ||
      paymentVerified === null ||
      successViewTracked.current
    ) {
      return;
    }
    successViewTracked.current = true;
    trackCheckoutSuccessView({
      packageType: 'resource',
      resultState: paymentVerified ? 'verified_paid' : 'not_verified_paid',
      offeringId: product?.id ?? productId ?? undefined,
      paymentType: 'store',
      pagePath: '/checkout/store/success',
    });
  }, [paymentVerified, product?.id, productId, sessionId]);

  return (
    <section className={sectionSurface('blend', 'py-24')}>
      <SectionAmbience tone="blend" />
      <div className="container relative z-10 mx-auto max-w-lg text-center">
        <h1 className="font-heading text-hero font-bold mb-4">Purchase confirmed</h1>
        {sessionId && paymentVerified === false && (
          <p className="text-amber-700 dark:text-amber-300 mb-4 text-sm leading-relaxed">
            We&apos;re still confirming your payment. If this persists, contact support with your checkout reference.
          </p>
        )}
        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Thank you for your purchase
          {product ? ` of ${product.title}` : ''}. Download instructions will be sent to the email address you
          provided at checkout.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/community?view=store" className={cn(buttonVariants({ size: 'lg', variant: 'brand' }))}>
            Back to store
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-lg py-24 text-center">Loading…</div>}>
      <StoreCheckoutSuccessContent />
    </Suspense>
  );
}

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { enrollmentPathForOffering } from '@/lib/enrollment-routes';

function RedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const offeringId = searchParams.get('offering');

  useEffect(() => {
    if (!offeringId) return;
    const path = enrollmentPathForOffering(offeringId);
    if (path) router.replace(path);
  }, [offeringId, router]);

  return <p className="text-slate-500">Redirecting to enrollment…</p>;
}

export function CheckoutOfferingRedirect() {
  return (
    <Suspense fallback={<p className="text-slate-500">Loading…</p>}>
      <RedirectInner />
    </Suspense>
  );
}

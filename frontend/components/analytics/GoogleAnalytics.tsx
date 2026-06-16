'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { isGaConfigured } from '@/lib/analytics/ga-config';
import { loadGtagScript } from '@/lib/analytics/load-gtag';
import { trackPageView } from '@/lib/analytics/funnel';
import { hasAnalyticsConsent } from '@/lib/legal/consent';

/** Consent-gated GA4: loads gtag only after analytics cookies are accepted. */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [gaReady, setGaReady] = useState(false);

  useEffect(() => {
    if (!isGaConfigured()) return;

    const sync = async () => {
      if (!hasAnalyticsConsent()) {
        setGaReady(false);
        return;
      }
      await loadGtagScript();
      setGaReady(true);
    };

    void sync();
    window.addEventListener('legal-consent-updated', sync);
    return () => window.removeEventListener('legal-consent-updated', sync);
  }, []);

  useEffect(() => {
    if (!gaReady) return;
    const qs = searchParams.toString();
    const path = qs ? `${pathname}?${qs}` : pathname;
    trackPageView(path, window.location.href, document.title);
  }, [gaReady, pathname, searchParams]);

  return null;
}

'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getGaMeasurementId, isGaConfigured } from '@/lib/analytics/ga-config';
import { trackPageView } from '@/lib/analytics/funnel';
import { hasAnalyticsConsent } from '@/lib/legal/consent';

/** Consent-gated GA4: loads gtag only after analytics cookies are accepted. */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const measurementId = getGaMeasurementId();
  const [consentGranted, setConsentGranted] = useState(false);
  const [gaReady, setGaReady] = useState(false);

  useEffect(() => {
    if (!isGaConfigured()) return;

    const sync = () => {
      const granted = hasAnalyticsConsent();
      setConsentGranted(granted);
      if (!granted) setGaReady(false);
    };

    sync();
    window.addEventListener('legal-consent-updated', sync);
    return () => window.removeEventListener('legal-consent-updated', sync);
  }, []);

  useEffect(() => {
    if (!gaReady) return;
    const qs = searchParams.toString();
    const path = qs ? `${pathname}?${qs}` : pathname;
    trackPageView(path, window.location.href, document.title);
  }, [gaReady, pathname, searchParams]);

  if (!measurementId || !consentGranted) return null;

  return (
    <>
      <Script id="ga4-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', { send_page_view: false });
        `}
      </Script>
      <Script
        id="ga4-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="lazyOnload"
        onLoad={() => setGaReady(true)}
      />
    </>
  );
}

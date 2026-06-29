'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getGaMeasurementId, isGaConfigured } from '@/lib/analytics/ga-config';
import { trackPageView } from '@/lib/analytics/funnel';

/** GA4 site measurement: loads whenever a measurement ID is configured. */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const measurementId = getGaMeasurementId();
  const [gaReady, setGaReady] = useState(false);

  useEffect(() => {
    if (!gaReady) return;
    const qs = searchParams.toString();
    const path = qs ? `${pathname}?${qs}` : pathname;
    trackPageView(path, window.location.href, document.title);
  }, [gaReady, pathname, searchParams]);

  if (!measurementId || !isGaConfigured()) return null;

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

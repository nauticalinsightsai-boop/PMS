'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  flushPendingMetaBrowserEvents,
  trackMetaPageView,
} from '@/lib/analytics/meta-browser';
import { getMetaPixelId, isMetaPixelConfigured } from '@/lib/analytics/meta-config';
import { hasMarketingConsent } from '@/lib/legal/consent';
import { shouldTrackRoutePageView } from '@/lib/analytics/route-pageview';

/**
 * Reusable Meta Pixel loader. One PageView on first load and on each App Router navigation.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const lastPathRef = useRef<string | null>(null);
  const pixelId = getMetaPixelId();

  useEffect(() => {
    const sync = () => setAllowed(hasMarketingConsent());
    sync();
    window.addEventListener('legal-consent-updated', sync);
    return () => window.removeEventListener('legal-consent-updated', sync);
  }, []);

  useEffect(() => {
    if (!allowed || !ready || !pixelId) return;
    flushPendingMetaBrowserEvents();
    const qs = searchParams.toString();
    const pathKey = qs ? `${pathname}?${qs}` : pathname;
    if (!shouldTrackRoutePageView(lastPathRef.current, pathKey)) return;
    lastPathRef.current = pathKey;
    trackMetaPageView();
  }, [allowed, ready, pathname, searchParams, pixelId]);

  if (!allowed || !pixelId || !isMetaPixelConfigured()) return null;

  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      onLoad={() => setReady(true)}
      onReady={() => setReady(true)}
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('set', 'autoConfig', false, '${pixelId}');
          fbq('init', '${pixelId}');
        `,
      }}
    />
  );
}

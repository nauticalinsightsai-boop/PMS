'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getGaMeasurementId, isGaConfigured } from '@/lib/analytics/ga-config';
import { buildGaRoutePageview, shouldDispatchGaRoute } from '@/lib/analytics/ga-route-pageview';
import { hasAnalyticsConsent } from '@/lib/legal/consent';

/**
 * Single consent-gated GA4 owner. Implicit pageviews are disabled and this
 * component emits one explicit sanitized page_view per real route transition.
 */
export function GoogleAnalytics() {
  const [allowed, setAllowed] = useState(false);
  const gaId = getGaMeasurementId();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const configured = useRef(false);
  const lastRouteKey = useRef<string | null>(null);

  useEffect(() => {
    const sync = () => setAllowed(hasAnalyticsConsent());
    sync();
    window.addEventListener('legal-consent-updated', sync);
    return () => window.removeEventListener('legal-consent-updated', sync);
  }, []);

  useEffect(() => {
    if (!allowed || !gaId || !isGaConfigured() || typeof window === 'undefined') return;

    const analyticsWindow = window as typeof window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };
    analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];
    analyticsWindow.gtag = analyticsWindow.gtag ?? function gtag(...args: unknown[]) {
      analyticsWindow.dataLayer?.push(args);
    };

    if (!configured.current) {
      analyticsWindow.gtag('js', new Date());
      analyticsWindow.gtag('config', gaId, { send_page_view: false });
      configured.current = true;
    }

    const payload = buildGaRoutePageview({
      origin: window.location.origin,
      pathname: pathname || '/',
      search: searchParams?.toString() ?? '',
      title: document.title,
    });
    if (!payload || !shouldDispatchGaRoute(lastRouteKey.current, payload.routeKey)) return;
    analyticsWindow.gtag('event', 'page_view', payload.params);
    lastRouteKey.current = payload.routeKey;
  }, [allowed, gaId, pathname, searchParams]);

  if (!allowed || !gaId || !isGaConfigured()) return null;

  return (
    <Script
      id="pms-ga4-loader"
      src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
      strategy="afterInteractive"
    />
  );
}

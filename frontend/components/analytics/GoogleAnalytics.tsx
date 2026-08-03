'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getGaMeasurementId, isGaConfigured } from '@/lib/analytics/ga-config';
import {
  buildGaRoutePageview,
  shouldDispatchGaRoute,
  type GaRoutePageview,
} from '@/lib/analytics/ga-route-pageview';
import { hasAnalyticsConsent } from '@/lib/legal/consent';

type GaCommandTarget = {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export type GaDispatchState = {
  configured: boolean;
  lastRouteKey: string | null;
};

export function bootstrapGaCommandTarget(target: GaCommandTarget): void {
  target.dataLayer = target.dataLayer ?? [];
  target.gtag = target.gtag ?? function gtag(...args: unknown[]) {
    target.dataLayer?.push(args);
  };
}

export function dispatchLoadedGaPageview(input: {
  target: GaCommandTarget;
  allowed: boolean;
  loaderReady: boolean;
  loaderFailed: boolean;
  gaId: string;
  payload: GaRoutePageview | null;
  state: GaDispatchState;
}): GaDispatchState {
  const { target, allowed, loaderReady, loaderFailed, gaId, payload, state } = input;
  if (!allowed || !loaderReady || loaderFailed || !gaId || !payload || !target.gtag) return state;
  if (!shouldDispatchGaRoute(state.lastRouteKey, payload.routeKey)) return state;

  if (!state.configured) {
    target.gtag('js', new Date());
    target.gtag('config', gaId, { send_page_view: false });
  }
  target.gtag('event', 'page_view', payload.params);
  return { configured: true, lastRouteKey: payload.routeKey };
}

/**
 * Single consent-gated GA4 owner. Implicit pageviews are disabled and this
 * component emits one explicit sanitized page_view per real route transition.
 */
export function GoogleAnalytics() {
  const [allowed, setAllowed] = useState(false);
  const gaId = getGaMeasurementId();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [bootstrapped, setBootstrapped] = useState(false);
  const [loaderState, setLoaderState] = useState<'idle' | 'ready' | 'failed'>('idle');
  const configured = useRef(false);
  const lastRouteKey = useRef<string | null>(null);

  useEffect(() => {
    const sync = () => setAllowed(hasAnalyticsConsent());
    sync();
    window.addEventListener('legal-consent-updated', sync);
    return () => window.removeEventListener('legal-consent-updated', sync);
  }, []);

  useEffect(() => {
    if (!allowed || !gaId || !isGaConfigured() || typeof window === 'undefined' || bootstrapped) return;

    bootstrapGaCommandTarget(window as typeof window & GaCommandTarget);
    setBootstrapped(true);
  }, [allowed, bootstrapped, gaId]);

  useEffect(() => {
    if (!allowed || !bootstrapped || loaderState !== 'ready' || !gaId || !isGaConfigured()) return;

    const payload = buildGaRoutePageview({
      origin: window.location.origin,
      pathname: pathname || '/',
      search: searchParams?.toString() ?? '',
      title: document.title,
    });
    const nextState = dispatchLoadedGaPageview({
      target: window as typeof window & GaCommandTarget,
      allowed,
      loaderReady: loaderState === 'ready',
      loaderFailed: false,
      gaId,
      payload,
      state: { configured: configured.current, lastRouteKey: lastRouteKey.current },
    });
    configured.current = nextState.configured;
    lastRouteKey.current = nextState.lastRouteKey;
  }, [allowed, bootstrapped, gaId, loaderState, pathname, searchParams]);

  if (!bootstrapped || !gaId || !isGaConfigured()) return null;

  return (
    <Script
      id="pms-ga4-loader"
      src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
      strategy="afterInteractive"
      onLoad={() => setLoaderState('ready')}
      onError={() => setLoaderState('failed')}
    />
  );
}

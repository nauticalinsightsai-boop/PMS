'use client';

import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';
import { useEffect, useState } from 'react';
import { getGaMeasurementId, isGaConfigured } from '@/lib/analytics/ga-config';
import { hasAnalyticsConsent } from '@/lib/legal/consent';

/**
 * Single GA4 install via `@next/third-parties/google`.
 * Loads only after analytics cookie consent. Pageviews are handled by the
 * third-parties component (no custom send_page_view:false snippet).
 */
export function GoogleAnalytics() {
  const [allowed, setAllowed] = useState(false);
  const gaId = getGaMeasurementId();

  useEffect(() => {
    const sync = () => setAllowed(hasAnalyticsConsent());
    sync();
    window.addEventListener('legal-consent-updated', sync);
    return () => window.removeEventListener('legal-consent-updated', sync);
  }, []);

  if (!allowed || !gaId || !isGaConfigured()) return null;

  return <NextGoogleAnalytics gaId={gaId} />;
}

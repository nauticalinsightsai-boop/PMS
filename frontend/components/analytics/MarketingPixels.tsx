'use client';

import { Suspense, useEffect } from 'react';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { MetaPixel } from '@/components/analytics/MetaPixel';
import { installCalendlyBookedListener } from '@/lib/conversion-recovery/calendly-bridge';
import { captureClickIdsFromLocation } from '@/lib/analytics/funnel';
import { applyConsentWithdrawalCleanup } from '@/lib/analytics/consent-cleanup';
import { hasMarketingConsent } from '@/lib/legal/consent';

/** Root-layout marketing pixels (consent-gated, single install each). */
export function MarketingPixels() {
  useEffect(() => {
    installCalendlyBookedListener();
    const syncConsent = () => {
      applyConsentWithdrawalCleanup();
      if (hasMarketingConsent()) captureClickIdsFromLocation();
    };
    syncConsent();
    window.addEventListener('legal-consent-updated', syncConsent);
    return () => window.removeEventListener('legal-consent-updated', syncConsent);
  }, []);

  return (
    <Suspense fallback={null}>
      <GoogleAnalytics />
      <MetaPixel />
    </Suspense>
  );
}

'use client';

import { Suspense, useEffect } from 'react';
import { CookieConsent } from '@/components/CookieConsent';
import { RegionProvider } from '@/contexts/RegionContext';
import { PortalRegionThemeProvider } from '@/contexts/PortalRegionThemeContext';
import { initAttributionCapture } from '@/lib/analytics/funnel';

/** Keep in sync with PublicShell MAIN_CONTENT_ID / MAIN_CONTENT_SCROLL_MARGIN_CLASS. */
const MAIN_CONTENT_ID = 'main-content';
const MAIN_CONTENT_SCROLL_MARGIN_CLASS = 'scroll-mt-16';

export function PortalRegionShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAttributionCapture();
  }, []);

  return (
    <PortalRegionThemeProvider>
      <RegionProvider portalDefaults>
        <main
          id={MAIN_CONTENT_ID}
          tabIndex={-1}
          className={`${MAIN_CONTENT_SCROLL_MARGIN_CLASS} outline-none`}
        >
          {children}
        </main>
        <Suspense fallback={null}>
          <CookieConsent />
        </Suspense>
      </RegionProvider>
    </PortalRegionThemeProvider>
  );
}

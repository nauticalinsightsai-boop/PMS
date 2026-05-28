declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

import { hasAnalyticsConsent } from '@/lib/legal/consent';

/** Track custom events in GA4 from client interactions (requires analytics consent). */
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  if (!hasAnalyticsConsent()) return;
  window.gtag('event', eventName, params || {});
}


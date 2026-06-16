import { getGaMeasurementId } from '@/lib/analytics/ga-config';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    __pmsGaLoaded?: boolean;
  }
}

/** Inject gtag.js once; resolves when the script is ready. */
export function loadGtagScript(): Promise<void> {
  const measurementId = getGaMeasurementId();
  if (!measurementId || typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (window.__pmsGaLoaded && typeof window.gtag === 'function') {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { send_page_view: false });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.onload = () => {
      window.__pmsGaLoaded = true;
      resolve();
    };
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

import { getGaMeasurementId } from '@/lib/analytics/ga-config';
import {
  captureAttributionFromLocation,
  getClickIdsForLead,
  getLandingPageForLead,
  getUtmParamsForLead,
} from '@/lib/analytics/funnel';
import { hasAnalyticsConsent, hasMarketingConsent } from '@/lib/legal/consent';

const GA_CLIENT_ID_TIMEOUT_MS = 800;

function readGaClientId(): Promise<string | undefined> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(undefined);
      return;
    }

    const measurementId = getGaMeasurementId();
    if (!measurementId || typeof window.gtag !== 'function') {
      resolve(undefined);
      return;
    }

    const timer = window.setTimeout(() => resolve(undefined), GA_CLIENT_ID_TIMEOUT_MS);
    window.gtag('get', measurementId, 'client_id', (clientId: unknown) => {
      window.clearTimeout(timer);
      resolve(typeof clientId === 'string' && clientId.trim() ? clientId.trim() : undefined);
    });
  });
}

/** Non-PII attribution fields stored on lead interaction payloads for offline import. */
export async function collectLeadTrackingContext(): Promise<Record<string, string | boolean>> {
  if (typeof window === 'undefined') return {};

  captureAttributionFromLocation();

  const consentAnalytics = hasAnalyticsConsent();
  const consentMarketing = hasMarketingConsent();
  const gaClientId = consentAnalytics ? await readGaClientId() : undefined;
  const utm = getUtmParamsForLead();
  const landingPage = getLandingPageForLead();
  const clickIds = consentMarketing ? getClickIdsForLead() : {};

  return {
    ...(gaClientId ? { ga_client_id: gaClientId } : {}),
    ...clickIds,
    ...utm,
    ...(landingPage ? { landing_page: landingPage } : {}),
    consent_analytics: consentAnalytics,
    consent_marketing: consentMarketing,
  };
}

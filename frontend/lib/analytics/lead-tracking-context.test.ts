import { beforeEach, describe, expect, it, vi } from 'vitest';

const hasAnalyticsConsent = vi.hoisted(() => vi.fn(() => true));
const hasMarketingConsent = vi.hoisted(() => vi.fn(() => true));
const getGaMeasurementId = vi.hoisted(() => vi.fn(() => 'G-TEST'));

vi.mock('@/lib/legal/consent', () => ({
  hasAnalyticsConsent,
  hasMarketingConsent,
}));

vi.mock('@/lib/analytics/ga-config', () => ({
  getGaMeasurementId,
}));

import { collectLeadTrackingContext } from '@/lib/analytics/lead-tracking-context';

function stubBrowser() {
  const store: Record<string, string> = {
    analytics_utm_first_touch: JSON.stringify({
      utm_source: 'google',
      utm_medium: 'cpc',
    }),
    analytics_utm_last_touch: JSON.stringify({
      utm_source: 'linkedin',
      utm_medium: 'paid_social',
    }),
    analytics_click_first_touch: JSON.stringify({
      gclid: 'first-click',
    }),
    analytics_click_last_touch: JSON.stringify({
      gclid: 'last-click',
    }),
    analytics_landing_page: '/certifications/pmp',
  };
  const gtag = vi.fn(
    (
      _command: string,
      _measurementId: string,
      _field: string,
      callback: (value: unknown) => void,
    ) => callback('123.456'),
  );
  vi.stubGlobal('sessionStorage', {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  });
  vi.stubGlobal('window', {
    location: { search: '', pathname: '/go/linkedin' },
    setTimeout,
    clearTimeout,
    gtag,
  });
  return { store, gtag };
}

describe('collectLeadTrackingContext', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    hasAnalyticsConsent.mockReturnValue(true);
    hasMarketingConsent.mockReturnValue(true);
    getGaMeasurementId.mockReturnValue('G-TEST');
  });

  it('collects consented first/last attribution without contact PII', async () => {
    const { gtag } = stubBrowser();

    const result = await collectLeadTrackingContext();

    expect(result).toMatchObject({
      ga_client_id: '123.456',
      first_utm_source: 'google',
      utm_source: 'linkedin',
      first_utm_medium: 'cpc',
      utm_medium: 'paid_social',
      first_gclid: 'first-click',
      gclid: 'last-click',
      landing_page: '/certifications/pmp',
      consent_analytics: true,
      consent_marketing: true,
    });
    expect(gtag).toHaveBeenCalledOnce();
    expect(result).not.toHaveProperty('email');
    expect(result).not.toHaveProperty('phone');
    expect(result).not.toHaveProperty('full_name');
    expect(result).not.toHaveProperty('other_detail');
  });

  it('does not read or retain consent-gated identifiers without consent', async () => {
    const { store, gtag } = stubBrowser();
    hasAnalyticsConsent.mockReturnValue(false);
    hasMarketingConsent.mockReturnValue(false);

    const result = await collectLeadTrackingContext();

    expect(gtag).not.toHaveBeenCalled();
    expect(result).not.toHaveProperty('ga_client_id');
    expect(result).not.toHaveProperty('gclid');
    expect(result).not.toHaveProperty('first_gclid');
    expect(store.analytics_click_first_touch).toBeUndefined();
    expect(store.analytics_click_last_touch).toBeUndefined();
    expect(result).toMatchObject({
      first_utm_source: 'google',
      utm_source: 'linkedin',
      landing_page: '/certifications/pmp',
      consent_analytics: false,
      consent_marketing: false,
    });
  });
});

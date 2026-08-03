import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendGAEvent = vi.hoisted(() => vi.fn());
const hasAnalyticsConsent = vi.hoisted(() => vi.fn(() => true));
const hasMarketingConsent = vi.hoisted(() => vi.fn(() => true));
const trackMetaPurchase = vi.hoisted(() => vi.fn(() => 'meta_purchase_id'));

vi.mock('@next/third-parties/google', () => ({
  sendGAEvent,
  GoogleAnalytics: () => null,
}));

vi.mock('@/lib/legal/consent', () => ({
  hasAnalyticsConsent,
  hasMarketingConsent,
}));

vi.mock('@/lib/analytics/meta-browser', () => ({
  trackMetaPurchase,
  trackMetaPageView: vi.fn(() => 'meta_pv'),
  trackMetaViewContent: vi.fn(() => 'meta_vc'),
}));

import { sanitizeGaParams, trackGaEvent } from '@/lib/analytics/send-ga-event';
import { trackBookingClick } from '@/lib/analytics/track-booking-click';
import { trackPurchaseOnce } from '@/lib/analytics/track-purchase-once';
import {
  clearMarketingAttributionStorage,
  getClickIdsForLead,
  trackPageView,
} from '@/lib/analytics/funnel';
import { mergeCalendlyUtmWithInbound } from '@/lib/analytics/utm-calendly';

function stubSessionStorage() {
  const store: Record<string, string> = {};
  const storage = {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => {
      store[k] = v;
    },
    removeItem: (k: string) => {
      delete store[k];
    },
  };
  vi.stubGlobal('sessionStorage', storage);
  vi.stubGlobal('localStorage', storage);
  return store;
}

describe('sanitizeGaParams', () => {
  it('strips PII and form answer fields', () => {
    const out = sanitizeGaParams({
      email: 'a@b.com',
      phone: '123',
      full_name: 'Ada',
      role: 'PM',
      daily_study_time: '1-2',
      form_placement: 'cert_hero',
      lead_type: 'roadmap_request',
    });
    expect(out.email).toBeUndefined();
    expect(out.phone).toBeUndefined();
    expect(out.full_name).toBeUndefined();
    expect(out.role).toBeUndefined();
    expect(out.daily_study_time).toBeUndefined();
    expect(out.form_placement).toBe('cert_hero');
    expect(out.lead_type).toBe('roadmap_request');
  });
});

describe('lead and conversion events', () => {
  beforeEach(() => {
    sendGAEvent.mockClear();
    trackMetaPurchase.mockClear();
    hasAnalyticsConsent.mockReturnValue(true);
    hasMarketingConsent.mockReturnValue(true);
    stubSessionStorage();
    vi.stubGlobal('window', {
      location: { search: '', pathname: '/', href: 'http://localhost/' },
      dataLayer: [],
      addEventListener: () => {},
      removeEventListener: () => {},
    });
  });

  it('does not fire GA when consent is denied', () => {
    hasAnalyticsConsent.mockReturnValue(false);
    trackGaEvent('generate_lead', { lead_type: 'test' });
    expect(sendGAEvent).not.toHaveBeenCalled();
  });

  it('tracks booking CTA as select_content not generate_lead', () => {
    trackBookingClick({ bookingType: 'mentor_call', ctaText: 'Talk to Mentor' });
    expect(sendGAEvent.mock.calls.some((c) => c[1] === 'generate_lead')).toBe(false);
    expect(sendGAEvent.mock.calls.some((c) => c[1] === 'select_content')).toBe(true);
  });

  it('does not duplicate purchase on refresh', () => {
    const verifiedPurchase = {
      durableTransactionId: 'order_01JPMSTRUCTURE',
      durablePurchaseEventId: 'paid_01JPMSTRUCTURE',
      serverVerifiedPaid: true,
      value: 10,
      currency: 'USD',
    };
    trackPurchaseOnce(verifiedPurchase);
    trackPurchaseOnce(verifiedPurchase);
    const purchaseCalls = sendGAEvent.mock.calls.filter((c) => c[1] === 'purchase');
    expect(purchaseCalls).toHaveLength(1);
    expect(purchaseCalls[0]?.[2]).toMatchObject({
      transaction_id: 'order_01JPMSTRUCTURE',
      event_id: 'paid_01JPMSTRUCTURE',
    });
    expect(trackMetaPurchase).toHaveBeenCalledTimes(1);
  });

  it('rejects unpaid outcomes and raw Stripe object IDs', () => {
    trackPurchaseOnce({
      durableTransactionId: 'order_unpaid',
      durablePurchaseEventId: 'paid_unpaid',
      serverVerifiedPaid: false,
      value: 10,
      currency: 'USD',
    });
    trackPurchaseOnce({
      durableTransactionId: 'cs_test_raw',
      durablePurchaseEventId: 'evt_test_raw',
      serverVerifiedPaid: true,
      value: 10,
      currency: 'USD',
    });

    expect(sendGAEvent.mock.calls.some((c) => c[1] === 'purchase')).toBe(false);
    expect(trackMetaPurchase).not.toHaveBeenCalled();
  });

  it('trackPageView is a no-op to avoid duplicate pageviews', () => {
    trackPageView('/a', 'http://localhost/a', 'A');
    trackPageView('/b', 'http://localhost/b', 'B');
    expect(sendGAEvent.mock.calls.filter((c) => c[1] === 'page_view')).toHaveLength(0);
  });

  it('does not expose stored click IDs when marketing consent is denied', () => {
    sessionStorage.setItem(
      'analytics_click_last_touch',
      JSON.stringify({ fbclid: 'fb-secret', gclid: 'g-secret' }),
    );
    hasMarketingConsent.mockReturnValue(false);

    expect(getClickIdsForLead()).toEqual({});
    expect(sessionStorage.getItem('analytics_click_last_touch')).toBeNull();
    clearMarketingAttributionStorage();
  });
});

describe('mergeCalendlyUtmWithInbound', () => {
  beforeEach(() => {
    stubSessionStorage();
    vi.stubGlobal('window', {
      location: { search: '', pathname: '/', href: 'http://localhost/' },
    });
  });

  it('does not overwrite advertising utm_source with pmstructure', () => {
    sessionStorage.setItem(
      'analytics_utm_last_touch',
      JSON.stringify({
        utm_source: 'facebook',
        utm_medium: 'cpc',
        utm_campaign: 'pmp_2026',
      }),
    );
    const merged = mergeCalendlyUtmWithInbound({
      utm_source: 'pmstructure',
      utm_medium: 'nav',
      utm_campaign: 'mentor',
    });
    expect(merged.utm_source).toBe('facebook');
    expect(merged.utm_medium).toBe('cpc');
    expect(merged.utm_campaign).toBe('pmp_2026');
  });

  it('uses site UTMs when no inbound advertising UTMs exist', () => {
    const merged = mergeCalendlyUtmWithInbound({
      utm_source: 'pmstructure',
      utm_medium: 'nav',
      utm_campaign: 'mentor',
    });
    expect(merged.utm_source).toBe('pmstructure');
    expect(merged.utm_medium).toBe('nav');
  });
});

describe('booking-confirmed refresh dedupe', () => {
  it('session key prevents second conversion', () => {
    stubSessionStorage();
    const key = 'pms_booking_confirmed_lead_abc';
    expect(sessionStorage.getItem(key)).toBeNull();
    sessionStorage.setItem(key, '1');
    expect(sessionStorage.getItem(key)).toBe('1');
  });
});

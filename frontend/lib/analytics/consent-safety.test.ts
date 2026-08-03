import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearPendingMetaBrowserEvents,
  flushPendingMetaBrowserEvents,
  trackMetaPageView,
} from '@/lib/analytics/meta-browser';
import { applyConsentWithdrawalCleanup } from '@/lib/analytics/consent-cleanup';
import { trackGaEvent } from '@/lib/analytics/send-ga-event';
import {
  rejectNonEssentialConsent,
  writeStoredConsent,
} from '@/lib/legal/consent';

const sendGAEvent = vi.hoisted(() => vi.fn());
const clearMarketingAttributionStorage = vi.hoisted(() => vi.fn());
const clearPersistedLeadTrackingState = vi.hoisted(() => vi.fn());

vi.mock('@next/third-parties/google', () => ({ sendGAEvent }));
vi.mock('@/lib/analytics/meta-config', () => ({
  getMetaPixelId: () => 'test-pixel',
  isMetaPixelConfigured: () => true,
}));
vi.mock('@/lib/analytics/funnel', () => ({ clearMarketingAttributionStorage }));
vi.mock('@/lib/analytics/track-persisted-lead', () => ({
  clearPersistedLeadTrackingState,
}));

class MemoryStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

function installBrowserGlobals() {
  const fetch = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => ({
    ok: true,
  }));
  const fbq = vi.fn();
  vi.stubGlobal('localStorage', new MemoryStorage());
  vi.stubGlobal('CustomEvent', class {
    constructor(
      public readonly type: string,
      public readonly init?: { detail?: unknown },
    ) {}
  });
  vi.stubGlobal('document', { cookie: '' });
  vi.stubGlobal('fetch', fetch);
  vi.stubGlobal('window', {
    dispatchEvent: vi.fn(),
    location: { origin: 'https://example.invalid', pathname: '/certifications/pmp' },
    dataLayer: [],
    fbq,
  });
  return { fetch, fbq };
}

beforeEach(() => {
  sendGAEvent.mockClear();
  clearMarketingAttributionStorage.mockClear();
  clearPersistedLeadTrackingState.mockClear();
  clearPendingMetaBrowserEvents();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('consent category transport isolation', () => {
  it('fails closed before choice and after explicit rejection', () => {
    const { fetch, fbq } = installBrowserGlobals();

    expect(trackGaEvent('page_view')).toBe(false);
    expect(trackMetaPageView('route_initial')).toBeNull();

    rejectNonEssentialConsent();
    expect(trackGaEvent('page_view')).toBe(false);
    expect(trackMetaPageView('route_rejected')).toBeNull();
    expect(sendGAEvent).not.toHaveBeenCalled();
    expect(fbq).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('keeps analytics-only and marketing-only grants independent', async () => {
    const { fetch, fbq } = installBrowserGlobals();

    writeStoredConsent({ necessary: true, analytics: true, marketing: false });
    expect(trackGaEvent('page_view', { page_path: '/certifications/pmp' })).toBe(true);
    expect(trackMetaPageView('route_analytics_only')).toBeNull();
    expect(sendGAEvent).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalled();

    writeStoredConsent({ necessary: true, analytics: false, marketing: true });
    expect(trackGaEvent('page_view')).toBe(false);
    expect(trackMetaPageView('route_marketing_only')).toBe('route_marketing_only');
    expect(fbq).toHaveBeenCalledWith('track', 'PageView', {}, {
      eventID: 'route_marketing_only',
    });
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch.mock.calls[0]?.[1]?.body).toContain(
      '"event_id":"route_marketing_only"',
    );
  });

  it('allows both categories without changing the shared Meta event id', async () => {
    const { fetch, fbq } = installBrowserGlobals();
    writeStoredConsent({ necessary: true, analytics: true, marketing: true });

    expect(trackGaEvent('page_view')).toBe(true);
    expect(trackMetaPageView('route_both')).toBe('route_both');
    expect(sendGAEvent).toHaveBeenCalledTimes(1);
    expect(fbq).toHaveBeenCalledTimes(1);
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch.mock.calls[0]?.[1]?.body).toContain('"event_id":"route_both"');
  });

  it('withdrawal clears queued Meta delivery and persisted tracking state', () => {
    const { fetch, fbq } = installBrowserGlobals();
    delete (window as typeof window & { fbq?: unknown }).fbq;
    writeStoredConsent({ necessary: true, analytics: true, marketing: true });
    expect(trackMetaPageView('queued_before_withdrawal')).toBe(
      'queued_before_withdrawal',
    );

    rejectNonEssentialConsent();
    applyConsentWithdrawalCleanup();
    (window as typeof window & { fbq?: typeof fbq }).fbq = fbq;
    flushPendingMetaBrowserEvents();

    expect(clearMarketingAttributionStorage).toHaveBeenCalledTimes(1);
    expect(clearPersistedLeadTrackingState).toHaveBeenCalledTimes(1);
    expect(fbq).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

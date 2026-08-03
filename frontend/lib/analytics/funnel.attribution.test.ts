import { beforeEach, describe, expect, it, vi } from 'vitest';

const hasMarketingConsent = vi.hoisted(() => vi.fn(() => true));

vi.mock('@/lib/legal/consent', () => ({
  hasMarketingConsent,
}));

import {
  captureClickIdsFromLocation,
  captureUtmFromLocation,
  getClickIdsForLead,
  getUtmParamsForLead,
} from '@/lib/analytics/funnel';

function stubBrowser(search = '', pathname = '/') {
  const store: Record<string, string> = {};
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
    location: { search, pathname },
  });
  return store;
}

describe('durable lead attribution', () => {
  beforeEach(() => {
    hasMarketingConsent.mockReturnValue(true);
    vi.unstubAllGlobals();
  });

  it('returns first- and last-touch UTM values without rewriting first touch', () => {
    stubBrowser(
      '?utm_source=google&utm_medium=cpc&utm_campaign=launch&utm_term=pmp&utm_content=hero',
      '/go/google',
    );
    captureUtmFromLocation();

    window.location.search =
      '?utm_source=linkedin&utm_medium=paid_social&utm_campaign=retarget&utm_term=pm&utm_content=video';
    captureUtmFromLocation();

    expect(getUtmParamsForLead()).toEqual({
      first_utm_source: 'google',
      utm_source: 'linkedin',
      first_utm_medium: 'cpc',
      utm_medium: 'paid_social',
      first_utm_campaign: 'launch',
      utm_campaign: 'retarget',
      first_utm_term: 'pmp',
      utm_term: 'pm',
      first_utm_content: 'hero',
      utm_content: 'video',
    });
  });

  it('returns first- and last-touch click IDs only with marketing consent', () => {
    const store = stubBrowser('?gclid=first-g&fbclid=first-fb');
    captureClickIdsFromLocation();
    window.location.search = '?gclid=last-g&fbclid=last-fb';
    captureClickIdsFromLocation();

    expect(getClickIdsForLead()).toEqual({
      first_gclid: 'first-g',
      gclid: 'last-g',
      first_fbclid: 'first-fb',
      fbclid: 'last-fb',
    });

    hasMarketingConsent.mockReturnValue(false);
    expect(getClickIdsForLead()).toEqual({});
    expect(store.analytics_click_first_touch).toBeUndefined();
    expect(store.analytics_click_last_touch).toBeUndefined();
  });
});

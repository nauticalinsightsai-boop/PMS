import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  captureUtmFromLocation,
  getUtmParamsForLead,
} from '@/lib/analytics/funnel';

const values = new Map<string, string>();
const storage = {
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => values.set(key, value),
  removeItem: (key: string) => values.delete(key),
  clear: () => values.clear(),
  key: (index: number) => [...values.keys()][index] ?? null,
  get length() {
    return values.size;
  },
};

beforeEach(() => {
  vi.stubGlobal('sessionStorage', storage);
  vi.stubGlobal('window', {
    location: {
      pathname: '/go/linkedin',
      search: '',
    },
  });
});

afterEach(() => {
  values.clear();
  vi.unstubAllGlobals();
});

describe('durable lead UTM attribution', () => {
  it('preserves the first touch while updating the unprefixed last touch', () => {
    window.location.search =
      '?utm_source=linkedin&utm_medium=social&utm_campaign=awareness&utm_term=pmp-first&utm_content=intro';
    captureUtmFromLocation();

    window.location.search =
      '?utm_source=google&utm_medium=cpc&utm_campaign=conversion&utm_term=pmp-course&utm_content=roadmap';
    captureUtmFromLocation();

    expect(getUtmParamsForLead()).toEqual({
      first_utm_source: 'linkedin',
      first_utm_medium: 'social',
      first_utm_campaign: 'awareness',
      first_utm_term: 'pmp-first',
      first_utm_content: 'intro',
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'conversion',
      utm_term: 'pmp-course',
      utm_content: 'roadmap',
    });
  });

  it('returns an empty context when stored attribution is malformed', () => {
    sessionStorage.setItem('analytics_utm_first_touch', '{bad-json');
    sessionStorage.setItem('analytics_utm_last_touch', '{bad-json');
    expect(getUtmParamsForLead()).toEqual({});
  });
});

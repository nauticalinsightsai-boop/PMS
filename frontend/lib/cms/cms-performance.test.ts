import { describe, expect, it } from 'vitest';
import { globalContentString } from '@/lib/cms/global-content';
import { invalidatePublishedDataCache, fetchPublishedRowsCached } from '@/lib/cms/published-data-cache';

describe('globalContentString', () => {
  it('returns fallback when key missing', () => {
    expect(globalContentString({}, 'contact_title', 'Get in Touch')).toBe('Get in Touch');
  });

  it('returns CMS value when present', () => {
    expect(globalContentString({ contact_title: 'Custom' }, 'contact_title', 'Get in Touch')).toBe(
      'Custom',
    );
  });
});

describe('published-data-cache', () => {
  it('dedupes in-flight fetches for the same key set', async () => {
    invalidatePublishedDataCache();
    let calls = 0;
    const fetcher = async (keys: string[]) => {
      calls += 1;
      return keys.map((field_key) => ({ field_key, content: {} }));
    };

    const [a, b] = await Promise.all([
      fetchPublishedRowsCached(['home_page_config'], fetcher),
      fetchPublishedRowsCached(['home_page_config'], fetcher),
    ]);

    expect(calls).toBe(1);
    expect(a).toEqual(b);
  });
});

describe('fetchPublishedHomeConfig fallback', () => {
  it('uses defaults when Supabase env is unset', async () => {
    const { fetchPublishedHomeConfig } = await import('@/lib/cms/fetch-published-document');
    const prevUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const prevKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const cfg = await fetchPublishedHomeConfig();
    expect(cfg.version).toBe(2);
    expect(cfg.stats.professionalsCount).toBe(1284);

    process.env.NEXT_PUBLIC_SUPABASE_URL = prevUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = prevKey;
  });
});

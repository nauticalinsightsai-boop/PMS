import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FIELD_KEYS } from '@pms/site-content/keys';
import {
  defaultHomePageConfigV2,
  normalizeHomeConfigV1ToV2,
  type HomePageConfigV2,
} from '@pms/site-content';
import type { GlobalContentMap } from '@/lib/cms/global-content';

type PublishedRow = { field_key: string; content: Record<string, unknown> };

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function queryPublishedByFieldKeys(keys: string[]): Promise<PublishedRow[]> {
  const client = getServerSupabase();
  if (!client || keys.length === 0) return [];

  try {
    const { data, error } = await client
      .from('website_data')
      .select('field_key, content')
      .eq('is_published', true)
      .in('field_key', keys);

    if (error || !data) return [];
    return data as PublishedRow[];
  } catch {
    return [];
  }
}

const cachedQuery = cache(queryPublishedByFieldKeys);

export async function fetchPublishedDocument<T>(
  fieldKey: string,
  parse: (raw: unknown) => T | null,
  fallback: T,
): Promise<T> {
  const rows = await cachedQuery([fieldKey]);
  const row = rows.find((item) => item.field_key === fieldKey);
  const parsed = row?.content ? parse(row.content) : null;
  return parsed ?? fallback;
}

export async function fetchPublishedDocuments(
  fieldKeys: string[],
): Promise<PublishedRow[]> {
  return cachedQuery(fieldKeys);
}

function flattenGlobalContent(raw: unknown): GlobalContentMap {
  if (!raw || typeof raw !== 'object') return {};
  const map: GlobalContentMap = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === 'string') map[key] = value;
  }
  return map;
}

export const fetchPublishedGlobalContent = cache(async (): Promise<GlobalContentMap> => {
  const rows = await cachedQuery([FIELD_KEYS.GLOBAL_CONTENT]);
  const row = rows.find((item) => item.field_key === FIELD_KEYS.GLOBAL_CONTENT);
  return flattenGlobalContent(row?.content);
});

export async function fetchPublishedHomeConfig(): Promise<HomePageConfigV2> {
  const rows = await cachedQuery([FIELD_KEYS.HOME_PAGE_CONFIG]);
  const row = rows.find((item) => item.field_key === FIELD_KEYS.HOME_PAGE_CONFIG);
  return normalizeHomeConfigV1ToV2(row?.content ?? defaultHomePageConfigV2());
}

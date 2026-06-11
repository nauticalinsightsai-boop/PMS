import { PMS_SITE_URL } from '@/config/pms-site';
import { normalizePath } from '@/lib/indexing-metadata';

/** Query params stripped from canonical URLs (tracking, session, UI state). */
export const STRIPPED_QUERY_PARAM_KEYS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'msclkid',
  'ref',
  'source',
  'tab',
  'view',
  'offering',
  'session_id',
  'session',
  /** Regional / pricing UI: must not create alternate indexed URLs (Run 14). */
  'currency',
  'region',
  'regionId',
  'gcc',
  'gccCountry',
  'country',
  'residence',
  'billing',
  'pricing',
]);

export function stripQueryParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
): URLSearchParams {
  const out = new URLSearchParams();
  const entries =
    searchParams instanceof URLSearchParams
      ? [...searchParams.entries()]
      : Object.entries(searchParams).flatMap(([key, value]) => {
          if (value === undefined) return [];
          return Array.isArray(value) ? value.map((v) => [key, v] as const) : [[key, value] as const];
        });

  for (const [key, value] of entries) {
    if (!STRIPPED_QUERY_PARAM_KEYS.has(key)) out.set(key, value);
  }
  return out;
}

export function buildCanonicalPath(path: string): string {
  return normalizePath(path);
}

export function canonicalUrl(path: string): string {
  return `${PMS_SITE_URL}${buildCanonicalPath(path)}`;
}
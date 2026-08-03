export const META_ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;

export const META_ATTRIBUTION_VALUE_MAX_LENGTH = 200;

export type MetaAttributionKey = (typeof META_ATTRIBUTION_KEYS)[number];
export type MetaAttribution = Partial<Record<MetaAttributionKey, string>>;

export function sanitizeMetaAttribution(
  search: string | URLSearchParams,
): MetaAttribution {
  const params =
    typeof search === 'string'
      ? new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
      : search;
  const clean: MetaAttribution = {};

  for (const key of META_ATTRIBUTION_KEYS) {
    const value = params.get(key)?.trim().slice(0, META_ATTRIBUTION_VALUE_MAX_LENGTH);
    if (value) clean[key] = value;
  }

  return clean;
}

export function buildMetaEventSourceUrl(
  origin: string,
  pathname: string,
  search: string | URLSearchParams,
): string {
  const url = new URL(pathname, origin);
  const attribution = sanitizeMetaAttribution(search);
  for (const key of META_ATTRIBUTION_KEYS) {
    const value = attribution[key];
    if (value) url.searchParams.append(key, value);
  }
  return url.toString();
}

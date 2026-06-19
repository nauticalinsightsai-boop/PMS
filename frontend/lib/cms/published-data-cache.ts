type PublishedRow = { field_key: string; content: Record<string, unknown> };

const CACHE_TTL_MS = 30_000;
const inflight = new Map<string, Promise<PublishedRow[]>>();
const cache = new Map<string, { at: number; rows: PublishedRow[] }>();

function cacheKey(keys: string[]): string {
  return keys.slice().sort().join('\0');
}

export function invalidatePublishedDataCache(keys?: string[]) {
  if (!keys?.length) {
    inflight.clear();
    cache.clear();
    return;
  }
  const key = cacheKey(keys);
  inflight.delete(key);
  cache.delete(key);
}

export async function fetchPublishedRowsCached(
  keys: string[],
  fetcher: (keys: string[]) => Promise<PublishedRow[]>,
): Promise<PublishedRow[]> {
  if (keys.length === 0) return [];

  const key = cacheKey(keys);
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && now - hit.at < CACHE_TTL_MS) {
    return hit.rows;
  }

  let pending = inflight.get(key);
  if (!pending) {
    pending = fetcher(keys)
      .then((rows) => {
        cache.set(key, { at: Date.now(), rows });
        return rows;
      })
      .finally(() => {
        inflight.delete(key);
      });
    inflight.set(key, pending);
  }

  return pending;
}

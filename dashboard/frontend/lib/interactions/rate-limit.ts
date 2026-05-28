type Bucket = { count: number; windowStart: number };

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 12;
const MAX_BUCKETS = 2000;

const buckets = new Map<string, Bucket>();

function prune(now: number) {
  if (buckets.size <= MAX_BUCKETS) return;
  for (const [k, b] of buckets) {
    if (now - b.windowStart > WINDOW_MS) buckets.delete(k);
  }
  if (buckets.size <= MAX_BUCKETS) return;
  const keys = [...buckets.keys()].slice(0, Math.floor(MAX_BUCKETS / 2));
  for (const k of keys) buckets.delete(k);
}

export function isInteractionRateLimited(ip: string | null): boolean {
  const key = ip?.trim() || 'unknown';
  const now = Date.now();
  prune(now);
  const b = buckets.get(key);
  if (!b || now - b.windowStart > WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    return false;
  }
  b.count += 1;
  return b.count > MAX_REQUESTS;
}

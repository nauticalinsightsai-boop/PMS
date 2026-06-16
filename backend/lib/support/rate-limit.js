/** In-memory rate limit for public support chat (per IP). */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 20;
const buckets = new Map();

export function isSupportChatRateLimited(ip) {
  const key = ip?.trim() || 'unknown';
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    return false;
  }
  bucket.count += 1;
  return bucket.count > MAX_REQUESTS;
}

export function getSupportChatClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || null;
  return request.headers.get('x-real-ip');
}

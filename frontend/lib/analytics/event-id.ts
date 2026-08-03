/** Stable event IDs for Meta Pixel ↔ CAPI deduplication. */

export function createAnalyticsEventId(prefix = 'pms'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Deterministic browser ↔ server dedupe ID for an authoritative provider object. */
export function stableAnalyticsEventId(prefix: string, providerId: string): string {
  const safe = providerId.trim().replace(/[^a-zA-Z0-9._:-]/g, '_').slice(0, 96);
  return `${prefix}_${safe}`.slice(0, 128);
}

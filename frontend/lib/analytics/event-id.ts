/** Stable event IDs for Meta Pixel ↔ CAPI deduplication. */

export function createAnalyticsEventId(prefix = 'pms'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

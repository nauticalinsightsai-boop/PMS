import { trackFunnelEvent } from '@/lib/analytics/funnel';

export type AnalyticsItem = Record<string, string | number | boolean | null | undefined>;

export type AnalyticsEventParams = Record<
  string,
  string | number | boolean | null | undefined | AnalyticsItem[]
>;

const PII_KEYS = new Set([
  'email',
  'phone',
  'phone_full',
  'phonenumber',
  'phone_number',
  'full_name',
  'fullname',
  'name',
  'first_name',
  'last_name',
  'message',
  'message_body',
  'whatsapp',
  'street',
  'address',
  'cnic',
  'passport',
]);

function sanitizeParams(params: AnalyticsEventParams): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (PII_KEYS.has(key.toLowerCase())) continue;
    if (value === undefined) continue;
    out[key] = value;
  }
  return out;
}

/** Consent-gated GA4 event with UTM + page context (T-013). Strips PII keys. */
export function pushAnalyticsEvent(event: string, params: AnalyticsEventParams = {}): void {
  trackFunnelEvent(event, sanitizeParams(params));
}

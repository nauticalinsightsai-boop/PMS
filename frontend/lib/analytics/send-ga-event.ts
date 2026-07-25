import { sendGAEvent } from '@next/third-parties/google';
import { hasAnalyticsConsent } from '@/lib/legal/consent';

export type GaScalar = string | number | boolean | null | undefined;
export type GaItem = Record<string, GaScalar>;
export type GaEventParams = Record<string, GaScalar | GaItem[]>;

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
  'notes',
  'comments',
  'description',
  'preferred_contact_window',
  'contact_window',
  'contact_time',
  'whatsapp',
  'street',
  'address',
  'cnic',
  'passport',
  'role',
  'job_title',
  'daily_study_time',
  'job_experience',
  'job_experience_years',
]);

function sanitizeGaItem(item: GaItem): Record<string, Exclude<GaScalar, undefined>> {
  const out: Record<string, Exclude<GaScalar, undefined>> = {};
  for (const [key, value] of Object.entries(item)) {
    if (PII_KEYS.has(key.toLowerCase()) || value === undefined) continue;
    out[key] = value;
  }
  return out;
}

/** Strip PII and undefined values before any GA4 send, including ecommerce items. */
export function sanitizeGaParams(params: GaEventParams = {}): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (PII_KEYS.has(key.toLowerCase())) continue;
    if (value === undefined) continue;
    out[key] = Array.isArray(value) ? value.map(sanitizeGaItem) : value;
  }
  return out;
}

/**
 * Typed GA4 event helper (consent-aware).
 * Uses `@next/third-parties/google` `sendGAEvent`.
 */
export function trackGaEvent(eventName: string, params: GaEventParams = {}): boolean {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return false;
  const dataLayer = (window as typeof window & { dataLayer?: unknown[] }).dataLayer;
  if (!Array.isArray(dataLayer)) return false;
  const safe = sanitizeGaParams(params);
  sendGAEvent('event', eventName, safe);
  return true;
}

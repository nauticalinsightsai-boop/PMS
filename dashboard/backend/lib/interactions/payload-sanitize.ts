const MAX_KEYS = 48;
const MAX_KEY_LEN = 80;
const MAX_STRING_LEN = 8000;
const TRUSTED_TRACKING_KEYS = new Set([
  'consent_analytics',
  'consent_marketing',
  'ga_client_id',
  'landing_page',
  'landing_url',
  'referrer',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'first_utm_source',
  'first_utm_medium',
  'first_utm_campaign',
  'first_utm_term',
  'first_utm_content',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'msclkid',
]);

export function sanitizeInteractionPayload(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {};
  }
  const o = input as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  let n = 0;
  for (const [k, v] of Object.entries(o)) {
    if (n >= MAX_KEYS) break;
    if (k.length > MAX_KEY_LEN) continue;
    if (TRUSTED_TRACKING_KEYS.has(k)) continue;
    if (typeof v === 'string') {
      out[k] = v.length > MAX_STRING_LEN ? v.slice(0, MAX_STRING_LEN) : v;
    } else if (typeof v === 'number' && Number.isFinite(v)) {
      out[k] = v;
    } else if (typeof v === 'boolean') {
      out[k] = v;
    } else if (v === null) {
      out[k] = null;
    }
    n++;
  }
  return out;
}

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;
const CLICK_ID_KEYS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid'] as const;

function trackingString(
  input: Record<string, unknown>,
  key: string,
  max = 500,
): string | null {
  const value = input[key];
  if (typeof value !== 'string') return null;
  const clean = value.trim();
  return clean && clean.length <= max ? clean : null;
}

/**
 * Accept only the dedicated top-level tracking object. Consent gates
 * pseudonymous identifiers, and the server merges these fields last.
 */
export function sanitizeTrustedInteractionTracking(
  input: unknown,
): Record<string, string | boolean> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {};
  const raw = input as Record<string, unknown>;
  const analyticsConsent = raw.consent_analytics === true;
  const marketingConsent = raw.consent_marketing === true;
  const out: Record<string, string | boolean> = {
    consent_analytics: analyticsConsent,
    consent_marketing: marketingConsent,
  };

  const landingPage = trackingString(raw, 'landing_page');
  if (landingPage) out.landing_page = landingPage;
  const landingUrl = trackingString(raw, 'landing_url');
  if (landingUrl) out.landing_url = landingUrl;
  const referrer = trackingString(raw, 'referrer');
  if (referrer) out.referrer = referrer;
  for (const key of UTM_KEYS) {
    const value = trackingString(raw, key);
    if (value) out[key] = value;
    const firstValue = trackingString(raw, `first_${key}`);
    if (firstValue) out[`first_${key}`] = firstValue;
  }
  if (analyticsConsent) {
    const gaClientId = trackingString(raw, 'ga_client_id', 255);
    if (gaClientId) out.ga_client_id = gaClientId;
  }
  if (marketingConsent) {
    for (const key of CLICK_ID_KEYS) {
      const value = trackingString(raw, key);
      if (value) out[key] = value;
    }
  }
  return out;
}

export function jsonByteLength(obj: Record<string, unknown>): number {
  try {
    return new TextEncoder().encode(JSON.stringify(obj)).length;
  } catch {
    return Number.MAX_SAFE_INTEGER;
  }
}

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;
const CLICK_ID_KEYS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid'] as const;

export type BookingHandoffInput = {
  pagePath?: unknown;
  channel?: unknown;
  funnelLabel?: unknown;
  attribution?: unknown;
};

export type SanitizedBookingHandoff = {
  page_path: string | null;
  channel: string | null;
  funnel_label: string | null;
  analytics_consent: boolean;
  marketing_consent: boolean;
  analytics_client_id: string | null;
  attribution: Record<string, string>;
};

function boundedString(
  value: unknown,
  max: number,
  pattern?: RegExp,
): string | null {
  if (typeof value !== 'string') return null;
  const clean = value.trim();
  if (!clean || clean.length > max || (pattern && !pattern.test(clean))) return null;
  return clean;
}

export function sanitizeBookingHandoff(
  input: BookingHandoffInput,
): SanitizedBookingHandoff {
  const attributionInput =
    input.attribution &&
    typeof input.attribution === 'object' &&
    !Array.isArray(input.attribution)
      ? (input.attribution as Record<string, unknown>)
      : {};
  const analyticsConsent = attributionInput.consent_analytics === true;
  const marketingConsent = attributionInput.consent_marketing === true;
  const attribution: Record<string, string> = {};

  for (const key of UTM_KEYS) {
    const value = boundedString(attributionInput[key], 500);
    if (value) attribution[key] = value;
  }
  if (marketingConsent) {
    for (const key of CLICK_ID_KEYS) {
      const value = boundedString(attributionInput[key], 500);
      if (value) attribution[key] = value;
    }
  }

  return {
    page_path: boundedString(input.pagePath, 500, /^\/(?!\/)/),
    channel: boundedString(input.channel, 100, /^[A-Za-z0-9._:-]+$/),
    funnel_label: boundedString(input.funnelLabel, 200),
    analytics_consent: analyticsConsent,
    marketing_consent: marketingConsent,
    analytics_client_id: analyticsConsent
      ? boundedString(attributionInput.ga_client_id, 255)
      : null,
    attribution,
  };
}

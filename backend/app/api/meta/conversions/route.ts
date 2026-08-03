import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const ALLOWED_EVENTS = new Set([
  'PageView',
  'ViewContent',
  'Lead',
  'Purchase',
  'InitiateCheckout',
  'Contact',
  'Schedule',
]);
const MAX_BODY_BYTES = 64 * 1024;
const MAX_CUSTOM_DATA_KEYS = 40;
const MAX_VALUE_LENGTH = 500;
const MAX_ATTRIBUTION_VALUE_LENGTH = 200;
const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;
const ATTRIBUTION_KEY_SET = new Set<string>(ATTRIBUTION_KEYS);
const CUSTOM_DATA_ALLOWLIST = new Set([
  'content_name',
  'content_category',
  'content_type',
  'content_ids',
  'contents',
  'currency',
  'value',
  'num_items',
  'status',
  'search_string',
  'form_placement',
  ...ATTRIBUTION_KEYS,
]);
const PII_KEY_DENYLIST = new Set([
  'email',
  'em',
  'phone',
  'ph',
  'name',
  'full_name',
  'first_name',
  'last_name',
  'fn',
  'ln',
  'address',
  'city',
  'state',
  'zip',
  'postal_code',
  'country',
  'date_of_birth',
  'dob',
  'external_id',
  'client_ip_address',
  'client_user_agent',
]);

type MetaScalar = string | number | boolean;
type CapiBody = {
  event_name?: unknown;
  event_id?: unknown;
  event_source_url?: unknown;
  custom_data?: unknown;
  fbp?: unknown;
  fbc?: unknown;
};

function serverEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value || null;
}

function isLocalOrPreviewHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase();
  const isExactOrChildOf = (domain: string) =>
    normalized === domain || normalized.endsWith(`.${domain}`);
  return (
    normalized === 'localhost' ||
    normalized === '127.0.0.1' ||
    normalized === '[::1]' ||
    normalized === '::1' ||
    normalized.endsWith('.localhost') ||
    isExactOrChildOf('railway.app') ||
    isExactOrChildOf('up.railway.app') ||
    isExactOrChildOf('railway.internal')
  );
}

function parseConfiguredCanonicalOrigins(): Set<string> {
  const origins = new Set<string>();
  const configured = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_MARKETING_SITE_URL,
  ]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
  if (configured.length === 0) return origins;

  for (const raw of configured) {
    try {
      const url = new URL(raw);
      if (
        url.protocol !== 'https:' ||
        url.username ||
        url.password ||
        url.pathname !== '/' ||
        url.search ||
        url.hash ||
        isLocalOrPreviewHostname(url.hostname)
      ) {
        return new Set();
      }
      origins.add(url.origin);
    } catch {
      return new Set();
    }
  }
  return origins;
}

function effectivePublicOrigin(request: Request): string | null {
  const forwardedHost = request.headers
    .get('x-forwarded-host')
    ?.split(',')[0]
    ?.trim();
  const forwardedProto = request.headers
    .get('x-forwarded-proto')
    ?.split(',')[0]
    ?.trim()
    .toLowerCase();
  if (Boolean(forwardedHost) !== Boolean(forwardedProto)) return null;
  try {
    if (forwardedHost && forwardedProto) {
      if (forwardedProto !== 'https') return null;
      return new URL(`${forwardedProto}://${forwardedHost}`).origin;
    }
    return new URL(request.url).origin;
  } catch {
    return null;
  }
}

function isCanonicalSameOriginRequest(
  request: Request,
  allowedOrigins: Set<string>,
): boolean {
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite === 'cross-site') return false;
  const effectiveOrigin = effectivePublicOrigin(request);
  if (!effectiveOrigin || !allowedOrigins.has(effectiveOrigin)) return false;
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).origin === effectiveOrigin;
  } catch {
    return false;
  }
}

function cleanTrackingCookie(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 255 || !/^fb\.\d\.\d+\..+$/i.test(trimmed)) return undefined;
  return trimmed;
}

function sanitizeCustomData(value: unknown): Record<string, MetaScalar | MetaScalar[]> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const clean: Record<string, MetaScalar | MetaScalar[]> = {};
  for (const [key, raw] of Object.entries(value).slice(0, MAX_CUSTOM_DATA_KEYS)) {
    const normalizedKey = key.toLowerCase();
    if (
      !/^[a-zA-Z0-9_]{1,64}$/.test(key) ||
      PII_KEY_DENYLIST.has(normalizedKey) ||
      !CUSTOM_DATA_ALLOWLIST.has(normalizedKey)
    ) {
      continue;
    }
    if (typeof raw === 'string') {
      const maxLength = ATTRIBUTION_KEY_SET.has(normalizedKey)
        ? MAX_ATTRIBUTION_VALUE_LENGTH
        : MAX_VALUE_LENGTH;
      const trimmed = raw.trim().slice(0, maxLength);
      if (trimmed) clean[normalizedKey] = trimmed;
    } else if (typeof raw === 'number' && Number.isFinite(raw)) {
      clean[key] = raw;
    } else if (typeof raw === 'boolean') {
      clean[key] = raw;
    } else if (Array.isArray(raw)) {
      const items = raw
        .slice(0, 50)
        .filter(
          (item): item is MetaScalar =>
            typeof item === 'boolean' ||
            (typeof item === 'number' && Number.isFinite(item)) ||
            typeof item === 'string',
        )
        .map((item) => (typeof item === 'string' ? item.slice(0, MAX_VALUE_LENGTH) : item));
      if (items.length > 0) clean[key] = items;
    }
  }
  return clean;
}

function validEventSourceUrl(value: unknown, allowedOrigins: Set<string>): string | null {
  if (typeof value !== 'string' || value.length > 2048) return null;
  try {
    const url = new URL(value);
    if (!allowedOrigins.has(url.origin)) return null;
    const clean = new URL(url.pathname, url.origin);
    for (const key of ATTRIBUTION_KEYS) {
      const value = url.searchParams
        .get(key)
        ?.trim()
        .slice(0, MAX_ATTRIBUTION_VALUE_LENGTH);
      if (value) clean.searchParams.append(key, value);
    }
    return clean.toString();
  } catch {
    return null;
  }
}

/**
 * Same-origin, allow-listed Meta Conversions API proxy.
 * The browser never receives the access token and cannot submit arbitrary events or PII.
 */
export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: 'payload_too_large' }, { status: 413 });
  }

  const allowedOrigins = parseConfiguredCanonicalOrigins();
  if (allowedOrigins.size === 0) {
    return NextResponse.json(
      { ok: false, skipped: true, reason: 'canonical_origin_unavailable' },
      { status: 503 },
    );
  }
  if (!isCanonicalSameOriginRequest(request, allowedOrigins)) {
    return NextResponse.json(
      { ok: false, skipped: true, reason: 'noncanonical_origin' },
      { status: 403 },
    );
  }

  const accessToken = serverEnv('META_CAPI_ACCESS_TOKEN');
  const datasetId = serverEnv('META_DATASET_ID');
  const graphVersion = serverEnv('META_GRAPH_API_VERSION');
  if (!accessToken || !datasetId) {
    return NextResponse.json(
      { ok: false, skipped: true, reason: 'capi_not_configured' },
      { status: 200 },
    );
  }
  if (!/^\d+$/.test(datasetId) || (graphVersion && !/^v\d+\.\d+$/.test(graphVersion))) {
    return NextResponse.json(
      { ok: false, skipped: true, reason: 'capi_configuration_invalid' },
      { status: 200 },
    );
  }

  let body: CapiBody;
  try {
    body = (await request.json()) as CapiBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const eventName = typeof body.event_name === 'string' ? body.event_name.trim() : '';
  const eventId = typeof body.event_id === 'string' ? body.event_id.trim() : '';
  if (!ALLOWED_EVENTS.has(eventName)) {
    return NextResponse.json({ ok: false, error: 'event_not_allowed' }, { status: 400 });
  }
  if (!/^[a-zA-Z0-9._:-]{1,128}$/.test(eventId)) {
    return NextResponse.json({ ok: false, error: 'event_id_invalid' }, { status: 400 });
  }

  const eventSourceUrl = validEventSourceUrl(body.event_source_url, allowedOrigins);
  if (!eventSourceUrl) {
    return NextResponse.json({ ok: false, error: 'event_source_url_invalid' }, { status: 400 });
  }

  const userData: Record<string, string> = {};
  const fbp = cleanTrackingCookie(body.fbp);
  const fbc = cleanTrackingCookie(body.fbc);
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  const userAgent = request.headers.get('user-agent')?.trim();
  if (userAgent) userData.client_user_agent = userAgent.slice(0, 500);
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (forwarded) userData.client_ip_address = forwarded.slice(0, 64);

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: eventSourceUrl,
        action_source: 'website',
        user_data: userData,
        custom_data: sanitizeCustomData(body.custom_data),
      },
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${graphVersion ? `${graphVersion}/` : ''}${datasetId}/events`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );
    const json = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: 'meta_api_error', status: response.status },
        { status: 502 },
      );
    }
    return NextResponse.json({
      ok: true,
      events_received: json.events_received ?? 1,
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'meta_network_error' }, { status: 502 });
  }
}

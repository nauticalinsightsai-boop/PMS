import { trackEvent } from '@/lib/analytics/gtag';

function pathnameToPageIdentifier(pathname: string): string | null {
  const path = pathname.replace(/^\/+|\/+$/g, '') || 'home';
  if (path === '' || path === 'home') return 'home';
  if (path.startsWith('go/')) return 'channel-portal';
  return path.split('/')[0] ?? null;
}

export type FunnelStage = 'awareness' | 'interest' | 'consideration' | 'action';

export const FUNNEL_EVENTS = {
  PAGE_VIEW: 'page_view',
  CTA_CLICK: 'cta_click',
  CTA_IMPRESSION: 'cta_impression',
  BOOKING_MODAL_OPEN: 'booking_modal_open',
  BOOKING_STEP_VIEW: 'booking_step_view',
  CALENDLY_EVENT_SCHEDULED: 'calendly_event_scheduled',
  BEGIN_CHECKOUT: 'begin_checkout',
  BOOKING_CONFIRMED: 'booking_confirmed',
  GENERATE_LEAD: 'generate_lead',
  CHAT_OPEN: 'chat_open',
} as const;

const UTM_PARAM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const UTM_FIRST_TOUCH_KEY = 'analytics_utm_first_touch';
const UTM_LAST_TOUCH_KEY = 'analytics_utm_last_touch';
let attributionInitialized = false;

export type UtmTouch = Partial<Record<(typeof UTM_PARAM_KEYS)[number], string>>;

/** Parse UTM query params from a search string or full URL. */
export function parseUtmFromSearch(search: string): UtmTouch {
  const out: UtmTouch = {};
  if (!search) return out;
  const normalized = search.startsWith('?') ? search : search.includes('?') ? search.slice(search.indexOf('?')) : `?${search}`;
  try {
    const params = new URLSearchParams(normalized);
    for (const key of UTM_PARAM_KEYS) {
      const value = params.get(key)?.trim();
      if (value) out[key] = value;
    }
  } catch {
    return out;
  }
  return out;
}

/** Merge first-touch and last-touch UTMs for event payloads (prefixed). */
export function getUtmParamsForEvents(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const merged: Record<string, string> = {};
  try {
    const firstRaw = sessionStorage.getItem(UTM_FIRST_TOUCH_KEY);
    const lastRaw = sessionStorage.getItem(UTM_LAST_TOUCH_KEY);
    const first = firstRaw ? (JSON.parse(firstRaw) as UtmTouch) : {};
    const last = lastRaw ? (JSON.parse(lastRaw) as UtmTouch) : {};
    for (const key of UTM_PARAM_KEYS) {
      if (first[key]) merged[`first_${key}`] = first[key]!;
      if (last[key]) merged[key] = last[key]!;
    }
  } catch {
    return merged;
  }
  return merged;
}

/** Persist UTMs from the current URL (call on load and when search params change). */
export function captureUtmFromLocation(): void {
  if (typeof window === 'undefined') return;
  const touch = parseUtmFromSearch(window.location.search);
  if (Object.keys(touch).length === 0) return;

  try {
    const firstRaw = sessionStorage.getItem(UTM_FIRST_TOUCH_KEY);
    if (!firstRaw) {
      sessionStorage.setItem(UTM_FIRST_TOUCH_KEY, JSON.stringify(touch));
    }
    sessionStorage.setItem(UTM_LAST_TOUCH_KEY, JSON.stringify(touch));
  } catch {
    // ignore quota / private mode
  }
}

function ensureAttributionCapture(): void {
  if (typeof window === 'undefined' || attributionInitialized) return;
  attributionInitialized = true;
  captureUtmFromLocation();
}

export function getPageContext(pathname?: string): {
  page_path: string;
  page_identifier: string | null;
} {
  const pagePath =
    pathname ??
    (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/');
  const pathOnly = pagePath.split('?')[0] || '/';
  return {
    page_path: pathOnly,
    page_identifier: pathnameToPageIdentifier(pathOnly),
  };
}

/** Send a GA4 event with page + UTM context attached. */
export function trackFunnelEvent(eventName: string, params?: Record<string, unknown>): void {
  ensureAttributionCapture();
  const ctx = getPageContext(
    typeof params?.page_path === 'string' ? String(params.page_path) : undefined
  );
  trackEvent(eventName, {
    ...getUtmParamsForEvents(),
    page_path: ctx.page_path,
    page_identifier: ctx.page_identifier,
    ...params,
  });
}

/** Standard lead conversion event. */
export function trackGenerateLead(params: Record<string, unknown>): void {
  trackFunnelEvent(FUNNEL_EVENTS.GENERATE_LEAD, params);
}

/** SPA page_view with UTM + page identifier. */
export function trackPageView(pagePath: string, pageLocation: string, pageTitle: string): void {
  ensureAttributionCapture();
  const pathOnly = pagePath.split('?')[0] || '/';
  trackEvent(FUNNEL_EVENTS.PAGE_VIEW, {
    ...getUtmParamsForEvents(),
    page_path: pagePath,
    page_location: pageLocation,
    page_title: pageTitle,
    page_identifier: pathnameToPageIdentifier(pathOnly),
  });
}

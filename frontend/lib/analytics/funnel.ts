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
  RECOVERY_SHOWN: 'recovery_shown',
  RECOVERY_DISMISSED: 'recovery_dismissed',
  RECOVERY_SUBMITTED: 'recovery_submitted',
  BOTTOM_BAR_SHOWN: 'bottom_bar_shown',
  BOTTOM_BAR_DISMISSED: 'bottom_bar_dismissed',
  BOTTOM_BAR_ROTATION: 'bottom_bar_rotation',
  CHAT_OPEN: 'chat_open',
} as const;

const UTM_PARAM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const CLICK_ID_KEYS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid'] as const;
const UTM_FIRST_TOUCH_KEY = 'analytics_utm_first_touch';
const UTM_LAST_TOUCH_KEY = 'analytics_utm_last_touch';
const CLICK_FIRST_TOUCH_KEY = 'analytics_click_first_touch';
const CLICK_LAST_TOUCH_KEY = 'analytics_click_last_touch';
const LANDING_PAGE_KEY = 'analytics_landing_page';
let attributionInitialized = false;

export type UtmTouch = Partial<Record<(typeof UTM_PARAM_KEYS)[number], string>>;
export type ClickIdTouch = Partial<Record<(typeof CLICK_ID_KEYS)[number], string>>;

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

/** Parse ad click IDs from a search string or full URL. */
export function parseClickIdsFromSearch(search: string): ClickIdTouch {
  const out: ClickIdTouch = {};
  if (!search) return out;
  const normalized = search.startsWith('?') ? search : search.includes('?') ? search.slice(search.indexOf('?')) : `?${search}`;
  try {
    const params = new URLSearchParams(normalized);
    for (const key of CLICK_ID_KEYS) {
      const value = params.get(key)?.trim();
      if (value) out[key] = value;
    }
  } catch {
    return out;
  }
  return out;
}

function persistFirstLastTouch<T extends Record<string, string>>(
  touch: T,
  firstKey: string,
  lastKey: string,
): void {
  if (Object.keys(touch).length === 0) return;
  try {
    const firstRaw = sessionStorage.getItem(firstKey);
    if (!firstRaw) {
      sessionStorage.setItem(firstKey, JSON.stringify(touch));
    }
    sessionStorage.setItem(lastKey, JSON.stringify(touch));
  } catch {
    // ignore quota / private mode
  }
}

/** Persist UTMs from the current URL (call on load and when search params change). */
export function captureUtmFromLocation(): void {
  if (typeof window === 'undefined') return;
  persistFirstLastTouch(parseUtmFromSearch(window.location.search), UTM_FIRST_TOUCH_KEY, UTM_LAST_TOUCH_KEY);
}

/** Persist ad click IDs from the current URL. */
export function captureClickIdsFromLocation(): void {
  if (typeof window === 'undefined') return;
  persistFirstLastTouch(parseClickIdsFromSearch(window.location.search), CLICK_FIRST_TOUCH_KEY, CLICK_LAST_TOUCH_KEY);
}

function captureLandingPage(): void {
  if (typeof window === 'undefined') return;
  try {
    if (!sessionStorage.getItem(LANDING_PAGE_KEY)) {
      sessionStorage.setItem(LANDING_PAGE_KEY, window.location.pathname || '/');
    }
  } catch {
    // ignore quota / private mode
  }
}

/** Last-touch click IDs for lead payloads (offline conversion import). */
export function getClickIdsForLead(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const out: Record<string, string> = {};
  try {
    const firstRaw = sessionStorage.getItem(CLICK_FIRST_TOUCH_KEY);
    const lastRaw = sessionStorage.getItem(CLICK_LAST_TOUCH_KEY);
    const first = firstRaw ? (JSON.parse(firstRaw) as ClickIdTouch) : {};
    const last = lastRaw ? (JSON.parse(lastRaw) as ClickIdTouch) : {};
    for (const key of CLICK_ID_KEYS) {
      if (first[key]) out[`first_${key}`] = first[key]!;
      if (last[key]) out[key] = last[key]!;
    }
  } catch {
    return out;
  }
  return out;
}

/** Last-touch UTMs for lead payloads (unprefixed keys match offline CSV). */
export function getUtmParamsForLead(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const out: Record<string, string> = {};
  try {
    const lastRaw = sessionStorage.getItem(UTM_LAST_TOUCH_KEY);
    const last = lastRaw ? (JSON.parse(lastRaw) as UtmTouch) : {};
    for (const key of UTM_PARAM_KEYS) {
      if (last[key]) out[key] = last[key]!;
    }
  } catch {
    return out;
  }
  return out;
}

export function getLandingPageForLead(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    return sessionStorage.getItem(LANDING_PAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

/** Capture UTMs, click IDs, and landing page from the current session. */
export function captureAttributionFromLocation(): void {
  if (typeof window === 'undefined') return;
  captureLandingPage();
  captureUtmFromLocation();
  captureClickIdsFromLocation();
}

function ensureAttributionCapture(): void {
  if (typeof window === 'undefined' || attributionInitialized) return;
  attributionInitialized = true;
  captureAttributionFromLocation();
}

/** Run once on public shell mount so lead forms capture attribution without a prior GA event. */
export function initAttributionCapture(): void {
  ensureAttributionCapture();
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

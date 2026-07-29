'use client';

import { createAnalyticsEventId } from '@/lib/analytics/event-id';
import {
  buildMetaEventSourceUrl,
  sanitizeMetaAttribution,
} from '@/lib/analytics/meta-attribution';
import { getMetaPixelId, isMetaPixelConfigured } from '@/lib/analytics/meta-config';
import { hasMarketingConsent } from '@/lib/legal/consent';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

type MetaStandardEvent =
  | 'PageView'
  | 'ViewContent'
  | 'Lead'
  | 'Purchase'
  | 'InitiateCheckout'
  | 'Contact'
  | 'Schedule';

type MetaScalar = string | number | boolean;
export type MetaEventPayload = Record<
  string,
  MetaScalar | MetaScalar[] | null | undefined
>;
type CleanMetaEventPayload = Record<string, MetaScalar | MetaScalar[]>;
type PendingBrowserEvent = {
  eventName: MetaStandardEvent;
  eventId: string;
  customData: CleanMetaEventPayload;
};

const pendingBrowserEvents: PendingBrowserEvent[] = [];
const MAX_PENDING_BROWSER_EVENTS = 50;
const META_PII_KEYS = new Set([
  'email',
  'phone',
  'phone_number',
  'full_name',
  'fullname',
  'name',
  'first_name',
  'last_name',
  'message',
  'notes',
  'role',
  'job_title',
  'address',
]);

function canPrepareMetaEvent(): boolean {
  return (
    typeof window !== 'undefined' &&
    hasMarketingConsent() &&
    isMetaPixelConfigured()
  );
}

function sanitizeMetaPayload(params: MetaEventPayload): CleanMetaEventPayload {
  const clean: CleanMetaEventPayload = {};
  for (const [key, value] of Object.entries(params)) {
    if (
      value === undefined ||
      value === null ||
      META_PII_KEYS.has(key.toLowerCase())
    ) {
      continue;
    }
    clean[key] = value;
  }
  return clean;
}

/** Fire a browser Pixel event; returns event_id used for CAPI dedupe. */
export function trackMetaEvent(
  eventName: MetaStandardEvent,
  params: MetaEventPayload = {},
  eventId?: string,
): string | null {
  if (!canPrepareMetaEvent()) return null;
  const id = eventId ?? createAnalyticsEventId('meta');
  const clean = {
    ...sanitizeMetaPayload(params),
    ...sanitizeMetaAttribution(window.location.search ?? ''),
  };
  if (typeof window.fbq === 'function') {
    window.fbq('track', eventName, clean, { eventID: id });
  } else if (pendingBrowserEvents.length < MAX_PENDING_BROWSER_EVENTS) {
    pendingBrowserEvents.push({ eventName, eventId: id, customData: clean });
  }
  void sendMetaCapiBeacon(eventName, id, clean);
  return id;
}

/** Flush events that happened after consent but before the browser Pixel bootstrap finished. */
export function flushPendingMetaBrowserEvents(): void {
  if (
    typeof window === 'undefined' ||
    !hasMarketingConsent() ||
    !isMetaPixelConfigured() ||
    typeof window.fbq !== 'function'
  ) {
    return;
  }
  while (pendingBrowserEvents.length > 0) {
    const pending = pendingBrowserEvents.shift();
    if (!pending) break;
    window.fbq('track', pending.eventName, pending.customData, {
      eventID: pending.eventId,
    });
  }
}

export function clearPendingMetaBrowserEvents(): void {
  pendingBrowserEvents.length = 0;
}

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const prefix = `${name}=`;
  const part = document.cookie.split(';').map((value) => value.trim()).find((value) => value.startsWith(prefix));
  return part ? decodeURIComponent(part.slice(prefix.length)) : undefined;
}

async function sendMetaCapiBeacon(
  eventName: string,
  eventId: string,
  customData: CleanMetaEventPayload,
): Promise<void> {
  if (!hasMarketingConsent() || !isMetaPixelConfigured()) return;
  try {
    const eventSourceUrl =
      typeof window !== 'undefined'
        ? buildMetaEventSourceUrl(
            window.location.origin,
            window.location.pathname,
            window.location.search ?? '',
          )
        : undefined;
    await fetch('/api/meta/conversions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: eventName,
        event_id: eventId,
        event_source_url: eventSourceUrl,
        custom_data: customData,
        fbp: readCookie('_fbp'),
        fbc: readCookie('_fbc'),
      }),
      keepalive: true,
    });
  } catch {
    // Non-blocking: browser Pixel remains source of truth if CAPI is unset.
  }
}

export function trackMetaPageView(eventId?: string): string | null {
  return trackMetaEvent('PageView', {}, eventId);
}

export function trackMetaViewContent(params: MetaEventPayload, eventId?: string): string | null {
  return trackMetaEvent('ViewContent', params, eventId);
}

export function trackMetaLead(params: MetaEventPayload = {}, eventId?: string): string | null {
  return trackMetaEvent('Lead', params, eventId);
}

export function trackMetaPurchase(params: MetaEventPayload, eventId?: string): string | null {
  return trackMetaEvent('Purchase', params, eventId);
}

export function trackMetaInitiateCheckout(
  params: MetaEventPayload,
  eventId?: string,
): string | null {
  return trackMetaEvent('InitiateCheckout', params, eventId);
}

export function trackMetaContact(
  params: MetaEventPayload,
  eventId?: string,
): string | null {
  return trackMetaEvent('Contact', params, eventId);
}

export function trackMetaSchedule(
  params: MetaEventPayload = {},
  eventId?: string,
): string | null {
  return trackMetaEvent('Schedule', params, eventId);
}

export function ensureMetaPixelBootstrapped(): boolean {
  const pixelId = getMetaPixelId();
  if (!pixelId || typeof window === 'undefined' || !isMetaPixelConfigured()) {
    return false;
  }
  if (typeof window.fbq === 'function') return true;
  return false;
}

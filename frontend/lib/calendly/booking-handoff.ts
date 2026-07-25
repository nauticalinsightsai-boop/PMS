import { collectLeadTrackingContext } from '@/lib/analytics/lead-tracking-context';

const HANDOFF_TIMEOUT_MS = 2_000;

type BookingHandoffResponse = {
  ok?: unknown;
  sessionId?: unknown;
};

function boundedLabel(value: string | undefined, max: number): string | undefined {
  const clean = value?.trim();
  return clean && clean.length <= max ? clean : undefined;
}

/**
 * Creates an opaque first-party bridge before Calendly opens. Contact PII is
 * never sent, and Calendly receives only the returned random session ID.
 */
export async function createBookingHandoffId(input: {
  channel?: string;
  funnelLabel?: string;
}): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), HANDOFF_TIMEOUT_MS);
  try {
    const attribution = await collectLeadTrackingContext();
    const response = await fetch('/api/calendly/handoff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      cache: 'no-store',
      signal: controller.signal,
      body: JSON.stringify({
        pagePath: window.location.pathname,
        channel: boundedLabel(input.channel, 100),
        funnelLabel: boundedLabel(input.funnelLabel, 200),
        attribution,
      }),
    });
    if (!response.ok) return null;
    const json = (await response.json()) as BookingHandoffResponse;
    return typeof json.sessionId === 'string' &&
      /^bks_[A-Za-z0-9._:-]{16,124}$/.test(json.sessionId)
      ? json.sessionId
      : null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

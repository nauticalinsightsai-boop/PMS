import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const CALENDLY_SIGNATURE_HEADER = 'calendly-webhook-signature';
export const CALENDLY_SIGNATURE_TOLERANCE_SECONDS = 180;

export type CalendlyWebhookEventType = 'invitee.created' | 'invitee.canceled';

export type CalendlyWebhookEnvelope = {
  event: CalendlyWebhookEventType;
  createdAt: string;
  inviteeUri: string;
  eventUri: string;
  inviteeEmail: string | null;
  status: 'active' | 'canceled';
  rescheduled: boolean;
  oldInviteeUri: string | null;
  newInviteeUri: string | null;
  scheduledAt: string | null;
  canceledAt: string | null;
  bookingSessionId: string | null;
};

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function stringValue(value: unknown, max = 2048): string | null {
  if (typeof value !== 'string') return null;
  const clean = value.trim();
  return clean && clean.length <= max ? clean : null;
}

function isoDate(value: unknown): string | null {
  const clean = stringValue(value, 100);
  if (!clean || Number.isNaN(Date.parse(clean))) return null;
  return new Date(clean).toISOString();
}

function uriValue(value: unknown): string | null {
  const clean = stringValue(value);
  if (!clean) return null;
  try {
    const url = new URL(clean);
    return url.protocol === 'https:' && url.hostname === 'api.calendly.com'
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function parseSignatureHeader(header: string): {
  timestamp: number;
  signatures: string[];
} | null {
  const entries = header.split(',').map((part) => part.trim());
  const timestampEntry = entries.find((entry) => entry.startsWith('t='));
  const signatures = entries
    .filter((entry) => entry.startsWith('v1='))
    .map((entry) => entry.slice(3))
    .filter((value) => /^[a-f0-9]{64}$/i.test(value));
  const timestamp = Number(timestampEntry?.slice(2));
  if (!Number.isInteger(timestamp) || timestamp <= 0 || signatures.length === 0) {
    return null;
  }
  return { timestamp, signatures };
}

/**
 * Calendly signs `${timestamp}.${rawBody}` with HMAC-SHA256. The raw bytes must
 * be verified before JSON parsing, and old/future deliveries are rejected.
 */
export function verifyCalendlyWebhookSignature(input: {
  rawBody: string;
  signatureHeader: string | null;
  signingKey: string;
  nowSeconds?: number;
  toleranceSeconds?: number;
}): boolean {
  if (!input.signatureHeader || !input.signingKey) return false;
  const parsed = parseSignatureHeader(input.signatureHeader);
  if (!parsed) return false;

  const now = input.nowSeconds ?? Math.floor(Date.now() / 1000);
  const tolerance =
    input.toleranceSeconds ?? CALENDLY_SIGNATURE_TOLERANCE_SECONDS;
  if (Math.abs(now - parsed.timestamp) > tolerance) return false;

  const expected = createHmac('sha256', input.signingKey)
    .update(`${parsed.timestamp}.${input.rawBody}`, 'utf8')
    .digest();

  return parsed.signatures.some((candidate) => {
    const received = Buffer.from(candidate, 'hex');
    return received.length === expected.length && timingSafeEqual(received, expected);
  });
}

export function calendlyWebhookEventKey(rawBody: string): string {
  return createHash('sha256').update(rawBody, 'utf8').digest('hex');
}

export function bookingConversionEventId(inviteeUri: string): string {
  const digest = createHash('sha256').update(inviteeUri, 'utf8').digest('hex');
  return `cal_booking_${digest.slice(0, 40)}`;
}

/** Parse only the bounded fields needed for durable booking state. */
export function parseCalendlyWebhookPayload(value: unknown): CalendlyWebhookEnvelope | null {
  const envelope = asRecord(value);
  const payload = asRecord(envelope?.payload);
  const event =
    envelope?.event === 'invitee.created' || envelope?.event === 'invitee.canceled'
      ? envelope.event
      : null;
  const inviteeUri = uriValue(payload?.uri);
  const eventUri = uriValue(payload?.event);
  const createdAt = isoDate(envelope?.created_at);
  if (!event || !payload || !inviteeUri || !eventUri || !createdAt) return null;

  const tracking = asRecord(payload.tracking);
  const scheduledEvent = asRecord(payload.scheduled_event);
  const bookingSession = stringValue(tracking?.utm_content, 128);
  const bookingSessionId =
    bookingSession && /^bks_[A-Za-z0-9._:-]{16,124}$/.test(bookingSession)
      ? bookingSession
      : null;
  const rescheduled = payload.rescheduled === true;
  const status =
    event === 'invitee.canceled' || payload.status === 'canceled'
      ? 'canceled'
      : 'active';

  return {
    event,
    createdAt,
    inviteeUri,
    eventUri,
    inviteeEmail: stringValue(payload.email, 320)?.toLowerCase() ?? null,
    status,
    rescheduled,
    oldInviteeUri: uriValue(payload.old_invitee),
    newInviteeUri: uriValue(payload.new_invitee),
    scheduledAt: isoDate(scheduledEvent?.start_time),
    canceledAt:
      status === 'canceled'
        ? isoDate(asRecord(payload.cancellation)?.created_at) ?? createdAt
        : null,
    bookingSessionId,
  };
}

export type BookingStatePlan = {
  booking: CalendlyWebhookEnvelope;
  relatedBookingUpdate:
    | {
        inviteeUri: string;
        status: 'canceled';
        rescheduledToInviteeUri: string;
      }
    | null;
  analytics:
    | {
        ga4Event: 'booking_confirmed';
        metaEvent: 'Schedule';
        eventId: string;
      }
    | null;
};

export function buildBookingStatePlan(
  webhook: CalendlyWebhookEnvelope,
): BookingStatePlan {
  return {
    booking: webhook,
    relatedBookingUpdate:
      webhook.event === 'invitee.created' && webhook.oldInviteeUri
        ? {
            inviteeUri: webhook.oldInviteeUri,
            status: 'canceled',
            rescheduledToInviteeUri: webhook.inviteeUri,
          }
        : null,
    analytics:
      webhook.event === 'invitee.created' && webhook.status === 'active'
        ? {
            ga4Event: 'booking_confirmed',
            metaEvent: 'Schedule',
            eventId: bookingConversionEventId(webhook.inviteeUri),
          }
        : null,
  };
}

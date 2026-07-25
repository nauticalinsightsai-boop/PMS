import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  bookingConversionEventId,
  buildBookingStatePlan,
  calendlyWebhookEventKey,
  parseCalendlyWebhookPayload,
  verifyCalendlyWebhookSignature,
} from './webhook';

const signingKey = 'test_signing_key';
const timestamp = 1_753_424_000;

function signatureFor(rawBody: string, at = timestamp) {
  const digest = createHmac('sha256', signingKey)
    .update(`${at}.${rawBody}`, 'utf8')
    .digest('hex');
  return `t=${at},v1=${digest}`;
}

function createdFixture(overrides: Record<string, unknown> = {}) {
  return {
    event: 'invitee.created',
    created_at: '2026-07-25T09:00:00.000Z',
    payload: {
      uri: 'https://api.calendly.com/scheduled_events/event-1/invitees/invitee-1',
      event: 'https://api.calendly.com/scheduled_events/event-1',
      email: 'candidate@example.com',
      status: 'active',
      tracking: { utm_content: 'bks_1234567890abcdef' },
      scheduled_event: { start_time: '2026-08-15T09:00:00.000Z' },
      ...overrides,
    },
  };
}

describe('verifyCalendlyWebhookSignature', () => {
  it('accepts a valid signature over the exact raw body', () => {
    const rawBody = JSON.stringify(createdFixture());
    expect(
      verifyCalendlyWebhookSignature({
        rawBody,
        signatureHeader: signatureFor(rawBody),
        signingKey,
        nowSeconds: timestamp,
      }),
    ).toBe(true);
  });

  it('rejects a modified, invalid, or stale delivery', () => {
    const rawBody = JSON.stringify(createdFixture());
    expect(
      verifyCalendlyWebhookSignature({
        rawBody: `${rawBody} `,
        signatureHeader: signatureFor(rawBody),
        signingKey,
        nowSeconds: timestamp,
      }),
    ).toBe(false);
    expect(
      verifyCalendlyWebhookSignature({
        rawBody,
        signatureHeader: 't=invalid,v1=invalid',
        signingKey,
        nowSeconds: timestamp,
      }),
    ).toBe(false);
    expect(
      verifyCalendlyWebhookSignature({
        rawBody,
        signatureHeader: signatureFor(rawBody),
        signingKey,
        nowSeconds: timestamp + 181,
      }),
    ).toBe(false);
  });
});

describe('Calendly booking lifecycle', () => {
  it('creates one deterministic booking/conversion identity on replay', () => {
    const rawBody = JSON.stringify(createdFixture());
    const first = parseCalendlyWebhookPayload(JSON.parse(rawBody));
    const replay = parseCalendlyWebhookPayload(JSON.parse(rawBody));

    expect(first).not.toBeNull();
    expect(first).toEqual(replay);
    expect(calendlyWebhookEventKey(rawBody)).toBe(calendlyWebhookEventKey(rawBody));

    const plan = buildBookingStatePlan(first!);
    expect(plan.analytics).toEqual({
      ga4Event: 'booking_confirmed',
      metaEvent: 'Schedule',
      eventId: bookingConversionEventId(first!.inviteeUri),
    });
    expect(JSON.stringify(plan.analytics)).not.toContain('candidate@example.com');
  });

  it('records cancellation without emitting a conversion', () => {
    const parsed = parseCalendlyWebhookPayload({
      event: 'invitee.canceled',
      created_at: '2026-07-25T10:00:00.000Z',
      payload: {
        uri: 'https://api.calendly.com/scheduled_events/event-1/invitees/invitee-1',
        event: 'https://api.calendly.com/scheduled_events/event-1',
        status: 'canceled',
        rescheduled: false,
        cancellation: { created_at: '2026-07-25T09:59:00.000Z' },
      },
    });

    expect(parsed?.status).toBe('canceled');
    expect(parsed?.canceledAt).toBe('2026-07-25T09:59:00.000Z');
    expect(buildBookingStatePlan(parsed!).analytics).toBeNull();
  });

  it('links the old invitee when a reschedule creates the replacement booking', () => {
    const oldInvitee =
      'https://api.calendly.com/scheduled_events/event-1/invitees/invitee-old';
    const parsed = parseCalendlyWebhookPayload(
      createdFixture({
        uri: 'https://api.calendly.com/scheduled_events/event-2/invitees/invitee-new',
        event: 'https://api.calendly.com/scheduled_events/event-2',
        old_invitee: oldInvitee,
      }),
    );

    expect(buildBookingStatePlan(parsed!).relatedBookingUpdate).toEqual({
      inviteeUri: oldInvitee,
      status: 'canceled',
      rescheduledToInviteeUri:
        'https://api.calendly.com/scheduled_events/event-2/invitees/invitee-new',
    });
  });

  it('does not accept PII or arbitrary text as a booking-session ID', () => {
    const parsed = parseCalendlyWebhookPayload(
      createdFixture({
        tracking: { utm_content: 'candidate@example.com' },
      }),
    );
    expect(parsed?.bookingSessionId).toBeNull();
  });
});

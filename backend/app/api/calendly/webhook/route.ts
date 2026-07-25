import { NextResponse } from 'next/server';
import {
  CALENDLY_SIGNATURE_HEADER,
  bookingConversionEventId,
  calendlyWebhookEventKey,
  parseCalendlyWebhookPayload,
  verifyCalendlyWebhookSignature,
} from '@pms/booking-crm/calendly/webhook';
import {
  isSupabaseConfigured,
  supabaseAdmin,
} from '../../../../lib/supabase-admin';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 256 * 1024;

type ProcessResult = {
  booking_id: string | null;
  duplicate: boolean;
  ga4_enqueued: boolean;
  meta_enqueued: boolean;
};

export async function POST(request: Request) {
  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY?.trim();
  if (!signingKey || !isSupabaseConfigured) {
    return NextResponse.json(
      { ok: false, error: 'webhook_not_configured' },
      { status: 503 },
    );
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: 'payload_too_large' }, { status: 413 });
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: 'payload_too_large' }, { status: 413 });
  }
  if (
    !verifyCalendlyWebhookSignature({
      rawBody,
      signatureHeader: request.headers.get(CALENDLY_SIGNATURE_HEADER),
      signingKey,
    })
  ) {
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 401 });
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const webhook = parseCalendlyWebhookPayload(parsedJson);
  if (!webhook) {
    return NextResponse.json(
      { ok: false, error: 'unsupported_webhook' },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin.rpc('process_calendly_webhook', {
    p_event_key: calendlyWebhookEventKey(rawBody),
    p_event_type: webhook.event,
    p_invitee_uri: webhook.inviteeUri,
    p_event_uri: webhook.eventUri,
    p_invitee_email: webhook.inviteeEmail,
    p_status: webhook.status,
    p_scheduled_at: webhook.scheduledAt,
    p_canceled_at: webhook.canceledAt,
    p_old_invitee_uri: webhook.oldInviteeUri,
    p_new_invitee_uri: webhook.newInviteeUri,
    p_handoff_session_id: webhook.bookingSessionId,
    p_conversion_event_id: bookingConversionEventId(webhook.inviteeUri),
  });
  if (error) {
    return NextResponse.json(
      { ok: false, error: 'webhook_processing_failed' },
      { status: 503 },
    );
  }

  const result = (Array.isArray(data) ? data[0] : data) as ProcessResult | null;
  return NextResponse.json(
    {
      ok: true,
      duplicate: Boolean(result?.duplicate),
      bookingId: result?.booking_id ?? null,
    },
    { status: 200, headers: { 'Cache-Control': 'no-store' } },
  );
}

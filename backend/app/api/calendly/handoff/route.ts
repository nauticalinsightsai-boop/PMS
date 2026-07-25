import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { sanitizeBookingHandoff } from '@pms/booking-crm/calendly/handoff';
import {
  isSupabaseConfigured,
  supabaseAdmin,
} from '../../../../lib/supabase-admin';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 16 * 1024;
const HANDOFF_TTL_MS = 24 * 60 * 60 * 1000;

function isSameOriginRequest(request: Request): boolean {
  if (request.headers.get('sec-fetch-site') === 'cross-site') return false;
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    return origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ ok: false, error: 'origin_not_allowed' }, { status: 403 });
  }

  const contentType = request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
  if (contentType !== 'application/json' && !contentType?.endsWith('+json')) {
    return NextResponse.json(
      { ok: false, error: 'content_type_not_supported' },
      { status: 415 },
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

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { ok: false, error: 'booking_handoff_unavailable' },
      { status: 503 },
    );
  }

  const sessionId = `bks_${randomUUID()}`;
  const expiresAt = new Date(Date.now() + HANDOFF_TTL_MS).toISOString();
  const sanitized = sanitizeBookingHandoff(
    body && typeof body === 'object' && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : {},
  );
  const { error } = await supabaseAdmin.from('calendly_booking_handoffs').insert({
    session_id: sessionId,
    expires_at: expiresAt,
    ...sanitized,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: 'booking_handoff_unavailable' },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { ok: true, sessionId, expiresAt },
    { status: 201, headers: { 'Cache-Control': 'no-store' } },
  );
}

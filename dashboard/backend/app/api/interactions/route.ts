import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { requireInteractionAdmin } from '@/lib/interactions/admin-guard';
import {
  buildInteractionListQuery,
  isMissingSheetsColumnError,
  parseInteractionListFilters,
} from '@/lib/interactions/query';
import { isInteractionRateLimited } from '@/lib/interactions/rate-limit';
import {
  collectInteractionRequestMetadata,
  getInteractionClientIp,
} from '@/lib/interactions/request-ip';
import { publicInteractionBodySchema } from '@/lib/interactions/schema';
import {
  jsonByteLength,
  sanitizeInteractionPayload,
} from '@/lib/interactions/payload-sanitize';
import { insertFormSubmission } from '@/lib/interactions/service';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

const MAX_PAYLOAD_BYTES = 48_000;

export async function POST(request: NextRequest) {
  const ip = getInteractionClientIp(request);
  if (isInteractionRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = publicInteractionBodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
  }

  const body = parsed.data;
  if ((body.website?.trim() ?? '') || (body.company?.trim() ?? '')) {
    return NextResponse.json(
      {
        success: true,
        id: 'honeypot',
        sheetsSynced: false,
        sheetsSyncPending: false,
        sheetsWarning: null,
      },
      { status: 201 },
    );
  }

  const payload = sanitizeInteractionPayload(body.payload);
  if (jsonByteLength(payload) > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  }

  const email = body.email.trim().toLowerCase();
  const metadata = {
    ...collectInteractionRequestMetadata(request),
  };

  const result = await insertFormSubmission({
    source: body.source,
    subject: body.subject.trim(),
    email,
    payload,
    metadata,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 503 });
  }

  return NextResponse.json(
    {
      success: true,
      id: result.id,
      sheetsSynced: result.sheetsSynced,
      sheetsSyncPending: result.sheetsSyncPending,
      sheetsWarning: result.sheetsError,
    },
    { status: 201 },
  );
}

export async function GET(request: NextRequest) {
  const auth = await requireInteractionAdmin(request);
  if (auth instanceof NextResponse) return auth;

  if (!isSupabaseConfigured) {
    return Response.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(0, Number(searchParams.get('page') ?? 0));
  const limit = Math.min(Math.max(1, Number(searchParams.get('limit') ?? 50)), 200);
  const filters = parseInteractionListFilters(searchParams);

  const result = await buildInteractionListQuery(supabaseAdmin, filters, {
    limit,
    offset: page * limit,
    count: true,
  });

  // Graceful fallback when the Sheets-sync columns have not been migrated yet.
  if (result.error && isMissingSheetsColumnError(result.error.message)) {
    const fallback = await buildInteractionListQuery(supabaseAdmin, filters, {
      limit,
      offset: page * limit,
      count: true,
      includeSheetsColumns: false,
    });
    if (fallback.error) {
      return Response.json({ error: fallback.error.message }, { status: 500 });
    }
    const rows = Array.isArray(fallback.data)
      ? fallback.data.map((row) => ({
          ...(row as Record<string, unknown>),
          sheets_synced_at: null,
          sheets_sync_error: null,
          sheets_sync_attempts: 0,
        }))
      : fallback.data;
    return Response.json({ data: rows, count: fallback.count });
  }

  if (result.error) {
    return Response.json({ error: result.error.message }, { status: 500 });
  }

  return Response.json({ data: result.data, count: result.count });
}

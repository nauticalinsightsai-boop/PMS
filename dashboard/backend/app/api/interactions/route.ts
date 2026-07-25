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
  sanitizeTrustedInteractionTracking,
} from '@/lib/interactions/payload-sanitize';
import { insertFormSubmission } from '@/lib/interactions/service';
import { isGoogleSheetsConfigured } from '@/lib/interactions/google-sheets';
import { getSheetsSyncUiStatus } from '@/lib/interactions/sync-status';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

const MAX_PAYLOAD_BYTES = 48_000;
const CLIENT_SUBMISSION_ID_PATTERN = /^[A-Za-z0-9._:-]{16,128}$/;

type InteractionListRow = Record<string, unknown> & {
  sheets_synced_at?: string | null;
  sheets_sync_error?: string | null;
};

function toClientSheetsStatus(row: InteractionListRow): 'synced' | 'failed' | 'pending' | 'na' {
  const ui = getSheetsSyncUiStatus(
    {
      sheets_synced_at: row.sheets_synced_at ?? null,
      sheets_sync_error: row.sheets_sync_error ?? null,
    },
    isGoogleSheetsConfigured(),
  );
  if (ui === 'not_configured' || ui === 'skipped') return 'na';
  return ui;
}

function mapInteractionListRow(row: InteractionListRow) {
  return {
    ...row,
    sheets_status: toClientSheetsStatus(row),
  };
}

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
  const headerIdempotencyKey = request.headers.get('idempotency-key')?.trim();
  if (
    headerIdempotencyKey &&
    !CLIENT_SUBMISSION_ID_PATTERN.test(headerIdempotencyKey)
  ) {
    return NextResponse.json({ error: 'Invalid submission key' }, { status: 400 });
  }
  if (
    headerIdempotencyKey &&
    body.clientSubmissionId &&
    headerIdempotencyKey !== body.clientSubmissionId
  ) {
    return NextResponse.json({ error: 'Invalid submission key' }, { status: 400 });
  }
  const clientSubmissionId = body.clientSubmissionId ?? headerIdempotencyKey;

  if ((body.website?.trim() ?? '') || (body.company?.trim() ?? '')) {
    return NextResponse.json(
      {
        success: true,
        id: 'honeypot',
        sheetsSynced: false,
        sheetsSyncPending: false,
      },
      { status: 201 },
    );
  }

  const payload = {
    ...sanitizeInteractionPayload(body.payload),
    ...sanitizeTrustedInteractionTracking(body.tracking),
  };
  if (jsonByteLength(payload) > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  }

  const email = body.email.trim().toLowerCase();
  const metadata = {
    ...collectInteractionRequestMetadata(request),
    ...(clientSubmissionId ? { clientSubmissionId } : {}),
  };

  const result = await insertFormSubmission({
    source: body.source,
    subject: body.subject.trim(),
    email,
    payload,
    metadata,
    clientSubmissionId,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 503 });
  }

  return NextResponse.json(
    {
      success: true,
      id: result.id,
      sheetsSynced: result.sheetsSynced,
      // The detailed Sheets error remains in operations storage/logs. Public
      // callers only need to know that secondary synchronization is pending.
      sheetsSyncPending:
        result.sheetsSyncPending || Boolean(result.sheetsError),
      idempotentReplay: result.idempotentReplay,
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
      ? fallback.data.map((row) =>
          mapInteractionListRow({
            ...(row as Record<string, unknown>),
            sheets_synced_at: null,
            sheets_sync_error: null,
            sheets_sync_attempts: 0,
          }),
        )
      : fallback.data;
    return Response.json({ data: rows, count: fallback.count });
  }

  if (result.error) {
    return Response.json({ error: result.error.message }, { status: 500 });
  }

  const rows = Array.isArray(result.data)
    ? result.data.map((row) => mapInteractionListRow(row as InteractionListRow))
    : result.data;

  return Response.json({ data: rows, count: result.count });
}

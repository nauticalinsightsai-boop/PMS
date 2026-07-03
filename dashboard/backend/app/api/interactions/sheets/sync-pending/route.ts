import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { requireInteractionAdmin } from '@/lib/interactions/admin-guard';
import { pingInteractionSubscribers } from '@/lib/interactions/broadcast';
import { syncPendingFormSubmissionsToSheets } from '@/lib/interactions/sheets-backfill';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Admin: append all pending/failed form_submissions rows to Google Sheets (all tabs). */
export async function POST(request: NextRequest) {
  const auth = await requireInteractionAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const url = new URL(request.url);
  const limitRaw = url.searchParams.get('limit');
  const limit = limitRaw ? Number.parseInt(limitRaw, 10) : undefined;

  const result = await syncPendingFormSubmissionsToSheets({
    limit: Number.isFinite(limit) ? limit : undefined,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  pingInteractionSubscribers();

  return NextResponse.json(result);
}

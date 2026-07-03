import { isGoogleSheetsConfigured } from '@/lib/interactions/google-sheets';
import { syncRowToGoogleSheetsWithRetries, type SheetsSyncRow } from '@/lib/interactions/sheets-sync';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/client';

export type SyncPendingResult =
  | {
      ok: true;
      total: number;
      synced: number;
      failed: number;
      skipped: number;
      errors: { id: string; error: string }[];
    }
  | { ok: false; error: string; status: 503 };

/** Re-sync rows that never reached Google Sheets (pending/failed). Skips already-synced rows. */
export async function syncPendingFormSubmissionsToSheets(opts?: {
  limit?: number;
}): Promise<SyncPendingResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase is not configured.', status: 503 };
  }
  if (!isGoogleSheetsConfigured()) {
    return { ok: false, error: 'Google Sheets is not configured on the server.', status: 503 };
  }

  const supabase = getSupabaseAdmin();
  const limit = Math.min(Math.max(opts?.limit ?? 500, 1), 2000);

  const { data, error } = await supabase
    .from('form_submissions')
    .select(
      'id, created_at, source, subject, email, payload, metadata, sheets_synced_at, sheets_sync_error',
    )
    .or('sheets_synced_at.is.null,sheets_sync_error.not.is.null')
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    if (error.message?.includes('sheets_sync')) {
      const fallback = await supabase
        .from('form_submissions')
        .select('id, created_at, source, subject, email, payload, metadata')
        .order('created_at', { ascending: true })
        .limit(limit);
      if (fallback.error) {
        console.error('[interactions:sheets-backfill] fetch failed', fallback.error);
        return { ok: false, error: 'Could not load submissions.', status: 503 };
      }
      const rows = (fallback.data ?? []) as SheetsSyncRow[];
      return syncRows(supabase, rows);
    }
    console.error('[interactions:sheets-backfill] fetch failed', error);
    return { ok: false, error: 'Could not load submissions.', status: 503 };
  }

  const rows = ((data ?? []) as (SheetsSyncRow & {
    sheets_synced_at?: string | null;
    sheets_sync_error?: string | null;
  })[]).filter((row) => !row.sheets_synced_at || row.sheets_sync_error);

  return syncRows(supabase, rows);
}

async function syncRows(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  rows: SheetsSyncRow[],
): Promise<Extract<SyncPendingResult, { ok: true }>> {
  let synced = 0;
  let failed = 0;
  const errors: { id: string; error: string }[] = [];

  for (const row of rows) {
    const result = await syncRowToGoogleSheetsWithRetries(supabase, row.id, row);
    if (result.synced) {
      synced += 1;
    } else {
      failed += 1;
      if (result.error) errors.push({ id: row.id, error: result.error });
    }
  }

  return {
    ok: true,
    total: rows.length,
    synced,
    failed,
    skipped: 0,
    errors: errors.slice(0, 20),
  };
}

import { pingInteractionSubscribers } from '@/lib/interactions/broadcast';
import { isGoogleSheetsConfigured } from '@/lib/interactions/google-sheets';
import { syncRowToGoogleSheetsWithRetries, type SheetsSyncRow } from '@/lib/interactions/sheets-sync';
import type { InteractionSource } from '@/lib/interactions/types';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertInteractionResult =
  | {
      ok: true;
      id: string;
      /** True only when sync finished inline (always false for public POST — sync runs in background). */
      sheetsSynced: boolean;
      /** True when a background Sheets append was queued. */
      sheetsSyncPending: boolean;
      sheetsError: string | null;
    }
  | { ok: false; error: string };

/**
 * Queue Google Sheets append after Supabase insert. Never throws — errors are logged and stored on the row.
 */
export function scheduleGoogleSheetsSync(
  supabase: SupabaseClient,
  rowId: string,
  row: SheetsSyncRow
): void {
  void syncRowToGoogleSheetsWithRetries(supabase, rowId, row)
    .then((sync) => {
      if (sync.synced) {
        console.info('[interactions] Google Sheets background sync ok', { submissionId: rowId });
      } else if (sync.error) {
        console.error('[interactions] Google Sheets background sync failed', {
          submissionId: rowId,
          error: sync.error,
        });
      }
      pingInteractionSubscribers();
    })
    .catch((e) => {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('[interactions] Google Sheets background sync error', {
        submissionId: rowId,
        error: msg,
      });
    });
}

/**
 * Persists a submission to Supabase (required), then queues Google Sheets sync without blocking the response.
 */
export async function insertFormSubmission(params: {
  source: InteractionSource;
  subject: string;
  email: string;
  payload: Record<string, unknown>;
  metadata: Record<string, unknown>;
}): Promise<InsertInteractionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase is not configured.' };
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('form_submissions')
    .insert({
      source: params.source,
      subject: params.subject,
      email: params.email,
      payload: params.payload,
      metadata: params.metadata,
      sheets_sync_attempts: 0,
    })
    .select('id, created_at, source, subject, email, payload, metadata')
    .single();

  if (error || !data) {
    console.error('[interactions] insert', error);
    return { ok: false, error: 'Could not store submission.' };
  }

  const row = data as SheetsSyncRow;

  pingInteractionSubscribers();

  const sheetsConfigured = isGoogleSheetsConfigured();
  if (sheetsConfigured) {
    scheduleGoogleSheetsSync(supabase, row.id, row);
    return {
      ok: true,
      id: row.id,
      sheetsSynced: false,
      sheetsSyncPending: true,
      sheetsError: null,
    };
  }

    console.warn('[interactions] Google Sheets not configured — row saved to Supabase only', {
      submissionId: row.id,
    });

  return {
    ok: true,
    id: row.id,
    sheetsSynced: false,
    sheetsSyncPending: false,
    sheetsError: null,
  };
}

export type RetrySheetsResult =
  | { ok: true; synced: boolean; error: string | null }
  | { ok: false; error: string; status: 404 | 400 | 503 };

/** Admin retry: re-append row to Google Sheets (may duplicate if already synced — use when sync failed). */
export async function retryFormSubmissionSheetsSync(submissionId: string): Promise<RetrySheetsResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase is not configured.', status: 503 };
  }
  if (!isGoogleSheetsConfigured()) {
    return { ok: false, error: 'Google Sheets is not configured.', status: 503 };
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('form_submissions')
    .select('id, created_at, source, subject, email, payload, metadata, sheets_synced_at')
    .eq('id', submissionId)
    .maybeSingle();

  if (error) {
    console.error('[interactions] retry fetch', error);
    return { ok: false, error: 'Could not load submission.', status: 503 };
  }
  if (!data) {
    return { ok: false, error: 'Submission not found.', status: 404 };
  }

  const row = data as SheetsSyncRow & { sheets_synced_at: string | null };

  const sync = await syncRowToGoogleSheetsWithRetries(supabase, row.id, row);
  pingInteractionSubscribers();

  return { ok: true, synced: sync.synced, error: sync.error };
}

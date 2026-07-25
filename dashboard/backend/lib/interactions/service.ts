import { pingInteractionSubscribers } from '@/lib/interactions/broadcast';
import { isGoogleSheetsConfigured } from '@/lib/interactions/google-sheets';
import { enqueueInteractionOperations } from '@/lib/interactions/outbox';
import { syncRowToGoogleSheetsWithRetries, type SheetsSyncRow } from '@/lib/interactions/sheets-sync';
import type { InteractionSource } from '@/lib/interactions/types';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertInteractionResult =
  | {
      ok: true;
      id: string;
      /** True when Google Sheets delivery has already completed. */
      sheetsSynced: boolean;
      /** True while the durable outbox owns a pending Sheets delivery. */
      sheetsSyncPending: boolean;
      sheetsError: string | null;
      /** True when an existing row satisfied the same client submission key. */
      idempotentReplay: boolean;
    }
  | { ok: false; error: string };

type ExistingSubmissionRow = {
  id: string;
  sheets_synced_at: string | null;
  sheets_sync_error: string | null;
};

function isUniqueViolation(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code?: unknown }).code === '23505',
  );
}

async function findSubmissionByClientKey(
  supabase: SupabaseClient,
  clientSubmissionId: string,
): Promise<ExistingSubmissionRow | null> {
  const { data, error } = await supabase
    .from('form_submissions')
    .select('id, sheets_synced_at, sheets_sync_error')
    .eq('metadata->>clientSubmissionId', clientSubmissionId)
    .maybeSingle();

  if (error) {
    console.error('[interactions] idempotency lookup', {
      code: error.code,
    });
    return null;
  }
  return (data as ExistingSubmissionRow | null) ?? null;
}

function replayResult(row: ExistingSubmissionRow): InsertInteractionResult {
  return {
    ok: true,
    id: row.id,
    sheetsSynced: Boolean(row.sheets_synced_at),
    sheetsSyncPending: !row.sheets_synced_at && !row.sheets_sync_error,
    sheetsError: row.sheets_sync_error,
    idempotentReplay: true,
  };
}

/**
 * Persists a submission to Supabase (required), then enqueues secondary
 * deliveries. The protected outbox worker is the only automatic consumer.
 */
export async function insertFormSubmission(params: {
  source: InteractionSource;
  subject: string;
  email: string;
  payload: Record<string, unknown>;
  metadata: Record<string, unknown>;
  clientSubmissionId?: string;
}): Promise<InsertInteractionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase is not configured.' };
  }

  const supabase = getSupabaseAdmin();
  if (params.clientSubmissionId) {
    const existing = await findSubmissionByClientKey(
      supabase,
      params.clientSubmissionId,
    );
    if (existing) {
      return replayResult(existing);
    }
  }

  const { data, error } = await supabase
    .from('form_submissions')
    .insert({
      source: params.source,
      subject: params.subject,
      email: params.email,
      payload: params.payload,
      metadata: params.metadata,
    })
    .select('id, created_at, source, subject, email, payload, metadata')
    .single();

  if (error || !data) {
    if (params.clientSubmissionId && isUniqueViolation(error)) {
      const existing = await findSubmissionByClientKey(
        supabase,
        params.clientSubmissionId,
      );
      if (existing) {
        return replayResult(existing);
      }
    }
    console.error('[interactions] insert', {
      code:
        error && typeof error === 'object' && 'code' in error
          ? (error as { code?: unknown }).code
          : undefined,
    });
    return { ok: false, error: 'Could not store submission.' };
  }

  const row = data as SheetsSyncRow;

  pingInteractionSubscribers();
  await enqueueInteractionOperations(
    supabase,
    row.id,
    !params.metadata.booking_id,
  );

  return {
    ok: true,
    id: row.id,
    sheetsSynced: false,
    sheetsSyncPending: true,
    sheetsError: null,
    idempotentReplay: false,
  };
}

export type RetrySheetsResult =
  | { ok: true; synced: boolean; error: string | null }
  | { ok: false; error: string; status: 404 | 400 | 503 };

/** Admin retry: re-append row to Google Sheets (may duplicate if already synced: use when sync failed). */
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

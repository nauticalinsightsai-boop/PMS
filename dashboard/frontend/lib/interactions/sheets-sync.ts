import type { SupabaseClient } from '@supabase/supabase-js';

import { appendRowToGoogleSheet, isGoogleSheetsConfigured } from '@/lib/interactions/google-sheets';
import type { FormSubmissionRow } from '@/lib/interactions/types';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type SheetsSyncRow = Pick<
  FormSubmissionRow,
  'id' | 'created_at' | 'source' | 'subject' | 'email' | 'payload' | 'metadata'
>;

function isRetryableSheetsError(message: string): boolean {
  return (
    message.includes('429') ||
    message.includes('500') ||
    message.includes('502') ||
    message.includes('503') ||
    message.includes('504') ||
    message.includes('RESOURCE_EXHAUSTED') ||
    message.includes('UNAVAILABLE')
  );
}

export function rowToSheetValues(row: SheetsSyncRow): string[] {
  return [
    row.created_at,
    row.source,
    row.subject,
    row.email,
    JSON.stringify(row.payload),
    JSON.stringify(row.metadata),
    row.id,
  ];
}

export async function syncRowToGoogleSheetsWithRetries(
  supabase: SupabaseClient,
  rowId: string,
  row: SheetsSyncRow
): Promise<{ synced: boolean; error: string | null }> {
  if (!isGoogleSheetsConfigured()) {
    return { synced: false, error: 'Google Sheets is not configured on the server.' };
  }

  const values = rowToSheetValues(row);
  let lastErr: string | null = null;
  const maxAttempts = 4;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await supabase
      .from('form_submissions')
      .update({ sheets_sync_attempts: attempt })
      .eq('id', rowId);

    try {
      console.info('[interactions:sheets-sync] append attempt', {
        submissionId: rowId,
        attempt,
        source: row.source,
        columnCount: values.length,
      });
      await appendRowToGoogleSheet(values);
      console.info('[interactions:sheets-sync] append success', { submissionId: rowId, attempt });
      await supabase
        .from('form_submissions')
        .update({
          sheets_synced_at: new Date().toISOString(),
          sheets_sync_error: null,
          sheets_sync_attempts: attempt,
        })
        .eq('id', rowId);
      return { synced: true, error: null };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      lastErr = msg.slice(0, 2000);
      console.error('[interactions:sheets-sync] append failed', {
        submissionId: rowId,
        attempt,
        error: lastErr,
      });
      if (attempt < maxAttempts && isRetryableSheetsError(msg)) {
        await sleep(400 * 2 ** (attempt - 1));
      }
    }
  }

  await supabase
    .from('form_submissions')
    .update({ sheets_sync_error: lastErr })
    .eq('id', rowId);

  return { synced: false, error: lastErr };
}

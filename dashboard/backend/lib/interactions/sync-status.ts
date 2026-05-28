import type { FormSubmissionRow } from '@/lib/interactions/types';

export type SheetsSyncUiStatus = 'synced' | 'failed' | 'pending' | 'not_configured' | 'skipped';

export function getSheetsSyncUiStatus(
  row: Pick<FormSubmissionRow, 'sheets_synced_at' | 'sheets_sync_error'>,
  sheetsConfigured: boolean
): SheetsSyncUiStatus {
  if (!sheetsConfigured) return 'not_configured';
  if (row.sheets_synced_at) return 'synced';
  if (row.sheets_sync_error) return 'failed';
  return 'pending';
}

export function canRetrySheetsSync(
  row: Pick<FormSubmissionRow, 'sheets_synced_at' | 'sheets_sync_error'>,
  sheetsConfigured: boolean
): boolean {
  if (!sheetsConfigured) return false;
  return Boolean(row.sheets_sync_error) || !row.sheets_synced_at;
}

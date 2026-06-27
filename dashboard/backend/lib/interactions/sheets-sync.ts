import type { SupabaseClient } from '@supabase/supabase-js';

import {
  appendRowToGoogleSheet,
  appendRowToTab,
  ensureSheetTabExists,
  isGoogleSheetsConfigured,
} from '@/lib/interactions/google-sheets';
import type { FormSubmissionRow } from '@/lib/interactions/types';

/** Stripe payments get their own tab so purchases are tracked separately from leads. */
const PAYMENTS_TAB = 'Payments';
const PAYMENTS_HEADERS = [
  'Date',
  'Type',
  'Customer',
  'Email',
  'Amount',
  'Currency',
  'Tier',
  'Billing',
  'Offering',
  'Stripe Session',
  'Status',
];

function payloadString(payload: Record<string, unknown>, key: string): string {
  const value = payload[key];
  if (value == null) return '';
  return typeof value === 'string' ? value : String(value);
}

function paymentRowValues(row: SheetsSyncRow): string[] {
  const p = row.payload ?? {};
  return [
    row.created_at,
    payloadString(p, 'paymentType'),
    payloadString(p, 'customerName'),
    row.email,
    payloadString(p, 'amountDisplay'),
    payloadString(p, 'currency'),
    payloadString(p, 'membershipTier'),
    payloadString(p, 'billingCycle'),
    payloadString(p, 'offeringId'),
    payloadString(p, 'stripeSessionId'),
    payloadString(p, 'paymentStatus') || 'paid',
  ];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function tryUpdateSyncFields(
  supabase: SupabaseClient,
  rowId: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase.from('form_submissions').update(patch).eq('id', rowId);
  if (!error) return;
  if (error.message?.includes('sheets_sync')) {
    console.warn(
      '[interactions:sheets-sync] sync tracking columns missing — apply supabase/migrations/20260610120000_form_submissions_sheets_sync.sql',
    );
    return;
  }
  console.error('[interactions:sheets-sync] could not update sync fields', error.message);
}

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

  const isPayment = row.source === 'payment';
  const values = isPayment ? paymentRowValues(row) : rowToSheetValues(row);
  let lastErr: string | null = null;
  const maxAttempts = 4;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await tryUpdateSyncFields(supabase, rowId, { sheets_sync_attempts: attempt });

    try {
      console.info('[interactions:sheets-sync] append attempt', {
        submissionId: rowId,
        attempt,
        source: row.source,
        columnCount: values.length,
        tab: isPayment ? PAYMENTS_TAB : 'default',
      });
      if (isPayment) {
        await ensureSheetTabExists(PAYMENTS_TAB, PAYMENTS_HEADERS);
        await appendRowToTab(PAYMENTS_TAB, values);
      } else {
        await appendRowToGoogleSheet(values);
      }
      console.info('[interactions:sheets-sync] append success', { submissionId: rowId, attempt });
      await tryUpdateSyncFields(supabase, rowId, {
        sheets_synced_at: new Date().toISOString(),
        sheets_sync_error: null,
        sheets_sync_attempts: attempt,
      });
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

  await tryUpdateSyncFields(supabase, rowId, { sheets_sync_error: lastErr });

  return { synced: false, error: lastErr };
}

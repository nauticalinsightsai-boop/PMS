import {
  appendRowToTab,
  ensureSheetTabExists,
  isGoogleSheetsConfigured,
} from '@/lib/interactions/google-sheets';
import type { FormSubmissionRow } from '@/lib/interactions/types';
import {
  buildCertificationSheetRow,
  buildHumanSubmissionsRow,
  buildRecordsRow,
  CERTIFICATION_SHEET_HEADERS,
  isCertificationSheetSubmission,
  RECORDS_SHEET_HEADERS,
  SUBMISSIONS_SHEET_HEADERS,
  type SheetSubmissionRow,
} from '@pms/booking-crm/sheets-human-row';
import type { SupabaseClient } from '@supabase/supabase-js';

const SUBMISSIONS_TAB = 'Submissions';
const RECORDS_TAB = 'Records';
const CERTIFICATION_TAB = 'Certification Forms';
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
  return buildHumanSubmissionsRow(row as SheetSubmissionRow);
}

async function appendHumanLeadRows(row: SheetsSyncRow): Promise<void> {
  const sheetRow = row as SheetSubmissionRow;

  await ensureSheetTabExists(SUBMISSIONS_TAB, [...SUBMISSIONS_SHEET_HEADERS]);
  await appendRowToTab(SUBMISSIONS_TAB, buildHumanSubmissionsRow(sheetRow));

  await ensureSheetTabExists(RECORDS_TAB, [...RECORDS_SHEET_HEADERS]);
  await appendRowToTab(RECORDS_TAB, buildRecordsRow(sheetRow));

  if (isCertificationSheetSubmission(sheetRow)) {
    await ensureSheetTabExists(CERTIFICATION_TAB, [...CERTIFICATION_SHEET_HEADERS]);
    await appendRowToTab(CERTIFICATION_TAB, buildCertificationSheetRow(sheetRow));
  }
}

export async function syncRowToGoogleSheetsWithRetries(
  supabase: SupabaseClient,
  rowId: string,
  row: SheetsSyncRow,
): Promise<{ synced: boolean; error: string | null }> {
  if (!isGoogleSheetsConfigured()) {
    return { synced: false, error: 'Google Sheets is not configured on the server.' };
  }

  const isPayment = row.source === 'payment';
  let lastErr: string | null = null;
  const maxAttempts = 4;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await supabase
      .from('form_submissions')
      .update({ sheets_sync_attempts: attempt })
      .eq('id', rowId);

    try {
      if (isPayment) {
        await ensureSheetTabExists(PAYMENTS_TAB, PAYMENTS_HEADERS);
        await appendRowToTab(PAYMENTS_TAB, paymentRowValues(row));
      } else {
        await appendHumanLeadRows(row);
      }

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
      if (attempt < maxAttempts && isRetryableSheetsError(msg)) {
        await sleep(400 * 2 ** (attempt - 1));
      }
    }
  }

  await supabase.from('form_submissions').update({ sheets_sync_error: lastErr }).eq('id', rowId);

  return { synced: false, error: lastErr };
}

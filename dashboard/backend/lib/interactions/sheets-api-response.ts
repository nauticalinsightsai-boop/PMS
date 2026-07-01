import {
  getGoogleSheetsRange,
  getGoogleSpreadsheetEditorUrl,
  isGoogleSheetsConfigured,
  readGoogleSheetValues,
} from '@/lib/interactions/google-sheets';
import {
  DEFAULT_SHEET_HEADERS,
  parseSheetRows,
  sheetHeadersFromValues,
  type SheetRecord,
} from '@/lib/interactions/sheets-records';
import {
  buildHumanSubmissionsRow,
  type SheetSubmissionRow,
} from '@pms/booking-crm/sheets-human-row';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';

export type InteractionRecordsDataSource = 'google_sheets' | 'supabase';

function rowsFromSupabase(
  data: Array<{
    id: string;
    created_at: string;
    source: string;
    subject: string | null;
    email: string | null;
    payload: Record<string, unknown> | null;
    metadata: Record<string, unknown> | null;
  }>,
): SheetRecord[] {
  return data.map((row, index) => {
    const sheetRow: SheetSubmissionRow = {
      id: row.id,
      created_at: row.created_at,
      source: row.source,
      subject: row.subject ?? '',
      email: row.email ?? '',
      payload: row.payload ?? {},
      metadata: row.metadata ?? {},
    };
    return {
      rowIndex: index + 1,
      createdAt: row.created_at,
      source: row.source,
      subject: row.subject ?? '',
      email: row.email ?? '',
      payload: row.payload ?? {},
      metadata: row.metadata ?? {},
      submissionId: row.id,
      raw: buildHumanSubmissionsRow(sheetRow),
    };
  });
}

export async function fetchSupabaseFormSubmissionRecords(): Promise<
  | { ok: true; records: SheetRecord[]; fetchedAt: string }
  | { ok: false; error: string }
> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: 'Database not configured' };
  }

  const { data, error } = await supabaseAdmin
    .from('form_submissions')
    .select('id, created_at, source, subject, email, payload, metadata')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    return { ok: false, error: error.message };
  }

  return {
    ok: true,
    records: rowsFromSupabase(data ?? []),
    fetchedAt: new Date().toISOString(),
  };
}

export type SheetsFetchResult =
  | {
      ok: true;
      configured: true;
      range: string;
      spreadsheetUrl: string | null;
      headers: string[];
      records: SheetRecord[];
      rowCount: number;
      fetchedAt: string;
    }
  | {
      ok: false;
      configured: boolean;
      range: string;
      headers: string[];
      records: [];
      rowCount: 0;
      error: string;
    };

export async function fetchInteractionSheetRecords(): Promise<SheetsFetchResult> {
  const range = getGoogleSheetsRange();

  if (!isGoogleSheetsConfigured()) {
    return {
      ok: false,
      configured: false,
      range,
      headers: [...DEFAULT_SHEET_HEADERS],
      records: [],
      rowCount: 0,
      error: 'Google Sheets is not configured on the server.',
    };
  }

  try {
    const values = await readGoogleSheetValues();
    const { headers, dataRows } = sheetHeadersFromValues(values);
    const records = parseSheetRows(headers, dataRows);

    return {
      ok: true,
      configured: true,
      range,
      spreadsheetUrl: getGoogleSpreadsheetEditorUrl(),
      headers,
      records,
      rowCount: records.length,
      fetchedAt: new Date().toISOString(),
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Could not read Google Sheet.';
    return {
      ok: false,
      configured: true,
      range,
      headers: [...DEFAULT_SHEET_HEADERS],
      records: [],
      rowCount: 0,
      error: message,
    };
  }
}

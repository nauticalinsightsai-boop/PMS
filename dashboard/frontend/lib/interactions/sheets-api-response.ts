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

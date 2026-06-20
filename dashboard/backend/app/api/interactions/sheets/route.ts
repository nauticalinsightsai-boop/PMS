import { NextResponse } from 'next/server';
import {
  fetchInteractionSheetRecords,
  fetchSupabaseFormSubmissionRecords,
} from '@/lib/interactions/sheets-api-response';
import { DEFAULT_SHEET_HEADERS } from '@/lib/interactions/sheets-records';
import { isGoogleSheetsConfigured } from '@/lib/interactions/google-sheets';
import { getClientSheetsEnvMeta } from '@/lib/google/sheets-env';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Google Sheets when configured; otherwise Supabase form_submissions fallback. */
export async function GET() {
  const sheetsEnv = getClientSheetsEnvMeta();

  if (isGoogleSheetsConfigured()) {
    const sheet = await fetchInteractionSheetRecords();
    if (sheet.ok) {
      return NextResponse.json({
        configured: true,
        dataSource: 'google_sheets',
        sheetsEnv,
        range: sheet.range,
        spreadsheetUrl: sheet.spreadsheetUrl,
        headers: sheet.headers,
        records: sheet.records,
        rowCount: sheet.rowCount,
        fetchedAt: sheet.fetchedAt,
      });
    }
    return NextResponse.json(
      {
        error: sheet.error,
        configured: false,
        dataSource: 'google_sheets',
        sheetsEnv,
        range: sheet.range,
        spreadsheetUrl: null,
        headers: sheet.headers,
        records: [],
        rowCount: 0,
      },
      { status: sheet.configured ? 502 : 503 },
    );
  }

  const fallback = await fetchSupabaseFormSubmissionRecords();
  if (!fallback.ok) {
    return NextResponse.json(
      {
        error: fallback.error,
        configured: false,
        dataSource: 'supabase',
        sheetsEnv,
        range: 'form_submissions',
        spreadsheetUrl: null,
        headers: [...DEFAULT_SHEET_HEADERS],
        records: [],
        rowCount: 0,
      },
      { status: fallback.error === 'Database not configured' ? 503 : 500 },
    );
  }

  return NextResponse.json({
    configured: true,
    dataSource: 'supabase',
    sheetsEnv,
    range: 'form_submissions (Supabase — configure Google Sheets env to mirror rows live)',
    spreadsheetUrl: null,
    headers: [...DEFAULT_SHEET_HEADERS],
    records: fallback.records,
    rowCount: fallback.records.length,
    fetchedAt: fallback.fetchedAt,
  });
}

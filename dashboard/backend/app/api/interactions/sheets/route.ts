import { NextResponse } from 'next/server';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import {
  DEFAULT_SHEET_HEADERS,
  type SheetRecord,
} from '@/lib/interactions/sheets-records';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
  return data.map((row, index) => ({
    rowIndex: index + 1,
    createdAt: row.created_at,
    source: row.source,
    subject: row.subject ?? '',
    email: row.email ?? '',
    payload: row.payload ?? {},
    metadata: row.metadata ?? {},
    submissionId: row.id,
    raw: [
      row.created_at,
      row.source,
      row.subject ?? '',
      row.email ?? '',
      JSON.stringify(row.payload ?? {}),
      JSON.stringify(row.metadata ?? {}),
      row.id,
    ],
  }));
}

/** Dual-source sheets API: Google Sheets when configured on backend; Supabase fallback. */
export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      {
        error: 'Database not configured',
        configured: false,
        sheetsEnv: { source: 'supabase', configured: false },
        range: 'form_submissions',
        spreadsheetUrl: null,
        headers: [...DEFAULT_SHEET_HEADERS],
        records: [],
        rowCount: 0,
      },
      { status: 503 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from('form_submissions')
    .select('id, created_at, source, subject, email, payload, metadata')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
        configured: true,
        sheetsEnv: { source: 'supabase', configured: true },
        range: 'form_submissions',
        spreadsheetUrl: null,
        headers: [...DEFAULT_SHEET_HEADERS],
        records: [],
        rowCount: 0,
      },
      { status: 500 },
    );
  }

  const records = rowsFromSupabase(data ?? []);

  return NextResponse.json({
    configured: true,
    sheetsEnv: { source: 'supabase', configured: true },
    range: 'form_submissions',
    spreadsheetUrl: null,
    headers: [...DEFAULT_SHEET_HEADERS],
    records,
    rowCount: records.length,
    fetchedAt: new Date().toISOString(),
  });
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import {
  sheetRecordsToCsv,
  sheetRecordsToXlsxBuffer,
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

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const format = request.nextUrl.searchParams.get('format') === 'xlsx' ? 'xlsx' : 'csv';

  const { data, error } = await supabaseAdmin
    .from('form_submissions')
    .select('id, created_at, source, subject, email, payload, metadata')
    .order('created_at', { ascending: false })
    .limit(5000);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const records = rowsFromSupabase(data ?? []);
  const stamp = new Date().toISOString().slice(0, 10);

  if (format === 'xlsx') {
    const buffer = sheetRecordsToXlsxBuffer(records);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="interactions-${stamp}.xlsx"`,
      },
    });
  }

  const csv = sheetRecordsToCsv(records);
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="interactions-${stamp}.csv"`,
    },
  });
}

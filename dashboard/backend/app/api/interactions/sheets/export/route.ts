import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  fetchInteractionSheetRecords,
  fetchSupabaseFormSubmissionRecords,
} from '@/lib/interactions/sheets-api-response';
import {
  sheetRecordsToCsv,
  sheetRecordsToXlsxBuffer,
} from '@/lib/interactions/sheets-records';
import { isGoogleSheetsConfigured } from '@/lib/interactions/google-sheets';
import { isSupabaseConfigured } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function loadRecordsForExport() {
  if (isGoogleSheetsConfigured()) {
    const sheet = await fetchInteractionSheetRecords();
    if (sheet.ok) return { ok: true as const, records: sheet.records };
    return { ok: false as const, error: sheet.error, status: sheet.configured ? 502 : 503 };
  }

  if (!isSupabaseConfigured) {
    return { ok: false as const, error: 'Database not configured', status: 503 };
  }

  const fallback = await fetchSupabaseFormSubmissionRecords();
  if (!fallback.ok) {
    return { ok: false as const, error: fallback.error, status: 500 };
  }
  return { ok: true as const, records: fallback.records };
}

export async function GET(request: NextRequest) {
  const format = request.nextUrl.searchParams.get('format') === 'xlsx' ? 'xlsx' : 'csv';
  const loaded = await loadRecordsForExport();

  if (!loaded.ok) {
    return NextResponse.json({ error: loaded.error }, { status: loaded.status });
  }

  const stamp = new Date().toISOString().slice(0, 10);

  if (format === 'xlsx') {
    const buffer = sheetRecordsToXlsxBuffer(loaded.records);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="interactions-${stamp}.xlsx"`,
      },
    });
  }

  const csv = sheetRecordsToCsv(loaded.records);
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="interactions-${stamp}.csv"`,
    },
  });
}

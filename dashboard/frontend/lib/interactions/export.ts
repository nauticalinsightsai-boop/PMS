import * as XLSX from 'xlsx';

import type { FormSubmissionRow } from '@/lib/interactions/types';

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function submissionsToCsv(rows: FormSubmissionRow[]): string {
  const headers = [
    'created_at',
    'source',
    'subject',
    'email',
    'payload_json',
    'metadata_json',
    'submission_id',
    'sheets_synced_at',
    'sheets_sync_error',
    'sheets_sync_attempts',
  ];
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push(
      [
        r.created_at,
        r.source,
        r.subject,
        r.email,
        JSON.stringify(r.payload),
        JSON.stringify(r.metadata),
        r.id,
        r.sheets_synced_at ?? '',
        r.sheets_sync_error ?? '',
        String(r.sheets_sync_attempts),
      ]
        .map((c) => escapeCsvCell(String(c)))
        .join(',')
    );
  }
  return lines.join('\n');
}

export function submissionsToXlsxBuffer(rows: FormSubmissionRow[]): Buffer {
  const data = rows.map((r) => ({
    created_at: r.created_at,
    source: r.source,
    subject: r.subject,
    email: r.email,
    payload_json: JSON.stringify(r.payload),
    metadata_json: JSON.stringify(r.metadata),
    submission_id: r.id,
    sheets_synced_at: r.sheets_synced_at ?? '',
    sheets_sync_error: r.sheets_sync_error ?? '',
    sheets_sync_attempts: r.sheets_sync_attempts,
  }));
  const sheet = XLSX.utils.json_to_sheet(data);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, 'Submissions');
  return Buffer.from(XLSX.write(book, { type: 'buffer', bookType: 'xlsx' }));
}

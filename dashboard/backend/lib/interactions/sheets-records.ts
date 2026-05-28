import * as XLSX from 'xlsx';

import type { InteractionSource } from '@/lib/interactions/types';

export const SHEET_SOURCE_LABEL: Record<InteractionSource, string> = {
  contact: 'Contact',
  subscription: 'Subscription',
  meeting_booking: 'Meeting / booking',
  documentation_request: 'Documentation',
};

export const DEFAULT_SHEET_HEADERS = [
  'created_at',
  'source',
  'subject',
  'email',
  'payload_json',
  'metadata_json',
  'submission_id',
] as const;

export type SheetRecord = {
  rowIndex: number;
  createdAt: string;
  source: string;
  subject: string;
  email: string;
  payload: Record<string, unknown>;
  metadata: Record<string, unknown>;
  submissionId: string;
  raw: string[];
};

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, '_');
}

function safeJsonObject(raw: string): Record<string, unknown> {
  const t = raw.trim();
  if (!t) return {};
  try {
    const v = JSON.parse(t) as unknown;
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
  } catch {
    return { _raw: t };
  }
}

function columnIndex(headers: string[], names: string[], fallback: number): number {
  const norm = headers.map(normalizeHeader);
  for (const name of names) {
    const i = norm.indexOf(name);
    if (i >= 0) return i;
  }
  return fallback;
}

export function sheetHeadersFromValues(values: string[][]): {
  headers: string[];
  dataRows: string[][];
  hasHeader: boolean;
} {
  const hasHeader =
    values.length > 0 &&
    values[0].some((cell) => DEFAULT_SHEET_HEADERS.includes(normalizeHeader(String(cell)) as (typeof DEFAULT_SHEET_HEADERS)[number]));
  const headers = hasHeader ? values[0].map((c) => String(c)) : [...DEFAULT_SHEET_HEADERS];
  const dataRows = hasHeader ? values.slice(1) : values;
  return { headers, dataRows, hasHeader };
}

export function parseSheetRows(headers: string[], dataRows: string[][]): SheetRecord[] {
  const createdIdx = columnIndex(headers, ['created_at', 'created'], 0);
  const sourceIdx = columnIndex(headers, ['source'], 1);
  const subjectIdx = columnIndex(headers, ['subject'], 2);
  const emailIdx = columnIndex(headers, ['email'], 3);
  const payloadIdx = columnIndex(headers, ['payload_json', 'payload'], 4);
  const metadataIdx = columnIndex(headers, ['metadata_json', 'metadata'], 5);
  const idIdx = columnIndex(headers, ['submission_id', 'id'], 6);

  return dataRows
    .map((raw, rowIndex) => {
      const cells = raw.map((c) => String(c ?? ''));
      const nonEmpty = cells.some((c) => c.trim() !== '');
      if (!nonEmpty) return null;

      return {
        rowIndex,
        createdAt: cells[createdIdx] ?? '',
        source: cells[sourceIdx] ?? '',
        subject: cells[subjectIdx] ?? '',
        email: cells[emailIdx] ?? '',
        payload: safeJsonObject(cells[payloadIdx] ?? ''),
        metadata: safeJsonObject(cells[metadataIdx] ?? ''),
        submissionId: cells[idIdx] ?? '',
        raw: cells,
      };
    })
    .filter((r): r is SheetRecord => r !== null);
}

export function sourceLabel(source: string): string {
  const key = source.trim() as InteractionSource;
  return (SHEET_SOURCE_LABEL[key] ?? source) || '—';
}

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function sheetRecordsToCsv(records: SheetRecord[]): string {
  const headers = [...DEFAULT_SHEET_HEADERS];
  const lines = [headers.join(',')];
  for (const r of records) {
    lines.push(
      [
        r.createdAt,
        r.source,
        r.subject,
        r.email,
        JSON.stringify(r.payload),
        JSON.stringify(r.metadata),
        r.submissionId,
      ]
        .map((c) => escapeCsvCell(String(c)))
        .join(',')
    );
  }
  return lines.join('\n');
}

export function sheetRecordsToXlsxBuffer(records: SheetRecord[]): Buffer {
  const data = records.map((r) => ({
    created_at: r.createdAt,
    source: r.source,
    subject: r.subject,
    email: r.email,
    payload_json: JSON.stringify(r.payload),
    metadata_json: JSON.stringify(r.metadata),
    submission_id: r.submissionId,
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Submissions');
  return Buffer.from(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
}

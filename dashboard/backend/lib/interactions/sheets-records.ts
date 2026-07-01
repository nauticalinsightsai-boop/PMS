import * as XLSX from 'xlsx';

import { FORM_SOURCE_LABELS, submissionSourceLabel } from '@pms/booking-crm/form-submissions';
import {
  isHumanSheetHeaders,
  isLegacySheetHeaders,
  payloadFromHumanSheetCells,
  sourceCodeFromLabel,
  SUBMISSIONS_SHEET_HEADERS,
  LEGACY_SHEET_HEADERS,
} from '@pms/booking-crm/sheets-human-row';

export const SHEET_SOURCE_LABEL = FORM_SOURCE_LABELS;

/** Human-readable headers written by the API (default). */
export const DEFAULT_SHEET_HEADERS = [...SUBMISSIONS_SHEET_HEADERS];

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

function humanColumn(headers: string[], cells: string[], ...names: string[]): string {
  const norm = headers.map((h) => h.trim().toLowerCase());
  for (const name of names) {
    const idx = norm.indexOf(name.toLowerCase());
    if (idx >= 0 && cells[idx]?.trim()) return cells[idx].trim();
  }
  return '';
}

export function sheetHeadersFromValues(values: string[][]): {
  headers: string[];
  dataRows: string[][];
  hasHeader: boolean;
} {
  if (values.length === 0) {
    return { headers: [...DEFAULT_SHEET_HEADERS], dataRows: [], hasHeader: false };
  }

  const firstRow = values[0].map((c) => String(c));
  const hasHeader =
    isHumanSheetHeaders(firstRow) ||
    isLegacySheetHeaders(firstRow) ||
    LEGACY_SHEET_HEADERS.some((h) => firstRow.map(normalizeHeader).includes(normalizeHeader(h)));

  const headers = hasHeader ? firstRow : [...DEFAULT_SHEET_HEADERS];
  const dataRows = hasHeader ? values.slice(1) : values;
  return { headers, dataRows, hasHeader };
}

function parseLegacyRow(headers: string[], cells: string[], rowIndex: number): SheetRecord | null {
  const createdIdx = columnIndex(headers, ['created_at', 'created', 'date'], 0);
  const sourceIdx = columnIndex(headers, ['source', 'form_type'], 1);
  const subjectIdx = columnIndex(headers, ['subject', 'subject_line'], 2);
  const emailIdx = columnIndex(headers, ['email'], 3);
  const payloadIdx = columnIndex(headers, ['payload_json', 'payload'], 4);
  const metadataIdx = columnIndex(headers, ['metadata_json', 'metadata'], 5);
  const idIdx = columnIndex(headers, ['submission_id', 'id'], 6);

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
}

function parseHumanRow(headers: string[], cells: string[], rowIndex: number): SheetRecord | null {
  const nonEmpty = cells.some((c) => c.trim() !== '');
  if (!nonEmpty) return null;

  const formTypeLabel = humanColumn(headers, cells, 'form type');
  const source = formTypeLabel ? sourceCodeFromLabel(formTypeLabel) : '';

  return {
    rowIndex,
    createdAt: humanColumn(headers, cells, 'date', 'created_at'),
    source: typeof source === 'string' ? source : formTypeLabel,
    subject: humanColumn(headers, cells, 'subject line', 'subject'),
    email: humanColumn(headers, cells, 'email'),
    payload: payloadFromHumanSheetCells(headers, cells),
    metadata: {},
    submissionId: humanColumn(headers, cells, 'submission id', 'submission_id'),
    raw: cells,
  };
}

export function parseSheetRows(headers: string[], dataRows: string[][]): SheetRecord[] {
  const human = isHumanSheetHeaders(headers);

  return dataRows
    .map((raw, rowIndex) => {
      const cells = raw.map((c) => String(c ?? ''));
      return human
        ? parseHumanRow(headers, cells, rowIndex)
        : parseLegacyRow(headers, cells, rowIndex);
    })
    .filter((r): r is SheetRecord => r !== null);
}

export function sourceLabel(source: string): string {
  return submissionSourceLabel(source);
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
        sourceLabel(r.source),
        r.email,
        String(r.payload.fullName ?? ''),
        String(r.payload.phone ?? ''),
        String(r.payload.company ?? ''),
        String(r.payload.role ?? ''),
        String(r.payload.certName ?? ''),
        String(r.payload.tierLabel ?? ''),
        String(r.payload.regionId ?? ''),
        String(r.payload.pageUrl ?? ''),
        String(r.payload.formLabel ?? ''),
        r.subject,
        String(r.payload.message ?? ''),
        String(r.payload.jobExperienceYears ?? ''),
        String(r.payload.dailyStudyTime ?? ''),
        String(r.payload.originLabel ?? ''),
        String(r.payload.utm_source ?? ''),
        String(r.payload.utm_medium ?? ''),
        String(r.payload.utm_campaign ?? ''),
        '',
        String(r.payload._otherAnswers ?? ''),
        r.submissionId,
      ]
        .map((c) => escapeCsvCell(String(c)))
        .join(','),
    );
  }
  return lines.join('\n');
}

export function sheetRecordsToXlsxBuffer(records: SheetRecord[]): Buffer {
  const data = records.map((r) => ({
    Date: r.createdAt,
    'Form Type': sourceLabel(r.source),
    Email: r.email,
    'Full Name': r.payload.fullName ?? '',
    Phone: r.payload.phone ?? '',
    Company: r.payload.company ?? '',
    'Role / Job Title': r.payload.role ?? '',
    Certification: r.payload.certName ?? '',
    'Tier / Package': r.payload.tierLabel ?? '',
    Region: r.payload.regionId ?? '',
    'Page URL': r.payload.pageUrl ?? '',
    'Form / Placement': r.payload.formLabel ?? '',
    'Subject line': r.subject,
    'Message / Notes': r.payload.message ?? '',
    'Submission ID': r.submissionId,
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Submissions');
  return Buffer.from(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
}

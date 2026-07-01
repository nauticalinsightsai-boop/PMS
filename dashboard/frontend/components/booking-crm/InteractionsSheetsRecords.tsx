'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  RefreshCw,
  Search,
  Download,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Copy,
  Check,
  Radio,
  Layers,
} from 'lucide-react';
import { CTAButton } from '@/components/ui/CTAButton';
import { RefreshIcon } from '@/components/shared/RefreshIcon';
import { GlassCard } from '@/components/ui/GlassCard';
import { SkeletonBar } from '@/components/shared/PageSkeleton';
import EmptyState from '@/components/shared/EmptyState';
import { SheetsRecordsSetupPanel } from '@/components/booking-crm/SheetsRecordsSetupPanel';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useInteractionBroadcast } from '@/hooks/useInteractionBroadcast';
import { useDashboardApiAuth } from '@/hooks/useDashboardApiAuth';
import { fetchDashboardApi } from '@/lib/auth/fetch-dashboard-api';
import type { ClientSheetsEnvMeta } from '@/lib/google/sheets-env';
import {
  sourceLabel,
  type SheetRecord,
} from '@/lib/interactions/sheets-records';
import { originLabelFromPayload } from '@pms/booking-crm/lead-attribution';
import {
  certNameFromPayload,
  formFieldsFromPayload,
  pagePathFromPayload,
  submissionSourceLabel,
} from '@pms/booking-crm/form-submissions';

type SheetsResponse = {
  configured: boolean;
  dataSource?: 'google_sheets' | 'supabase';
  sheetsEnv?: ClientSheetsEnvMeta;
  range: string;
  spreadsheetUrl: string | null;
  records: SheetRecord[];
  rowCount: number;
  fetchedAt?: string;
  error?: string;
};

const PAGE_SIZE = 75;
const AUTO_REFRESH_MS = 45_000;

function formatDate(iso: string): string {
  if (!iso.trim()) return '-';
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

function humanRecordSummary(payload: Record<string, unknown>): string {
  const parts = [
    typeof payload.fullName === 'string' ? payload.fullName : '',
    typeof payload.phone === 'string' ? payload.phone : '',
    typeof payload.message === 'string' ? payload.message : '',
    typeof payload._otherAnswers === 'string' ? payload._otherAnswers : '',
  ].filter(Boolean);
  if (parts.length) return parts.join(' · ');
  return formFieldsFromPayload(payload)
    .slice(0, 4)
    .map((field) => `${field.label}: ${field.value}`)
    .join(' · ');
}

function cellPreview(value: string, max = 100): string {
  const t = value.trim();
  if (t.length <= max) return t || '-';
  return `${t.slice(0, max)}…`;
}

function SheetRecordDetailPanel({
  record,
  onClose,
}: {
  record: SheetRecord;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const formFields = formFieldsFromPayload(record.payload);
  const pagePath = pagePathFromPayload(record.payload);
  const certName = certNameFromPayload(record.payload);
  const origin =
    originLabelFromPayload(record.payload) ||
    (typeof record.payload.originLabel === 'string' ? record.payload.originLabel : '');

  const copyId = async () => {
    if (!record.submissionId) return;
    try {
      await navigator.clipboard.writeText(record.submissionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <SheetHeader className="border-b border-border">
        <span className="text-meta text-muted-foreground">Sheet row</span>
        <SheetTitle>{record.subject || 'Submission'}</SheetTitle>
        <SheetDescription>{formatDate(record.createdAt)}</SheetDescription>
      </SheetHeader>
      <div className="flex-1 space-y-4 overflow-y-auto px-4 text-body-sm">
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-meta text-muted-foreground">Source</dt>
            <dd className="text-foreground">{sourceLabel(record.source)}</dd>
          </div>
          <div>
            <dt className="text-meta text-muted-foreground">Email</dt>
            <dd className="break-all text-foreground">{record.email || '-'}</dd>
          </div>
          <div>
            <dt className="text-meta text-muted-foreground">Page</dt>
            <dd className="break-all text-foreground">{pagePath || '-'}</dd>
          </div>
          <div>
            <dt className="text-meta text-muted-foreground">Certification</dt>
            <dd className="text-foreground">{certName || '-'}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-meta text-muted-foreground">Origin</dt>
            <dd className="text-foreground">{origin || '-'}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="mb-1 text-meta text-muted-foreground">Submission ID</dt>
            <dd className="flex items-center gap-2 break-all font-mono text-meta">
              {record.submissionId || '-'}
              {record.submissionId ? (
                <button
                  type="button"
                  onClick={() => void copyId()}
                  className="inline-flex shrink-0 items-center gap-1 text-brand-orange hover:underline"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              ) : null}
            </dd>
          </div>
        </dl>
        {formFields.length > 0 && (
          <div>
            <h4 className="mb-2 text-label text-foreground">Form details</h4>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {formFields.map((field) => (
                <div key={field.key} className={field.key === 'message' || field.key === 'notes' ? 'sm:col-span-2' : undefined}>
                  <dt className="text-meta text-muted-foreground">{field.label}</dt>
                  <dd className="break-words text-foreground">{field.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        <div>
          <h4 className="mb-2 text-label text-foreground">Form answers</h4>
          <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-muted/80 p-3 font-mono text-meta">
            {JSON.stringify(record.payload, null, 2)}
          </pre>
        </div>
        <div>
          <h4 className="mb-2 text-label text-foreground">Metadata</h4>
          <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-muted/80 p-3 font-mono text-meta">
            {JSON.stringify(record.metadata, null, 2)}
          </pre>
        </div>
      </div>
      <SheetFooter className="border-t border-border sm:flex-row sm:justify-end">
        <CTAButton variant="secondary" size="sm" type="button" onClick={onClose}>
          Close
        </CTAButton>
      </SheetFooter>
    </>
  );
}

export default function InteractionsSheetsRecords() {
  const apiAuth = useDashboardApiAuth();
  const [records, setRecords] = useState<SheetRecord[]>([]);
  const [range, setRange] = useState('');
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);
  const [dataSource, setDataSource] = useState<'google_sheets' | 'supabase' | null>(null);
  const [sheetsEnv, setSheetsEnv] = useState<ClientSheetsEnvMeta | null>(null);
  const [sheetsStatusKnown, setSheetsStatusKnown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [orderAsc, setOrderAsc] = useState(false);
  const [page, setPage] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [exporting, setExporting] = useState<'csv' | 'xlsx' | null>(null);
  const [detail, setDetail] = useState<SheetRecord | null>(null);

  const load = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!apiAuth.ready) {
        if (!opts?.silent) setLoading(false);
        if (apiAuth.needsSignIn) setError('Sign in to view sheet records.');
        else if (apiAuth.needsToken) {
          setError(
            'Dashboard API token missing. Log out and sign in again, or restart npm run dev after setting AUTH_SESSION_SECRET.'
          );
        }
        return;
      }
      if (!opts?.silent) setLoading(true);
      setError(null);
      try {
        const res = await fetchDashboardApi('/api/interactions/sheets', { cache: 'no-store' });
        const data = (await res.json()) as SheetsResponse;
        setSheetsStatusKnown(true);
        if (!res.ok) {
          setError(data.error || 'Could not load Google Sheet data.');
          setRecords([]);
          setConfigured(Boolean(data.configured));
          setDataSource(data.dataSource ?? null);
          setSheetsEnv(data.sheetsEnv ?? null);
          setRange(data.range ?? '');
          setSpreadsheetUrl(data.spreadsheetUrl ?? null);
          return;
        }
        setConfigured(Boolean(data.configured));
        setDataSource(data.dataSource ?? null);
        setSheetsEnv(data.sheetsEnv ?? null);
        setRange(data.range ?? '');
        setSpreadsheetUrl(data.spreadsheetUrl ?? null);
        setRecords(data.records ?? []);
        setFetchedAt(data.fetchedAt ?? new Date().toISOString());
        if (data.configured) setError(null);
      } catch {
        setError('Network error loading sheet records.');
        setRecords([]);
      } finally {
        if (!opts?.silent) setLoading(false);
      }
    },
    [apiAuth.ready, apiAuth.needsSignIn, apiAuth.needsToken]
  );

  useEffect(() => {
    void load();
  }, [load]);

  useInteractionBroadcast(() => {
    void load({ silent: true });
  });

  useEffect(() => {
    if (!autoRefresh || !apiAuth.ready || !configured) return;
    const id = window.setInterval(() => void load({ silent: true }), AUTO_REFRESH_MS);
    return () => window.clearInterval(id);
  }, [autoRefresh, apiAuth.ready, configured, load]);

  useEffect(() => {
    setPage(0);
  }, [q, sourceFilter, orderAsc]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = records;
    if (sourceFilter) {
      list = list.filter((r) => r.source === sourceFilter);
    }
    if (needle) {
      list = list.filter((r) => {
        const pagePath = pagePathFromPayload(r.payload);
        const certName = certNameFromPayload(r.payload);
        const origin = originLabelFromPayload(r.payload);
        return (
          r.subject.toLowerCase().includes(needle) ||
          r.email.toLowerCase().includes(needle) ||
          r.source.toLowerCase().includes(needle) ||
          submissionSourceLabel(r.source).toLowerCase().includes(needle) ||
          r.submissionId.toLowerCase().includes(needle) ||
          pagePath.toLowerCase().includes(needle) ||
          certName.toLowerCase().includes(needle) ||
          origin.toLowerCase().includes(needle) ||
          JSON.stringify(r.payload).toLowerCase().includes(needle)
        );
      });
    }
    const sorted = [...list].sort((a, b) => {
      const ta = Date.parse(a.createdAt) || 0;
      const tb = Date.parse(b.createdAt) || 0;
      return orderAsc ? ta - tb : tb - ta;
    });
    return sorted;
  }, [records, q, sourceFilter, orderAsc]);

  const stats = useMemo(() => {
    const bySource: Record<string, number> = {};
    for (const r of records) {
      const k = r.source || 'unknown';
      bySource[k] = (bySource[k] ?? 0) + 1;
    }
    return { total: records.length, bySource };
  }, [records]);

  const sourceOptions = useMemo(() => {
    const keys = Object.keys(stats.bySource).sort((a, b) =>
      submissionSourceLabel(a).localeCompare(submissionSourceLabel(b)),
    );
    return keys;
  }, [stats.bySource]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const handleExport = async (format: 'csv' | 'xlsx') => {
    if (!apiAuth.ready) return;
    setExporting(format);
    try {
      const res = await fetchDashboardApi(`/api/interactions/sheets/export?format=${format}`);
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error || 'Export failed.');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sheets-records.${format === 'xlsx' ? 'xlsx' : 'csv'}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Network error during export.');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-16">
      <header className="mb-6">
        <h1 className="text-h3 text-foreground flex items-center gap-2">
          <FileSpreadsheet size={24} className="text-brand-orange" />
          Sheets records
        </h1>
        <p className="text-body-sm text-muted-foreground mt-2 max-w-3xl">
          Central view for all website lead submissions — contact forms, newsletters, roadmap popups,
          waitlist modals, and channel forms. Rows sync from the live Google Sheet when configured;
          until then, Supabase submissions appear here as a preview.
        </p>
        {range && dataSource === 'google_sheets' ? (
          <p className="text-meta text-muted-foreground mt-1 font-mono">{range}</p>
        ) : null}
        {fetchedAt && !loading ? (
          <p className="text-meta text-muted-foreground mt-1">
            Last fetched {formatDate(fetchedAt)}
          </p>
        ) : null}
      </header>

      {sheetsStatusKnown ? (
        <SheetsRecordsSetupPanel
          sheetsEnv={sheetsEnv}
          dataSource={dataSource}
          range={range}
          spreadsheetUrl={spreadsheetUrl}
          rowCount={records.length}
          hasRealtimeChannel={Boolean(process.env.NEXT_PUBLIC_INTERACTIONS_REALTIME_CHANNEL?.trim())}
        />
      ) : null}

      {configured && records.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
          <div className="p-3 r-card border border-slate-300/60 dark:border-slate-700/60 bg-card/30">
            <p className="text-meta text-muted-foreground">Total rows</p>
            <p className="text-h4 text-foreground">{stats.total}</p>
          </div>
          {sourceOptions.slice(0, 4).map((src) => (
            <div
              key={src}
              className="p-3 r-card border border-slate-300/60 dark:border-slate-700/60 bg-card/30"
            >
              <p className="text-meta text-muted-foreground truncate">{submissionSourceLabel(src)}</p>
              <p className="text-h4 text-foreground">{stats.bySource[src] ?? 0}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-nowrap gap-3 mt-4 mb-3 items-end overflow-x-auto scrollbar-hide">
        <div className="relative flex-1 min-w-[260px] max-w-md shrink-0">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search email, page, cert, origin, payload…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300/70 dark:border-slate-600 bg-background text-body-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          aria-label="Filter by source"
          className="text-body-sm bg-background border border-slate-300/70 dark:border-slate-600 rounded-lg px-3 py-2 text-foreground min-w-[200px]"
        >
          <option value="" className="bg-background text-foreground">
            All sources
          </option>
          {sourceOptions.map((s) => (
            <option key={s} value={s} className="bg-background text-foreground">
              {submissionSourceLabel(s)} ({stats.bySource[s] ?? 0})
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setOrderAsc((v) => !v)}
          className="inline-flex items-center gap-2 text-label text-brand-orange hover:underline py-2"
        >
          <ArrowUpDown size={14} />
          Date {orderAsc ? 'asc' : 'desc'}
        </button>
        <label className="inline-flex items-center gap-2 text-body-sm text-muted-foreground cursor-pointer py-2">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="rounded"
          />
          Auto-refresh
        </label>
        <CTAButton
          variant="secondary"
          type="button"
          onClick={() => void handleExport('csv')}
          disabled={!!exporting || loading || !configured}
          className="flex items-center gap-2 shrink-0"
        >
          <Download size={16} />
          {exporting === 'csv' ? '…' : 'CSV'}
        </CTAButton>
        <CTAButton
          variant="secondary"
          type="button"
          onClick={() => void handleExport('xlsx')}
          disabled={!!exporting || loading || !configured}
          className="flex items-center gap-2 shrink-0"
        >
          <Download size={16} />
          {exporting === 'xlsx' ? '…' : 'Excel'}
        </CTAButton>
        <CTAButton
          variant="secondary"
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="flex items-center gap-2 shrink-0"
        >
          <RefreshIcon loading={loading} />
          Refresh
        </CTAButton>
      </div>

      <div className="text-meta text-muted-foreground mb-3 flex flex-wrap items-center gap-2">
        <Layers size={14} />
        {loading ? (
          <span>Loading…</span>
        ) : (
          <span>
            {filtered.length} shown · page {page + 1} of {totalPages}
          </span>
        )}
        {process.env.NEXT_PUBLIC_INTERACTIONS_REALTIME_CHANNEL ? (
          <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-400">
            <Radio size={12} /> Live refresh active
          </span>
        ) : null}
        {error && (
          <button
            type="button"
            onClick={() => {
              setError(null);
              void load();
            }}
            className="inline-flex items-center gap-1 px-2 py-1 rounded border border-red-300/60 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-300 text-meta"
            title={error}
          >
            {error}
            <span className="underline shrink-0">Try again</span>
          </button>
        )}
      </div>

      <div className="overflow-x-auto border border-slate-300/60 dark:border-slate-700/60 r-card bg-card/20">
        <table className="min-w-full text-left text-body-sm">
          <thead className="bg-card/80 text-meta uppercase tracking-wide text-muted-foreground sticky top-0 z-[1]">
            <tr>
              <th className="px-3 py-3 font-medium">Date</th>
              <th className="px-3 py-3 font-medium">Source</th>
              <th className="px-3 py-3 font-medium">Subject</th>
              <th className="px-3 py-3 font-medium">Email</th>
              <th className="px-3 py-3 font-medium">Page</th>
              <th className="px-3 py-3 font-medium">Certification</th>
              <th className="px-3 py-3 font-medium">Origin</th>
              <th className="px-3 py-3 font-medium">Details</th>
              <th className="px-3 py-3 font-medium w-[88px]">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/60 text-foreground">
            {loading &&
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 9 }).map((__, j) => (
                    <td key={j} className="px-3 py-3">
                      <SkeletonBar />
                    </td>
                  ))}
                </tr>
              ))}
            {!loading &&
              pageRows.map((r) => (
                <tr key={`${r.rowIndex}-${r.submissionId || r.createdAt}`} className="hover:bg-card/40 align-top">
                  <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                    {formatDate(r.createdAt)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-foreground">{sourceLabel(r.source)}</td>
                  <td className="px-3 py-2 max-w-[200px] text-foreground">{r.subject || '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-foreground">{r.email || '-'}</td>
                  <td className="px-3 py-2 max-w-[120px] text-meta text-muted-foreground">
                    {cellPreview(pagePathFromPayload(r.payload), 32)}
                  </td>
                  <td className="px-3 py-2 max-w-[120px] text-meta text-muted-foreground">
                    {cellPreview(certNameFromPayload(r.payload), 32)}
                  </td>
                  <td className="px-3 py-2 max-w-[160px] text-meta text-muted-foreground">
                    {cellPreview(originLabelFromPayload(r.payload), 48)}
                  </td>
                  <td className="px-3 py-2 max-w-[240px] text-meta line-clamp-2 break-words">
                    {cellPreview(humanRecordSummary(r.payload), 120)}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => setDetail(r)}
                      className="inline-flex items-center gap-1 text-meta text-brand-orange hover:underline"
                    >
                      <Eye size={14} /> Details
                    </button>
                  </td>
                </tr>
              ))}
            {!loading && !error && filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-8">
                  <EmptyState
                    icon={FileSpreadsheet}
                    title={records.length === 0 ? 'No sheet rows yet' : 'No matches'}
                    description={
                      records.length === 0
                        ? dataSource === 'google_sheets'
                          ? 'Submit a form on the public site — a new row will appear here and in your Google Sheet.'
                          : 'Submit a contact form or newsletter on the public site. Rows appear here immediately; connect Google Sheets in the setup panel above to mirror them live.'
                        : 'Clear filters or search.'
                    }
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between mt-4 gap-4">
          <button
            type="button"
            disabled={page <= 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="inline-flex items-center gap-1 text-label text-brand-orange disabled:opacity-40 hover:underline"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="text-meta text-muted-foreground">
            Page {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center gap-1 text-label text-brand-orange disabled:opacity-40 hover:underline"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      <Sheet open={!!detail} onOpenChange={(open) => !open && setDetail(null)}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-hidden sm:max-w-2xl">
          {detail ? <SheetRecordDetailPanel record={detail} onClose={() => setDetail(null)} /> : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

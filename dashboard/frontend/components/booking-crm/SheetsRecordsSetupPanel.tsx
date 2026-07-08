'use client';

import Link from 'next/link';
import { CheckCircle2, Circle, FileSpreadsheet, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import type { ClientSheetsEnvMeta } from '@/lib/google/sheets-env';
import { DEFAULT_SHEET_HEADERS } from '@/lib/interactions/sheets-records';

type Props = {
  sheetsEnv: ClientSheetsEnvMeta | null;
  dataSource: 'google_sheets' | 'supabase' | null;
  range: string;
  spreadsheetUrl: string | null;
  rowCount: number;
  hasRealtimeChannel?: boolean;
  syncing?: boolean;
  verifying?: boolean;
  actionMessage?: string | null;
  onSyncPending?: () => void;
  onVerifyConnection?: () => void;
};

const FORM_SOURCES = [
  'Contact, newsletter, waitlists',
  'PMP / cert roadmap heroes & popups',
  'Register & join-waitlist modals',
  'Lead recovery bar & dialog',
  '/go/* channel landing forms',
  '/go/* portal booking forms (below tiers)',
  'Engagement bookings (meeting_booking)',
] as const;

const SHEET_TABS = [
  'Submissions',
  'Records',
  'All Leads',
  'Contact',
  'Newsletter',
  'Waitlist',
  'Certification Forms',
  'Payments',
] as const;

function Step({
  done,
  label,
  detail,
}: {
  done: boolean;
  label: string;
  detail?: string;
}) {
  return (
    <li className="flex gap-3 text-body-sm">
      {done ? (
        <CheckCircle2 size={18} className="shrink-0 text-green-600 dark:text-green-400 mt-0.5" />
      ) : (
        <Circle size={18} className="shrink-0 text-muted-foreground mt-0.5" />
      )}
      <div>
        <p className={done ? 'text-foreground' : 'text-foreground font-medium'}>{label}</p>
        {detail ? <p className="text-meta text-muted-foreground mt-0.5">{detail}</p> : null}
      </div>
    </li>
  );
}

function SyncActions({
  syncing,
  verifying,
  actionMessage,
  onSyncPending,
  onVerifyConnection,
  showSyncAll,
}: {
  syncing?: boolean;
  verifying?: boolean;
  actionMessage?: string | null;
  onSyncPending?: () => void;
  onVerifyConnection?: () => void;
  showSyncAll?: boolean;
}) {
  if (!onSyncPending && !onVerifyConnection) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {onVerifyConnection ? (
        <button
          type="button"
          disabled={verifying || syncing}
          onClick={onVerifyConnection}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-body-sm font-semibold hover:bg-muted disabled:opacity-50"
        >
          {verifying ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
          Test connection
        </button>
      ) : null}
      {showSyncAll && onSyncPending ? (
        <button
          type="button"
          disabled={syncing || verifying}
          onClick={onSyncPending}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-body-sm font-semibold hover:bg-muted disabled:opacity-50"
        >
          {syncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Backfill older rows to Google Sheets
        </button>
      ) : null}
      {actionMessage ? (
        <p className="w-full text-body-sm text-muted-foreground">{actionMessage}</p>
      ) : null}
    </div>
  );
}

export function SheetsRecordsSetupPanel({
  sheetsEnv,
  dataSource,
  range,
  spreadsheetUrl,
  rowCount,
  hasRealtimeChannel = false,
  syncing,
  verifying,
  actionMessage,
  onSyncPending,
  onVerifyConnection,
}: Props) {
  const connected = dataSource === 'google_sheets' && Boolean(sheetsEnv?.configured);
  const envConfigured = Boolean(sheetsEnv?.configured);
  const hasCredentials =
    sheetsEnv?.credentialSource === 'file' || sheetsEnv?.credentialSource === 'base64';
  const hasSpreadsheet = Boolean(sheetsEnv?.hasSpreadsheetId);
  const hasSaEmail = Boolean(sheetsEnv?.serviceAccountEmail);

  if (connected) {
    return (
      <GlassCard className="mb-6 border border-green-300/50 dark:border-green-800/50 bg-green-50/30 dark:bg-green-950/10 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <FileSpreadsheet size={22} className="shrink-0 text-green-700 dark:text-green-400" />
            <div>
              <h2 className="text-h5 text-foreground">Google Sheets connected</h2>
              <p className="text-body-sm text-muted-foreground mt-1">
                New form submissions sync to Google Sheets automatically on submit — no manual step.
                Every lead appends to <strong>Submissions</strong>, <strong>Records</strong>,{' '}
                <strong>All Leads</strong>, and the matching ops tab (Contact, Newsletter, Waitlist,
                etc.). Certification leads also go to <strong>Certification Forms</strong>. Payments go
                to <strong>Payments</strong>. This table mirrors the live sheet ({rowCount} row
                {rowCount === 1 ? '' : 's'}).
              </p>
              <p className="text-meta text-muted-foreground mt-2">
                In Google Sheets: check <strong>All Leads</strong> or the form-specific tab (e.g.{' '}
                Newsletter), or <strong>Submissions</strong> for the full row. Refresh the browser tab
                if the sheet was already open.
              </p>
              <dl className="mt-3 grid gap-2 text-meta sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Range</dt>
                  <dd className="font-mono text-foreground">{range}</dd>
                </div>
                {sheetsEnv?.serviceAccountEmail ? (
                  <div>
                    <dt className="text-muted-foreground">Service account</dt>
                    <dd className="break-all text-foreground">{sheetsEnv.serviceAccountEmail}</dd>
                  </div>
                ) : null}
              </dl>
              <SyncActions
                syncing={syncing}
                verifying={verifying}
                actionMessage={actionMessage}
                onSyncPending={onSyncPending}
                onVerifyConnection={onVerifyConnection}
              />
            </div>
          </div>
          {spreadsheetUrl ? (
            <a
              href={spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-body-sm text-foreground hover:bg-muted transition-colors"
            >
              Open Google Sheet
            </a>
          ) : null}
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="mb-6 border border-amber-300/60 dark:border-amber-800/40 bg-amber-50/20 dark:bg-amber-950/10 p-5">
      <div className="flex gap-3">
        <FileSpreadsheet size={22} className="shrink-0 text-amber-800 dark:text-amber-300" />
        <div className="min-w-0 flex-1">
          <h2 className="text-h5 text-foreground">Google Sheets — configure here</h2>
          <p className="text-body-sm text-muted-foreground mt-1">
            This page is the dashboard view of your lead spreadsheet. Every public form posts to
            Supabase first, then appends to Google Sheets tabs when the server env is set on Railway.
          </p>

          {dataSource === 'supabase' && rowCount > 0 ? (
            <p className="mt-2 text-body-sm text-amber-900 dark:text-amber-200">
              Preview: showing {rowCount} row{rowCount === 1 ? '' : 's'} from Supabase. Set{' '}
              <code className="text-foreground">GOOGLE_SHEETS_*</code> on the dashboard API service,
              redeploy, then use <strong>Backfill older rows</strong> once for submissions saved before
              Sheets was connected.
            </p>
          ) : null}

          {sheetsEnv?.parseError ? (
            <p className="mt-3 flex items-start gap-2 rounded-md border border-red-300/60 bg-red-50/50 dark:bg-red-950/20 px-3 py-2 text-body-sm text-red-800 dark:text-red-200">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {sheetsEnv.parseError}
            </p>
          ) : null}

          <SyncActions
            syncing={syncing}
            verifying={verifying}
            actionMessage={actionMessage}
            onSyncPending={envConfigured ? onSyncPending : undefined}
            onVerifyConnection={onVerifyConnection}
            showSyncAll={envConfigured}
          />

          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-label text-foreground mb-2">Setup checklist</h3>
              <ol className="space-y-3 list-none">
                <Step
                  done={hasCredentials && !sheetsEnv?.parseError}
                  label="Service account JSON"
                  detail="Local: GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH · Production: GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64"
                />
                <Step
                  done={hasSpreadsheet}
                  label="Spreadsheet ID + range"
                  detail="GOOGLE_SHEETS_SPREADSHEET_ID and GOOGLE_SHEETS_RANGE=Submissions!A:W"
                />
                <Step
                  done={hasSaEmail}
                  label="Share sheet with service account"
                  detail={
                    sheetsEnv?.serviceAccountEmail
                      ? `Editor access for ${sheetsEnv.serviceAccountEmail}`
                      : 'Grant Editor on the spreadsheet to the service account client_email'
                  }
                />
                <Step
                  done={connected}
                  label="Sheet tabs"
                  detail={SHEET_TABS.join(' · ')}
                />
                <Step
                  done={connected}
                  label="Submissions tab headers (row 1)"
                  detail={DEFAULT_SHEET_HEADERS.slice(0, 6).join(' · ') + ' …'}
                />
                <Step
                  done={hasRealtimeChannel}
                  label="Optional: live dashboard refresh"
                  detail="INTERACTIONS_REALTIME_CHANNEL + NEXT_PUBLIC_INTERACTIONS_REALTIME_CHANNEL"
                />
              </ol>
            </div>

            <div>
              <h3 className="text-label text-foreground mb-2">Forms that sync to this sheet</h3>
              <ul className="space-y-1.5 text-body-sm text-muted-foreground">
                {FORM_SOURCES.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-brand-orange">·</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-meta text-muted-foreground">
                Full pipeline:{' '}
                <Link
                  href="/dashboard/booking-crm/interactions/inbox"
                  className="text-brand-orange hover:underline"
                >
                  Interaction Inbox
                </Link>{' '}
                (sync status per row) · Setup guide:{' '}
                <code className="text-foreground">docs/guides/GOOGLE_SHEETS_SETUP.md</code>
              </p>
              {sheetsEnv?.hint ? (
                <p className="mt-3 rounded-md bg-muted/60 px-3 py-2 font-mono text-meta text-foreground">
                  {sheetsEnv.hint}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

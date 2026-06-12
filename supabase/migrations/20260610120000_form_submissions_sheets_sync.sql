-- Align form_submissions with runtime Sheets sync fields (dashboard/backend/lib/interactions/sheets-sync.ts)

alter table public.form_submissions
  add column if not exists sheets_synced_at timestamptz,
  add column if not exists sheets_sync_error text,
  add column if not exists sheets_sync_attempts smallint not null default 0;

create index if not exists idx_form_submissions_sheets_sync_failed
  on public.form_submissions (created_at desc)
  where sheets_sync_error is not null and sheets_synced_at is null;

create index if not exists idx_form_submissions_source
  on public.form_submissions (source);

create index if not exists idx_form_submissions_subject_lower
  on public.form_submissions (lower(subject));

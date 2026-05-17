-- PMS initial schema

create table if not exists public.website_data (
  id uuid primary key default gen_random_uuid(),
  field_key text unique not null,
  content jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null default 'contact',
  subject text,
  email text,
  payload jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  sheets_status text not null default 'na'
    check (sheets_status in ('synced', 'failed', 'pending', 'na'))
);

create index if not exists idx_form_submissions_created_at
  on public.form_submissions (created_at desc);

create index if not exists idx_website_data_published
  on public.website_data (is_published)
  where is_published = true;

alter table public.website_data enable row level security;
alter table public.form_submissions enable row level security;

-- Public read of published website content
create policy "Published website data is readable"
  on public.website_data for select
  using (is_published = true);

-- Authenticated users can manage website data
create policy "Authenticated users manage website data"
  on public.website_data for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Anyone can submit contact/forms (insert only)
create policy "Public can submit forms"
  on public.form_submissions for insert
  with check (true);

-- Authenticated users can read submissions (dashboard)
create policy "Authenticated users read submissions"
  on public.form_submissions for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users update submissions"
  on public.form_submissions for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Optional catalogue mirror for admin / sync (Phase 1 JSON remains source of truth on site)

create table if not exists public.catalogue_meta (
  id text primary key default 'default',
  version int not null default 1,
  imported_at timestamptz,
  source_file text,
  offering_count int,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.course_offerings (
  offering_id text primary key,
  family_id text not null,
  course_name text not null,
  tier_id text not null,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.catalogue_meta enable row level security;
alter table public.course_offerings enable row level security;

create policy "Catalogue meta readable"
  on public.catalogue_meta for select using (true);

create policy "Offerings readable"
  on public.course_offerings for select using (true);

create policy "Service role manages catalogue meta"
  on public.catalogue_meta for all using (auth.role() = 'service_role');

create policy "Service role manages offerings"
  on public.course_offerings for all using (auth.role() = 'service_role');

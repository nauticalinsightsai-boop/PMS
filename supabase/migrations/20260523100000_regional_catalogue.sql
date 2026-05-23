-- Regional availability catalogue + profiles + orders

create table if not exists public.regions (
  id text primary key,
  label text not null,
  default_price_display text,
  can_change_region boolean not null default true,
  mismatch_rule text,
  checkout_rule text,
  website_message text,
  sort_order int not null default 0
);

create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  region_id text references public.regions (id),
  gcc_country text,
  residence_country text,
  billing_country text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  offering_id text not null,
  region_id text not null,
  email text not null,
  usd_cents int not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'cancelled')),
  stripe_session_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.verification_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  region_id text,
  residence_country text,
  billing_country text,
  verified boolean not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_orders_email on public.orders (email);
create index if not exists idx_orders_status on public.orders (status);

alter table public.regions enable row level security;
alter table public.user_profiles enable row level security;
alter table public.orders enable row level security;
alter table public.verification_logs enable row level security;

create policy "Regions are readable by everyone"
  on public.regions for select using (true);

create policy "Users read own profile"
  on public.user_profiles for select using (auth.uid() = id);

create policy "Users update own profile"
  on public.user_profiles for update using (auth.uid() = id);

create policy "Users insert own profile"
  on public.user_profiles for insert with check (auth.uid() = id);

create policy "Authenticated read orders"
  on public.orders for select using (auth.role() = 'authenticated');

create policy "Service role manages orders"
  on public.orders for all using (auth.role() = 'service_role');

create policy "Authenticated read verification logs"
  on public.verification_logs for select using (auth.role() = 'authenticated');

-- Shareable mentor-led scholarship reservations and analytics events.
-- Service-role only: browser clients never hold a direct table grant.
-- Rollback: drop table public.scholarship_events; drop table public.scholarship_reservations;
-- (events first because of the optional FK to reservations).

create table if not exists public.scholarship_reservations (
  id uuid primary key default gen_random_uuid(),
  visitor_hash text not null
    check (visitor_hash ~ '^[a-f0-9]{64}$'),
  offering_id text not null,
  site_cert_id text not null,
  tier_slug text not null
    check (tier_slug in ('professional', 'mastery')),
  tier_id text not null,
  market text not null
    check (market in ('gcc', 'global')),
  country_code text not null
    check (country_code ~ '^[A-Z]{2}$'),
  delivery_mode text not null default 'mentor_led'
    check (delivery_mode = 'mentor_led'),
  currency text not null
    check (currency ~ '^[a-z]{3}$'),
  base_unit_amount integer not null
    check (base_unit_amount > 0),
  final_unit_amount integer not null
    check (final_unit_amount > 0 and final_unit_amount < base_unit_amount),
  base_usd_cents integer not null
    check (base_usd_cents > 0),
  final_usd_cents integer not null
    check (final_usd_cents > 0 and final_usd_cents < base_usd_cents),
  discount_bps integer not null default 1500
    check (discount_bps = 1500),
  status text not null default 'active'
    check (status in ('active', 'checkout_open', 'expired', 'completed', 'rejected')),
  expires_at timestamptz not null,
  stripe_session_id text unique,
  idempotency_key text not null unique,
  expired_at timestamptz,
  completed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- One durable reservation identity per visitor + offering + market.
  unique (visitor_hash, offering_id, market)
);

create index if not exists idx_scholarship_reservations_expiry
  on public.scholarship_reservations (expires_at)
  where status in ('active', 'checkout_open');

create index if not exists idx_scholarship_reservations_status_updated
  on public.scholarship_reservations (status, updated_at desc);

create table if not exists public.scholarship_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null
    check (
      event_name in (
        'scholarship_page_view',
        'reservation_started',
        'checkout_started',
        'expired',
        'completed'
      )
    ),
  reservation_id uuid
    references public.scholarship_reservations (id)
    on delete set null,
  offering_id text not null,
  market text not null
    check (market in ('gcc', 'global')),
  dedupe_key text unique,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_scholarship_events_created
  on public.scholarship_events (created_at desc);

create index if not exists idx_scholarship_events_offering_market
  on public.scholarship_events (offering_id, market, created_at desc);

alter table public.scholarship_reservations enable row level security;
alter table public.scholarship_events enable row level security;
alter table public.scholarship_reservations force row level security;
alter table public.scholarship_events force row level security;

revoke all on public.scholarship_reservations from anon, authenticated;
revoke all on public.scholarship_events from anon, authenticated;

grant all on public.scholarship_reservations to service_role;
grant all on public.scholarship_events to service_role;

-- No anon/authenticated policies: website APIs use service_role via supabaseAdmin.
comment on table public.scholarship_reservations is
  'Visitor-bound mentor-led scholarship price reservations (15 min, SCH15). Service role only.';
comment on table public.scholarship_events is
  'Deduped scholarship funnel events without PII. Service role only.';

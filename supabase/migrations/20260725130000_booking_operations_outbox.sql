-- Durable Calendly lifecycle and retryable operational deliveries.
-- This migration is intentionally service-role only. It is not applied by this packet.

create table if not exists public.calendly_booking_handoffs (
  session_id text primary key
    check (session_id ~ '^bks_[A-Za-z0-9._:-]{16,124}$'),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz,
  page_path text,
  channel text,
  funnel_label text,
  analytics_consent boolean not null default false,
  marketing_consent boolean not null default false,
  analytics_client_id text,
  attribution jsonb not null default '{}'::jsonb
);

create index if not exists idx_calendly_booking_handoffs_expires
  on public.calendly_booking_handoffs (expires_at);

create table if not exists public.calendly_bookings (
  id uuid primary key default gen_random_uuid(),
  invitee_uri text not null unique,
  event_uri text not null,
  invitee_email text,
  status text not null
    check (status in ('active', 'canceled')),
  scheduled_at timestamptz,
  canceled_at timestamptz,
  rescheduled_from_invitee_uri text,
  rescheduled_to_invitee_uri text,
  handoff_session_id text
    references public.calendly_booking_handoffs (session_id)
    on delete set null,
  conversion_event_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_calendly_bookings_status_scheduled
  on public.calendly_bookings (status, scheduled_at);

create table if not exists public.calendly_webhook_events (
  event_key text primary key,
  event_type text not null
    check (event_type in ('invitee.created', 'invitee.canceled')),
  invitee_uri text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

create table if not exists public.operations_outbox (
  id uuid primary key default gen_random_uuid(),
  aggregate_type text not null,
  aggregate_id text not null,
  destination text not null
    check (
      destination in (
        'google_sheets',
        'admin_email',
        'ga4_booking',
        'meta_schedule'
      )
    ),
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'delivered', 'failed', 'dead_letter')),
  attempts integer not null default 0 check (attempts >= 0),
  last_error text,
  next_attempt_at timestamptz default now(),
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (aggregate_type, aggregate_id, destination, event_type)
);

create index if not exists idx_operations_outbox_retry
  on public.operations_outbox (next_attempt_at, created_at)
  where status in ('pending', 'failed');

alter table public.calendly_booking_handoffs enable row level security;
alter table public.calendly_bookings enable row level security;
alter table public.calendly_webhook_events enable row level security;
alter table public.operations_outbox enable row level security;

alter table public.calendly_booking_handoffs force row level security;
alter table public.calendly_bookings force row level security;
alter table public.calendly_webhook_events force row level security;
alter table public.operations_outbox force row level security;

revoke all on public.calendly_booking_handoffs from anon, authenticated;
revoke all on public.calendly_bookings from anon, authenticated;
revoke all on public.calendly_webhook_events from anon, authenticated;
revoke all on public.operations_outbox from anon, authenticated;

grant all on public.calendly_booking_handoffs to service_role;
grant all on public.calendly_bookings to service_role;
grant all on public.calendly_webhook_events to service_role;
grant all on public.operations_outbox to service_role;

create or replace function public.process_calendly_webhook(
  p_event_key text,
  p_event_type text,
  p_invitee_uri text,
  p_event_uri text,
  p_invitee_email text,
  p_status text,
  p_scheduled_at timestamptz,
  p_canceled_at timestamptz,
  p_old_invitee_uri text,
  p_new_invitee_uri text,
  p_handoff_session_id text,
  p_conversion_event_id text
)
returns table (
  booking_id uuid,
  duplicate boolean,
  ga4_enqueued boolean,
  meta_enqueued boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rows integer := 0;
  v_booking_id uuid;
  v_handoff_id text;
  v_analytics_consent boolean := false;
  v_marketing_consent boolean := false;
  v_ga4_enqueued boolean := false;
  v_meta_enqueued boolean := false;
begin
  insert into public.calendly_webhook_events (
    event_key,
    event_type,
    invitee_uri
  )
  values (
    p_event_key,
    p_event_type,
    p_invitee_uri
  )
  on conflict (event_key) do nothing;

  get diagnostics v_rows = row_count;

  if v_rows = 0 then
    select id
      into v_booking_id
      from public.calendly_bookings
     where invitee_uri = p_invitee_uri;

    return query select v_booking_id, true, false, false;
    return;
  end if;

  select session_id, analytics_consent, marketing_consent
    into v_handoff_id, v_analytics_consent, v_marketing_consent
    from public.calendly_booking_handoffs
   where session_id = p_handoff_session_id
     and expires_at >= now()
   limit 1;

  insert into public.calendly_bookings (
    invitee_uri,
    event_uri,
    invitee_email,
    status,
    scheduled_at,
    canceled_at,
    rescheduled_from_invitee_uri,
    rescheduled_to_invitee_uri,
    handoff_session_id,
    conversion_event_id
  )
  values (
    p_invitee_uri,
    p_event_uri,
    p_invitee_email,
    p_status,
    p_scheduled_at,
    p_canceled_at,
    p_old_invitee_uri,
    p_new_invitee_uri,
    v_handoff_id,
    case
      when p_event_type = 'invitee.created' and p_status = 'active'
        then p_conversion_event_id
      else null
    end
  )
  on conflict (invitee_uri) do update set
    event_uri = excluded.event_uri,
    invitee_email = coalesce(excluded.invitee_email, public.calendly_bookings.invitee_email),
    status = excluded.status,
    scheduled_at = coalesce(excluded.scheduled_at, public.calendly_bookings.scheduled_at),
    canceled_at = excluded.canceled_at,
    rescheduled_from_invitee_uri = coalesce(
      excluded.rescheduled_from_invitee_uri,
      public.calendly_bookings.rescheduled_from_invitee_uri
    ),
    rescheduled_to_invitee_uri = coalesce(
      excluded.rescheduled_to_invitee_uri,
      public.calendly_bookings.rescheduled_to_invitee_uri
    ),
    handoff_session_id = coalesce(
      excluded.handoff_session_id,
      public.calendly_bookings.handoff_session_id
    ),
    conversion_event_id = coalesce(
      excluded.conversion_event_id,
      public.calendly_bookings.conversion_event_id
    ),
    updated_at = now()
  returning id into v_booking_id;

  if p_event_type = 'invitee.created' and p_old_invitee_uri is not null then
    update public.calendly_bookings
       set status = 'canceled',
           canceled_at = coalesce(canceled_at, now()),
           rescheduled_to_invitee_uri = p_invitee_uri,
           updated_at = now()
     where invitee_uri = p_old_invitee_uri;
  end if;

  if p_event_type = 'invitee.canceled' and p_new_invitee_uri is not null then
    update public.calendly_bookings
       set rescheduled_to_invitee_uri = p_new_invitee_uri,
           updated_at = now()
     where id = v_booking_id;
  end if;

  if (
    p_event_type = 'invitee.created'
    and p_status = 'active'
    and p_conversion_event_id is not null
  ) then
    if coalesce(v_analytics_consent, false) then
      insert into public.operations_outbox (
        aggregate_type,
        aggregate_id,
        destination,
        event_type,
        payload
      )
      values (
        'booking',
        v_booking_id::text,
        'ga4_booking',
        'booking_confirmed',
        jsonb_build_object(
          'booking_id', v_booking_id,
          'event_id', p_conversion_event_id
        )
      )
      on conflict (aggregate_type, aggregate_id, destination, event_type)
      do nothing;
      get diagnostics v_rows = row_count;
      v_ga4_enqueued := v_rows > 0;
    end if;

    if coalesce(v_marketing_consent, false) then
      insert into public.operations_outbox (
        aggregate_type,
        aggregate_id,
        destination,
        event_type,
        payload
      )
      values (
        'booking',
        v_booking_id::text,
        'meta_schedule',
        'Schedule',
        jsonb_build_object(
          'booking_id', v_booking_id,
          'event_id', p_conversion_event_id
        )
      )
      on conflict (aggregate_type, aggregate_id, destination, event_type)
      do nothing;
      get diagnostics v_rows = row_count;
      v_meta_enqueued := v_rows > 0;
    end if;
  end if;

  if v_handoff_id is not null then
    update public.calendly_booking_handoffs
       set used_at = coalesce(used_at, now())
     where session_id = v_handoff_id;
  end if;

  update public.calendly_webhook_events
     set processed_at = now()
   where event_key = p_event_key;

  return query
    select v_booking_id, false, v_ga4_enqueued, v_meta_enqueued;
end;
$$;

revoke all on function public.process_calendly_webhook(
  text,
  text,
  text,
  text,
  text,
  text,
  timestamptz,
  timestamptz,
  text,
  text,
  text,
  text
) from public, anon, authenticated;

grant execute on function public.process_calendly_webhook(
  text,
  text,
  text,
  text,
  text,
  text,
  timestamptz,
  timestamptz,
  text,
  text,
  text,
  text
) to service_role;

create or replace function public.claim_operations_outbox(
  p_limit integer default 25
)
returns setof public.operations_outbox
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  return query
    with due as (
      select candidate.id
        from public.operations_outbox as candidate
       where candidate.status in ('pending', 'failed')
         and candidate.next_attempt_at <= now()
       order by
         candidate.next_attempt_at asc,
         candidate.created_at asc,
         candidate.id asc
       for update skip locked
       limit least(greatest(coalesce(p_limit, 25), 1), 50)
    )
    update public.operations_outbox as claimed
       set status = 'processing',
           attempts = claimed.attempts + 1,
           updated_at = now()
      from due
     where claimed.id = due.id
    returning claimed.*;
end;
$$;

revoke all on function public.claim_operations_outbox(integer)
  from public, anon, authenticated;

grant execute on function public.claim_operations_outbox(integer)
  to service_role;

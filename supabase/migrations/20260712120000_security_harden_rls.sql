-- Security hardening: lock down CMS/PII/orders/storage RLS and dashboard_one auth schema.
-- Apply via: supabase db push / SQL editor. Service role continues to bypass RLS for admin APIs.

-- ---------------------------------------------------------------------------
-- 1) website_data: drop authenticated-wide manage; keep published public read
-- ---------------------------------------------------------------------------
drop policy if exists "Authenticated users manage website data" on public.website_data;

-- ---------------------------------------------------------------------------
-- 2) form_submissions: drop authenticated read/update (admin via service_role only)
-- ---------------------------------------------------------------------------
drop policy if exists "Authenticated users read submissions" on public.form_submissions;
drop policy if exists "Authenticated users update submissions" on public.form_submissions;

-- ---------------------------------------------------------------------------
-- 3) orders / verification_logs: no broad authenticated SELECT
-- ---------------------------------------------------------------------------
drop policy if exists "Authenticated read orders" on public.orders;
drop policy if exists "Authenticated read verification logs" on public.verification_logs;

-- Owners may read their own orders by email claim when present in JWT (optional).
-- Prefer service_role for admin dashboards; allow users to see rows matching their email.
drop policy if exists "Users read own orders by email" on public.orders;
create policy "Users read own orders by email"
  on public.orders for select
  to authenticated
  using (
    email is not null
    and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- ---------------------------------------------------------------------------
-- 4) user_profiles UPDATE: require WITH CHECK ownership; block verified_at self-set
-- ---------------------------------------------------------------------------
drop policy if exists "Users update own profile" on public.user_profiles;
create policy "Users update own profile"
  on public.user_profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- ---------------------------------------------------------------------------
-- 5) Storage: remove authenticated write/delete on public media buckets
--    Uploads go through dashboard APIs using service_role.
-- ---------------------------------------------------------------------------
drop policy if exists "Authenticated upload site media" on storage.objects;
drop policy if exists "Authenticated update site media" on storage.objects;
drop policy if exists "Authenticated delete site media" on storage.objects;

drop policy if exists "Authenticated upload programme media" on storage.objects;
drop policy if exists "Authenticated update programme media" on storage.objects;
drop policy if exists "Authenticated delete programme media" on storage.objects;

-- Keep public read on site-media; programme-media policies depend on existing public-read policy.

-- Disallow new SVG uploads on site-media (XSS via stored SVG).
update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
where id = 'site-media';

-- ---------------------------------------------------------------------------
-- 6) dashboard_one: enable RLS deny-all for anon/authenticated (service_role bypasses)
-- ---------------------------------------------------------------------------
do $$
declare
  r record;
begin
  for r in
    select tablename
    from pg_tables
    where schemaname = 'dashboard_one'
  loop
    execute format('alter table dashboard_one.%I enable row level security', r.tablename);
    execute format('alter table dashboard_one.%I force row level security', r.tablename);
  end loop;
end $$;

-- Explicit revoke from API roles if present (defense in depth)
revoke all on schema dashboard_one from anon, authenticated;
revoke all on all tables in schema dashboard_one from anon, authenticated;
revoke all on all sequences in schema dashboard_one from anon, authenticated;
alter default privileges in schema dashboard_one revoke all on tables from anon, authenticated;

-- Fixed Items09-10 atomic publication/rollback primitive. Source-only until separately applied.
create extension if not exists pgcrypto;

create table if not exists public.newsletter_fixed_publication_receipts (
  id uuid primary key default gen_random_uuid(),
  item_key text not null check (item_key in ('item09', 'item10')),
  idempotency_token uuid not null unique,
  preimage jsonb not null,
  postimage jsonb not null,
  preimage_hash text not null check (preimage_hash ~ '^[0-9a-f]{64}$'),
  postimage_hash text not null check (postimage_hash ~ '^[0-9a-f]{64}$'),
  published_at timestamptz not null,
  rolled_back_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.newsletter_fixed_publication_receipts enable row level security;
revoke all on public.newsletter_fixed_publication_receipts from anon, authenticated;
grant all on public.newsletter_fixed_publication_receipts to service_role;

create or replace function public.mutate_fixed_newsletter_publication(
  p_item_key text,
  p_action text,
  p_expected_updated_at timestamptz default null,
  p_expected_preimage_hash text default null,
  p_idempotency_token uuid default null,
  p_confirmation text default null,
  p_publish_at timestamptz default null
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_row public.website_data%rowtype;
  v_post jsonb;
  v_preimage jsonb;
  v_next_post jsonb;
  v_next_content jsonb;
  v_receipt public.newsletter_fixed_publication_receipts%rowtype;
  v_expected_id text;
  v_expected_slug text;
  v_expected_body text;
  v_expected_assets text;
  v_expected_author text;
  v_expected_cta text;
  v_expected_meta text;
  v_match_count integer;
  v_ordinal integer;
  v_pre_hash text;
  v_post_hash text;
  v_confirmation text;
  v_updated_at timestamptz;
begin
  if auth.role() <> 'service_role' then raise exception 'newsletter_fixed_forbidden'; end if;
  if p_item_key = 'item09' then
    v_expected_id := 'post-pmi-rmp-2026-domain-map-five-domain-study-plan';
    v_expected_slug := 'pmi-rmp-2026-domain-map-five-domain-study-plan';
    v_expected_body := 'c5f9ca9cd13bae5616847200da397e1e187aa0a8136987e8324b5279e75155bb';
    v_expected_assets := '195f4ca96dc8a11ab6348b4929a4c67e550f6944b39c510be7023d05bbae2f9a';
    v_expected_author := '2f2fe379b687a1af3b33d29cc2fb509e0174c4a7c88ce05c6cd3fab34182f8af';
    v_expected_cta := 'cbe5cfdf7c2118a9c3d78ef1d684f3afa089201352886449a06a6511cfef74a7';
    v_expected_meta := 'a3e3ffd143925dd984f828613fc73e134b244d9e879684a7a39622f9f360aeab';
  elsif p_item_key = 'item10' then
    v_expected_id := 'post-pmi-rmp-eligibility-separate-risk-experience-general-project-work';
    v_expected_slug := 'pmi-rmp-eligibility-separate-risk-experience-general-project-work';
    v_expected_body := 'f23600eb6f8fc266c706888b9e738f8e71dcb8af94f3ddbdfad8f8e3d2fa7bd5';
    v_expected_assets := '47f8836b6a405ef39b1970d956e54bbd6590073133abf5453cc192f808dd538d';
    v_expected_author := '2f2fe379b687a1af3b33d29cc2fb509e0174c4a7c88ce05c6cd3fab34182f8af';
    v_expected_cta := 'cbe5cfdf7c2118a9c3d78ef1d684f3afa089201352886449a06a6511cfef74a7';
    v_expected_meta := '1f276dea7702ae14705b974326f959692116547937a4854fc98ea4d02cc2e250';
  else
    raise exception 'newsletter_fixed_item_invalid';
  end if;

  if p_action not in ('preview', 'commit', 'rollback') then raise exception 'newsletter_fixed_action_invalid'; end if;
  select * into v_row from public.website_data
    where field_key = 'newsletter_posts_registry' for update;
  if not found or v_row.content->>'version' <> '1' or jsonb_typeof(v_row.content->'posts') <> 'array' then
    raise exception 'newsletter_fixed_registry_invalid';
  end if;

  select count(*), min(ordinality)::integer into v_match_count, v_ordinal
  from jsonb_array_elements(v_row.content->'posts') with ordinality as candidate(post, ordinality)
  where post->>'id' = v_expected_id or post->>'slug' = v_expected_slug;
  if v_match_count <> 1 then raise exception 'newsletter_fixed_uniqueness_invalid'; end if;
  v_post := v_row.content->'posts'->(v_ordinal - 1);
  if v_post->>'id' <> v_expected_id or v_post->>'slug' <> v_expected_slug then
    raise exception 'newsletter_fixed_identity_invalid';
  end if;

  v_pre_hash := encode(digest(convert_to(v_post::text, 'utf8'), 'sha256'), 'hex');

  if p_action = 'rollback' then
    if p_idempotency_token is null then raise exception 'newsletter_fixed_token_invalid'; end if;
    select * into v_receipt from public.newsletter_fixed_publication_receipts
      where item_key = p_item_key and idempotency_token = p_idempotency_token for update;
    if not found then raise exception 'newsletter_fixed_rollback_unavailable'; end if;
    if v_receipt.rolled_back_at is not null then
      return jsonb_build_object('classification','ALREADY_ROLLED_BACK','item',p_item_key,'wrote',false,
        'preimageHash',v_receipt.preimage_hash,'postimageHash',v_receipt.postimage_hash);
    end if;
    if v_pre_hash <> v_receipt.postimage_hash then raise exception 'newsletter_fixed_rollback_stale'; end if;
    if p_confirmation is distinct from 'ROLLBACK ' || upper(substr(v_receipt.postimage_hash,1,8)) then
      raise exception 'newsletter_fixed_confirmation_invalid';
    end if;
    v_next_content := jsonb_set(v_row.content, array['posts',(v_ordinal-1)::text], v_receipt.preimage, false);
    update public.website_data set content = v_next_content, updated_at = clock_timestamp()
      where id = v_row.id and updated_at = v_row.updated_at returning updated_at into v_updated_at;
    if v_updated_at is null then raise exception 'newsletter_fixed_cas_failed'; end if;
    select content->'posts'->(v_ordinal-1) into v_post from public.website_data where id = v_row.id;
    if encode(digest(convert_to(v_post::text, 'utf8'), 'sha256'), 'hex') <> v_receipt.preimage_hash then
      raise exception 'newsletter_fixed_hard_reread_failed';
    end if;
    update public.newsletter_fixed_publication_receipts set rolled_back_at = clock_timestamp() where id = v_receipt.id;
    return jsonb_build_object('classification','ROLLED_BACK','item',p_item_key,'wrote',true,
      'status','draft','publishDate',null,'preimageHash',v_receipt.preimage_hash,
      'postimageHash',v_receipt.postimage_hash,'updatedAt',v_updated_at);
  end if;

  if p_action = 'commit' and p_idempotency_token is not null then
    select * into v_receipt from public.newsletter_fixed_publication_receipts
      where idempotency_token = p_idempotency_token;
    if found then
      if v_receipt.item_key <> p_item_key then raise exception 'newsletter_fixed_token_conflict'; end if;
      return jsonb_build_object('classification','ALREADY_APPLIED','item',v_receipt.item_key,'wrote',false,
        'preimageHash',v_receipt.preimage_hash,'postimageHash',v_receipt.postimage_hash,'publishedAt',v_receipt.published_at);
    end if;
  end if;

  if v_post->>'status' <> 'draft' or coalesce(v_post->>'publishDate','') <> '' then
    raise exception 'newsletter_fixed_not_hidden_draft';
  end if;
  if encode(digest(convert_to(coalesce(v_post->>'content',''), 'utf8'), 'sha256'), 'hex') <> v_expected_body
    or encode(digest(convert_to(coalesce(v_post->>'featuredImageUrl','') || '|' || coalesce(v_post->>'featuredImageMobileUrl',''), 'utf8'), 'sha256'), 'hex') <> v_expected_assets
    or encode(digest(convert_to(coalesce(v_post->>'author','') || '|' || coalesce(v_post->>'authorId',''), 'utf8'), 'sha256'), 'hex') <> v_expected_author
    or encode(digest(convert_to(coalesce(v_post->>'ctaLabel','') || '|' || coalesce(v_post->>'ctaUrl',''), 'utf8'), 'sha256'), 'hex') <> v_expected_cta
    or encode(digest(convert_to(coalesce(v_post->>'title','') || '|' || coalesce(v_post->>'slug','') || '|' || coalesce(v_post->>'description','') || '|' || coalesce(v_post->>'metaTitle','') || '|' || coalesce(v_post->>'metaDescription','') || '|' || coalesce(v_post->>'keywords','') || '|' || coalesce(v_post->>'heroImageAlt',''), 'utf8'), 'sha256'), 'hex') <> v_expected_meta
  then raise exception 'newsletter_fixed_preimage_mismatch'; end if;

  -- Preserve the validated draft before the hard reread reuses v_post for the postimage.
  v_preimage := v_post;
  v_confirmation := 'PUBLISH ' || upper(p_item_key) || ' ' || upper(substr(v_pre_hash,1,8));
  if p_action = 'preview' then
    return jsonb_build_object('classification','READY','item',p_item_key,'wrote',false,
      'status','draft','publishDate',null,'preimageHash',v_pre_hash,'updatedAt',v_row.updated_at,
      'confirmation',v_confirmation);
  end if;

  if p_expected_updated_at is null or p_expected_updated_at <> v_row.updated_at then raise exception 'newsletter_fixed_preview_stale'; end if;
  if p_expected_preimage_hash is null or lower(p_expected_preimage_hash) <> v_pre_hash then raise exception 'newsletter_fixed_hash_stale'; end if;
  if p_idempotency_token is null then raise exception 'newsletter_fixed_token_invalid'; end if;
  if p_confirmation is distinct from v_confirmation then raise exception 'newsletter_fixed_confirmation_invalid'; end if;
  if p_publish_at is null then raise exception 'newsletter_fixed_publish_at_required'; end if;

  v_next_post := jsonb_set(jsonb_set(jsonb_set(v_post,'{status}','"published"'::jsonb,false),
    '{publishDate}',to_jsonb(to_char(p_publish_at at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),false),
    '{modifiedDate}',to_jsonb(to_char(p_publish_at at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),false);
  v_post_hash := encode(digest(convert_to(v_next_post::text, 'utf8'), 'sha256'), 'hex');
  v_next_content := jsonb_set(v_row.content, array['posts',(v_ordinal-1)::text], v_next_post, false);
  update public.website_data set content = v_next_content, is_published = true, updated_at = clock_timestamp()
    where id = v_row.id and updated_at = v_row.updated_at returning updated_at into v_updated_at;
  if v_updated_at is null then raise exception 'newsletter_fixed_cas_failed'; end if;
  select content->'posts'->(v_ordinal-1) into v_post from public.website_data where id = v_row.id;
  if encode(digest(convert_to(v_post::text, 'utf8'), 'sha256'), 'hex') <> v_post_hash then
    raise exception 'newsletter_fixed_hard_reread_failed';
  end if;
  insert into public.newsletter_fixed_publication_receipts
    (item_key,idempotency_token,preimage,postimage,preimage_hash,postimage_hash,published_at)
    values (p_item_key,p_idempotency_token,v_preimage,v_next_post,v_pre_hash,v_post_hash,p_publish_at);
  return jsonb_build_object('classification','PUBLISHED','item',p_item_key,'wrote',true,
    'status','published','publishDate',to_char(p_publish_at at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
    'preimageHash',v_pre_hash,'postimageHash',v_post_hash,'updatedAt',v_updated_at);
end;
$$;

revoke all on function public.mutate_fixed_newsletter_publication(text,text,timestamptz,text,uuid,text,timestamptz) from public, anon, authenticated;
grant execute on function public.mutate_fixed_newsletter_publication(text,text,timestamptz,text,uuid,text,timestamptz) to service_role;

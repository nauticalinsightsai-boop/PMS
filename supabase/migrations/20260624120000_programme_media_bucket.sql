-- Programme PDFs / videos for certification pathway preview (CMS uploads)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'programme-media',
  'programme-media',
  true,
  52428800,
  array[
    'application/pdf',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read programme media" on storage.objects;
create policy "Public read programme media"
  on storage.objects for select
  using (bucket_id = 'programme-media');

drop policy if exists "Authenticated upload programme media" on storage.objects;
create policy "Authenticated upload programme media"
  on storage.objects for insert
  with check (bucket_id = 'programme-media' and auth.role() = 'authenticated');

drop policy if exists "Authenticated update programme media" on storage.objects;
create policy "Authenticated update programme media"
  on storage.objects for update
  using (bucket_id = 'programme-media' and auth.role() = 'authenticated');

drop policy if exists "Authenticated delete programme media" on storage.objects;
create policy "Authenticated delete programme media"
  on storage.objects for delete
  using (bucket_id = 'programme-media' and auth.role() = 'authenticated');

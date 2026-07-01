import type { SupabaseClient } from '@supabase/supabase-js';

type BucketSpec = {
  id: string;
  public: boolean;
  fileSizeLimit: number;
  allowedMimeTypes: string[];
};

const SITE_MEDIA: BucketSpec = {
  id: 'site-media',
  public: true,
  fileSizeLimit: 5 * 1024 * 1024,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
};

const PROGRAMME_MEDIA: BucketSpec = {
  id: 'programme-media',
  public: true,
  fileSizeLimit: 52_428_800,
  allowedMimeTypes: [
    'application/pdf',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'image/jpeg',
    'image/png',
    'image/webp',
  ],
};

async function bucketExists(admin: SupabaseClient, id: string): Promise<boolean> {
  const { data, error } = await admin.storage.getBucket(id);
  if (error) return false;
  return Boolean(data?.id);
}

export async function ensureSupabaseBucket(
  admin: SupabaseClient,
  spec: BucketSpec,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (await bucketExists(admin, spec.id)) return { ok: true };

  const { error } = await admin.storage.createBucket(spec.id, {
    public: spec.public,
    fileSizeLimit: spec.fileSizeLimit,
    allowedMimeTypes: spec.allowedMimeTypes,
  });

  if (error) {
    return {
      ok: false,
      error: `Storage bucket "${spec.id}" is missing and could not be created: ${error.message}. Run Supabase migrations.`,
    };
  }

  return { ok: true };
}

export async function ensureSiteMediaBucket(admin: SupabaseClient) {
  return ensureSupabaseBucket(admin, SITE_MEDIA);
}

export async function ensureProgrammeMediaBucket(admin: SupabaseClient) {
  return ensureSupabaseBucket(admin, PROGRAMME_MEDIA);
}

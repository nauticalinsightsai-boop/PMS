import { NextRequest, NextResponse } from 'next/server';
import { requireDashboardMutationAuth } from '@/lib/auth/api-guard';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from '@/lib/auth/supabase-admin';
import { buildMediaCatalog, buildSectionTabs } from '@/lib/cms/media-catalog';
import { updateCmsImageAtContext } from '@/lib/cms/cms-image-update';
import { inferContentType } from '@/lib/storage/content-type';
import { ensureSiteMediaBucket } from '@/lib/storage/ensure-supabase-bucket';

const BUCKET = 'site-media';
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_AUDIO_BYTES = 20 * 1024 * 1024;

const IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const AUDIO_TYPES = new Set([
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',
  'audio/m4a',
  'audio/x-m4a',
]);

function maxBytesForType(contentType: string): number {
  if (AUDIO_TYPES.has(contentType)) return MAX_AUDIO_BYTES;
  return MAX_IMAGE_BYTES;
}

function isAllowedMediaType(contentType: string): boolean {
  return IMAGE_TYPES.has(contentType) || AUDIO_TYPES.has(contentType);
}

function publicUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
  if (!base.trim()) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured — cannot build media URL.');
  }
  return `${base.replace(/\/$/, '')}/storage/v1/object/public/${BUCKET}/${path}`;
}

function isSafeObjectName(name: string): boolean {
  return Boolean(name) && !name.includes('/') && !name.includes('..') && !name.startsWith('.');
}

export async function GET(request: NextRequest) {
  const auth = await requireDashboardMutationAuth(request);
  if (auth) return auth;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const admin = getSupabaseAdmin();
  const source = request.nextUrl.searchParams.get('source');
  let items = await buildMediaCatalog(admin);

  if (source === 'upload' || source === 'site' || source === 'cms') {
    items = items.filter((item) => item.source === source);
  }

  const counts = {
    total: items.length,
    upload: items.filter((i) => i.source === 'upload').length,
    site: items.filter((i) => i.source === 'site').length,
    cms: items.filter((i) => i.source === 'cms').length,
  };

  return NextResponse.json({ items, counts, sections: buildSectionTabs(items) });
}

export async function POST(request: NextRequest) {
  const auth = await requireDashboardMutationAuth(request);
  if (auth) return auth;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const form = await request.formData();
  const file = form.get('file');
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 });
  }

  const replaceRaw = form.get('replace');
  const replaceName = typeof replaceRaw === 'string' ? replaceRaw.trim() : '';
  const cmsContextRaw = form.get('cmsContext');
  const cmsContext = typeof cmsContextRaw === 'string' ? cmsContextRaw.trim() : '';
  const isUploadReplace = Boolean(replaceName);
  const isCmsReplace = Boolean(cmsContext);

  if (isUploadReplace && !isSafeObjectName(replaceName)) {
    return NextResponse.json({ error: 'Invalid replace target' }, { status: 400 });
  }

  if (isUploadReplace && isCmsReplace) {
    return NextResponse.json({ error: 'Use either replace or cmsContext, not both' }, { status: 400 });
  }

  const original = form.get('filename');
  const safeName =
    typeof original === 'string' && original.trim()
      ? original.trim().replace(/[^a-zA-Z0-9._-]/g, '_')
      : 'upload.bin';
  const contentType = inferContentType(safeName, file.type);
  if (!isAllowedMediaType(contentType)) {
    return NextResponse.json(
      { error: 'Only images (JPEG, PNG, WebP, GIF, SVG) or audio (MP3, M4A, WAV) are allowed' },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const maxBytes = maxBytesForType(contentType);
  if (buffer.length > maxBytes) {
    const maxMb = Math.round(maxBytes / (1024 * 1024));
    return NextResponse.json({ error: `File exceeds ${maxMb}MB limit` }, { status: 400 });
  }

  const path = isUploadReplace ? replaceName : `${Date.now()}-${safeName}`;

  const admin = getSupabaseAdmin();
  const bucketReady = await ensureSiteMediaBucket(admin);
  if (!bucketReady.ok) {
    return NextResponse.json({ error: bucketReady.error }, { status: 503 });
  }
  if (isUploadReplace) {
    const { data: existing, error: listError } = await admin.storage.from(BUCKET).list('', { limit: 500 });
    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }
    const found = (existing ?? []).some((f) => f.name === replaceName);
    if (!found) {
      return NextResponse.json({ error: 'Upload not found' }, { status: 404 });
    }
  }

  const { error } = await admin.storage.from(BUCKET).upload(path, buffer, {
    contentType,
    upsert: isUploadReplace,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let uploadedUrl: string;
  try {
    uploadedUrl = publicUrl(path);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid storage URL configuration' },
      { status: 503 },
    );
  }

  if (isCmsReplace) {
    const { fieldKey } = await updateCmsImageAtContext(admin, cmsContext, uploadedUrl);
    return NextResponse.json({
      ok: true,
      name: path,
      url: uploadedUrl,
      replaced: true,
      cmsUpdated: true,
      cmsFieldKey: fieldKey,
      message: 'Image uploaded and CMS draft updated. Publish that page to go live.',
    });
  }

  return NextResponse.json({ ok: true, name: path, url: uploadedUrl, replaced: isUploadReplace });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireDashboardMutationAuth(request);
  if (auth) return auth;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  let body: { name?: string };
  try {
    body = (await request.json()) as { name?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name || !isSafeObjectName(name)) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: existing, error: listError } = await admin.storage.from(BUCKET).list('', { limit: 500 });
  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }
  const found = (existing ?? []).some((f) => f.name === name);
  if (!found) {
    return NextResponse.json(
      { error: 'Only uploaded library files can be deleted. Site bundle images are managed in the repo.' },
      { status: 400 },
    );
  }

  const { error } = await admin.storage.from(BUCKET).remove([name]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

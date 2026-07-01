import { NextRequest, NextResponse } from 'next/server';
import { requireDashboardMutationAuth } from '@/lib/auth/api-guard';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from '@/lib/auth/supabase-admin';
import {
  isR2ProgrammeMediaConfigured,
  programmeMediaMaxBytes,
  programmeMediaStorageNotConfiguredMessage,
  programmeMediaUsesR2,
  r2DeleteObject,
  r2ListObjects,
  r2PublicUrl,
  r2UploadObject,
} from '@/lib/storage/r2-programme-media';
import { inferContentType } from '@/lib/storage/content-type';
import { ensureProgrammeMediaBucket } from '@/lib/storage/ensure-supabase-bucket';

const SUPABASE_BUCKET = 'programme-media';

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

function supabasePublicUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
  return `${base}/storage/v1/object/public/${SUPABASE_BUCKET}/${path}`;
}

function safeSegment(value: string): string {
  return value.trim().replace(/[^a-zA-Z0-9._-]/g, '_');
}

function storageReady(): boolean {
  if (programmeMediaUsesR2()) return isR2ProgrammeMediaConfigured();
  return isSupabaseAdminConfigured();
}

export async function GET(request: NextRequest) {
  const auth = await requireDashboardMutationAuth(request);
  if (auth) return auth;

  if (!storageReady()) {
    return NextResponse.json({ error: programmeMediaStorageNotConfiguredMessage() }, { status: 503 });
  }

  const prefix = request.nextUrl.searchParams.get('prefix')?.trim() ?? '';

  if (programmeMediaUsesR2()) {
    const objects = await r2ListObjects(prefix);
    const items = objects.map((obj) => ({
      name: obj.key,
      url: r2PublicUrl(obj.key),
      created_at: obj.lastModified?.toISOString() ?? '',
    }));
    return NextResponse.json({ items, storage: 'r2' });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin.storage.from(SUPABASE_BUCKET).list(prefix, {
    limit: 200,
    sortBy: { column: 'created_at', order: 'desc' },
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items = (data ?? [])
    .filter((f) => f.name && !f.name.startsWith('.'))
    .map((f) => {
      const path = prefix ? `${prefix}/${f.name}` : f.name!;
      return {
        name: path,
        url: supabasePublicUrl(path),
        created_at: f.created_at ?? '',
      };
    });

  return NextResponse.json({ items, storage: 'supabase' });
}

export async function POST(request: NextRequest) {
  const auth = await requireDashboardMutationAuth(request);
  if (auth) return auth;

  if (!storageReady()) {
    return NextResponse.json({ error: programmeMediaStorageNotConfiguredMessage() }, { status: 503 });
  }

  const form = await request.formData();
  const file = form.get('file');
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 });
  }

  const maxBytes = programmeMediaMaxBytes();
  if (file.size > maxBytes) {
    const maxMb = Math.round(maxBytes / (1024 * 1024));
    return NextResponse.json({ error: `File exceeds ${maxMb}MB limit` }, { status: 413 });
  }

  const certId = safeSegment(String(form.get('certId') ?? 'cert'));
  const tier = safeSegment(String(form.get('tier') ?? 'foundation'));
  const kind = safeSegment(String(form.get('kind') ?? 'file'));
  const original = form.get('filename');
  const filename =
    typeof original === 'string' && original.trim() ? original.trim() : `${kind}.bin`;
  const contentType = inferContentType(filename, file.type);
  if (!ALLOWED_TYPES.has(contentType)) {
    return NextResponse.json({ error: `Unsupported file type: ${contentType}` }, { status: 400 });
  }

  const ext = filename.includes('.') ? filename.trim().split('.').pop()! : (contentType.split('/')[1] ?? 'bin');

  const path = `${certId}/${tier}/${kind}-${Date.now()}.${safeSegment(ext)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (programmeMediaUsesR2()) {
    try {
      await r2UploadObject({ key: path, body: buffer, contentType });
      return NextResponse.json({ ok: true, path, url: r2PublicUrl(path), storage: 'r2' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Cloudflare R2 upload failed';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const admin = getSupabaseAdmin();
  const bucketReady = await ensureProgrammeMediaBucket(admin);
  if (!bucketReady.ok) {
    return NextResponse.json({ error: bucketReady.error }, { status: 503 });
  }

  const { error } = await admin.storage.from(SUPABASE_BUCKET).upload(path, buffer, {
    contentType,
    upsert: false,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, path, url: supabasePublicUrl(path), storage: 'supabase' });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireDashboardMutationAuth(request);
  if (auth) return auth;

  if (!storageReady()) {
    return NextResponse.json({ error: programmeMediaStorageNotConfiguredMessage() }, { status: 503 });
  }

  let body: { path?: string };
  try {
    body = (await request.json()) as { path?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const storagePath = body.path?.trim();
  if (!storagePath) {
    return NextResponse.json({ error: 'path is required' }, { status: 400 });
  }

  if (programmeMediaUsesR2()) {
    try {
      await r2DeleteObject(storagePath);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Cloudflare R2 delete failed';
      return NextResponse.json({ error: message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, storage: 'r2' });
  }

  const admin = getSupabaseAdmin();
  const { error } = await admin.storage.from(SUPABASE_BUCKET).remove([storagePath]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, storage: 'supabase' });
}

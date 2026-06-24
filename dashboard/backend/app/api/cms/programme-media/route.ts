import { NextRequest, NextResponse } from 'next/server';
import { requireDashboardMutationAuth } from '@/lib/auth/api-guard';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from '@/lib/auth/supabase-admin';

const BUCKET = 'programme-media';
const MAX_BYTES = 52_428_800;

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

function publicUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}

function safeSegment(value: string): string {
  return value.trim().replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function GET(request: NextRequest) {
  const auth = await requireDashboardMutationAuth(request);
  if (auth) return auth;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const prefix = request.nextUrl.searchParams.get('prefix')?.trim() ?? '';
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.storage.from(BUCKET).list(prefix, {
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
        url: publicUrl(path),
        created_at: f.created_at ?? '',
      };
    });

  return NextResponse.json({ items });
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

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File exceeds 50MB limit' }, { status: 413 });
  }

  const contentType = file.type || 'application/octet-stream';
  if (!ALLOWED_TYPES.has(contentType)) {
    return NextResponse.json({ error: `Unsupported file type: ${contentType}` }, { status: 400 });
  }

  const certId = safeSegment(String(form.get('certId') ?? 'cert'));
  const tier = safeSegment(String(form.get('tier') ?? 'foundation'));
  const kind = safeSegment(String(form.get('kind') ?? 'file'));
  const original = form.get('filename');
  const ext =
    typeof original === 'string' && original.includes('.')
      ? original.trim().split('.').pop()!
      : contentType.split('/')[1] ?? 'bin';

  const path = `${certId}/${tier}/${kind}-${Date.now()}.${safeSegment(ext)}`;
  const admin = getSupabaseAdmin();
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage.from(BUCKET).upload(path, buffer, {
    contentType,
    upsert: false,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, path, url: publicUrl(path) });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireDashboardMutationAuth(request);
  if (auth) return auth;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
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

  const admin = getSupabaseAdmin();
  const { error } = await admin.storage.from(BUCKET).remove([storagePath]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

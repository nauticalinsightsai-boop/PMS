import { NextRequest, NextResponse } from 'next/server';
import { requireDashboardMutationAuth } from '@/lib/auth/api-guard';
import {
  buildProgrammeMediaObjectKey,
  PROGRAMME_MEDIA_DIRECT_UPLOAD_BYTES,
} from '@/lib/storage/programme-media-upload';
import {
  isR2ProgrammeMediaConfigured,
  programmeMediaMaxBytes,
  programmeMediaStorageNotConfiguredMessage,
  programmeMediaUsesR2,
  r2ApplyBucketCors,
  r2CreatePresignedPutUrl,
  r2PublicUrl,
} from '@/lib/storage/r2-programme-media';

type PresignBody = {
  certId?: string;
  tier?: string;
  kind?: string;
  filename?: string;
  contentType?: string;
  size?: number;
};

let corsConfigured = false;

async function ensureR2UploadCors(): Promise<void> {
  if (corsConfigured) return;
  try {
    await r2ApplyBucketCors();
    corsConfigured = true;
  } catch {
    // Presign may still work if CORS was set manually; server proxy works on Railway without CORS.
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireDashboardMutationAuth(request);
  if (auth) return auth;

  if (!programmeMediaUsesR2() || !isR2ProgrammeMediaConfigured()) {
    return NextResponse.json({ error: programmeMediaStorageNotConfiguredMessage() }, { status: 503 });
  }

  let body: PresignBody;
  try {
    body = (await request.json()) as PresignBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const size = Number(body.size ?? 0);
  if (!Number.isFinite(size) || size <= 0) {
    return NextResponse.json({ error: 'size is required' }, { status: 400 });
  }

  const maxBytes = programmeMediaMaxBytes();
  if (size > maxBytes) {
    const maxMb = Math.round(maxBytes / (1024 * 1024));
    return NextResponse.json({ error: `File exceeds ${maxMb}MB limit` }, { status: 413 });
  }

  let path: string;
  let contentType: string;
  try {
    const built = buildProgrammeMediaObjectKey({
      certId: body.certId ?? 'cert',
      tier: body.tier ?? 'foundation',
      kind: body.kind ?? 'file',
      filename: body.filename ?? 'file.bin',
    });
    path = built.path;
    contentType = body.contentType?.trim() || built.contentType;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid upload metadata';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    await ensureR2UploadCors();
    const uploadUrl = await r2CreatePresignedPutUrl({ key: path, contentType });
    return NextResponse.json({
      ok: true,
      path,
      url: r2PublicUrl(path),
      uploadUrl,
      contentType,
      storage: 'r2',
      directUploadMinBytes: PROGRAMME_MEDIA_DIRECT_UPLOAD_BYTES,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not create R2 upload URL';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

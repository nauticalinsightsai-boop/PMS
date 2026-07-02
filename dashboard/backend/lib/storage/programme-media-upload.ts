import { inferContentType } from '@/lib/storage/content-type';

export const PROGRAMME_MEDIA_ALLOWED_TYPES = new Set([
  'application/pdf',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

/** Server/proxy uploads above this size should use direct-to-R2 presigned PUT. */
export const PROGRAMME_MEDIA_DIRECT_UPLOAD_BYTES = 4 * 1024 * 1024;

export function safeProgrammeSegment(value: string): string {
  return value.trim().replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function buildProgrammeMediaObjectKey(params: {
  certId: string;
  tier: string;
  kind: string;
  filename: string;
}): { path: string; contentType: string } {
  const certId = safeProgrammeSegment(params.certId || 'cert');
  const tier = safeProgrammeSegment(params.tier || 'foundation');
  const kind = safeProgrammeSegment(params.kind || 'file');
  const filename =
    params.filename?.trim() || `${kind}.bin`;
  const contentType = inferContentType(filename);
  if (!PROGRAMME_MEDIA_ALLOWED_TYPES.has(contentType)) {
    throw new Error(`Unsupported file type: ${contentType}`);
  }
  const ext = filename.includes('.')
    ? filename.trim().split('.').pop()!
    : (contentType.split('/')[1] ?? 'bin');
  const path = `${certId}/${tier}/${kind}-${Date.now()}.${safeProgrammeSegment(ext)}`;
  return { path, contentType };
}

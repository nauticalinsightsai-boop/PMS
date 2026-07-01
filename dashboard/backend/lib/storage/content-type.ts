const EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  wav: 'audio/wav',
};

export function inferContentType(filename: string, declaredType?: string): string {
  const trimmed = declaredType?.trim().toLowerCase() ?? '';
  if (trimmed && trimmed !== 'application/octet-stream') return trimmed;

  const ext = filename.trim().split('.').pop()?.toLowerCase() ?? '';
  return EXT_TO_MIME[ext] ?? (trimmed || 'application/octet-stream');
}

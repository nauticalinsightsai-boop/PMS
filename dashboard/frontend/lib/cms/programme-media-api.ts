'use client';

import { fetchDashboardApi } from '@/lib/auth/fetch-dashboard-api';

export type ProgrammeMediaItem = {
  name: string;
  url: string;
  created_at: string;
  storage?: 'r2' | 'supabase';
};

function parseUploadError(res: Response, data: Record<string, unknown>): string {
  const msg = typeof data.error === 'string' ? data.error : '';
  if (res.status === 401) {
    return msg || 'Session expired — sign out and log in again, then retry upload.';
  }
  if (res.status === 403) {
    return msg || 'Upload blocked (origin/auth). Refresh the page and try again.';
  }
  if (res.status === 413) {
    return msg || 'File is too large for the server proxy. Retrying direct R2 upload…';
  }
  if (res.status === 503) {
    return msg || 'Programme media storage is not configured on the server (R2 env vars).';
  }
  return msg || `Upload failed (${res.status})`;
}

function inferProgrammeContentType(
  file: File,
  kind: 'guide' | 'slides' | 'video' | 'infographic',
): string {
  if (file.type && file.type !== 'application/octet-stream') return file.type;
  if (kind === 'slides' || kind === 'guide') return 'application/pdf';
  if (kind === 'video') return 'video/mp4';
  if (kind === 'infographic') return 'image/png';
  return file.type || 'application/octet-stream';
}

async function uploadViaPresignedPut(params: {
  file: File;
  certId: string;
  tier: 'foundation' | 'professional' | 'mastery';
  kind: 'guide' | 'slides' | 'video' | 'infographic';
}): Promise<{ path: string; url: string; storage: 'r2' }> {
  const contentType = inferProgrammeContentType(params.file, params.kind);

  const presignRes = await fetchDashboardApi('/api/cms/programme-media/presign', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      certId: params.certId,
      tier: params.tier,
      kind: params.kind,
      filename: params.file.name,
      contentType,
      size: params.file.size,
    }),
  });

  const presignData = (await presignRes.json().catch(() => ({}))) as {
    path?: string;
    url?: string;
    uploadUrl?: string;
    contentType?: string;
    error?: string;
    storage?: 'r2';
  };

  if (!presignRes.ok) {
    throw new Error(parseUploadError(presignRes, presignData));
  }

  const uploadUrl = presignData.uploadUrl?.trim();
  const publicUrl = presignData.url?.trim();
  const storagePath = presignData.path?.trim();
  if (!uploadUrl || !publicUrl || !storagePath) {
    throw new Error('Could not get R2 upload URL. Check R2 credentials on the dashboard backend.');
  }

  let putRes: Response;
  try {
    putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': presignData.contentType || contentType },
      body: params.file,
    });
  } catch {
    throw new Error(
      'Direct upload to Cloudflare R2 was blocked (network/CORS). Run `npm run r2:cors` from the repo root, or allow PUT from your admin domain in the R2 bucket CORS settings.',
    );
  }

  if (!putRes.ok) {
    const detail = await putRes.text().catch(() => '');
    throw new Error(
      detail ||
        `R2 upload failed (${putRes.status}). If this is a CORS error, run \`npm run r2:cors\` or add PUT permission for your admin origin on the R2 bucket.`,
    );
  }

  return { path: storagePath, url: publicUrl, storage: 'r2' };
}

async function uploadViaServerProxy(params: {
  file: File;
  certId: string;
  tier: 'foundation' | 'professional' | 'mastery';
  kind: 'guide' | 'slides' | 'video' | 'infographic';
}): Promise<{ path: string; url: string; storage?: 'r2' | 'supabase'; directUploadRequired?: boolean }> {
  const form = new FormData();
  form.append('file', params.file);
  form.append('filename', params.file.name);
  form.append('certId', params.certId);
  form.append('tier', params.tier);
  form.append('kind', params.kind);

  const res = await fetchDashboardApi('/api/cms/programme-media', {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  const data = (await res.json().catch(() => ({}))) as {
    path?: string;
    url?: string;
    storage?: 'r2' | 'supabase';
    error?: string;
    code?: string;
  };

  if (res.status === 413 && data.code === 'USE_DIRECT_UPLOAD') {
    return { path: '', url: '', directUploadRequired: true };
  }

  if (!res.ok) throw new Error(parseUploadError(res, data));
  if (!data.url?.trim()) {
    throw new Error('Upload succeeded but no public URL was returned. Check R2_PUBLIC_BASE_URL.');
  }
  return { path: data.path ?? '', url: data.url ?? '', storage: data.storage };
}

/** Programme PDFs and videos upload to Cloudflare R2 via the dashboard API (never Supabase direct). */
export async function uploadProgrammeMediaFile(params: {
  file: File;
  certId: string;
  tier: 'foundation' | 'professional' | 'mastery';
  kind: 'guide' | 'slides' | 'video' | 'infographic';
}): Promise<{ path: string; url: string; storage?: 'r2' | 'supabase' }> {
  const proxied = await uploadViaServerProxy(params);

  if (proxied.directUploadRequired) {
    return uploadViaPresignedPut(params);
  }

  if (proxied.storage !== 'r2') {
    throw new Error(
      'Certification media must upload to Cloudflare R2. Set PROGRAMME_MEDIA_STORAGE=r2 and all R2_* env vars on the dashboard backend.',
    );
  }

  return { path: proxied.path, url: proxied.url, storage: proxied.storage };
}

export async function deleteProgrammeMediaFile(path: string): Promise<void> {
  const res = await fetchDashboardApi('/api/cms/programme-media', {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path }),
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(data.error || 'Delete failed');
}

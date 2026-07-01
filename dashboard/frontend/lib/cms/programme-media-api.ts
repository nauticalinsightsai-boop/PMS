'use client';

import { fetchDashboardApi } from '@/lib/auth/fetch-dashboard-api';

export type ProgrammeMediaItem = {
  name: string;
  url: string;
  created_at: string;
  storage?: 'r2' | 'supabase';
};

/** Programme PDFs and videos upload to Cloudflare R2 via the dashboard API (never Supabase direct). */
export async function uploadProgrammeMediaFile(params: {
  file: File;
  certId: string;
  tier: 'foundation' | 'professional' | 'mastery';
  kind: 'guide' | 'slides' | 'video' | 'infographic';
}): Promise<{ path: string; url: string; storage?: 'r2' | 'supabase' }> {
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
  };
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  if (!data.url?.trim()) {
    throw new Error('Upload succeeded but no public URL was returned. Check R2_PUBLIC_BASE_URL.');
  }
  if (data.storage !== 'r2') {
    throw new Error(
      'Certification media must upload to Cloudflare R2. Set PROGRAMME_MEDIA_STORAGE=r2 and all R2_* env vars on the dashboard backend.',
    );
  }
  return { path: data.path ?? '', url: data.url ?? '', storage: data.storage };
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

'use client';

import { fetchDashboardApi } from '@/lib/auth/fetch-dashboard-api';
import { isApiLoginEnabled } from '@/lib/auth/api-login-config';

export type ProgrammeMediaItem = {
  name: string;
  url: string;
  created_at: string;
};

const USE_API = isApiLoginEnabled();

export async function uploadProgrammeMediaFile(params: {
  file: File;
  certId: string;
  tier: 'foundation' | 'professional' | 'mastery';
  kind: 'guide' | 'slides' | 'video' | 'infographic';
}): Promise<{ path: string; url: string }> {
  const form = new FormData();
  form.append('file', params.file);
  form.append('filename', params.file.name);
  form.append('certId', params.certId);
  form.append('tier', params.tier);
  form.append('kind', params.kind);

  if (USE_API) {
    const res = await fetchDashboardApi('/api/cms/programme-media', {
      method: 'POST',
      credentials: 'include',
      body: form,
    });
    const data = (await res.json().catch(() => ({}))) as {
      path?: string;
      url?: string;
      error?: string;
    };
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return { path: data.path ?? '', url: data.url ?? '' };
  }

  const { supabase } = await import('@/lib/supabase');
  const ext = params.file.name.includes('.') ? params.file.name.split('.').pop() : 'bin';
  const path = `${params.certId}/${params.tier}/${params.kind}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('programme-media').upload(path, params.file, {
    upsert: false,
    contentType: params.file.type || undefined,
  });
  if (error) throw error;
  const { data: pub } = supabase.storage.from('programme-media').getPublicUrl(path);
  return { path, url: pub.publicUrl };
}

export async function deleteProgrammeMediaFile(path: string): Promise<void> {
  if (USE_API) {
    const res = await fetchDashboardApi('/api/cms/programme-media', {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) throw new Error(data.error || 'Delete failed');
    return;
  }

  const { supabase } = await import('@/lib/supabase');
  const { error } = await supabase.storage.from('programme-media').remove([path]);
  if (error) throw error;
}

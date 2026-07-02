'use client';

import { fetchDashboardApi } from '@/lib/auth/fetch-dashboard-api';
import { isApiLoginEnabled } from '@/lib/auth/api-login-config';
import { hasDashboardMutationAuth } from '@/lib/auth/dashboard-api-headers';

export type MediaSource = 'upload' | 'site' | 'cms';

export type MediaItem = {
  name: string;
  url: string;
  created_at: string;
  source?: MediaSource;
  category?: string;
  context?: string;
  pageLabel?: string;
  sectionLabel?: string;
  sectionTab?: string;
  deletable?: boolean;
  replaceable?: boolean;
};

export type MediaCounts = {
  total: number;
  upload: number;
  site: number;
  cms: number;
};

export type MediaSectionTab = {
  id: string;
  label: string;
  count: number;
};

/** Dashboard_one login has no Supabase Auth JWT — uploads must use the admin API (service role). */
function shouldUseMediaApi(): boolean {
  if (typeof window !== 'undefined') {
    if (process.env.NEXT_PUBLIC_DASHBOARD_BUNDLED === 'true') return true;
    if (isApiLoginEnabled()) return true;
    if (hasDashboardMutationAuth()) return true;
    return false;
  }
  return isApiLoginEnabled();
}

/** Vercel serverless request bodies are capped ~4.5MB; stay under that. */
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_AUDIO_BYTES = 20 * 1024 * 1024;

function parseUploadError(res: Response, data: Record<string, unknown>): string {
  const msg = typeof data.error === 'string' ? data.error : '';
  if (res.status === 401) {
    return msg || 'Session expired — sign out and log in again, then retry upload.';
  }
  if (res.status === 403) {
    return msg || 'Upload blocked (origin/auth). Refresh the page and try again.';
  }
  if (res.status === 413) {
    return msg || 'File is too large for the server (max 4MB for images).';
  }
  if (res.status === 503) {
    return msg || 'Media storage is not configured on the server.';
  }
  return msg || `Upload failed (${res.status})`;
}

async function listFromSupabaseClient(): Promise<MediaItem[]> {
  const { supabase } = await import('@/lib/supabase');
  const { data, error } = await supabase.storage.from('site-media').list('', { limit: 500 });
  if (error) throw error;
  return (data ?? [])
    .filter((f) => f.name && !f.name.startsWith('.'))
    .map((f) => {
      const { data: pub } = supabase.storage.from('site-media').getPublicUrl(f.name!);
      return {
        name: f.name!,
        url: pub.publicUrl,
        created_at: f.created_at ?? '',
        source: 'upload' as const,
        category: 'uploads',
        pageLabel: 'Uploads',
        sectionLabel: 'Library upload',
        sectionTab: 'uploads',
        deletable: true,
        replaceable: true,
      };
    });
}

export async function listMediaItems(): Promise<{
  items: MediaItem[];
  counts: MediaCounts;
  sections: MediaSectionTab[];
}> {
  if (shouldUseMediaApi()) {
    const res = await fetchDashboardApi('/api/cms/media', {
      credentials: 'include',
    });
    const data = (await res.json().catch(() => ({}))) as {
      items?: MediaItem[];
      counts?: MediaCounts;
      sections?: MediaSectionTab[];
      error?: string;
    };
    if (!res.ok) throw new Error(data.error || 'Failed to load media');
    const items = data.items ?? [];
    const counts = data.counts ?? {
      total: items.length,
      upload: items.filter((i) => i.source === 'upload').length,
      site: items.filter((i) => i.source === 'site').length,
      cms: items.filter((i) => i.source === 'cms').length,
    };
    const sections = data.sections ?? [{ id: 'all', label: 'All', count: items.length }];
    return { items, counts, sections };
  }

  const items = await listFromSupabaseClient();
  return {
    items,
    counts: { total: items.length, upload: items.length, site: 0, cms: 0 },
    sections: [
      { id: 'all', label: 'All', count: items.length },
      { id: 'uploads', label: 'Uploads', count: items.length },
    ],
  };
}

export async function uploadMediaFile(
  file: File,
  options?: { replace?: string; cmsContext?: string; kind?: 'image' | 'audio' },
): Promise<MediaItem & { cmsUpdated?: boolean; message?: string }> {
  const isAudio = options?.kind === 'audio' || file.type.startsWith('audio/');
  const maxBytes = isAudio ? MAX_AUDIO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    throw new Error(
      isAudio
        ? `Audio exceeds ${Math.round(maxBytes / (1024 * 1024))}MB limit`
        : `Image exceeds ${Math.round(maxBytes / (1024 * 1024))}MB limit (use a smaller file or compress)`,
    );
  }

  if (shouldUseMediaApi()) {
    const form = new FormData();
    form.append('file', file);
    form.append('filename', file.name);
    if (options?.replace) form.append('replace', options.replace);
    if (options?.cmsContext) form.append('cmsContext', options.cmsContext);
    const res = await fetchDashboardApi('/api/cms/media', {
      method: 'POST',
      credentials: 'include',
      body: form,
    });
    const data = (await res.json().catch(() => ({}))) as {
      url?: string;
      name?: string;
      cmsUpdated?: boolean;
      message?: string;
      error?: string;
      success?: boolean;
    };
    if (!res.ok) throw new Error(parseUploadError(res, data));
    if (!data.url?.trim()) {
      throw new Error('Upload succeeded but no public URL was returned. Check Supabase URL env vars.');
    }
    return {
      name: data.name ?? file.name,
      url: data.url ?? '',
      created_at: new Date().toISOString(),
      source: 'upload',
      category: 'uploads',
      pageLabel: 'Uploads',
      sectionLabel: 'Library upload',
      sectionTab: 'uploads',
      deletable: true,
      replaceable: true,
      cmsUpdated: data.cmsUpdated,
      message: data.message,
    };
  }

  const { supabase } = await import('@/lib/supabase');
  const path = options?.replace?.trim() || `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const { error } = await supabase.storage.from('site-media').upload(path, file, {
    upsert: Boolean(options?.replace),
  });
  if (error) {
    throw new Error(
      error.message.includes('row-level security') || error.message.includes('JWT')
        ? 'Upload requires admin API login. Sign in at /admin/login and try again.'
        : error.message,
    );
  }
  const { data: pub } = supabase.storage.from('site-media').getPublicUrl(path);
  return {
    name: path,
    url: pub.publicUrl,
    created_at: new Date().toISOString(),
    source: 'upload',
    category: 'uploads',
    deletable: true,
    replaceable: true,
  };
}

export async function deleteMediaItem(name: string): Promise<void> {
  if (shouldUseMediaApi()) {
    const res = await fetchDashboardApi('/api/cms/media', {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) throw new Error(data.error || 'Delete failed');
    return;
  }

  const { supabase } = await import('@/lib/supabase');
  const { error } = await supabase.storage.from('site-media').remove([name]);
  if (error) throw error;
}

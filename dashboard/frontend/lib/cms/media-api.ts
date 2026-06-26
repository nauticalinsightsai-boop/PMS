'use client';

import { fetchDashboardApi } from '@/lib/auth/fetch-dashboard-api';

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

import { isApiLoginEnabled } from '@/lib/auth/api-login-config';

const USE_MEDIA_API = isApiLoginEnabled();

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
  if (USE_MEDIA_API) {
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
  options?: { replace?: string; cmsContext?: string },
): Promise<MediaItem & { cmsUpdated?: boolean; message?: string }> {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File exceeds 5MB limit');
  }

  if (USE_MEDIA_API) {
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
    };
    if (!res.ok) throw new Error(data.error || 'Upload failed');
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
  const path = options?.replace?.trim() || `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from('site-media').upload(path, file, {
    upsert: Boolean(options?.replace),
  });
  if (error) throw error;
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
  if (USE_MEDIA_API) {
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

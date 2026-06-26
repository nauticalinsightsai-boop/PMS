import type { SupabaseClient } from '@supabase/supabase-js';
import {
  cmsSectionTabId,
  humanizeCmsContext,
  parseCmsContext,
  staticCategoryLabel,
  staticSectionTabId,
} from '@pms/site-content';
import staticManifest from './static-media-manifest.json';

export type MediaCatalogItem = {
  name: string;
  url: string;
  created_at: string;
  source: 'upload' | 'site' | 'cms';
  category?: string;
  context?: string;
  pageLabel?: string;
  sectionLabel?: string;
  sectionTab?: string;
  deletable: boolean;
  replaceable: boolean;
};

const BUCKET = 'site-media';

function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.AUTH_EMAIL_SITE_URL?.trim() ||
    'https://pmstructure.com'
  ).replace(/\/$/, '');
}

function publicStorageUrl(base: string, objectPath: string): string {
  return `${base}/storage/v1/object/public/${BUCKET}/${objectPath}`;
}

function loadStaticManifest(): Array<{ name: string; path: string; category: string }> {
  return staticManifest.items ?? [];
}

function isImageUrl(value: string): boolean {
  const v = value.trim();
  if (!v || v.startsWith('data:')) return false;
  return (
    /\.(webp|png|jpe?g|gif|svg|avif)(\?|$)/i.test(v) ||
    v.includes('/images/') ||
    v.includes('site-media')
  );
}

function collectImageUrls(value: unknown, out: Map<string, string>, prefix = ''): void {
  if (typeof value === 'string') {
    if (isImageUrl(value)) {
      const key = value.trim();
      if (!out.has(key)) out.set(key, prefix || 'CMS');
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => collectImageUrls(item, out, `${prefix}[${i}]`));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const next = prefix ? `${prefix}.${k}` : k;
      if (/image|photo|avatar|hero|featured|thumbnail|logo|icon/i.test(k) && typeof v === 'string') {
        collectImageUrls(v, out, next);
      } else {
        collectImageUrls(v, out, next);
      }
    }
  }
}

function enrichCmsItem(url: string, context: string): MediaCatalogItem {
  const { page, section, fieldKey } = humanizeCmsContext(context);
  const absolute = url.startsWith('http')
    ? url
    : url.startsWith('/')
      ? `${siteBaseUrl()}${url}`
      : `${siteBaseUrl()}/${url}`;

  return {
    name: url,
    url: absolute,
    created_at: '',
    source: 'cms',
    category: 'in-use',
    context,
    pageLabel: page,
    sectionLabel: section,
    sectionTab: cmsSectionTabId(fieldKey),
    deletable: false,
    replaceable: Boolean(parseCmsContext(context)),
  };
}

async function listUploads(admin: SupabaseClient, supabaseUrl: string): Promise<MediaCatalogItem[]> {
  const { data, error } = await admin.storage.from(BUCKET).list('', {
    limit: 500,
    sortBy: { column: 'created_at', order: 'desc' },
  });
  if (error) throw new Error(error.message);

  return (data ?? [])
    .filter((f) => f.name && !f.name.startsWith('.'))
    .map((f) => ({
      name: f.name!,
      url: publicStorageUrl(supabaseUrl, f.name!),
      created_at: f.created_at ?? '',
      source: 'upload' as const,
      category: 'uploads',
      pageLabel: 'Uploads',
      sectionLabel: 'Library upload',
      sectionTab: 'uploads',
      deletable: true,
      replaceable: true,
    }));
}

async function listCmsImages(admin: SupabaseClient): Promise<MediaCatalogItem[]> {
  const { data, error } = await admin.from('website_data').select('field_key, content');
  if (error) throw new Error(error.message);

  const urls = new Map<string, string>();
  for (const row of data ?? []) {
    const prefix = row.field_key ?? 'website_data';
    collectImageUrls(row.content, urls, prefix);
  }

  return Array.from(urls.entries())
    .map(([url, context]) => enrichCmsItem(url, context))
    .sort((a, b) => a.url.localeCompare(b.url));
}

function listStaticSiteImages(siteUrl: string): MediaCatalogItem[] {
  return loadStaticManifest().map((item) => ({
    name: item.name,
    url: `${siteUrl}${item.path}`,
    created_at: '',
    source: 'site' as const,
    category: item.category,
    pageLabel: 'Site bundle',
    sectionLabel: staticCategoryLabel(item.category),
    sectionTab: staticSectionTabId(item.category),
    deletable: false,
    replaceable: false,
  }));
}

export async function buildMediaCatalog(admin: SupabaseClient): Promise<MediaCatalogItem[]> {
  const siteUrl = siteBaseUrl();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
  const [uploads, staticItems, cmsItems] = await Promise.all([
    listUploads(admin, supabaseUrl),
    Promise.resolve(listStaticSiteImages(siteUrl)),
    listCmsImages(admin),
  ]);

  const byUrl = new Map<string, MediaCatalogItem>();
  for (const item of staticItems) byUrl.set(item.url, item);
  for (const item of cmsItems) {
    const existing = byUrl.get(item.url);
    byUrl.set(
      item.url,
      existing
        ? {
            ...existing,
            ...item,
            source: 'cms',
            sectionLabel: item.sectionLabel,
            pageLabel: item.pageLabel,
            sectionTab: item.sectionTab,
            replaceable: item.replaceable,
          }
        : item,
    );
  }
  for (const item of uploads) byUrl.set(item.url, item);

  return Array.from(byUrl.values()).sort((a, b) => {
    const pageA = a.pageLabel ?? '';
    const pageB = b.pageLabel ?? '';
    if (pageA !== pageB) return pageA.localeCompare(pageB);
    return a.name.localeCompare(b.name);
  });
}

export function buildSectionTabs(items: MediaCatalogItem[]): Array<{ id: string; label: string; count: number }> {
  const counts = new Map<string, { label: string; count: number }>();

  for (const item of items) {
    const id = item.sectionTab ?? 'other';
    const label =
      item.source === 'upload'
        ? 'Uploads'
        : item.source === 'site'
          ? item.sectionLabel ?? 'Site bundle'
          : item.pageLabel ?? 'CMS';
    const prev = counts.get(id);
    counts.set(id, { label, count: (prev?.count ?? 0) + 1 });
  }

  const tabs = Array.from(counts.entries())
    .map(([id, meta]) => ({ id, label: meta.label, count: meta.count }))
    .sort((a, b) => {
      if (a.id === 'uploads') return -1;
      if (b.id === 'uploads') return 1;
      return a.label.localeCompare(b.label);
    });

  return [{ id: 'all', label: 'All', count: items.length }, ...tabs];
}

'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Trash2, Check, Upload, ImageUp, Search } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  listMediaItems,
  uploadMediaFile,
  deleteMediaItem,
  type MediaItem,
  type MediaSectionTab,
  type MediaCounts,
} from '@/lib/cms/media-api';

type Props = {
  onSelect?: (url: string) => void;
  compact?: boolean;
};

function emptyCounts(): MediaCounts {
  return { total: 0, upload: 0, site: 0, cms: 0 };
}

export function MediaLibraryGrid({ onSelect, compact }: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [sections, setSections] = useState<MediaSectionTab[]>([]);
  const [counts, setCounts] = useState<MediaCounts>(emptyCounts());
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [replacingKey, setReplacingKey] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [sectionFilter, setSectionFilter] = useState('all');
  const [query, setQuery] = useState('');
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await listMediaItems();
      setItems(result.items);
      setCounts(result.counts);
      setSections(result.sections);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load media');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (sectionFilter !== 'all' && item.sectionTab !== sectionFilter) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q) ||
        (item.pageLabel?.toLowerCase().includes(q) ?? false) ||
        (item.sectionLabel?.toLowerCase().includes(q) ?? false) ||
        (item.context?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [items, sectionFilter, query]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      await uploadMediaFile(file);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const startReplace = (item: MediaItem) => {
    if (!replaceInputRef.current) return;
    replaceInputRef.current.dataset.replaceName = item.source === 'upload' ? item.name : '';
    replaceInputRef.current.dataset.cmsContext = item.context ?? '';
    replaceInputRef.current.dataset.itemKey = item.url;
    replaceInputRef.current.click();
  };

  const onReplacePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const replaceName = e.target.dataset.replaceName || '';
    const cmsContext = e.target.dataset.cmsContext || '';
    const itemKey = e.target.dataset.itemKey || file.name;

    setUploading(true);
    setReplacingKey(itemKey);
    setError('');
    setSuccess('');
    try {
      const result = await uploadMediaFile(file, {
        replace: replaceName || undefined,
        cmsContext: cmsContext || undefined,
      });
      await load();
      setSuccess(result.message ?? 'Image replaced. Publish the page if this was a CMS image.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Replace failed');
    } finally {
      setUploading(false);
      setReplacingKey(null);
      e.target.value = '';
      e.target.dataset.replaceName = '';
      e.target.dataset.cmsContext = '';
      e.target.dataset.itemKey = '';
    }
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const onDelete = async (name: string) => {
    if (!confirm(`Delete uploaded file "${name}"? This cannot be undone.`)) return;
    try {
      await deleteMediaItem(name);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      <GlassCard variant="flat" animateEntry={false} className="p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange text-white text-sm font-bold">
              <Upload className="h-4 w-4" />
              {uploading && !replacingKey ? 'Uploading…' : 'Upload image'}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={onUpload}
              disabled={uploading}
            />
          </label>
          <input
            ref={replaceInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={onReplacePick}
            disabled={uploading}
          />
          <span className="text-xs text-muted-foreground">JPEG, PNG, WebP, GIF, SVG — max 5MB</span>
          {!compact ? (
            <button
              type="button"
              onClick={() => load()}
              disabled={loading}
              className="ml-auto text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-brand-orange/40 disabled:opacity-50"
            >
              Refresh
            </button>
          ) : null}
        </div>

        {!compact && sections.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {sections.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSectionFilter(tab.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  sectionFilter === tab.id
                    ? 'bg-brand-orange/15 border-brand-orange/40 text-brand-orange font-semibold'
                    : 'border-white/10 text-muted-foreground hover:border-white/20'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        ) : null}

        {!compact ? (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by page, section, or filename…"
              className="w-full rounded-xl border border-white/10 bg-black/20 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-orange/50"
            />
          </div>
        ) : null}
      </GlassCard>

      {success ? <p className="text-sm text-emerald-500">{success}</p> : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {loading ? <p className="text-sm text-muted-foreground">Loading media library…</p> : null}

      <div
        className={`grid gap-4 ${compact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}
      >
        {filtered.map((item) => {
          const canDelete = item.deletable ?? item.source === 'upload';
          const canReplace = item.replaceable ?? item.source === 'upload';
          const isReplacingThis = replacingKey === item.url;

          return (
            <GlassCard key={item.url} variant="flat" animateEntry={false} className="p-2 overflow-hidden group">
              <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/20">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                {onSelect ? (
                  <button
                    type="button"
                    onClick={() => onSelect(item.url)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                  >
                    Use this image
                  </button>
                ) : null}
                {item.pageLabel ? (
                  <span className="absolute top-2 left-2 max-w-[90%] truncate text-[10px] px-2 py-0.5 rounded-full border font-semibold bg-black/60 text-white border-white/20">
                    {item.pageLabel}
                  </span>
                ) : null}
              </div>
              <p className="text-xs truncate mt-2 font-mono text-muted-foreground" title={item.name}>
                {item.name}
              </p>
              {item.sectionLabel ? (
                <p className="text-[10px] text-muted-foreground truncate" title={item.sectionLabel}>
                  {item.sectionLabel}
                </p>
              ) : null}
              <div className="flex gap-1 mt-2">
                <button
                  type="button"
                  onClick={() => copyUrl(item.url)}
                  className="flex-1 inline-flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg border border-white/10 hover:border-brand-orange/50"
                >
                  {copied === item.url ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied === item.url ? 'Copied' : 'Copy URL'}
                </button>
                {!onSelect && canReplace ? (
                  <button
                    type="button"
                    onClick={() => startReplace(item)}
                    disabled={uploading}
                    className="p-1.5 rounded-lg border border-white/10 text-amber-300 hover:bg-amber-500/10 disabled:opacity-50"
                    aria-label="Upload replacement"
                    title="Upload a new image from your device to replace this one"
                  >
                    <ImageUp className={`h-3.5 w-3.5 ${isReplacingThis ? 'animate-pulse' : ''}`} />
                  </button>
                ) : null}
                {!onSelect && canDelete ? (
                  <button
                    type="button"
                    onClick={() => onDelete(item.name)}
                    className="p-1.5 rounded-lg border border-white/10 text-red-400 hover:bg-red-500/10"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {!loading && filtered.length === 0 ? (
        <div className="text-sm text-muted-foreground text-center py-8 space-y-2">
          {items.length === 0 ? (
            <>
              <p>No images found yet.</p>
              <p className="text-xs">Upload an image above — site bundle images appear after deploy.</p>
            </>
          ) : (
            <p>No images match this tab or search.</p>
          )}
        </div>
      ) : null}

      {!loading && !compact && counts.total > 0 ? (
        <p className="text-xs text-muted-foreground text-center">
          Showing {filtered.length} of {counts.total} images across {sections.length - 1} sections.
        </p>
      ) : null}
    </div>
  );
}

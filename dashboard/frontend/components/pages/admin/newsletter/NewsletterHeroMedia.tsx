'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Copy, ImageIcon, Loader2, Monitor, Smartphone, Upload, X } from 'lucide-react';
import { MediaLibraryGrid } from '@/components/pages/admin/site-content/MediaLibraryGrid';
import { uploadMediaFile } from '@/lib/cms/media-api';
import { dashboardHref } from '@/lib/base-path';

type Device = 'desktop' | 'mobile';

/** Used by live preview phone frame only — not the hero editor pickers. */
export const MOBILE_FRAME_WIDTH = 375;
export const MOBILE_FRAME_HEIGHT = 667;

function displayUrl(value: string): string {
  return value.startsWith('data:') ? '' : value;
}

function HeroImageFrame({
  url,
  emptyLabel,
  onClear,
  compact,
}: {
  url: string;
  emptyLabel: string;
  onClear: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? 'relative mx-auto w-full max-w-[220px] aspect-[16/10] overflow-hidden rounded-xl border border-border bg-black/30 shadow-inner'
          : 'relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-black/30 shadow-inner'
      }
    >
      {url ? (
        <>
          <img src={url} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-red-500/90"
            aria-label="Remove image"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
          <ImageIcon className="h-8 w-8 opacity-40" />
          <span className="text-[11px] font-medium">{emptyLabel}</span>
        </div>
      )}
    </div>
  );
}

function DevicePicker({
  device,
  label,
  hint,
  value,
  onChange,
  showLibrary = false,
  compact = false,
}: {
  device: Device;
  label: string;
  hint: string;
  value: string;
  onChange: (url: string) => void;
  showLibrary?: boolean;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const url = displayUrl(value);
  const Icon = device === 'desktop' ? Monitor : Smartphone;
  const emptyLabel = device === 'desktop' ? 'No desktop hero' : 'No mobile hero';

  const copyUrl = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-muted/20 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Icon size={16} className="text-brand-orange" aria-hidden />
            {label}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        {url ? (
          <button
            type="button"
            onClick={() => void copyUrl()}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11px] font-semibold hover:bg-muted"
          >
            <Copy size={12} />
            Copy URL
          </button>
        ) : null}
      </div>

      <div className="my-3 flex items-center justify-center">
        {device === 'mobile' ? (
          <div
            className={
              compact
                ? 'mx-auto w-full max-w-[80px] overflow-hidden rounded-xl border border-border bg-black/30 shadow-inner'
                : 'mx-auto w-full max-w-[160px] overflow-hidden rounded-xl border border-border bg-black/30 shadow-inner'
            }
            style={{ aspectRatio: `${MOBILE_FRAME_WIDTH}/${MOBILE_FRAME_HEIGHT}` }}
          >
            {url ? (
              <div className="relative h-full w-full">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-red-500/90"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImageIcon className="h-8 w-8 opacity-40" />
                <span className="text-[11px] font-medium">{emptyLabel}</span>
              </div>
            )}
          </div>
        ) : (
          <HeroImageFrame
            url={url}
            emptyLabel={emptyLabel}
            onClear={() => onChange('')}
            compact={compact}
          />
        )}
      </div>

      <div className="mt-3 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-orange px-3 py-2 text-xs font-bold text-white hover:opacity-90 disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            Upload Image
          </button>
          {showLibrary ? (
            <>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:border-brand-orange/40"
              >
                Choose from library
              </button>
              <Link
                href={dashboardHref('/dashboard/site-system/media-library')}
                target="_blank"
                className="rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:border-brand-orange/40"
              >
                Open media library
              </Link>
            </>
          ) : null}
        </div>

        <input
          value={url}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL"
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
        />
        {uploadError ? (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
            {uploadError}
          </p>
        ) : null}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.jpg,.jpeg,.png,.webp,.gif,.svg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setUploading(true);
          setUploadError('');
          void uploadMediaFile(file)
            .then((result) => onChange(result.url))
            .catch((err) =>
              setUploadError(err instanceof Error ? err.message : 'Upload failed'),
            )
            .finally(() => {
              setUploading(false);
              e.target.value = '';
            });
        }}
      />

      {showLibrary && open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="font-bold">Media library — {label}</h3>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              <MediaLibraryGrid
                compact
                onSelect={(selected) => {
                  onChange(selected);
                  setOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function NewsletterHeroMedia({
  desktopUrl,
  mobileUrl,
  altText,
  onDesktopChange,
  onMobileChange,
  onAltChange,
  showLibrary = false,
  showAltText = true,
  compact = true,
}: {
  desktopUrl: string;
  mobileUrl: string;
  altText: string;
  onDesktopChange: (url: string) => void;
  onMobileChange: (url: string) => void;
  onAltChange: (alt: string) => void;
  showLibrary?: boolean;
  showAltText?: boolean;
  /** Shorter preview frames (~50% height) for the newsletter editor */
  compact?: boolean;
}) {
  const desktop = displayUrl(desktopUrl);
  const mobile = displayUrl(mobileUrl);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Set a hero for desktop and optionally a different image for mobile. The public page uses responsive
        images — you can reuse the same file for both.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <DevicePicker
          device="desktop"
          label="Desktop hero"
          hint="Wide 16:10 hero for article header and email"
          value={desktopUrl}
          onChange={onDesktopChange}
          showLibrary={showLibrary}
          compact={compact}
        />
        <DevicePicker
          device="mobile"
          label="Mobile hero"
          hint="Tall 9:16 crop for phones — optional; falls back to desktop"
          value={mobileUrl}
          onChange={onMobileChange}
          showLibrary={showLibrary}
          compact={compact}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!desktop}
          onClick={() => onMobileChange(desktopUrl)}
          className="rounded-lg border border-border px-3 py-2 text-xs font-semibold disabled:opacity-40 hover:border-brand-orange/40"
        >
          Use desktop image on mobile
        </button>
        <span className="text-xs text-muted-foreground">
          {mobile ? 'Mobile-specific crop set' : desktop ? 'Mobile will fall back to desktop hero' : 'Add at least a desktop hero'}
        </span>
      </div>

      {showAltText ? (
        <div>
          <label className="mb-1.5 block text-sm font-semibold">Hero alt text</label>
          <input
            value={altText}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Describe the hero image for accessibility and SEO"
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
          />
        </div>
      ) : null}
    </div>
  );
}

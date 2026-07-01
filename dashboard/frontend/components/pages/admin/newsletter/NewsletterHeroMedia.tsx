'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, ImageIcon, Monitor, Smartphone, X } from 'lucide-react';
import { MediaLibraryGrid } from '@/components/pages/admin/site-content/MediaLibraryGrid';
import { dashboardHref } from '@/lib/base-path';
import { cn } from '@/lib/utils';

type Device = 'desktop' | 'mobile';

/** iPhone-class preview proportions used in hero pickers and live preview. */
export const MOBILE_FRAME_WIDTH = 375;
export const MOBILE_FRAME_HEIGHT = 667;

function displayUrl(value: string): string {
  return value.startsWith('data:') ? '' : value;
}

function FrameDimensionBadge({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-black/65 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
      {label}
    </span>
  );
}

function DevicePicker({
  device,
  label,
  hint,
  dimensionLabel,
  value,
  onChange,
}: {
  device: Device;
  label: string;
  hint: string;
  dimensionLabel: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const url = displayUrl(value);
  const Icon = device === 'desktop' ? Monitor : Smartphone;
  const isMobile = device === 'mobile';

  const copyUrl = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-muted/20 p-4">
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

      <div className="my-4 flex flex-1 items-center justify-center">
        {isMobile ? (
          <div
            className="flex w-full max-w-[375px] flex-col overflow-hidden rounded-[2rem] border-[6px] border-slate-800 bg-black shadow-inner dark:border-slate-600"
            style={{ aspectRatio: `${MOBILE_FRAME_WIDTH}/${MOBILE_FRAME_HEIGHT}` }}
          >
            <div className="flex items-center justify-center border-b border-slate-800 bg-slate-900 px-4 py-1.5">
              <div className="h-1 w-14 rounded-full bg-slate-700" />
            </div>
            <div className="relative min-h-0 flex-1 bg-black/30">
              {url ? (
                <>
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => onChange('')}
                    className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-red-500/90"
                    aria-label="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ImageIcon className="h-8 w-8 opacity-40" />
                  <span className="text-[11px] font-medium">No mobile hero</span>
                </div>
              )}
              <FrameDimensionBadge label={dimensionLabel} />
            </div>
          </div>
        ) : (
          <div className="relative w-full overflow-hidden rounded-xl border border-border bg-black/30 shadow-inner aspect-[16/10]">
            {url ? (
              <>
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-red-500/90"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImageIcon className="h-8 w-8 opacity-40" />
                <span className="text-[11px] font-medium">No desktop hero</span>
              </div>
            )}
            <FrameDimensionBadge label={dimensionLabel} />
          </div>
        )}
      </div>

      <div className="mt-auto space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg bg-brand-orange px-3 py-2 text-xs font-bold text-white hover:opacity-90"
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
        </div>

        <input
          value={url}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL"
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
        />
      </div>

      {open ? (
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
}: {
  desktopUrl: string;
  mobileUrl: string;
  altText: string;
  onDesktopChange: (url: string) => void;
  onMobileChange: (url: string) => void;
  onAltChange: (alt: string) => void;
}) {
  const desktop = displayUrl(desktopUrl);
  const mobile = displayUrl(mobileUrl);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Use a wide hero for desktop inboxes and a vertical crop for mobile clients. Both render on the
        public newsletter page via responsive images.
      </p>

      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        <DevicePicker
          device="desktop"
          label="Desktop hero"
          hint="Recommended 1200×750 (16:10) — email clients & article header"
          dimensionLabel="1200 × 750"
          value={desktopUrl}
          onChange={onDesktopChange}
        />
        <DevicePicker
          device="mobile"
          label="Mobile hero"
          hint={`Recommended ${MOBILE_FRAME_WIDTH}×${MOBILE_FRAME_HEIGHT} (9:16) — phone preview & narrow inboxes`}
          dimensionLabel={`${MOBILE_FRAME_WIDTH} × ${MOBILE_FRAME_HEIGHT}`}
          value={mobileUrl}
          onChange={onMobileChange}
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

      <div>
        <label className="mb-1.5 block text-sm font-semibold">Hero alt text</label>
        <input
          value={altText}
          onChange={(e) => onAltChange(e.target.value)}
          placeholder="Describe the hero image for accessibility and SEO"
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
        />
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, ImageIcon, Monitor, Smartphone, X } from 'lucide-react';
import { MediaLibraryGrid } from '@/components/pages/admin/site-content/MediaLibraryGrid';
import { dashboardHref } from '@/lib/base-path';
import { cn } from '@/lib/utils';

type Device = 'desktop' | 'mobile';

function displayUrl(value: string): string {
  return value.startsWith('data:') ? '' : value;
}

function DevicePicker({
  device,
  label,
  hint,
  aspectClass,
  frameClass,
  value,
  onChange,
}: {
  device: Device;
  label: string;
  hint: string;
  aspectClass: string;
  frameClass?: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const url = displayUrl(value);
  const Icon = device === 'desktop' ? Monitor : Smartphone;

  const copyUrl = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
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
            className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11px] font-semibold hover:bg-muted"
          >
            <Copy size={12} />
            Copy URL
          </button>
        ) : null}
      </div>

      <div className={cn('mx-auto w-full', device === 'mobile' ? 'max-w-[220px]' : 'max-w-full')}>
        <div
          className={cn(
            'relative overflow-hidden rounded-xl border border-border bg-black/30 shadow-inner',
            frameClass,
            aspectClass,
          )}
        >
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
              <span className="text-[11px] font-medium">No {device} hero</span>
            </div>
          )}
          {device === 'mobile' ? (
            <div className="pointer-events-none absolute inset-x-[18%] top-0 h-4 rounded-b-xl bg-black/80" />
          ) : null}
        </div>
      </div>

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

      <div className="grid gap-4 lg:grid-cols-2">
        <DevicePicker
          device="desktop"
          label="Desktop hero"
          hint="Recommended 1200×750 (16:10) — email clients & article header"
          aspectClass="aspect-[16/10]"
          value={desktopUrl}
          onChange={onDesktopChange}
        />
        <DevicePicker
          device="mobile"
          label="Mobile hero"
          hint="Recommended 750×1334 (9:16) — phone preview & narrow inboxes"
          aspectClass="aspect-[9/16]"
          frameClass="rounded-[1.75rem] border-2 border-slate-700"
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

'use client';

import React, { useRef, useState } from 'react';
import { ImageIcon, Loader2, Monitor, Smartphone, Upload, X } from 'lucide-react';
import { MediaLibraryGrid } from '@/components/pages/admin/site-content/MediaLibraryGrid';
import { uploadMediaFile } from '@/lib/cms/media-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type SlotProps = {
  label: string;
  device: 'desktop' | 'mobile';
  value: string;
  onChange: (url: string) => void;
  onError: (message: string) => void;
};

function FrameSlot({ label, device, value, onChange, onError }: SlotProps) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const isMobile = device === 'mobile';
  const Icon = isMobile ? Smartphone : Monitor;

  const uploadFile = async (file: File) => {
    setUploading(true);
    onError('');
    try {
      const result = await uploadMediaFile(file);
      onChange(result.url);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-3">
      <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
        <Icon size={14} className="text-brand-orange" aria-hidden />
        {label}
      </p>

      <div className="flex justify-center">
        {isMobile ? (
          <div
            className="relative w-full max-w-[120px] overflow-hidden rounded-[1.25rem] border-[4px] border-slate-700 bg-black shadow-inner"
            style={{ aspectRatio: '9/16' }}
          >
            <div className="absolute inset-x-0 top-0 flex justify-center border-b border-slate-800 bg-slate-900 py-1">
              <div className="h-1 w-8 rounded-full bg-slate-600" />
            </div>
            <div className="absolute inset-0 top-4">
              {value ? (
                <img src={value} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground">
                  <ImageIcon size={18} className="opacity-40" />
                  <span className="text-[9px] font-medium">9:16</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="relative aspect-[16/10] w-full max-w-[220px] overflow-hidden rounded-lg border border-border bg-muted/30 shadow-inner">
            {value ? (
              <img src={value} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground">
                <ImageIcon size={22} className="opacity-40" />
                <span className="text-[10px] font-medium">16:10</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="brand"
          className="h-8 gap-1.5 text-xs"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          Upload
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 text-xs"
          onClick={() => setLibraryOpen(true)}
        >
          Library
        </Button>
        {value ? (
          <Button type="button" size="sm" variant="ghost" className="h-8 text-xs" onClick={() => onChange('')}>
            Clear
          </Button>
        ) : null}
      </div>

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isMobile ? 'Mobile URL (optional)' : 'Desktop URL'}
        className="h-8 text-xs"
      />

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void uploadFile(file);
          e.target.value = '';
        }}
      />

      {libraryOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-sm font-bold">Media library — {label}</h3>
              <button type="button" onClick={() => setLibraryOpen(false)} className="rounded-lg p-2 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              <MediaLibraryGrid
                compact
                onSelect={(selected) => {
                  onChange(selected);
                  setLibraryOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function FigureImagePicker({
  open,
  onClose,
  onInsert,
}: {
  open: boolean;
  onClose: () => void;
  onInsert: (desktop: string, mobile: string, alt: string) => void;
}) {
  const [desktop, setDesktop] = useState('');
  const [mobile, setMobile] = useState('');
  const [alt, setAlt] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const previewDesktop = desktop.trim();
  const previewMobile = mobile.trim() || previewDesktop;

  return (
    <div className="border-b border-border bg-muted/40 px-3 py-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-foreground">Insert image (desktop + mobile)</p>
        <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
          <X size={14} />
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <FrameSlot
          label="Desktop (16:10)"
          device="desktop"
          value={desktop}
          onChange={setDesktop}
          onError={setError}
        />
        <FrameSlot
          label="Mobile (9:16)"
          device="mobile"
          value={mobile}
          onChange={setMobile}
          onError={setError}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-2">
        <div className="min-w-0 flex-1">
          <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Caption</label>
          <Input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Describe the image"
            className="h-8 text-xs"
          />
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 text-xs"
          disabled={!previewDesktop}
          onClick={() => {
            if (previewDesktop && !mobile.trim()) setMobile(previewDesktop);
          }}
        >
          Copy desktop → mobile
        </Button>
        <Button
          type="button"
          size="sm"
          variant="brand"
          className={cn('h-8 shrink-0 px-4 text-xs')}
          disabled={!previewDesktop}
          onClick={() => {
            onInsert(previewDesktop, previewMobile || previewDesktop, alt.trim() || 'Article image');
            setDesktop('');
            setMobile('');
            setAlt('');
            setError('');
            onClose();
          }}
        >
          Insert
        </Button>
      </div>

      {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

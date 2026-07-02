'use client';

import React, { useRef, useState } from 'react';
import { ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { uploadMediaFile } from '@/lib/cms/media-api';
import { cn } from '@/lib/utils';

type Props = {
  imageUrl: string;
  onImageChange: (url: string) => void;
  /** When set, also sync mobile hero to the same URL (featured image). */
  onMobileSync?: (url: string) => void;
  className?: string;
};

export function FeaturedImageUploader({ imageUrl, onImageChange, onMobileSync, className }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const url = imageUrl.trim();

  const applyUrl = (next: string) => {
    onImageChange(next);
    if (next && onMobileSync) onMobileSync(next);
  };

  const upload = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const result = await uploadMediaFile(file);
      applyUrl(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="overflow-hidden rounded-xl border border-border bg-muted/20">
        {url ? (
          <div className="relative aspect-[16/10] w-full">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => {
                onImageChange('');
                onMobileSync?.('');
              }}
              className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-red-500/90"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex aspect-[16/10] flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon className="h-10 w-10 opacity-40" aria-hidden />
            <p className="text-sm">No image yet</p>
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background disabled:opacity-60 sm:w-auto"
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        Upload Image
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.jpg,.jpeg,.png,.webp,.gif,.svg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.target.value = '';
        }}
      />

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

/** Modal — same Featured Image / Upload Image UI for inserting into article body. */
export function FeaturedImageUploadDialog({
  open,
  onClose,
  onInsert,
}: {
  open: boolean;
  onClose: () => void;
  onInsert: (url: string, alt: string) => void;
}) {
  const [imageUrl, setImageUrl] = useState('');
  const [alt, setAlt] = useState('');

  if (!open) return null;

  const handleClose = () => {
    setImageUrl('');
    setAlt('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        role="dialog"
        aria-labelledby="featured-image-dialog-title"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 id="featured-image-dialog-title" className="text-base font-bold text-foreground">
              Featured Image
            </h3>
            <p className="text-sm text-muted-foreground">Upload Image</p>
          </div>
          <button type="button" onClick={handleClose} className="rounded-lg p-2 hover:bg-muted" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <FeaturedImageUploader imageUrl={imageUrl} onImageChange={setImageUrl} />

          {imageUrl.trim() ? (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Caption (optional)
              </label>
              <input
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Describe the image"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
              />
            </div>
          ) : null}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!imageUrl.trim()}
              onClick={() => {
                onInsert(imageUrl.trim(), alt.trim() || 'Article image');
                setImageUrl('');
                setAlt('');
                onClose();
              }}
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background disabled:opacity-40"
            >
              Insert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

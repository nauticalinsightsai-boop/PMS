'use client';

import React, { useRef, useState } from 'react';
import { CheckCircle2, ImageIcon, Loader2, Music, Upload, Video, X } from 'lucide-react';
import { MediaLibraryGrid } from '@/components/pages/admin/site-content/MediaLibraryGrid';
import { uploadMediaFile } from '@/lib/cms/media-api';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function MediaSection({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
          <Icon size={20} aria-hidden />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function AudioUpload({
  audioUrl,
  onChange,
}: {
  audioUrl: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const hasAudio = Boolean(audioUrl.trim());

  const upload = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const result = await uploadMediaFile(file, { kind: 'audio' });
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-6">
      {hasAudio ? (
        <div className="flex flex-col items-center gap-3 text-center">
          <Music className="h-10 w-10 text-emerald-600" aria-hidden />
          <p className="text-sm font-bold">Audio file attached</p>
          <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            Uploaded to cloud <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          </p>
          <audio src={audioUrl} controls className="mt-2 w-full max-w-md" preload="metadata" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="mt-2 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
          >
            Remove Audio
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <Music className="h-10 w-10 text-muted-foreground/40" aria-hidden />
          <p className="text-sm text-muted-foreground">No audio attached</p>
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background',
              uploading && 'opacity-60',
            )}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload Audio
          </button>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="audio/mpeg,audio/mp3,audio/wav,audio/mp4,audio/m4a,.mp3,.m4a,.wav"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.target.value = '';
        }}
      />
      {error ? <p className="mt-3 text-center text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function FeaturedImageUpload({
  imageUrl,
  mobileUrl,
  onImageChange,
  onMobileChange,
}: {
  imageUrl: string;
  mobileUrl: string;
  onImageChange: (url: string) => void;
  onMobileChange: (url: string) => void;
}) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const url = imageUrl.trim();

  const upload = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const result = await uploadMediaFile(file);
      onImageChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-border bg-muted/20">
        {url ? (
          <div className="relative aspect-[16/10] w-full">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => {
                onImageChange('');
                onMobileChange('');
              }}
              className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-red-500/90"
              aria-label="Remove featured image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex aspect-[16/10] flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon className="h-10 w-10 opacity-40" />
            <p className="text-sm">No featured image</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload Image
        </button>
        <button
          type="button"
          onClick={() => setLibraryOpen(true)}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
        >
          Choose from library
        </button>
        {url && !mobileUrl.trim() ? (
          <button
            type="button"
            onClick={() => onMobileChange(imageUrl)}
            className="rounded-lg border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
          >
            Set mobile hero same as featured
          </button>
        ) : null}
      </div>

      <Input
        value={url}
        onChange={(e) => onImageChange(e.target.value)}
        placeholder="Or paste image URL"
        className="text-sm"
      />

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

      {libraryOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="font-bold">Featured image — media library</h3>
              <button type="button" onClick={() => setLibraryOpen(false)} className="rounded-lg p-2 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              <MediaLibraryGrid
                compact
                onSelect={(selected) => {
                  onImageChange(selected);
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

export function ArticleMediaPanel({
  audioUrl,
  youtubeUrl,
  featuredImageUrl,
  featuredImageMobileUrl,
  onAudioChange,
  onYoutubeChange,
  onFeaturedChange,
  onFeaturedMobileChange,
}: {
  audioUrl: string;
  youtubeUrl: string;
  featuredImageUrl: string;
  featuredImageMobileUrl: string;
  onAudioChange: (url: string) => void;
  onYoutubeChange: (url: string) => void;
  onFeaturedChange: (url: string) => void;
  onFeaturedMobileChange: (url: string) => void;
}) {
  return (
    <div className="space-y-4">
      <MediaSection icon={Music} title="Audio File" subtitle="Upload Audio">
        <AudioUpload audioUrl={audioUrl} onChange={onAudioChange} />
      </MediaSection>

      <MediaSection icon={Video} title="YouTube Video" subtitle="YouTube Video URL">
        <Input
          value={youtubeUrl}
          onChange={(e) => onYoutubeChange(e.target.value)}
          placeholder="https://youtu.be/… or https://www.youtube.com/watch?v=…"
          className="text-sm"
        />
        <p className="mt-2 text-xs text-muted-foreground">Enter YouTube video URL (optional)</p>
      </MediaSection>

      <MediaSection icon={ImageIcon} title="Featured Image" subtitle="Upload Image">
        <FeaturedImageUpload
          imageUrl={featuredImageUrl}
          mobileUrl={featuredImageMobileUrl}
          onImageChange={onFeaturedChange}
          onMobileChange={onFeaturedMobileChange}
        />
      </MediaSection>
    </div>
  );
}

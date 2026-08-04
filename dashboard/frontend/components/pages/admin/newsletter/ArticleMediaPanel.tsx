'use client';

import React, { useId, useRef, useState } from 'react';
import { CheckCircle2, ImageIcon, Loader2, Music, Upload, Video } from 'lucide-react';
import { NewsletterHeroMedia } from '@/components/pages/admin/newsletter/NewsletterHeroMedia';
import { uploadMediaFile } from '@/lib/cms/media-api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
      {error ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ArticleMediaPanel({
  audioUrl,
  youtubeUrl,
  featuredImageUrl,
  featuredImageMobileUrl,
  heroImageAlt,
  onAudioChange,
  onYoutubeChange,
  onFeaturedChange,
  onFeaturedMobileChange,
  onHeroAltChange,
}: {
  audioUrl: string;
  youtubeUrl: string;
  featuredImageUrl: string;
  featuredImageMobileUrl: string;
  heroImageAlt: string;
  onAudioChange: (url: string) => void;
  onYoutubeChange: (url: string) => void;
  onFeaturedChange: (url: string) => void;
  onFeaturedMobileChange: (url: string) => void;
  onHeroAltChange: (alt: string) => void;
}) {
  const youtubeInputId = useId();

  return (
    <div className="space-y-4">
      <MediaSection icon={Music} title="Audio File" subtitle="Upload Audio">
        <AudioUpload audioUrl={audioUrl} onChange={onAudioChange} />
      </MediaSection>

      <MediaSection icon={Video} title="YouTube Video" subtitle="YouTube Video URL">
        <Label htmlFor={youtubeInputId} className="mb-2">
          YouTube video URL <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id={youtubeInputId}
          value={youtubeUrl}
          onChange={(e) => onYoutubeChange(e.target.value)}
          placeholder="https://youtu.be/… or https://www.youtube.com/watch?v=…"
          className="text-sm"
        />
        <p className="mt-2 text-xs text-muted-foreground">Paste a YouTube watch or share URL.</p>
      </MediaSection>

      <MediaSection icon={ImageIcon} title="Featured Image" subtitle="Desktop and mobile hero frames">
        <NewsletterHeroMedia
          desktopUrl={featuredImageUrl}
          mobileUrl={featuredImageMobileUrl}
          altText={heroImageAlt}
          onDesktopChange={onFeaturedChange}
          onMobileChange={onFeaturedMobileChange}
          onAltChange={onHeroAltChange}
        />
      </MediaSection>
    </div>
  );
}

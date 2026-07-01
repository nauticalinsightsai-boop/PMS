'use client';

import React from 'react';
import { Eye, Monitor, Smartphone } from 'lucide-react';
import { ArticleMarkdownPreview } from '@/components/marketing/ArticleMarkdownPreview';
import { youtubeEmbedUrl } from '@pms/site-content/youtube';
import {
  MOBILE_FRAME_HEIGHT,
  MOBILE_FRAME_WIDTH,
} from '@/components/pages/admin/newsletter/NewsletterHeroMedia';
import { cn } from '@/lib/utils';
import type { NewsletterPost } from '@/lib/newsletter-posts';

type Props = {
  post: NewsletterPost;
  device: 'desktop' | 'mobile';
  onDeviceChange: (device: 'desktop' | 'mobile') => void;
};

/** Shared viewport — desktop and mobile previews stay the same height. */
const PREVIEW_VIEWPORT_CLASS = 'h-[640px] overflow-hidden';

function MobilePhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center bg-muted/20 p-3">
      <div
        className="flex h-full max-h-full w-auto max-w-full flex-col overflow-hidden rounded-[2rem] border-[6px] border-slate-900 bg-white text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        style={{ aspectRatio: `${MOBILE_FRAME_WIDTH}/${MOBILE_FRAME_HEIGHT}` }}
      >
        <div className="flex shrink-0 items-center justify-center border-b border-slate-200 bg-slate-100 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
          <div className="h-1 w-14 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        <div className="flex shrink-0 justify-center border-t border-slate-200 bg-slate-100 py-1.5 dark:border-slate-800 dark:bg-slate-900">
          <div className="h-1 w-20 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>
      </div>
    </div>
  );
}

export function NewsletterLivePreview({ post, device, onDeviceChange }: Props) {
  const heroPreview =
    device === 'mobile' && post.featuredImageMobileUrl?.trim()
      ? post.featuredImageMobileUrl
      : post.featuredImageUrl;

  const isMobile = device === 'mobile';

  const previewBody = (
    <>
      <div className="border-b border-border bg-muted/40 px-3 py-2 text-[10px] font-medium text-muted-foreground">
        <p className="truncate font-bold text-foreground">
          {post.emailSubject.trim() || post.title || 'Subject line'}
        </p>
        <p className="truncate">
          {post.emailPreheader.trim() || post.metaDescription || 'Preheader preview text…'}
        </p>
      </div>

      {heroPreview?.trim() && !heroPreview.startsWith('data:') ? (
        <div className={isMobile ? 'aspect-[375/280] w-full' : 'aspect-[16/10] w-full'}>
          <img src={heroPreview} alt="" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div
          className={cn(
            'flex w-full items-center justify-center bg-muted/30 text-xs text-muted-foreground',
            isMobile ? 'aspect-[375/280]' : 'aspect-[16/10]',
          )}
        >
          Hero image preview
        </div>
      )}

      {post.youtubeUrl?.trim() ? (
        <div className="border-b border-border bg-black p-2">
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
            <iframe
              src={youtubeEmbedUrl(post.youtubeUrl) ?? post.youtubeUrl}
              title="YouTube preview"
              className="h-full w-full"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}

      {post.audioUrl?.trim() ? (
        <div className="border-b border-border bg-muted/30 px-3 py-2">
          <audio src={post.audioUrl} controls className="w-full" preload="metadata" />
        </div>
      ) : null}

      <div className={cn('space-y-3', isMobile ? 'p-3' : 'p-5')}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">
          {post.topics[0] || 'Newsletter'}
        </p>
        <h5 className={cn('font-heading font-bold leading-tight', isMobile ? 'text-sm' : 'text-lg')}>
          {post.title || 'Newsletter title'}
        </h5>
        <p className="text-xs text-muted-foreground line-clamp-3">
          {post.description || post.metaDescription || 'Excerpt appears here.'}
        </p>

        {post.content.trim() ? (
          <div className="border-t border-border pt-3">
            <ArticleMarkdownPreview content={post.content} device={device} compact />
          </div>
        ) : (
          <p className="text-xs italic text-muted-foreground">Article body preview appears here as you write.</p>
        )}

        {post.ctaLabel && post.ctaUrl ? (
          <span className="inline-block rounded-lg bg-brand-orange px-3 py-1.5 text-xs font-bold text-white">
            {post.ctaLabel}
          </span>
        ) : null}
      </div>
    </>
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="flex items-center gap-2 text-sm font-bold">
          <Eye size={14} className="text-brand-orange" />
          Live preview
        </h4>
        <div className="flex rounded-lg border border-border p-0.5 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => onDeviceChange('desktop')}
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-2 py-1',
              device === 'desktop' ? 'bg-brand-orange text-white' : 'text-muted-foreground',
            )}
          >
            <Monitor size={12} />
            Desktop
          </button>
          <button
            type="button"
            onClick={() => onDeviceChange('mobile')}
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-2 py-1',
              device === 'mobile' ? 'bg-brand-orange text-white' : 'text-muted-foreground',
            )}
          >
            <Smartphone size={12} />
            Mobile
          </button>
        </div>
      </div>

      <div className={cn('rounded-xl border border-border', PREVIEW_VIEWPORT_CLASS)}>
        {isMobile ? (
          <MobilePhoneFrame>{previewBody}</MobilePhoneFrame>
        ) : (
          <div className="flex h-full flex-col overflow-hidden bg-white text-slate-900 shadow-lg dark:bg-slate-950 dark:text-slate-100">
            <div className="min-h-0 flex-1 overflow-y-auto">{previewBody}</div>
          </div>
        )}
      </div>
    </div>
  );
}

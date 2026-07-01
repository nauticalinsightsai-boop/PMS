'use client';

import React from 'react';
import { Eye, Monitor, Smartphone } from 'lucide-react';
import { ArticleMarkdownPreview } from '@/components/marketing/ArticleMarkdownPreview';
import { cn } from '@/lib/utils';
import type { NewsletterPost } from '@/lib/newsletter-posts';

type Props = {
  post: NewsletterPost;
  device: 'desktop' | 'mobile';
  onDeviceChange: (device: 'desktop' | 'mobile') => void;
};

export function NewsletterLivePreview({ post, device, onDeviceChange }: Props) {
  const heroPreview =
    device === 'mobile' && post.featuredImageMobileUrl?.trim()
      ? post.featuredImageMobileUrl
      : post.featuredImageUrl;

  const isMobile = device === 'mobile';

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

      <div className="flex justify-center">
        <div
          className={cn(
            'overflow-hidden rounded-[1.75rem] border-[6px] border-slate-800 bg-white text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100',
            isMobile ? 'w-[320px]' : 'w-full max-w-full',
          )}
        >
          {isMobile ? (
            <div className="flex items-center justify-center border-b border-slate-200 bg-slate-100 px-4 py-1.5 dark:border-slate-800 dark:bg-slate-900">
              <div className="h-1 w-16 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>
          ) : null}

          <div
            className={cn(
              'overflow-y-auto',
              isMobile ? 'h-[580px]' : 'max-h-[640px]',
            )}
          >
            <div className="border-b border-border bg-muted/40 px-3 py-2 text-[10px] font-medium text-muted-foreground">
              <p className="truncate font-bold text-foreground">
                {post.emailSubject.trim() || post.title || 'Subject line'}
              </p>
              <p className="truncate">
                {post.emailPreheader.trim() || post.metaDescription || 'Preheader preview text…'}
              </p>
            </div>

            {heroPreview?.trim() && !heroPreview.startsWith('data:') ? (
              <div className={isMobile ? 'aspect-[9/16]' : 'aspect-[16/10]'}>
                <img src={heroPreview} alt="" className="h-full w-full object-cover" />
              </div>
            ) : (
              <div
                className={cn(
                  'flex items-center justify-center bg-muted/30 text-xs text-muted-foreground',
                  isMobile ? 'aspect-[9/16]' : 'aspect-[16/10]',
                )}
              >
                Hero image preview
              </div>
            )}

            <div className={cn('space-y-3', isMobile ? 'p-4' : 'p-5')}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">
                {post.topics[0] || 'Newsletter'}
              </p>
              <h5 className={cn('font-heading font-bold leading-tight', isMobile ? 'text-base' : 'text-lg')}>
                {post.title || 'Newsletter title'}
              </h5>
              <p className="text-xs text-muted-foreground">{post.description || post.metaDescription || 'Excerpt appears here.'}</p>

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
          </div>
        </div>
      </div>
    </div>
  );
}

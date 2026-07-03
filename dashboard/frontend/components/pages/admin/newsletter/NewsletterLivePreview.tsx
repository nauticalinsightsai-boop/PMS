'use client';

import React from 'react';
import { Eye } from 'lucide-react';
import { ArticleMarkdownPreview } from '@/components/marketing/ArticleMarkdownPreview';
import { youtubeEmbedUrl } from '@pms/site-content/youtube';
import type { NewsletterPost } from '@/lib/newsletter-posts';

type Props = {
  post: NewsletterPost;
};

const PREVIEW_VIEWPORT_CLASS = 'h-[640px] overflow-hidden';

export function NewsletterLivePreview({ post }: Props) {
  const heroPreview = post.featuredImageUrl;

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <h4 className="flex items-center gap-2 text-sm font-bold">
          <Eye size={14} className="text-brand-orange" />
          Live preview
        </h4>
        <span className="text-[11px] text-muted-foreground">Desktop / email</span>
      </div>

      <div className={`rounded-xl border border-border ${PREVIEW_VIEWPORT_CLASS}`}>
        <div className="flex h-full flex-col overflow-hidden bg-white text-slate-900 shadow-lg dark:bg-slate-950 dark:text-slate-100">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="border-b border-border bg-muted/40 px-3 py-2 text-[10px] font-medium text-muted-foreground">
              <p className="truncate font-bold text-foreground">
                {post.emailSubject.trim() || post.title || 'Subject line'}
              </p>
              <p className="truncate">
                {post.emailPreheader.trim() || post.metaDescription || 'Preheader preview text…'}
              </p>
            </div>

            {heroPreview?.trim() && !heroPreview.startsWith('data:') ? (
              <div className="aspect-[16/10] w-full">
                <img src={heroPreview} alt="" className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="flex aspect-[16/10] w-full items-center justify-center bg-muted/30 text-xs text-muted-foreground">
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

            <div className="space-y-3 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">
                {post.topics[0] || 'Newsletter'}
              </p>
              <h5 className="font-heading text-lg font-bold leading-tight">
                {post.title || 'Newsletter title'}
              </h5>
              <p className="line-clamp-3 text-xs text-muted-foreground">
                {post.description || post.metaDescription || 'Excerpt appears here.'}
              </p>

              {post.content.trim() ? (
                <div className="border-t border-border pt-3">
                  <div className="mx-auto w-full max-w-3xl">
                    <ArticleMarkdownPreview content={post.content} device="desktop" />
                  </div>
                </div>
              ) : (
                <p className="text-xs italic text-muted-foreground">
                  Article body preview appears here as you write.
                </p>
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

'use client';

import React, { useMemo, useRef, useState } from 'react';
import { FileText } from 'lucide-react';
import { MarkdownContentEditor, type MarkdownContentEditorHandle } from './MarkdownContentEditor';
import { NewsletterLivePreview } from './NewsletterLivePreview';
import { ArticleMediaPanel } from './ArticleMediaPanel';
import { estimateReadTime, type NewsletterPost } from '@/lib/newsletter-posts';

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-sm font-semibold text-foreground">
      {children}
      {required ? <span className="text-destructive"> *</span> : null}
    </label>
  );
}

type Props = {
  post: NewsletterPost;
  onChange: (patch: Partial<NewsletterPost>) => void;
};

export function NewsletterEditorWorkspace({ post, onChange }: Props) {
  const editorRef = useRef<MarkdownContentEditorHandle>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const readTime = useMemo(() => estimateReadTime(post.content), [post.content]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
      <div className="space-y-6">
        <ArticleMediaPanel
          audioUrl={post.audioUrl}
          youtubeUrl={post.youtubeUrl}
          featuredImageUrl={post.featuredImageUrl}
          featuredImageMobileUrl={post.featuredImageMobileUrl}
          heroImageAlt={post.heroImageAlt}
          onAudioChange={(url) => onChange({ audioUrl: url })}
          onYoutubeChange={(url) => onChange({ youtubeUrl: url })}
          onFeaturedChange={(url) => onChange({ featuredImageUrl: url })}
          onFeaturedMobileChange={(url) => onChange({ featuredImageMobileUrl: url })}
          onHeroAltChange={(alt) => onChange({ heroImageAlt: alt })}
        />

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
            <FileText size={18} className="text-emerald-600" />
            <h3 className="text-lg font-bold">Content</h3>
          </div>

          <div>
            <FieldLabel required>Article body</FieldLabel>
            <MarkdownContentEditor
              ref={editorRef}
              value={post.content}
              onChange={(content) => onChange({ content })}
              rows={20}
              placeholder="Write your article…"
            />
          </div>
        </section>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <NewsletterLivePreview
          post={post}
          device={previewDevice}
          onDeviceChange={setPreviewDevice}
        />

        <div className="rounded-2xl border border-border bg-muted/20 p-4 text-xs text-muted-foreground space-y-2">
          <p>
            <span className="font-bold text-foreground">Read time:</span> {readTime}
          </p>
          <p>
            <span className="font-bold text-foreground">Author:</span>{' '}
            {post.author.trim() || 'Not set'}
          </p>
          <p>
            <span className="font-bold text-foreground">Keywords:</span>{' '}
            {post.keywords.trim() || 'Not set'}
          </p>
          <p className="pt-1 text-[11px] leading-relaxed">
            Audio, YouTube, featured image, and body content publish to{' '}
            <strong>/newsletter/[slug]</strong> and <strong>/blog/[slug]</strong> when you update the post.
          </p>
        </div>
      </aside>
    </div>
  );
}

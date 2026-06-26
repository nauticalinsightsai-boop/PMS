'use client';

import React, { useMemo, useState } from 'react';
import {
  CalendarClock,
  Eye,
  LayoutList,
  ListChecks,
  Mail,
  Megaphone,
  Sparkles,
  Users,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { estimateReadTime, type NewsletterEditorMeta, type NewsletterPost } from '@/lib/newsletter-posts';
import {
  buildNewsletterScaffold,
  CONTENT_SNIPPETS,
  extractContentOutline,
  NEWSLETTER_SEGMENTS,
  NEWSLETTER_TEMPLATES,
  NEWSLETTER_TONES,
  type NewsletterSegmentId,
  type NewsletterTemplateId,
  type NewsletterTone,
} from './newsletter-editor-config';

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-sm font-semibold text-foreground">
      {children}
      {required ? <span className="text-destructive"> *</span> : null}
    </label>
  );
}

function selectClass() {
  return 'h-10 w-full rounded-lg border border-input bg-background px-3 text-sm';
}

type Props = {
  post: NewsletterPost;
  onChange: (patch: Partial<NewsletterPost>) => void;
  onMetaChange: (patch: Partial<NewsletterEditorMeta>) => void;
};

export function NewsletterEditorWorkspace({ post, onChange, onMetaChange }: Props) {
  const meta = post.editorMeta;
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const segmentLabel =
    NEWSLETTER_SEGMENTS.find((item) => item.id === meta.segment)?.label ?? 'All subscribers';
  const templateMeta =
    NEWSLETTER_TEMPLATES.find((item) => item.id === meta.template) ?? NEWSLETTER_TEMPLATES[0];

  const contentWordCount = useMemo(
    () => post.content.trim().split(/\s+/).filter(Boolean).length,
    [post.content],
  );
  const notesWordCount = useMemo(
    () => meta.rawNotes.trim().split(/\s+/).filter(Boolean).length,
    [meta.rawNotes],
  );
  const outline = useMemo(() => extractContentOutline(post.content), [post.content]);
  const readTime = useMemo(() => estimateReadTime(post.content), [post.content]);

  const heroPreview =
    previewDevice === 'mobile' && post.featuredImageMobileUrl?.trim()
      ? post.featuredImageMobileUrl
      : post.featuredImageUrl;

  const applyScaffold = () => {
    onChange({
      content: buildNewsletterScaffold({
        title: post.title,
        tone: meta.tone as NewsletterTone,
        template: meta.template as NewsletterTemplateId,
        segmentLabel,
        sectionCount: meta.sectionCount,
        rawNotes: meta.rawNotes,
        ctaLabel: post.ctaLabel,
        ctaUrl: post.ctaUrl,
        preheader: post.emailPreheader,
      }),
    });
  };

  const appendSnippet = (text: string) => {
    onChange({ content: `${post.content.trimEnd()}${text}` });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-brand-orange/5 via-background to-brand-purple/5 p-5">
          <h3 className="mb-1 flex items-center gap-2 text-base font-bold font-heading">
            <Sparkles size={18} className="text-brand-orange" />
            Newsletter Editor Workspace
          </h3>
          <p className="text-sm text-muted-foreground">
            Plan delivery, structure, and copy in one place — then publish to the site registry.
          </p>
        </div>

        <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            <Mail size={14} />
            Email delivery
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel>Email subject</FieldLabel>
              <Input
                value={post.emailSubject}
                onChange={(e) => onChange({ emailSubject: e.target.value })}
                placeholder={post.title || 'Defaults to newsletter title when sending'}
              />
            </div>
            <div>
              <FieldLabel>Author byline</FieldLabel>
              <Input
                value={post.author}
                onChange={(e) => onChange({ author: e.target.value })}
                placeholder="PM Structure Editorial"
              />
            </div>
          </div>
          <div>
            <FieldLabel>Preheader (inbox preview)</FieldLabel>
            <Input
              value={post.emailPreheader}
              onChange={(e) => onChange({ emailPreheader: e.target.value })}
              placeholder="One line shown after the subject in Gmail and Apple Mail"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {(post.emailPreheader || post.metaDescription).length}/90 characters recommended
            </p>
          </div>
          {post.status === 'scheduled' ? (
            <div>
              <FieldLabel>Scheduled publish</FieldLabel>
              <div className="flex items-center gap-2">
                <CalendarClock size={16} className="text-muted-foreground shrink-0" />
                <input
                  type="datetime-local"
                  value={
                    post.publishDate
                      ? new Date(post.publishDate).toISOString().slice(0, 16)
                      : ''
                  }
                  onChange={(e) =>
                    onChange({
                      publishDate: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : post.publishDate,
                    })
                  }
                  className={selectClass()}
                />
              </div>
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            <LayoutList size={14} />
            Strategy & structure
          </h4>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <FieldLabel>Tone</FieldLabel>
              <select
                value={meta.tone}
                onChange={(e) => onMetaChange({ tone: e.target.value })}
                className={selectClass()}
                aria-label="Newsletter tone"
              >
                {NEWSLETTER_TONES.map((item) => (
                  <option key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel>Template</FieldLabel>
              <select
                value={meta.template}
                onChange={(e) => onMetaChange({ template: e.target.value })}
                className={selectClass()}
                aria-label="Newsletter template"
              >
                {NEWSLETTER_TEMPLATES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted-foreground">{templateMeta.description}</p>
            </div>
            <div>
              <FieldLabel>Subscriber segment</FieldLabel>
              <select
                value={meta.segment}
                onChange={(e) => onMetaChange({ segment: e.target.value as NewsletterSegmentId })}
                className={selectClass()}
                aria-label="Subscriber segment"
              >
                {NEWSLETTER_SEGMENTS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel>Planned sections</FieldLabel>
              <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3">
                <ListChecks size={14} className="text-muted-foreground" />
                <input
                  type="number"
                  min={2}
                  max={8}
                  value={meta.sectionCount}
                  aria-label="Planned section count"
                  onChange={(e) =>
                    onMetaChange({
                      sectionCount: Number.isFinite(Number(e.target.value))
                        ? Number(e.target.value)
                        : 4,
                    })
                  }
                  className="h-10 w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>
          </div>
          <div>
            <FieldLabel>Primary CTA</FieldLabel>
            <div className="grid gap-2 md:grid-cols-2">
              <Input
                value={post.ctaLabel}
                onChange={(e) => onChange({ ctaLabel: e.target.value })}
                placeholder="Button label, e.g. Book pathway review"
              />
              <Input
                value={post.ctaUrl}
                onChange={(e) => onChange({ ctaUrl: e.target.value })}
                placeholder="https://pmstructure.com/..."
              />
            </div>
          </div>
          <div>
            <FieldLabel>Raw notes & sources</FieldLabel>
            <Textarea
              value={meta.rawNotes}
              onChange={(e) => onMetaChange({ rawNotes: e.target.value })}
              rows={4}
              placeholder="Paste quick notes, bullet points, links, interview quotes, or source snippets..."
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Users size={12} /> {segmentLabel}
            </span>
            <span>Notes: {notesWordCount} words · Content: {contentWordCount} words · {readTime}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="gap-2" onClick={applyScaffold}>
              <Wand2 size={14} />
              Build professional scaffold
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onMetaChange({ rawNotes: '' })}
              disabled={!meta.rawNotes.trim()}
            >
              Clear notes
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            <Megaphone size={14} />
            Insert blocks
          </h4>
          <div className="flex flex-wrap gap-2">
            {CONTENT_SNIPPETS.map((snippet) => (
              <button
                key={snippet.id}
                type="button"
                onClick={() => appendSnippet(snippet.text)}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-brand-orange/50 hover:bg-brand-orange/5"
              >
                + {snippet.label}
              </button>
            ))}
          </div>
          {outline.length > 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Section outline ({outline.length})
              </p>
              <ol className="space-y-1 text-sm text-foreground">
                {outline.map((heading) => (
                  <li key={heading} className="flex gap-2">
                    <span className="text-brand-orange">#</span>
                    {heading}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </section>

        <div>
          <FieldLabel required>Post content</FieldLabel>
          <Textarea
            value={post.content}
            onChange={(e) => onChange({ content: e.target.value })}
            rows={18}
            className="min-h-96 font-mono text-sm leading-relaxed"
          />
        </div>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h4 className="flex items-center gap-2 text-sm font-bold">
              <Eye size={14} className="text-brand-orange" />
              Live preview
            </h4>
            <div className="flex rounded-lg border border-border p-0.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`rounded-md px-2 py-1 ${previewDevice === 'desktop' ? 'bg-brand-orange text-white' : 'text-muted-foreground'}`}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`rounded-md px-2 py-1 ${previewDevice === 'mobile' ? 'bg-brand-orange text-white' : 'text-muted-foreground'}`}
              >
                Mobile
              </button>
            </div>
          </div>

          <div
            className={`mx-auto overflow-hidden rounded-xl border border-border bg-white text-slate-900 shadow-lg dark:bg-slate-950 dark:text-slate-100 ${
              previewDevice === 'mobile' ? 'max-w-[280px]' : 'w-full'
            }`}
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
              <div className={previewDevice === 'mobile' ? 'aspect-[9/16]' : 'aspect-[16/10]'}>
                <img src={heroPreview} alt="" className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center bg-muted/30 text-xs text-muted-foreground">
                Hero image preview
              </div>
            )}
            <div className="space-y-2 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">
                {post.topics[0] || 'Newsletter'}
              </p>
              <h5 className="font-heading text-lg font-bold leading-tight">
                {post.title || 'Newsletter title'}
              </h5>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {post.description || post.metaDescription || 'Excerpt appears here.'}
              </p>
              {post.ctaLabel && post.ctaUrl ? (
                <span className="inline-block rounded-lg bg-brand-orange px-3 py-1.5 text-xs font-bold text-white">
                  {post.ctaLabel}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-muted/20 p-4 text-xs text-muted-foreground space-y-2">
          <p>
            <span className="font-bold text-foreground">Template:</span> {templateMeta.label}
          </p>
          <p>
            <span className="font-bold text-foreground">Read time:</span> {readTime}
          </p>
          <p>
            <span className="font-bold text-foreground">Keywords:</span>{' '}
            {post.keywords.trim() || 'Not set'}
          </p>
        </div>
      </aside>
    </div>
  );
}

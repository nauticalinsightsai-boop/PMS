'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ImageIcon,
  Loader2,
  ListChecks,
  Save,
  Search,
  Sparkles,
  Tag,
  Users,
  Wand2,
} from 'lucide-react';
import { MediaPicker } from '@/components/pages/admin/site-content/MediaPicker';
import { Button } from '@/components/ui/button';
import { NavLinkButton } from '@/components/ui/nav-link-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { WEBSITE_CMS_PATHS } from '@/constants/websiteCmsPaths';
import { useNewsletterPosts } from '@/hooks/useNewsletterPosts';
import {
  createEmptyPost,
  slugifyTitle,
  type NewsletterPost,
  type NewsletterPostStatus,
} from '@/lib/newsletter-posts';

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-sm font-semibold text-foreground">
      {children}
      {required ? <span className="text-destructive"> *</span> : null}
    </label>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-bold font-heading">
        <Icon size={18} className="text-muted-foreground" aria-hidden />
        {title}
      </h2>
      {children}
    </section>
  );
}

const NEWSLETTER_TONES = ['informative', 'casual', 'witty', 'formal', 'friendly'] as const;
const NEWSLETTER_SEGMENTS = [
  { id: 'all', label: 'All subscribers' },
  { id: 'new', label: 'New welcome' },
  { id: 'premium', label: 'Premium exclusive' },
  { id: 'inactive', label: 'Inactive re-engagement' },
] as const;
const NEWSLETTER_TEMPLATES = [
  { id: 'news_roundup', label: 'News Roundup' },
  { id: 'deep_dive', label: 'Deep Dive' },
  { id: 'tips_tricks', label: 'Tips & Tricks' },
  { id: 'spotlight', label: 'Spotlight' },
  { id: 'upcoming_events', label: 'Upcoming Events' },
  { id: 'reader_qa', label: 'Reader Q&A' },
] as const;

export function NewsletterPostEditor({ postId }: { postId?: string }) {
  const router = useRouter();
  const { getPostById, upsertPost, isLoading, isSaving } = useNewsletterPosts();
  const [post, setPost] = useState<NewsletterPost | null>(null);
  const [topicsInput, setTopicsInput] = useState('');
  const [rawNotes, setRawNotes] = useState('');
  const [tone, setTone] = useState<(typeof NEWSLETTER_TONES)[number]>('informative');
  const [segment, setSegment] = useState<(typeof NEWSLETTER_SEGMENTS)[number]['id']>('all');
  const [template, setTemplate] =
    useState<(typeof NEWSLETTER_TEMPLATES)[number]['id']>('news_roundup');
  const [sectionCount, setSectionCount] = useState(4);

  useEffect(() => {
    if (isLoading) return;
    if (postId) {
      const existing = getPostById(postId);
      if (existing) {
        setPost(existing);
        setTopicsInput(existing.topics.join(', '));
      } else {
        setPost(null);
      }
      return;
    }
    const empty = createEmptyPost();
    setPost(empty);
    setTopicsInput('');
  }, [getPostById, isLoading, postId]);

  const canSave = useMemo(() => Boolean(post?.title.trim() && post?.slug.trim()), [post]);
  const contentWordCount = useMemo(
    () => post?.content.trim().split(/\s+/).filter(Boolean).length ?? 0,
    [post?.content],
  );
  const notesWordCount = useMemo(
    () => rawNotes.trim().split(/\s+/).filter(Boolean).length,
    [rawNotes],
  );

  const updatePost = (patch: Partial<NewsletterPost>) => {
    setPost((current) => (current ? { ...current, ...patch } : current));
  };

  const handleTitleChange = (title: string) => {
    setPost((current) => {
      if (!current) return current;
      const shouldUpdateSlug = !postId || !current.slug || current.slug === slugifyTitle(current.title);
      return {
        ...current,
        title,
        slug: shouldUpdateSlug ? slugifyTitle(title) : current.slug,
        metaTitle: current.metaTitle || title,
      };
    });
  };

  const handleSave = async () => {
    if (!post) return;
    const topics = topicsInput
      .split(',')
      .map((topic) => topic.trim())
      .filter(Boolean);
    const publish = post.status === 'published' || post.status === 'scheduled';
    const saved = await upsertPost(
      {
        ...post,
        topics,
        publishDate:
          publish && !post.publishDate ? new Date().toISOString() : post.publishDate,
      },
      publish,
    );
    if (!postId) {
      router.replace(WEBSITE_CMS_PATHS.newsletterEdit(saved.id));
    }
  };

  const applyEditorScaffold = () => {
    if (!post) return;
    const templateLabel =
      NEWSLETTER_TEMPLATES.find((item) => item.id === template)?.label ?? 'Custom';
    const segmentLabel =
      NEWSLETTER_SEGMENTS.find((item) => item.id === segment)?.label ?? 'All subscribers';
    const sectionHeadings = Array.from({ length: Math.max(2, Math.min(8, sectionCount)) }).map(
      (_, index) => `## Section ${index + 1}`,
    );
    const notesBlock = rawNotes.trim()
      ? `\n## Source Notes\n${rawNotes
          .trim()
          .split('\n')
          .map((line) => (line.trim() ? `- ${line.trim().replace(/^-+\s*/, '')}` : ''))
          .filter(Boolean)
          .join('\n')}\n`
      : '';
    const scaffold = [
      `# ${post.title || 'Newsletter Draft'}`,
      '',
      `Audience Segment: ${segmentLabel}`,
      `Tone: ${tone}`,
      `Template: ${templateLabel}`,
      '',
      ...sectionHeadings,
      '',
      notesBlock.trimEnd(),
    ]
      .filter(Boolean)
      .join('\n');
    updatePost({ content: scaffold });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-56 items-center justify-center text-muted-foreground">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (postId && !post) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-medium">Newsletter post not found.</p>
        <NavLinkButton href={WEBSITE_CMS_PATHS.newsletter} className="mt-4">
          Back to newsletter
        </NavLinkButton>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const metaTitleCount = post.metaTitle.length;
  const metaDescriptionCount = post.metaDescription.length;
  const pageTitle = postId ? 'Edit Newsletter' : 'New Newsletter';
  const saveLabel = postId ? 'Update Newsletter' : 'Create Newsletter';

  return (
    <div className="space-y-6 pb-28">
      <div className="space-y-2">
        <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                Dashboard
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href={WEBSITE_CMS_PATHS.newsletter}
                className="hover:text-foreground transition-colors"
              >
                Newsletter
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-medium text-foreground">{postId ? 'Edit' : 'New'}</li>
          </ol>
        </nav>
        <div className="flex items-center gap-3">
          <Tag size={28} className="text-foreground" aria-hidden />
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-heading">{pageTitle}</h1>
            <p className="text-sm text-muted-foreground">Update newsletter information.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        <SectionCard title="Basic Information" icon={Tag}>
          <div className="space-y-4">
            <div>
              <FieldLabel required>Newsletter Name</FieldLabel>
              <Input value={post.title} onChange={(event) => handleTitleChange(event.target.value)} />
            </div>
            <div>
              <FieldLabel required>Slug</FieldLabel>
              <Input
                value={post.slug}
                onChange={(event) => updatePost({ slug: slugifyTitle(event.target.value) })}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                URL-friendly version (spaces convert to dashes).
              </p>
            </div>
            <div>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                value={post.description}
                onChange={(event) => updatePost({ description: event.target.value })}
                rows={4}
              />
            </div>
            <div>
              <FieldLabel>Topics</FieldLabel>
              <Input
                value={topicsInput}
                onChange={(event) => setTopicsInput(event.target.value)}
                placeholder="Safety, Certification"
              />
              <p className="mt-1 text-xs text-muted-foreground">Separate topics with commas.</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Feature Image" icon={ImageIcon}>
          <MediaPicker
            label="Feature image"
            value={
              post.featuredImageUrl.startsWith('data:') ? '' : post.featuredImageUrl
            }
            onChange={(url) => updatePost({ featuredImageUrl: url })}
          />
        </SectionCard>

        <SectionCard title="SEO Details" icon={Search}>
          <div className="space-y-4">
            <div>
              <FieldLabel>Meta Title</FieldLabel>
              <Input
                value={post.metaTitle}
                onChange={(event) => updatePost({ metaTitle: event.target.value })}
              />
              <p
                className={`mt-1 text-xs ${metaTitleCount > 60 ? 'text-destructive' : 'text-muted-foreground'}`}
              >
                {metaTitleCount}/60 characters (recommended: 50-60 characters)
              </p>
            </div>
            <div>
              <FieldLabel>Meta Description</FieldLabel>
              <Textarea
                value={post.metaDescription}
                onChange={(event) => updatePost({ metaDescription: event.target.value })}
                rows={4}
              />
              <p
                className={`mt-1 text-xs ${metaDescriptionCount > 160 ? 'text-destructive' : 'text-muted-foreground'}`}
              >
                {metaDescriptionCount}/160 characters (recommended: 150-160 characters)
              </p>
            </div>
            <div>
              <FieldLabel required>Status</FieldLabel>
              <select
                value={post.status}
                onChange={(event) =>
                  updatePost({ status: event.target.value as NewsletterPostStatus })
                }
                aria-label="Newsletter status"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="published">Active</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Content" icon={Tag}>
          <div className="mb-4 rounded-xl border border-border bg-muted/30 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Sparkles size={16} className="text-brand-orange" />
              Newsletter Editor Workspace
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <FieldLabel>Tone</FieldLabel>
                <select
                  value={tone}
                  onChange={(event) => setTone(event.target.value as (typeof NEWSLETTER_TONES)[number])}
                  aria-label="Newsletter tone"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
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
                  value={template}
                  onChange={(event) =>
                    setTemplate(event.target.value as (typeof NEWSLETTER_TEMPLATES)[number]['id'])
                  }
                  aria-label="Newsletter template"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  {NEWSLETTER_TEMPLATES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Subscriber Segment</FieldLabel>
                <select
                  value={segment}
                  onChange={(event) =>
                    setSegment(event.target.value as (typeof NEWSLETTER_SEGMENTS)[number]['id'])
                  }
                  aria-label="Newsletter subscriber segment"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  {NEWSLETTER_SEGMENTS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Planned Sections</FieldLabel>
                <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3">
                  <ListChecks size={14} className="text-muted-foreground" />
                  <input
                    type="number"
                    min={2}
                    max={8}
                    value={sectionCount}
                    aria-label="Planned section count"
                    onChange={(event) =>
                      setSectionCount(Number.isFinite(Number(event.target.value)) ? Number(event.target.value) : 4)
                    }
                    className="h-10 w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="mt-3">
              <FieldLabel>Raw Notes</FieldLabel>
              <Textarea
                value={rawNotes}
                onChange={(event) => setRawNotes(event.target.value)}
                rows={4}
                placeholder="Paste quick notes, bullet points, links, or source snippets..."
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Users size={12} /> Segment: {NEWSLETTER_SEGMENTS.find((item) => item.id === segment)?.label}
              </span>
              <span>Notes words: {notesWordCount}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" variant="outline" className="gap-2" onClick={applyEditorScaffold}>
                <Wand2 size={14} />
                Build Draft Scaffold
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="gap-2"
                onClick={() => setRawNotes('')}
                disabled={!rawNotes.trim()}
              >
                Clear Notes
              </Button>
            </div>
          </div>
          <FieldLabel required>Post Content</FieldLabel>
          <Textarea
            value={post.content}
            onChange={(event) => updatePost({ content: event.target.value })}
            rows={16}
            className="min-h-80 font-mono text-sm"
          />
          <p className="mt-2 text-xs text-muted-foreground">Content words: {contentWordCount}</p>
        </SectionCard>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:pl-[calc(var(--sidebar-width,16rem)+1rem)]">
        <div className="mx-auto flex max-w-4xl justify-end gap-3">
          <NavLinkButton href={WEBSITE_CMS_PATHS.newsletter} variant="brand" className="gap-2">
            <ArrowLeft size={16} />
            Cancel
          </NavLinkButton>
          <Button
            type="button"
            variant="brand"
            className="gap-2"
            disabled={!canSave || isSaving}
            onClick={() => void handleSave()}
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saveLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
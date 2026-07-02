'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Save,
  Search,
  Tag,
} from 'lucide-react';
import { NewsletterEditorWorkspace } from '@/components/pages/admin/newsletter/NewsletterEditorWorkspace';
import { FieldLabel, SectionCard } from '@/components/pages/admin/cms/CmsShared';
import { SyncStatusIndicator, type SyncStatus } from '@/components/shared/SyncStatusIndicator';
import { Button } from '@/components/ui/button';
import { NavLinkButton } from '@/components/ui/nav-link-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { WEBSITE_CMS_PATHS } from '@/constants/websiteCmsPaths';
import { dashboardHref } from '@/lib/base-path';
import { useNewsletterPosts } from '@/hooks/useNewsletterPosts';
import {
  createEmptyPost,
  slugifyTitle,
  type NewsletterPost,
  type NewsletterPostStatus,
} from '@/lib/newsletter-posts';

function serializePost(post: NewsletterPost, topicsInput: string): string {
  const topics = topicsInput
    .split(',')
    .map((topic) => topic.trim())
    .filter(Boolean);
  return JSON.stringify({ ...post, topics });
}

export function NewsletterPostEditor({ postId }: { postId?: string }) {
  const router = useRouter();
  const { getPostById, upsertPost, isLoading, isSaving, error: saveError } = useNewsletterPosts();
  const [post, setPost] = useState<NewsletterPost | null>(null);
  const [topicsInput, setTopicsInput] = useState('');
  const [baseline, setBaseline] = useState('');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [lastSynced, setLastSynced] = useState<Date | undefined>();

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

  // Load once per post route — do not reset on registry/realtime refresh while editing.
  useEffect(() => {
    if (isLoading) return;
    if (postId) {
      const existing = getPostById(postId);
      if (existing) {
        setPost(existing);
        setTopicsInput(existing.topics.join(', '));
        setBaseline(JSON.stringify({ ...existing, topics: existing.topics }));
        setSyncStatus('synced');
      } else {
        setPost(null);
      }
      return;
    }
    const empty = createEmptyPost();
    setPost(empty);
    setTopicsInput('');
    setBaseline(serializePost(empty, ''));
    setSyncStatus('pending');
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-init when route or load state changes
  }, [isLoading, postId]);

  const canSave = useMemo(() => Boolean(post?.title.trim() && post?.slug.trim()), [post]);

  const hasChanges = useMemo(() => {
    if (!post) return false;
    return serializePost(post, topicsInput) !== baseline;
  }, [post, topicsInput, baseline]);

  useEffect(() => {
    if (isSaving) {
      setSyncStatus('syncing');
      return;
    }
    if (saveError) {
      setSyncStatus('error');
      return;
    }
    setSyncStatus((current) => {
      if (current === 'error') return current;
      return hasChanges ? 'pending' : 'synced';
    });
  }, [hasChanges, isSaving, saveError]);

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
        emailSubject: current.emailSubject || title,
      };
    });
  };

  const buildPayload = (): NewsletterPost | null => {
    if (!post) return null;
    const topics = topicsInput
      .split(',')
      .map((topic) => topic.trim())
      .filter(Boolean);
    const publish = post.status === 'published' || post.status === 'scheduled';
    return {
      ...post,
      topics,
      heroImageAlt: post.heroImageAlt || post.title,
      publishDate: publish && !post.publishDate ? new Date().toISOString() : post.publishDate,
    };
  };

  const persist = async (publish: boolean) => {
    const payload = buildPayload();
    if (!payload) return;
    setSyncStatus('syncing');
    try {
      const saved = await upsertPost(payload, publish);
      const nextBaseline = JSON.stringify({ ...saved, topics: saved.topics });
      setBaseline(nextBaseline);
      setLastSynced(new Date());
      setSyncStatus('synced');
      if (!postId) {
        router.replace(WEBSITE_CMS_PATHS.newsletterEdit(saved.id));
      }
    } catch {
      setSyncStatus('error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-56 items-center justify-center text-muted-foreground">
        <Loader2 size={24} className="motion-safe:animate-spin [animation-duration:1.25s]" />
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
  const publicPaths = post.slug
    ? [
        { label: 'Newsletter page', href: `${siteUrl}/newsletter/${post.slug}` },
        { label: 'Blog page', href: `${siteUrl}/blog/${post.slug}` },
      ]
    : [];

  return (
    <div className="space-y-6 pb-28">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href={dashboardHref('/dashboard')} className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={WEBSITE_CMS_PATHS.newsletter} className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={WEBSITE_CMS_PATHS.newsletterPosts} className="hover:text-foreground transition-colors">
                  Posts
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-foreground">Edit</li>
              {postId ? (
                <>
                  <li aria-hidden>/</li>
                  <li className="font-mono text-xs text-muted-foreground">{postId}</li>
                </>
              ) : null}
            </ol>
          </nav>
          <div className="flex items-center gap-3">
            <Tag size={28} className="text-foreground" aria-hidden />
            <div>
              <h1 className="text-3xl font-bold tracking-tight font-heading">{pageTitle}</h1>
              <p className="text-sm text-muted-foreground">
                Edits sync to <strong>/newsletter</strong> and <strong>/blog</strong> when you publish.
              </p>
            </div>
          </div>
          {publicPaths.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {publicPaths.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                  <ExternalLink size={12} />
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <SyncStatusIndicator
          status={syncStatus}
          lastSynced={lastSynced}
          errorDetail={saveError}
        />
      </div>

      <div className="mx-auto max-w-6xl space-y-6">
        <SectionCard title="Basic Information" icon={Tag}>
          <div className="space-y-4">
            <div>
              <FieldLabel required>Newsletter name</FieldLabel>
              <Input value={post.title} onChange={(event) => handleTitleChange(event.target.value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel required>Slug</FieldLabel>
                <Input
                  value={post.slug}
                  onChange={(event) => updatePost({ slug: slugifyTitle(event.target.value) })}
                />
              </div>
              <div>
                <FieldLabel>Focus keywords</FieldLabel>
                <Input
                  value={post.keywords}
                  onChange={(event) => updatePost({ keywords: event.target.value })}
                  placeholder="PMP, safety management, HSE"
                />
              </div>
            </div>
            <div>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                value={post.description}
                onChange={(event) => updatePost({ description: event.target.value })}
                rows={3}
                placeholder="Short summary for listings and social shares"
              />
            </div>
            <div>
              <FieldLabel>Topics</FieldLabel>
              <Input
                value={topicsInput}
                onChange={(event) => setTopicsInput(event.target.value)}
                placeholder="Safety, Certification, Leadership"
              />
              <p className="mt-1 text-xs text-muted-foreground">Separate topics with commas.</p>
            </div>
          </div>
        </SectionCard>

        <NewsletterEditorWorkspace post={post} onChange={updatePost} />

        <SectionCard title="SEO & publishing" icon={Search}>
          <div className="space-y-4">
            <div>
              <FieldLabel>Meta title</FieldLabel>
              <Input
                value={post.metaTitle}
                onChange={(event) => updatePost({ metaTitle: event.target.value })}
              />
              <p
                className={`mt-1 text-xs ${metaTitleCount > 60 ? 'text-destructive' : 'text-muted-foreground'}`}
              >
                {metaTitleCount}/60 characters
              </p>
            </div>
            <div>
              <FieldLabel>Meta description</FieldLabel>
              <Textarea
                value={post.metaDescription}
                onChange={(event) => updatePost({ metaDescription: event.target.value })}
                rows={3}
              />
              <p
                className={`mt-1 text-xs ${metaDescriptionCount > 160 ? 'text-destructive' : 'text-muted-foreground'}`}
              >
                {metaDescriptionCount}/160 characters
              </p>
            </div>
            <div>
              <FieldLabel>Hero alt text</FieldLabel>
              <Input
                value={post.heroImageAlt}
                onChange={(event) => updatePost({ heroImageAlt: event.target.value })}
                placeholder="Describe the featured image for accessibility"
              />
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
                <option value="published">Active (visible on site)</option>
                <option value="draft">Draft (hidden on site)</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:pl-[calc(var(--sidebar-width,16rem)+1rem)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-3">
          <NavLinkButton href={WEBSITE_CMS_PATHS.newsletter} variant="brand" className="gap-2">
            <ArrowLeft size={16} />
            Cancel
          </NavLinkButton>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            disabled={!canSave || isSaving || !hasChanges}
            onClick={() => void persist(false)}
          >
            {isSaving ? <Loader2 size={16} className="motion-safe:animate-spin [animation-duration:1.25s]" /> : <Save size={16} />}
            Save draft
          </Button>
          <Button
            type="button"
            variant="default"
            className="gap-2 bg-foreground text-background hover:bg-foreground/90"
            disabled={!canSave || isSaving}
            onClick={() => void persist(true)}
          >
            {isSaving ? <Loader2 size={16} className="motion-safe:animate-spin [animation-duration:1.25s]" /> : <Save size={16} />}
            {postId ? 'Update Post' : 'Publish Post'}
          </Button>
        </div>
      </div>
    </div>
  );
}

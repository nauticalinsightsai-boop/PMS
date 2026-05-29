'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Loader2, Save, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLinkButton } from '@/components/ui/nav-link-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FeatureImageField,
  FieldLabel,
  SectionCard,
} from '@/components/pages/admin/cms/CmsShared';
import { useCmsPosts } from '@/hooks/useCmsPosts';
import { useCmsTopics } from '@/hooks/useCmsTopics';
import { slugifyTitle } from '@/lib/cms/slug';
import type { CmsStatus } from '@/lib/cms/types';
import type { CmsPost } from '@/lib/cms/posts';
import { createEmptyCmsPost } from '@/lib/cms/posts';

export type CmsPostEditorConfig = {
  postId?: string;
  basePath?: string;
  breadcrumbLabel?: string;
  editTitle?: string;
  newTitle?: string;
  saveUpdateLabel?: string;
  saveCreateLabel?: string;
  backLabel?: string;
};

const DEFAULT_POSTS_BASE = '/dashboard/cms/posts';

export function PostEditor({
  postId,
  basePath = DEFAULT_POSTS_BASE,
  breadcrumbLabel = 'Posts',
  editTitle = 'Edit Post',
  newTitle = 'New Post',
  saveUpdateLabel = 'Update Post',
  saveCreateLabel = 'Create Post',
  backLabel = 'Back to posts',
}: CmsPostEditorConfig) {
  const router = useRouter();
  const { getPostById, upsertPost, isLoading, isSaving } = useCmsPosts();
  const { topics } = useCmsTopics();
  const [post, setPost] = useState<CmsPost | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (postId) {
      setPost(getPostById(postId) ?? null);
      return;
    }
    setPost(createEmptyCmsPost());
  }, [getPostById, isLoading, postId]);

  const canSave = useMemo(() => Boolean(post?.title.trim() && post?.slug.trim()), [post]);

  const update = (patch: Partial<CmsPost>) => {
    setPost((current) => (current ? { ...current, ...patch } : current));
  };

  const handleTitleChange = (title: string) => {
    setPost((current) => {
      if (!current) return current;
      const shouldUpdateSlug =
        !postId || !current.slug || current.slug === slugifyTitle(current.title);
      return {
        ...current,
        title,
        slug: shouldUpdateSlug ? slugifyTitle(title) : current.slug,
        metaTitle: current.metaTitle || title,
      };
    });
  };

  const toggleTopic = (topicId: string) => {
    setPost((current) => {
      if (!current) return current;
      const has = current.topicIds.includes(topicId);
      return {
        ...current,
        topicIds: has
          ? current.topicIds.filter((id) => id !== topicId)
          : [...current.topicIds, topicId],
      };
    });
  };

  const handleSave = async () => {
    if (!post) return;
    const publish = post.status === 'active';
    const saved = await upsertPost(post, publish);
    if (!postId) {
      router.replace(`${basePath}/${saved.id}/edit`);
    }
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
        <p className="text-sm font-medium">Post not found.</p>
        <NavLinkButton href={basePath} className="mt-4">
          {backLabel}
        </NavLinkButton>
      </div>
    );
  }

  if (!post) return null;

  const metaTitleCount = post.metaTitle.length;
  const metaDescriptionCount = post.metaDescription.length;
  const pageTitle = postId ? editTitle : newTitle;
  const saveLabel = postId ? saveUpdateLabel : saveCreateLabel;

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
              <Link href={basePath} className="hover:text-foreground transition-colors">
                {breadcrumbLabel}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-medium text-foreground">{postId ? 'Edit' : 'New'}</li>
          </ol>
        </nav>
        <div className="flex items-center gap-3">
          <FileText size={28} className="text-foreground" aria-hidden />
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-heading">{pageTitle}</h1>
            <p className="text-sm text-muted-foreground">Update post information.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        <SectionCard title="Basic Information" icon={FileText}>
          <div className="space-y-4">
            <div>
              <FieldLabel required>Post Title</FieldLabel>
              <Input value={post.title} onChange={(e) => handleTitleChange(e.target.value)} />
            </div>
            <div>
              <FieldLabel required>Slug</FieldLabel>
              <Input
                value={post.slug}
                onChange={(e) => update({ slug: slugifyTitle(e.target.value) })}
              />
            </div>
            <div>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                value={post.description}
                onChange={(e) => update({ description: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <FieldLabel>Author</FieldLabel>
              <Input value={post.author} onChange={(e) => update({ author: e.target.value })} />
            </div>
            <div>
              <FieldLabel>Topics</FieldLabel>
              {topics.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No topics yet.{' '}
                  <Link href="/dashboard/cms/topics/new" className="text-brand-orange hover:underline">
                    Create a topic
                  </Link>
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => {
                    const selected = post.topicIds.includes(topic.id);
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => toggleTopic(topic.id)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          selected
                            ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                            : 'border-border text-muted-foreground hover:border-foreground/30'
                        }`}
                      >
                        {topic.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Feature Image" icon={FileText}>
          <FeatureImageField
            value={post.featuredImageUrl}
            onChange={(url) => update({ featuredImageUrl: url })}
          />
        </SectionCard>

        <SectionCard title="SEO Details" icon={Search}>
          <div className="space-y-4">
            <div>
              <FieldLabel>Meta Title</FieldLabel>
              <Input
                value={post.metaTitle}
                onChange={(e) => update({ metaTitle: e.target.value })}
              />
              <p
                className={`mt-1 text-xs ${metaTitleCount > 60 ? 'text-destructive' : 'text-muted-foreground'}`}
              >
                {metaTitleCount}/60 characters (recommended: 50–60 characters)
              </p>
            </div>
            <div>
              <FieldLabel>Meta Description</FieldLabel>
              <Textarea
                value={post.metaDescription}
                onChange={(e) => update({ metaDescription: e.target.value })}
                rows={4}
              />
              <p
                className={`mt-1 text-xs ${metaDescriptionCount > 160 ? 'text-destructive' : 'text-muted-foreground'}`}
              >
                {metaDescriptionCount}/160 characters (recommended: 150–160 characters)
              </p>
            </div>
            <div>
              <FieldLabel required>Status</FieldLabel>
              <select
                value={post.status}
                onChange={(e) => update({ status: e.target.value as CmsStatus })}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Content" icon={FileText}>
          <FieldLabel required>Post Content</FieldLabel>
          <Textarea
            value={post.content}
            onChange={(e) => update({ content: e.target.value })}
            rows={16}
            className="min-h-80 font-mono text-sm"
          />
        </SectionCard>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:pl-[calc(var(--sidebar-width,16rem)+1rem)]">
        <div className="mx-auto flex max-w-4xl justify-end gap-3">
          <NavLinkButton href={basePath} variant="brand" className="gap-2">
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

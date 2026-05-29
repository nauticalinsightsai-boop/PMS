'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save, Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLinkButton } from '@/components/ui/nav-link-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FeatureImageField,
  FieldLabel,
  SectionCard,
} from '@/components/pages/admin/cms/CmsShared';
import { useCmsTopics } from '@/hooks/useCmsTopics';
import { slugifyTitle } from '@/lib/cms/slug';
import type { CmsStatus } from '@/lib/cms/types';
import type { CmsTopic } from '@/lib/cms/topics';
import { createEmptyTopic } from '@/lib/cms/topics';

export function TopicEditor({ topicId }: { topicId?: string }) {
  const router = useRouter();
  const { getTopicById, upsertTopic, isLoading, isSaving } = useCmsTopics();
  const [topic, setTopic] = useState<CmsTopic | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (topicId) {
      setTopic(getTopicById(topicId) ?? null);
      return;
    }
    setTopic(createEmptyTopic());
  }, [getTopicById, isLoading, topicId]);

  const canSave = useMemo(() => Boolean(topic?.name.trim() && topic?.slug.trim()), [topic]);

  const update = (patch: Partial<CmsTopic>) => {
    setTopic((current) => (current ? { ...current, ...patch } : current));
  };

  const handleNameChange = (name: string) => {
    setTopic((current) => {
      if (!current) return current;
      const shouldUpdateSlug =
        !topicId || !current.slug || current.slug === slugifyTitle(current.name);
      return {
        ...current,
        name,
        slug: shouldUpdateSlug ? slugifyTitle(name) : current.slug,
        metaTitle: current.metaTitle || name,
      };
    });
  };

  const handleSave = async () => {
    if (!topic) return;
    const publish = topic.status === 'active';
    const saved = await upsertTopic(topic, publish);
    if (!topicId) {
      router.replace(`/dashboard/cms/topics/${saved.id}/edit`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-56 items-center justify-center text-muted-foreground">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (topicId && !topic) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-medium">Topic not found.</p>
        <NavLinkButton href="/dashboard/cms/topics" className="mt-4">
          Back to topics
        </NavLinkButton>
      </div>
    );
  }

  if (!topic) return null;

  const metaTitleCount = topic.metaTitle.length;
  const metaDescriptionCount = topic.metaDescription.length;
  const pageTitle = topicId ? 'Edit Topic' : 'New Topic';
  const saveLabel = topicId ? 'Update Topic' : 'Create Topic';

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
              <Link href="/dashboard/cms/topics" className="hover:text-foreground transition-colors">
                Topics
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-medium text-foreground">{topicId ? 'Edit' : 'New'}</li>
          </ol>
        </nav>
        <div className="flex items-center gap-3">
          <Tag size={28} className="text-foreground" aria-hidden />
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-heading">{pageTitle}</h1>
            <p className="text-sm text-muted-foreground">Update topic information.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        <SectionCard title="Basic Information" icon={Tag}>
          <div className="space-y-4">
            <div>
              <FieldLabel required>Topic Name</FieldLabel>
              <Input value={topic.name} onChange={(e) => handleNameChange(e.target.value)} />
            </div>
            <div>
              <FieldLabel required>Slug</FieldLabel>
              <Input
                value={topic.slug}
                onChange={(e) => update({ slug: slugifyTitle(e.target.value) })}
              />
            </div>
            <div>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                value={topic.description}
                onChange={(e) => update({ description: e.target.value })}
                rows={4}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Feature Image" icon={Tag}>
          <FeatureImageField
            value={topic.featuredImageUrl}
            onChange={(url) => update({ featuredImageUrl: url })}
          />
        </SectionCard>

        <SectionCard title="SEO Details" icon={Search}>
          <div className="space-y-4">
            <div>
              <FieldLabel>Meta Title</FieldLabel>
              <Input
                value={topic.metaTitle}
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
                value={topic.metaDescription}
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
                value={topic.status}
                onChange={(e) => update({ status: e.target.value as CmsStatus })}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:pl-[calc(var(--sidebar-width,16rem)+1rem)]">
        <div className="mx-auto flex max-w-4xl justify-end gap-3">
          <NavLinkButton href="/dashboard/cms/topics" variant="brand" className="gap-2">
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

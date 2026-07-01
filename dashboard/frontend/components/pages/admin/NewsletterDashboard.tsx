'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Rocket,
  Settings,
  Tag,
  Trash2,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLinkButton } from '@/components/ui/nav-link-button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { RefreshIcon } from '@/components/shared/RefreshIcon';
import { useNewsletterPosts } from '@/hooks/useNewsletterPosts';
import { useNewsletterSubscribers } from '@/hooks/useNewsletterSubscribers';
import { formatPostDate } from '@/lib/newsletter-posts';
import { WEBSITE_CMS_PATHS } from '@/constants/websiteCmsPaths';
import { cn } from '@/lib/utils';

function formatDashboardDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
          <Icon size={22} aria-hidden />
        </div>
      </div>
    </div>
  );
}

export function NewsletterDashboard() {
  const {
    posts,
    isLoading,
    isSaving,
    isRegistryPublished,
    lastSyncedCount,
    refresh,
    publishRegistry,
    deletePost,
  } = useNewsletterPosts();
  const { count: subscriberCount, isLoading: subscribersLoading } = useNewsletterSubscribers();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const topicCount = useMemo(() => {
    const topics = new Set<string>();
    for (const post of posts) {
      for (const topic of post.topics) {
        if (topic.trim()) topics.add(topic.trim());
      }
    }
    return topics.size;
  }, [posts]);

  const publishedCount = useMemo(
    () => posts.filter((post) => post.status === 'published' || post.status === 'scheduled').length,
    [posts],
  );

  const recentPosts = useMemo(
    () =>
      [...posts]
        .sort(
          (a, b) =>
            new Date(b.modifiedDate || b.publishDate).getTime() -
            new Date(a.modifiedDate || a.publishDate).getTime(),
        )
        .slice(0, 5),
    [posts],
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await publishRegistry();
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-foreground">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-foreground">Dashboard</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Welcome to your newsletter dashboard. Here&apos;s an overview of your content synced with
            the public site.
          </p>
          {lastSyncedCount > 0 ? (
            <p className="text-xs font-medium text-green-600">
              Synced {lastSyncedCount} article{lastSyncedCount === 1 ? '' : 's'} from site sources.
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="default"
            className="gap-2 bg-foreground text-background hover:bg-foreground/90"
            onClick={() => void handleRefresh()}
            disabled={isRefreshing || isSaving}
          >
            <RefreshIcon loading={isRefreshing} size={16} />
            Refresh
          </Button>
          <Button
            type="button"
            className="gap-2 bg-green-600 text-white hover:bg-green-600/90"
            onClick={() => void handlePublish()}
            disabled={isPublishing || isSaving || isRegistryPublished}
          >
            {isPublishing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Rocket size={16} />
            )}
            {isRegistryPublished ? 'Published' : 'Deploy Now'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Posts" value={isLoading ? '—' : posts.length} hint="+0 this month" icon={FileText} />
        <StatCard label="Total Topics" value={isLoading ? '—' : topicCount} hint="+0 this month" icon={Tag} />
        <StatCard
          label="Published"
          value={isLoading ? '—' : publishedCount}
          hint={`${posts.length - publishedCount} drafts`}
          icon={FileText}
        />
        <StatCard
          label="Total Subscribers"
          value={subscribersLoading ? '—' : subscriberCount}
          hint="Newsletter signups"
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold">Recent Posts</h2>
          </div>

          {isLoading ? (
            <div className="flex min-h-56 items-center justify-center text-muted-foreground">
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : recentPosts.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center gap-2 px-6 text-center text-sm text-muted-foreground">
              <FileText size={24} />
              <p>No posts yet. Create your first newsletter article.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recentPosts.map((post) => (
                <li
                  key={post.id}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDashboardDate(post.publishDate || post.modifiedDate)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <NavLinkButton
                      href={WEBSITE_CMS_PATHS.newsletterEdit(post.id)}
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${post.title}`}
                    >
                      <Pencil size={16} />
                    </NavLinkButton>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${post.title}`}
                      onClick={() => setDeleteId(post.id)}
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {posts.length > 5 ? (
            <div className="border-t border-border px-5 py-3">
              <Link
                href={WEBSITE_CMS_PATHS.newsletterPosts}
                className="text-sm font-medium text-brand-orange hover:underline"
              >
                View all {posts.length} posts
              </Link>
            </div>
          ) : null}
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>
            <div className="space-y-2 p-4">
              <NavLinkButton
                href={WEBSITE_CMS_PATHS.newsletterNew}
                variant="outline"
                className="h-12 w-full justify-start gap-2 text-base font-medium"
              >
                <Plus size={18} />
                Create New Post
              </NavLinkButton>
              <NavLinkButton
                href={WEBSITE_CMS_PATHS.newsletterPosts}
                variant="outline"
                className="h-12 w-full justify-start gap-2 text-base font-medium"
              >
                <FileText size={18} />
                All Posts ({posts.length})
              </NavLinkButton>
              <NavLinkButton
                href={WEBSITE_CMS_PATHS.newsletterSubscribers}
                variant="outline"
                className="h-12 w-full justify-start gap-2 text-base font-medium"
              >
                <Users size={18} />
                Subscribers
              </NavLinkButton>
              <NavLinkButton
                href={WEBSITE_CMS_PATHS.newsletterPosts}
                variant="outline"
                className="h-12 w-full justify-start gap-2 text-base font-medium"
              >
                <Settings size={18} />
                Manage Posts
              </NavLinkButton>
            </div>
          </section>

          <section className="rounded-2xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            <p>
              Posts here sync with <strong>/newsletter</strong> and <strong>/blog</strong> on the
              public site. Use <strong>Deploy Now</strong> to publish registry changes.
            </p>
            {posts.length > 0 ? (
              <p className="mt-2 text-xs">
                Latest update: {formatPostDate(posts[0]?.modifiedDate ?? posts[0]?.publishDate ?? '')}
              </p>
            ) : null}
          </section>
        </aside>
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete newsletter?"
        description="This removes the newsletter from the registry. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={async () => {
          if (!deleteId) return;
          await deletePost(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}

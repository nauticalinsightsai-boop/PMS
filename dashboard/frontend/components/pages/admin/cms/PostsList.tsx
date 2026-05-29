'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { FileText, Loader2, Pencil, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLinkButton } from '@/components/ui/nav-link-button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { cmsStatusBadge, cmsStatusLabel } from '@/components/pages/admin/cms/CmsShared';
import { useCmsPosts } from '@/hooks/useCmsPosts';
import { useCmsTopics } from '@/hooks/useCmsTopics';
import { cn } from '@/lib/utils';

export type CmsPostsViewConfig = {
  basePath?: string;
  title?: string;
  breadcrumbLabel?: string;
  subtitle?: string;
  newLabel?: string;
};

const DEFAULT_POSTS_BASE = '/dashboard/cms/posts';

export function PostsList({
  basePath = DEFAULT_POSTS_BASE,
  title = 'Posts',
  breadcrumbLabel = 'Posts',
  subtitle = 'Manage and organize your blog posts efficiently.',
  newLabel = 'New Post',
}: CmsPostsViewConfig = {}) {
  const { posts, isLoading, isSaving, refresh, deletePost } = useCmsPosts();
  const { topics } = useCmsTopics();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const topicNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const topic of topics) map.set(topic.id, topic.name);
    return map;
  }, [topics]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) || post.slug.toLowerCase().includes(query),
    );
  }, [posts, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-foreground">{breadcrumbLabel}</li>
            </ol>
          </nav>
          <div className="flex items-center gap-3">
            <FileText size={28} className="text-foreground" aria-hidden />
            <h1 className="text-3xl font-bold tracking-tight font-heading">{title}</h1>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              {posts.length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="brand"
            className="gap-2"
            onClick={() => void refresh()}
            disabled={isLoading || isSaving}
          >
            <RefreshCw size={16} className={cn(isLoading && 'animate-spin')} />
            Refresh
          </Button>
          <NavLinkButton href={`${basePath}/new`} variant="brand" className="gap-2">
            <Plus size={16} />
            {newLabel}
          </NavLinkButton>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search posts by title..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {isLoading ? (
          <div className="flex min-h-56 items-center justify-center text-muted-foreground">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 px-6 text-center">
            <FileText size={28} className="text-muted-foreground" />
            <p className="text-sm font-medium">No posts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Slug</th>
                  <th className="px-4 py-3 font-semibold">Topics</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post, index) => (
                  <tr key={post.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-4 text-muted-foreground">{index + 1}</td>
                    <td className="px-4 py-4 font-semibold text-foreground">{post.title}</td>
                    <td className="px-4 py-4 text-muted-foreground">{post.slug}</td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {post.topicIds.length > 0
                        ? post.topicIds
                            .map((id) => topicNameById.get(id))
                            .filter(Boolean)
                            .join(', ')
                        : '—'}
                    </td>
                    <td className="px-4 py-4">
                      <span className={cmsStatusBadge(post.status)}>{cmsStatusLabel(post.status)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <NavLinkButton
                          href={`${basePath}/${post.id}/edit`}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete post?"
        description="This removes the post from the registry. This action cannot be undone."
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

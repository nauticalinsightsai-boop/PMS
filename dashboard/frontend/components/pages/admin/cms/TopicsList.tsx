'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, Pencil, Plus, RefreshCw, Search, Tag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLinkButton } from '@/components/ui/nav-link-button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { cmsStatusBadge, cmsStatusLabel } from '@/components/pages/admin/cms/CmsShared';
import { useCmsTopics } from '@/hooks/useCmsTopics';
import { useCmsPosts } from '@/hooks/useCmsPosts';
import { cn } from '@/lib/utils';

export function TopicsList() {
  const { topics, isLoading, isSaving, refresh, deleteTopic } = useCmsTopics();
  const { posts } = useCmsPosts();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const postCountByTopic = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      for (const topicId of post.topicIds) {
        counts.set(topicId, (counts.get(topicId) ?? 0) + 1);
      }
    }
    return counts;
  }, [posts]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return topics.filter(
      (topic) =>
        topic.name.toLowerCase().includes(query) || topic.slug.toLowerCase().includes(query),
    );
  }, [topics, search]);

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
              <li className="font-medium text-foreground">Topics</li>
            </ol>
          </nav>
          <div className="flex items-center gap-3">
            <Tag size={28} className="text-foreground" aria-hidden />
            <h1 className="text-3xl font-bold tracking-tight font-heading">Topics</h1>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              {topics.length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage and organize your blog topics efficiently.
          </p>
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
          <NavLinkButton href="/dashboard/cms/topics/new" variant="brand" className="gap-2">
            <Plus size={16} />
            New Topic
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
            placeholder="Search topics by name..."
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
            <Tag size={28} className="text-muted-foreground" />
            <p className="text-sm font-medium">No topics found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Slug</th>
                  <th className="px-4 py-3 font-semibold">Posts</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((topic, index) => (
                  <tr key={topic.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-4 text-muted-foreground">{index + 1}</td>
                    <td className="px-4 py-4 font-semibold text-foreground">{topic.name}</td>
                    <td className="px-4 py-4 text-muted-foreground">{topic.slug}</td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {postCountByTopic.get(topic.id) ?? 0}
                    </td>
                    <td className="px-4 py-4">
                      <span className={cmsStatusBadge(topic.status)}>{cmsStatusLabel(topic.status)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <NavLinkButton
                          href={`/dashboard/cms/topics/${topic.id}/edit`}
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${topic.name}`}
                        >
                          <Pencil size={16} />
                        </NavLinkButton>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Delete ${topic.name}`}
                          onClick={() => setDeleteId(topic.id)}
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
        title="Delete topic?"
        description="This removes the topic from the registry. Posts linked to it will keep their other topic assignments."
        confirmLabel="Delete"
        onConfirm={async () => {
          if (!deleteId) return;
          await deleteTopic(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}

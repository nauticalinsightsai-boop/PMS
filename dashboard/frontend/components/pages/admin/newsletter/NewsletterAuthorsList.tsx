'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, Pencil, Plus, Search, Trash2, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLinkButton } from '@/components/ui/nav-link-button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { RefreshIcon } from '@/components/shared/RefreshIcon';
import { useNewsletterAuthors } from '@/hooks/useNewsletterAuthors';
import type { NewsletterAuthorStatus } from '@/lib/newsletter-authors';
import { WEBSITE_CMS_PATHS } from '@/constants/websiteCmsPaths';
import { cn } from '@/lib/utils';

function statusBadge(status: NewsletterAuthorStatus) {
  return cn(
    'inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
    status === 'active' && 'bg-green-500/10 text-green-600',
    status === 'draft' && 'bg-muted text-muted-foreground',
  );
}

export function NewsletterAuthorsList() {
  const { authors, isLoading, isSaving, refresh, deleteAuthor } = useNewsletterAuthors();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return authors.filter(
      (author) =>
        author.name.toLowerCase().includes(query) || author.slug.toLowerCase().includes(query),
    );
  }, [authors, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={WEBSITE_CMS_PATHS.newsletter} className="hover:text-foreground transition-colors">
                  Newsletter
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-foreground">Authors</li>
            </ol>
          </nav>
          <div className="flex items-center gap-3">
            <UserCircle size={28} className="text-foreground" aria-hidden />
            <h1 className="text-3xl font-bold tracking-tight font-heading">Authors</h1>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              {authors.length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Author profiles power bylines, avatars, and profile pages at{' '}
            <strong>/newsletter/author/[slug]</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="brand"
            className="gap-2"
            onClick={() => void handleRefresh()}
            disabled={isRefreshing || isSaving}
          >
            <RefreshIcon loading={isRefreshing} size={16} />
            Refresh
          </Button>
          <NavLinkButton href={WEBSITE_CMS_PATHS.newsletterAuthorNew} variant="brand" className="gap-2">
            <Plus size={16} />
            New Author
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
            placeholder="Search authors by name..."
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
            <UserCircle size={28} className="text-muted-foreground" />
            <p className="text-sm font-medium">No authors found</p>
            <p className="text-xs text-muted-foreground">
              Create an author to control bylines and profile pages.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Author</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Slug</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((author) => (
                  <tr key={author.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                          {author.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={author.avatarUrl}
                              alt={author.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                              <UserCircle size={18} />
                            </div>
                          )}
                        </div>
                        <span className="font-semibold text-foreground">{author.name || 'Untitled'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{author.title || '—'}</td>
                    <td className="px-4 py-4 text-muted-foreground">{author.slug || '—'}</td>
                    <td className="px-4 py-4">
                      <span className={statusBadge(author.status)}>{author.status}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <NavLinkButton
                          href={WEBSITE_CMS_PATHS.newsletterAuthorEdit(author.id)}
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${author.name}`}
                        >
                          <Pencil size={16} />
                        </NavLinkButton>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Delete ${author.name}`}
                          onClick={() => setDeleteId(author.id)}
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
        title="Delete author?"
        description="This removes the author profile. Posts keep the author name as plain text. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={async () => {
          if (!deleteId) return;
          await deleteAuthor(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}

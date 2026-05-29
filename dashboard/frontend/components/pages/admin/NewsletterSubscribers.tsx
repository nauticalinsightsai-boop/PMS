'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Mail, RefreshCw, Trash2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useNewsletterSubscribers } from '@/hooks/useNewsletterSubscribers';
import { cn } from '@/lib/utils';

function statusBadge(status: 'active' | 'inactive') {
  return cn(
    'inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
    status === 'active' && 'bg-green-500/10 text-green-600',
    status === 'inactive' && 'bg-muted text-muted-foreground',
  );
}

export function NewsletterSubscribers() {
  const { subscribers, count, isLoading, isDeleting, error, refresh, deleteSubscriber } =
    useNewsletterSubscribers();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const pendingDelete = subscribers.find((row) => row.id === deleteId);

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
              <li>
                <Link
                  href="/dashboard/booking-crm/newsletter"
                  className="hover:text-foreground transition-colors"
                >
                  Newsletter
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-foreground">Subscribers</li>
            </ol>
          </nav>
          <div className="flex items-center gap-3">
            <Mail size={28} className="text-foreground" aria-hidden />
            <h1 className="text-3xl font-bold tracking-tight font-heading">Subscribers</h1>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              {count}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage newsletter subscribers and their email addresses.
          </p>
        </div>

        <Button
          type="button"
          variant="brand"
          className="gap-2"
          onClick={() => void refresh()}
          disabled={isLoading || isDeleting}
        >
          <RefreshCw size={16} className={cn(isLoading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {isLoading ? (
          <div className="flex min-h-56 items-center justify-center text-muted-foreground">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 px-6 text-center">
            <Mail size={28} className="text-muted-foreground" />
            <p className="text-sm font-medium">No subscribers yet</p>
            <p className="text-xs text-muted-foreground">
              Newsletter signups from the public site will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Newsletter Email</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((row, index) => (
                  <tr key={row.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-4 text-muted-foreground">{index + 1}</td>
                    <td className="px-4 py-4 font-medium text-foreground">{row.email}</td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {format(new Date(row.createdAt), 'MMM d, yyyy, hh:mm a')}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{row.source}</td>
                    <td className="px-4 py-4">
                      <span className={statusBadge(row.status)}>{row.status}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Delete ${row.email}`}
                          disabled={isDeleting}
                          onClick={() => setDeleteId(row.id)}
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
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="Delete subscriber?"
        description={
          pendingDelete
            ? `Remove ${pendingDelete.email} from the newsletter list. This cannot be undone.`
            : 'Remove this subscriber from the newsletter list.'
        }
        confirmLabel="Delete"
        onConfirm={() => {
          if (!deleteId) return;
          void deleteSubscriber(deleteId).finally(() => setDeleteId(null));
        }}
        confirmDisabled={isDeleting}
      />
    </div>
  );
}

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save, UserCircle } from 'lucide-react';
import { FieldLabel, SectionCard } from '@/components/pages/admin/cms/CmsShared';
import { MediaPicker } from '@/components/pages/admin/site-content/MediaPicker';
import { SyncStatusIndicator, type SyncStatus } from '@/components/shared/SyncStatusIndicator';
import { Button } from '@/components/ui/button';
import { NavLinkButton } from '@/components/ui/nav-link-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { WEBSITE_CMS_PATHS } from '@/constants/websiteCmsPaths';
import { siteUrl } from '@/lib/site-config';
import { useNewsletterAuthors } from '@/hooks/useNewsletterAuthors';
import {
  createEmptyAuthor,
  slugifyAuthorName,
  type NewsletterAuthor,
  type NewsletterAuthorStatus,
} from '@/lib/newsletter-authors';

export function NewsletterAuthorEditor({ authorId }: { authorId?: string }) {
  const router = useRouter();
  const { getAuthorById, upsertAuthor, isLoading, isSaving, error: saveError } =
    useNewsletterAuthors();
  const [author, setAuthor] = useState<NewsletterAuthor | null>(null);
  const [baseline, setBaseline] = useState('');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [lastSynced, setLastSynced] = useState<Date | undefined>();

  const publicSiteUrl = siteUrl.replace(/\/$/, '');

  useEffect(() => {
    if (isLoading) return;
    if (authorId) {
      const existing = getAuthorById(authorId);
      if (existing) {
        setAuthor(existing);
        setBaseline(JSON.stringify(existing));
        setSyncStatus('synced');
      } else {
        setAuthor(null);
      }
      return;
    }
    const empty = createEmptyAuthor();
    setAuthor(empty);
    setBaseline(JSON.stringify(empty));
    setSyncStatus('pending');
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-init when route or load state changes
  }, [isLoading, authorId]);

  const canSave = useMemo(() => Boolean(author?.name.trim() && author?.slug.trim()), [author]);

  const hasChanges = useMemo(() => {
    if (!author) return false;
    return JSON.stringify(author) !== baseline;
  }, [author, baseline]);

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

  const update = (patch: Partial<NewsletterAuthor>) => {
    setAuthor((current) => (current ? { ...current, ...patch } : current));
  };

  const handleNameChange = (name: string) => {
    setAuthor((current) => {
      if (!current) return current;
      const shouldUpdateSlug = !authorId || !current.slug || current.slug === slugifyAuthorName(current.name);
      return {
        ...current,
        name,
        slug: shouldUpdateSlug ? slugifyAuthorName(name) : current.slug,
      };
    });
  };

  const handleSave = async () => {
    if (!author) return;
    setSyncStatus('syncing');
    try {
      const saved = await upsertAuthor(author);
      setAuthor(saved);
      setBaseline(JSON.stringify(saved));
      setLastSynced(new Date());
      setSyncStatus('synced');
      if (!authorId) {
        router.replace(WEBSITE_CMS_PATHS.newsletterAuthorEdit(saved.id));
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

  if (authorId && !author) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-medium">Author not found.</p>
        <NavLinkButton href={WEBSITE_CMS_PATHS.newsletterAuthors} className="mt-4">
          Back to authors
        </NavLinkButton>
      </div>
    );
  }

  if (!author) return null;

  const isLive = author.status === 'active';
  const profileHref = author.slug ? `${publicSiteUrl}/newsletter/author/${author.slug}` : null;

  return (
    <div className="space-y-6 pb-28">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href={WEBSITE_CMS_PATHS.newsletter} className="hover:text-foreground transition-colors">
                  Newsletter
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={WEBSITE_CMS_PATHS.newsletterAuthors} className="hover:text-foreground transition-colors">
                  Authors
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-foreground">{authorId ? 'Edit' : 'New'}</li>
            </ol>
          </nav>
          <div className="flex items-center gap-3">
            <UserCircle size={28} className="text-foreground" aria-hidden />
            <div>
              <h1 className="text-3xl font-bold tracking-tight font-heading">
                {authorId ? 'Edit Author' : 'New Author'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isLive && profileHref ? (
                  <>
                    Live profile:{' '}
                    <a
                      href={profileHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-foreground hover:underline"
                    >
                      /newsletter/author/{author.slug}
                    </a>
                  </>
                ) : (
                  <>Set status to Active to publish this profile.</>
                )}
              </p>
            </div>
          </div>
        </div>
        <SyncStatusIndicator status={syncStatus} lastSynced={lastSynced} errorDetail={saveError} />
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        <SectionCard title="Profile" icon={UserCircle}>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel htmlFor="newsletter-author-name" required>Name</FieldLabel>
                <Input id="newsletter-author-name" value={author.name} onChange={(event) => handleNameChange(event.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="newsletter-author-slug" required>Slug</FieldLabel>
                <Input
                  id="newsletter-author-slug"
                  value={author.slug}
                  onChange={(event) => update({ slug: slugifyAuthorName(event.target.value) })}
                />
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="newsletter-author-title">Role / title</FieldLabel>
              <Input
                id="newsletter-author-title"
                value={author.title}
                onChange={(event) => update({ title: event.target.value })}
                placeholder="Senior Editor"
              />
            </div>
            <div>
              <FieldLabel htmlFor="newsletter-author-bio">Bio</FieldLabel>
              <Textarea
                id="newsletter-author-bio"
                value={author.bio}
                onChange={(event) => update({ bio: event.target.value })}
                rows={4}
                placeholder="Short biography shown on the author profile page."
              />
            </div>
            <div>
              <MediaPicker
                label="Author photo"
                value={author.avatarUrl.startsWith('data:') ? '' : author.avatarUrl}
                onChange={(url) => update({ avatarUrl: url })}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Links & status" icon={UserCircle}>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel htmlFor="newsletter-author-linkedin">LinkedIn URL</FieldLabel>
                <Input
                  id="newsletter-author-linkedin"
                  value={author.linkedinUrl}
                  onChange={(event) => update({ linkedinUrl: event.target.value })}
                  placeholder="https://linkedin.com/in/…"
                />
              </div>
              <div>
                <FieldLabel htmlFor="newsletter-author-twitter">X / Twitter URL</FieldLabel>
                <Input
                  id="newsletter-author-twitter"
                  value={author.twitterUrl}
                  onChange={(event) => update({ twitterUrl: event.target.value })}
                  placeholder="https://x.com/…"
                />
              </div>
              <div>
                <FieldLabel htmlFor="newsletter-author-website">Website URL</FieldLabel>
                <Input
                  id="newsletter-author-website"
                  value={author.websiteUrl}
                  onChange={(event) => update({ websiteUrl: event.target.value })}
                  placeholder="https://…"
                />
              </div>
              <div>
                <FieldLabel htmlFor="newsletter-author-email">Email</FieldLabel>
                <Input
                  id="newsletter-author-email"
                  value={author.email}
                  onChange={(event) => update({ email: event.target.value })}
                  placeholder="name@pmstructure.com"
                />
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="newsletter-author-status" required>Status</FieldLabel>
              <select
                id="newsletter-author-status"
                value={author.status}
                onChange={(event) => update({ status: event.target.value as NewsletterAuthorStatus })}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="active">Active (visible on site)</option>
                <option value="draft">Draft (hidden on site)</option>
              </select>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:pl-[calc(var(--sidebar-width,16rem)+1rem)]">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-end gap-3">
          <NavLinkButton href={WEBSITE_CMS_PATHS.newsletterAuthors} variant="brand" className="gap-2">
            <ArrowLeft size={16} />
            Cancel
          </NavLinkButton>
          <Button
            type="button"
            variant="default"
            className="gap-2 bg-foreground text-background hover:bg-foreground/90"
            disabled={!canSave || isSaving}
            onClick={() => void handleSave()}
          >
            {isSaving ? (
              <Loader2 size={16} className="motion-safe:animate-spin [animation-duration:1.25s]" />
            ) : (
              <Save size={16} />
            )}
            Save author
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Save,
  Search,
  Tag,
  TableProperties,
} from 'lucide-react';
import { NewsletterEditorWorkspace } from '@/components/pages/admin/newsletter/NewsletterEditorWorkspace';
import { FieldLabel, SectionCard } from '@/components/pages/admin/cms/CmsShared';
import { SyncStatusIndicator, type SyncStatus } from '@/components/shared/SyncStatusIndicator';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { NavLinkButton } from '@/components/ui/nav-link-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { WEBSITE_CMS_PATHS } from '@/constants/websiteCmsPaths';
import { dashboardHref } from '@/lib/base-path';
import { siteUrl } from '@/lib/site-config';
import {
  WebsiteDataService,
  type Item07FirstTableReceipt,
} from '@/services/WebsiteDataService';
import { useNewsletterPosts } from '@/hooks/useNewsletterPosts';
import { useNewsletterAuthors } from '@/hooks/useNewsletterAuthors';
import { NewsletterLivePreview } from '@/components/pages/admin/newsletter/NewsletterLivePreview';
import {
  buildNewsletterPublishConfirmation,
  canPublishNewsletterPost,
  deriveNewsletterEditorState,
} from '@/lib/newsletter/editor-state';
import {
  createEmptyPost,
  slugifyTitle,
  type NewsletterPost,
} from '@/lib/newsletter-posts';

function serializePost(post: NewsletterPost, topicsInput: string): string {
  const topics = topicsInput
    .split(',')
    .map((topic) => topic.trim())
    .filter(Boolean);
  return JSON.stringify({ ...post, topics });
}

const ITEM07_POST_ID =
  'post-capm-2026-domain-map-fundamentals-predictive-agile-business-analysis';

export function NewsletterPostEditor({ postId }: { postId?: string }) {
  const router = useRouter();
  const {
    getPostById,
    getPostPersistence,
    saveDraftPost,
    publishPost,
    isLoading,
    isSaving,
    savingIntent,
    error: saveError,
  } = useNewsletterPosts();
  const { authors } = useNewsletterAuthors();
  const [post, setPost] = useState<NewsletterPost | null>(null);
  const [topicsInput, setTopicsInput] = useState('');
  const [baseline, setBaseline] = useState('');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [lastSynced, setLastSynced] = useState<Date | undefined>();
  const [lastSavedAsPublish, setLastSavedAsPublish] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [publishConfirmation, setPublishConfirmation] = useState('');
  const [publishVersion, setPublishVersion] = useState('');
  const errorAlertRef = useRef<HTMLDivElement>(null);
  const [tableReceipt, setTableReceipt] = useState<Item07FirstTableReceipt | null>(null);
  const [tableConfirmation, setTableConfirmation] = useState('');
  const [tableWriterBusy, setTableWriterBusy] = useState(false);
  const [tableWriterError, setTableWriterError] = useState('');

  const publicSiteUrl = siteUrl.replace(/\/$/, '');

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

  useEffect(() => {
    if (syncStatus === 'error') errorAlertRef.current?.focus();
  }, [syncStatus]);

  useEffect(() => {
    if (post?.id !== ITEM07_POST_ID || post?.status !== 'draft' || hasChanges) {
      setTableReceipt(null);
      setTableConfirmation('');
    }
  }, [hasChanges, post?.id, post?.status]);

  const updatePost = (patch: Partial<NewsletterPost>) => {
    setPost((current) => (current ? { ...current, ...patch } : current));
  };

  const runItem07TableWriter = async (
    action: 'preview' | 'apply' | 'rollback',
    commit = false,
  ) => {
    if (!post || post.id !== ITEM07_POST_ID || post.status !== 'draft' || hasChanges) return;
    setTableReceipt(null);
    setTableConfirmation('');
    setTableWriterBusy(true);
    setTableWriterError('');
    try {
      const receipt = await WebsiteDataService.item07FirstTable(
        action,
        commit
          ? {
              expectedUpdatedAt: tableReceipt?.updatedAt,
              confirmation: tableConfirmation,
            }
          : undefined,
      );
      setTableReceipt(receipt);
      setTableConfirmation('');
      if (receipt.wrote) window.location.reload();
    } catch (error) {
      setTableReceipt(null);
      setTableConfirmation('');
      setTableWriterError(error instanceof Error ? error.message : 'Item07 table writer failed.');
    } finally {
      setTableWriterBusy(false);
    }
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
    return {
      ...post,
      topics,
      heroImageAlt: post.heroImageAlt || post.title,
    };
  };

  const saveDraft = async () => {
    const payload = buildPayload();
    if (!payload) return;
    setSyncStatus('syncing');
    try {
      const saved = await saveDraftPost(payload);
      const nextBaseline = JSON.stringify({ ...saved, topics: saved.topics });
      setPost(saved);
      setBaseline(nextBaseline);
      setLastSynced(new Date());
      setLastSavedAsPublish(false);
      setSyncStatus('synced');
      if (!postId) {
        router.replace(WEBSITE_CMS_PATHS.newsletterEdit(saved.id));
      }
    } catch {
      setSyncStatus('error');
    }
  };

  const openPublishDialog = () => {
    if (!post) return;
    const persistence = getPostPersistence(post.id);
    if (!persistence.hasSavedDraft || !persistence.savedVersion) return;
    setPublishVersion(persistence.savedVersion);
    setPublishConfirmation('');
    setPublishDialogOpen(true);
  };

  const confirmPublish = async () => {
    if (!post || !publishVersion) return;
    setSyncStatus('syncing');
    try {
      const saved = await publishPost(post.id, publishVersion);
      setPost(saved);
      setBaseline(JSON.stringify({ ...saved, topics: saved.topics }));
      setLastSynced(new Date());
      setLastSavedAsPublish(true);
      setPublishDialogOpen(false);
      setPublishConfirmation('');
      setSyncStatus('synced');
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
  const persistence = getPostPersistence(post.id);
  const isLiveOnSite = persistence.isLive;
  const editorState = deriveNewsletterEditorState({
    canSave,
    hasChanges,
    hasSavedDraft: persistence.hasSavedDraft,
    isLive: isLiveOnSite,
    isSaving,
    savingIntent,
    hasError: Boolean(saveError),
  });
  const canPublish = canPublishNewsletterPost({
    canSave,
    hasChanges,
    hasSavedDraft: persistence.hasSavedDraft,
    isSaving,
  });
  const publishPhrase = buildNewsletterPublishConfirmation({
    slug: post.slug,
    modifiedDate: publishVersion || persistence.savedVersion || post.modifiedDate,
  });
  const publicPaths =
    post.slug && isLiveOnSite
      ? [{ label: 'Newsletter page', href: `${publicSiteUrl}/newsletter/${post.slug}` }]
      : [];
  const syncedLabel =
    syncStatus === 'synced'
      ? lastSavedAsPublish && isLiveOnSite
        ? 'Published on site'
        : editorState === 'publishable' || editorState === 'saved-hidden'
          ? 'Draft saved (hidden on site)'
          : editorState === 'live'
            ? 'Live version unchanged'
            : 'Changes saved'
      : undefined;

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
                Edits sync to <strong>/newsletter</strong> when you publish.
                {post.slug ? (
                  <>
                    {' '}
                    Live URL:{' '}
                    <strong>
                      /newsletter/{post.slug}
                    </strong>
                  </>
                ) : null}
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
          syncedLabel={syncedLabel}
        />
      </div>

      {saveError ? (
        <div
          ref={errorAlertRef}
          role="alert"
          tabIndex={-1}
          className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive outline-none focus-visible:ring-2 focus-visible:ring-destructive"
        >
          {saveError} Your editor content is still available. Verify the live version before retrying.
        </div>
      ) : null}

      {!isLiveOnSite ? (
        <div
          role="status"
          className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-foreground"
        >
          <strong className="font-semibold">Not live yet.</strong> Status is{' '}
          <strong>Draft</strong>, so this post is hidden on{' '}
          <strong>pmstructure.com/newsletter</strong>. Click{' '}
          <strong>Publish to site</strong> below to make it visible (status becomes Active
          automatically).
        </div>
      ) : null}

      <div className="md:hidden space-y-4">
        <div role="status" className="rounded-2xl border border-border bg-card px-4 py-3 text-sm">
          Phone view is preview-only. Use a laptop or desktop to edit, save, or publish.
        </div>
        <NewsletterLivePreview post={post} />
      </div>

      <div className="mx-auto hidden max-w-6xl space-y-6 md:block">
        <SectionCard title="Basic Information" icon={Tag}>
          <div className="space-y-4">
            <div>
              <FieldLabel htmlFor="newsletter-title" required>Newsletter name</FieldLabel>
              <Input id="newsletter-title" value={post.title} onChange={(event) => handleTitleChange(event.target.value)} />
            </div>
            <div>
              <FieldLabel htmlFor="newsletter-author">Author</FieldLabel>
              <select
                id="newsletter-author"
                value={post.authorId || ''}
                onChange={(event) => {
                  const selected = authors.find((a) => a.id === event.target.value);
                  updatePost({
                    authorId: selected?.id ?? '',
                    author: selected?.name ?? post.author,
                  });
                }}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="">
                  {post.author ? `Unlinked: ${post.author}` : 'No author selected'}
                </option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                    {author.title ? ` — ${author.title}` : ''}
                    {author.status !== 'active' ? ' (draft)' : ''}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                Manage profiles under{' '}
                <Link href={WEBSITE_CMS_PATHS.newsletterAuthors} className="font-semibold hover:underline">
                  Newsletter → Authors
                </Link>
                . The author photo, role, and profile page come from there.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel htmlFor="newsletter-slug" required>Slug</FieldLabel>
                <Input
                  id="newsletter-slug"
                  value={post.slug}
                  onChange={(event) => updatePost({ slug: slugifyTitle(event.target.value) })}
                />
              </div>
              <div>
                <FieldLabel htmlFor="newsletter-keywords">Focus keywords</FieldLabel>
                <Input
                  id="newsletter-keywords"
                  value={post.keywords}
                  onChange={(event) => updatePost({ keywords: event.target.value })}
                  placeholder="PMP, safety management, HSE"
                />
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="newsletter-description">Description</FieldLabel>
              <Textarea
                id="newsletter-description"
                value={post.description}
                onChange={(event) => updatePost({ description: event.target.value })}
                rows={3}
                placeholder="Short summary for listings and social shares"
              />
            </div>
            <div>
              <FieldLabel htmlFor="newsletter-topics">Topics</FieldLabel>
              <Input
                id="newsletter-topics"
                value={topicsInput}
                onChange={(event) => setTopicsInput(event.target.value)}
                placeholder="Safety, Certification, Leadership"
              />
              <p className="mt-1 text-xs text-muted-foreground">Separate topics with commas.</p>
            </div>
          </div>
        </SectionCard>

        <NewsletterEditorWorkspace post={post} onChange={updatePost} />

        {post.id === ITEM07_POST_ID ? (
          <SectionCard title="Item07 semantic first table" icon={TableProperties}>
            <div className="space-y-3 text-sm" aria-busy={tableWriterBusy}>
              <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {tableWriterBusy
                  ? 'Item07 table operation in progress'
                  : tableWriterError
                    ? 'Item07 table operation failed'
                    : tableReceipt
                      ? 'Item07 table operation complete'
                      : 'Item07 table writer ready'}
              </p>
              <p className="text-muted-foreground">
                This fail-closed control changes only the locked first table. It cannot publish,
                schedule, or replace arbitrary article HTML.
              </p>
              {tableReceipt ? (
                <div role="status" className="rounded-lg border border-border bg-muted/40 p-3">
                  <p><strong>{tableReceipt.classification}</strong> · writes: {tableReceipt.wrote ? '1' : '0'}</p>
                  <p className="mt-1 break-all font-mono text-xs">Body: {tableReceipt.hashes.bodyBefore} → {tableReceipt.hashes.bodyAfter}</p>
                </div>
              ) : null}
              {tableWriterError ? <p role="alert" className="text-destructive">{tableWriterError}</p> : null}
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={tableWriterBusy || hasChanges || post.status !== 'draft'}
                  onClick={() => void runItem07TableWriter('preview')}
                >
                  Preview first-table correction
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={tableWriterBusy || hasChanges || post.status !== 'draft'}
                  onClick={() => void runItem07TableWriter('rollback')}
                >
                  Preview exact rollback
                </Button>
              </div>
              {tableReceipt?.confirmation ? (
                <div className="space-y-2">
                  <label
                    id="item07-first-table-confirmation-label"
                    htmlFor="item07-first-table-confirmation"
                    className="text-sm font-medium text-foreground"
                  >
                    Exact confirmation
                  </label>
                  <Input
                    id="item07-first-table-confirmation"
                    aria-labelledby="item07-first-table-confirmation-label"
                    value={tableConfirmation}
                    onChange={(event) => setTableConfirmation(event.target.value)}
                    placeholder={tableReceipt.confirmation}
                    autoComplete="off"
                  />
                  <Button
                    type="button"
                    disabled={
                      tableWriterBusy ||
                      hasChanges ||
                      post.status !== 'draft' ||
                      Boolean(tableWriterError) ||
                      tableConfirmation !== tableReceipt.confirmation
                    }
                    onClick={() =>
                      void runItem07TableWriter(
                        tableReceipt.classification === 'ROLLBACK_AVAILABLE' ? 'rollback' : 'apply',
                        true,
                      )
                    }
                  >
                    {tableReceipt.classification === 'ROLLBACK_AVAILABLE'
                      ? 'Rollback exact first table'
                      : 'Apply exact first table'}
                  </Button>
                </div>
              ) : null}
              {hasChanges ? (
                <p className="text-amber-700 dark:text-amber-300">
                  Save or discard editor changes before previewing this isolated correction.
                </p>
              ) : null}
            </div>
          </SectionCard>
        ) : null}

        <SectionCard title="SEO & publishing" icon={Search}>
          <div className="space-y-4">
            <div>
              <FieldLabel htmlFor="newsletter-meta-title">Meta title</FieldLabel>
              <Input
                id="newsletter-meta-title"
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
              <FieldLabel htmlFor="newsletter-meta-description">Meta description</FieldLabel>
              <Textarea
                id="newsletter-meta-description"
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
              <FieldLabel htmlFor="newsletter-hero-alt">Hero alt text</FieldLabel>
              <Input
                id="newsletter-hero-alt"
                value={post.heroImageAlt}
                onChange={(event) => updatePost({ heroImageAlt: event.target.value })}
                placeholder="Describe the featured image for accessibility"
              />
            </div>
            <div>
              <FieldLabel htmlFor="newsletter-editor-state" required>Editor state</FieldLabel>
              <output
                id="newsletter-editor-state"
                className="flex min-h-10 w-full items-center rounded-lg border border-input bg-muted/30 px-3 text-sm font-medium"
              >
                {editorState}
              </output>
              <p className="mt-1 text-xs text-muted-foreground">
                Draft keeps the post off the public site. Click <strong>Publish to site</strong>{' '}
                to go live at <strong>/newsletter/{post.slug || 'your-slug'}</strong>.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 hidden border-t border-border bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:block lg:pl-[calc(var(--sidebar-width,16rem)+1rem)]">
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
            onClick={() => void saveDraft()}
          >
            {isSaving ? <Loader2 size={16} className="motion-safe:animate-spin [animation-duration:1.25s]" /> : <Save size={16} />}
            Save draft
          </Button>
          <Button
            type="button"
            variant="default"
            className="gap-2 bg-foreground text-background hover:bg-foreground/90"
            disabled={!canPublish}
            onClick={openPublishDialog}
          >
            {isSaving ? <Loader2 size={16} className="motion-safe:animate-spin [animation-duration:1.25s]" /> : <Save size={16} />}
            Publish to site
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={publishDialogOpen}
        onOpenChange={(open) => {
          setPublishDialogOpen(open);
          if (!open) setPublishConfirmation('');
        }}
        title="Publish saved newsletter draft"
        description={
          <>
            Confirm the exact public URL and saved version. Publishing copies this hidden draft to
            the live registry; unsaved editor changes cannot be published.
          </>
        }
        confirmLabel="Publish exact version"
        confirmVariant="brand"
        confirmDisabled={publishConfirmation !== publishPhrase || isSaving}
        onConfirm={() => void confirmPublish()}
      >
        <div className="space-y-2">
          <label htmlFor="newsletter-publish-confirmation" className="text-sm font-semibold">
            Type the exact confirmation
          </label>
          <code className="block break-all rounded-lg bg-muted p-2 text-xs">{publishPhrase}</code>
          <Input
            id="newsletter-publish-confirmation"
            value={publishConfirmation}
            onChange={(event) => setPublishConfirmation(event.target.value)}
            autoComplete="off"
          />
        </div>
      </ConfirmDialog>
    </div>
  );
}

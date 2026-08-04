'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import { useWebsiteDataRealtime } from '@/hooks/useWebsiteDataRealtime';
import {
  buildUnifiedNewsletterRegistry,
  countNewPosts,
} from '@/lib/newsletter/registry-merge';
import {
  NEWSLETTER_POSTS_FIELD_KEY,
  defaultNewsletterPostsRegistry,
  mergeNewsletterRegistries,
  parseNewsletterPostsRegistry,
  type NewsletterPost,
  type NewsletterPostsRegistry,
} from '@/lib/newsletter-posts';
import {
  NEWSLETTER_POSTS_DRAFT_FIELD_KEY,
  buildNewsletterPublicationRegistries,
  newsletterPostVersion,
  type NewsletterEditorIntent,
} from '@/lib/newsletter/editor-state';

function registryPost(registry: NewsletterPostsRegistry, id: string): NewsletterPost | undefined {
  return registry.posts.find((post) => post.id === id);
}

function samePost(left: NewsletterPost | undefined, right: NewsletterPost | undefined): boolean {
  return Boolean(left && right && JSON.stringify(left) === JSON.stringify(right));
}

export function useNewsletterPosts() {
  const [registry, setRegistry] = useState<NewsletterPostsRegistry>(defaultNewsletterPostsRegistry());
  const [liveRegistry, setLiveRegistry] = useState<NewsletterPostsRegistry>({ version: 1, posts: [] });
  const [privateDraftRegistry, setPrivateDraftRegistry] = useState<NewsletterPostsRegistry | null>(null);
  const [lastSyncedCount, setLastSyncedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savingIntent, setSavingIntent] = useState<NewsletterEditorIntent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [draftRows, publishedRows] = await Promise.all([
        WebsiteDataService.getData('draft'),
        WebsiteDataService.getData('published'),
      ]);

      const privateDraftRow = draftRows.find(
        (item) => item.field_key === NEWSLETTER_POSTS_DRAFT_FIELD_KEY,
      );
      const publicRow = publishedRows.find(
        (item) => item.field_key === NEWSLETTER_POSTS_FIELD_KEY,
      );
      const nextLiveRegistry = publicRow?.content
        ? parseNewsletterPostsRegistry(publicRow.content)
        : { version: 1 as const, posts: [] };
      const unified = buildUnifiedNewsletterRegistry({ draft: draftRows, published: publishedRows });
      const nextPrivateDraft = privateDraftRow?.content
        ? parseNewsletterPostsRegistry(privateDraftRow.content)
        : null;

      // Absence of the private row is a read-only fallback. Loading the editor must never
      // create a draft or mutate the public newsletter registry.
      setPrivateDraftRegistry(nextPrivateDraft);
      setLiveRegistry(nextLiveRegistry);
      setRegistry(nextPrivateDraft ? mergeNewsletterRegistries(unified, nextPrivateDraft) : unified);
      setLastSyncedCount(0);
    } catch (err) {
      console.error('Failed to load newsletter posts', err);
      setError('Could not load newsletter posts.');
      setRegistry(defaultNewsletterPostsRegistry());
      setPrivateDraftRegistry(null);
      setLiveRegistry({ version: 1, posts: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useWebsiteDataRealtime(NEWSLETTER_POSTS_FIELD_KEY, load);
  useWebsiteDataRealtime(NEWSLETTER_POSTS_DRAFT_FIELD_KEY, load);

  const persistPrivateDraft = useCallback(async (next: NewsletterPostsRegistry) => {
    await WebsiteDataService.saveDraft(
      NEWSLETTER_POSTS_DRAFT_FIELD_KEY,
      next as unknown as Record<string, unknown>,
      { publish: false },
    );
    setPrivateDraftRegistry(next);
    setRegistry(next);
  }, []);

  const syncFromSite = useCallback(async () => {
    setIsSaving(true);
    setSavingIntent('save-draft');
    setError(null);
    try {
      const [draftRows, publishedRows] = await Promise.all([
        WebsiteDataService.getData('draft'),
        WebsiteDataService.getData('published'),
      ]);
      const privateDraftRow = draftRows.find(
        (item) => item.field_key === NEWSLETTER_POSTS_DRAFT_FIELD_KEY,
      );
      const before = privateDraftRow?.content
        ? parseNewsletterPostsRegistry(privateDraftRow.content)
        : { version: 1 as const, posts: [] };
      const merged = buildUnifiedNewsletterRegistry({ draft: draftRows, published: publishedRows });
      const imported = countNewPosts(before, merged);
      await persistPrivateDraft(merged);
      setLastSyncedCount(imported);
      return imported;
    } catch (err) {
      console.error('Failed to sync newsletter posts', err);
      setError('Could not sync newsletter posts from site sources.');
      throw err;
    } finally {
      setIsSaving(false);
      setSavingIntent(null);
    }
  }, [persistPrivateDraft]);

  const saveDraftPost = useCallback(
    async (post: NewsletterPost) => {
      setIsSaving(true);
      setSavingIntent('save-draft');
      setError(null);
      try {
        const nextPosts = [...registry.posts];
        const index = nextPosts.findIndex((item) => item.id === post.id);
        const updated: NewsletterPost = {
          ...post,
          status: 'draft',
          modifiedDate: new Date().toISOString(),
        };
        if (index >= 0) nextPosts[index] = updated;
        else nextPosts.unshift(updated);
        await persistPrivateDraft({ version: 1, posts: nextPosts });
        return updated;
      } catch (err) {
        console.error('Failed to save newsletter draft', err);
        setError('Could not save newsletter draft. Live content was not changed.');
        throw err;
      } finally {
        setIsSaving(false);
        setSavingIntent(null);
      }
    },
    [persistPrivateDraft, registry.posts],
  );

  const publishPost = useCallback(
    async (postId: string, expectedVersion: string) => {
      setIsSaving(true);
      setSavingIntent('publish');
      setError(null);
      try {
        // Hard reread the hidden draft immediately before publishing. This prevents the
        // confirmation from applying to a different saved version.
        const rows = await WebsiteDataService.getData('draft');
        const privateRow = rows.find(
          (item) => item.field_key === NEWSLETTER_POSTS_DRAFT_FIELD_KEY,
        );
        if (!privateRow?.content) throw new Error('Saved newsletter draft not found.');
        const confirmedDraftRegistry = parseNewsletterPostsRegistry(privateRow.content);
        const confirmedDraft = registryPost(confirmedDraftRegistry, postId);
        if (!confirmedDraft) throw new Error('Saved newsletter draft post not found.');
        if (newsletterPostVersion(confirmedDraft) !== expectedVersion) {
          throw new Error('Newsletter draft version changed. Review and confirm the latest version.');
        }

        const liveRowsBefore = await WebsiteDataService.getData('published');
        const liveRowBefore = liveRowsBefore.find(
          (item) => item.field_key === NEWSLETTER_POSTS_FIELD_KEY,
        );
        const liveBefore = liveRowBefore?.content
          ? parseNewsletterPostsRegistry(liveRowBefore.content)
          : { version: 1 as const, posts: [] };
        const now = new Date().toISOString();
        const {
          nextPrivateDraftRegistry,
          nextLiveRegistry: publishedRegistry,
          publishedPost,
        } = buildNewsletterPublicationRegistries({
          confirmedDraftRegistry,
          liveRegistry: liveBefore,
          postId,
          now,
        });

        // Preserve every unrelated hidden draft, then merge only the exact confirmed record
        // into the sole public registry. An unrelated live sibling is never replaced by a draft.
        await WebsiteDataService.saveDraft(
          NEWSLETTER_POSTS_DRAFT_FIELD_KEY,
          nextPrivateDraftRegistry as unknown as Record<string, unknown>,
          { publish: false },
        );
        await WebsiteDataService.saveDraft(
          NEWSLETTER_POSTS_FIELD_KEY,
          publishedRegistry as unknown as Record<string, unknown>,
          { publish: true },
        );

        const publishedRows = await WebsiteDataService.getData('published');
        const hardReadRow = publishedRows.find(
          (item) => item.field_key === NEWSLETTER_POSTS_FIELD_KEY,
        );
        const hardReadRegistry = hardReadRow?.content
          ? parseNewsletterPostsRegistry(hardReadRow.content)
          : null;
        if (
          !hardReadRegistry ||
          JSON.stringify(hardReadRegistry) !== JSON.stringify(publishedRegistry) ||
          !samePost(registryPost(hardReadRegistry, postId), publishedPost)
        ) {
          throw new Error('Published newsletter hard reread did not match the confirmed version.');
        }

        setPrivateDraftRegistry(nextPrivateDraftRegistry);
        setLiveRegistry(hardReadRegistry);
        setRegistry(mergeNewsletterRegistries(hardReadRegistry, nextPrivateDraftRegistry));
        return publishedPost;
      } catch (err) {
        console.error('Failed to publish newsletter post', err);
        setError(err instanceof Error ? err.message : 'Could not publish newsletter post.');
        throw err;
      } finally {
        setIsSaving(false);
        setSavingIntent(null);
      }
    },
    [],
  );

  const deletePost = useCallback(
    async (id: string) => {
      setIsSaving(true);
      setSavingIntent('save-draft');
      setError(null);
      try {
        const next = {
          version: 1 as const,
          posts: registry.posts.filter((post) => post.id !== id),
        };
        await persistPrivateDraft(next);
      } catch (err) {
        setError('Could not update the hidden newsletter draft.');
        throw err;
      } finally {
        setIsSaving(false);
        setSavingIntent(null);
      }
    },
    [persistPrivateDraft, registry.posts],
  );

  const getPostById = useCallback(
    (id: string) => registry.posts.find((post) => post.id === id),
    [registry.posts],
  );

  const getPostPersistence = useCallback(
    (id: string) => {
      const draftPost = privateDraftRegistry ? registryPost(privateDraftRegistry, id) : undefined;
      const livePost = registryPost(liveRegistry, id);
      return {
        hasSavedDraft: Boolean(draftPost && !samePost(draftPost, livePost)),
        isLive: Boolean(livePost && (livePost.status === 'published' || livePost.status === 'scheduled')),
        savedVersion: draftPost ? newsletterPostVersion(draftPost) : '',
      };
    },
    [liveRegistry, privateDraftRegistry],
  );

  const isRegistryPublished = useMemo(() => liveRegistry.posts.length > 0, [liveRegistry.posts.length]);

  return {
    posts: registry.posts,
    isLoading,
    isSaving,
    savingIntent,
    isRegistryPublished,
    lastSyncedCount,
    error,
    refresh: load,
    syncFromSite,
    saveDraftPost,
    publishPost,
    deletePost,
    getPostById,
    getPostPersistence,
  };
}

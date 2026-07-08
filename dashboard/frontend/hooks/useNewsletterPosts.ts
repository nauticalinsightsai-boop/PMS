'use client';

import { useCallback, useEffect, useState } from 'react';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import { useWebsiteDataRealtime } from '@/hooks/useWebsiteDataRealtime';
import {
  buildUnifiedNewsletterRegistry,
  countNewPosts,
} from '@/lib/newsletter/registry-merge';
import {
  NEWSLETTER_POSTS_FIELD_KEY,
  defaultNewsletterPostsRegistry,
  parseNewsletterPostsRegistry,
  type NewsletterPost,
  type NewsletterPostsRegistry,
} from '@/lib/newsletter-posts';

export function useNewsletterPosts() {
  const [registry, setRegistry] = useState<NewsletterPostsRegistry>(defaultNewsletterPostsRegistry());
  const [isRegistryPublished, setIsRegistryPublished] = useState(false);
  const [lastSyncedCount, setLastSyncedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [draftRows, publishedRows] = await Promise.all([
        WebsiteDataService.getData('draft'),
        WebsiteDataService.getData('published'),
      ]);

      const draftRow = draftRows.find((item) => item.field_key === NEWSLETTER_POSTS_FIELD_KEY);
      const publishedRow = publishedRows.find((item) => item.field_key === NEWSLETTER_POSTS_FIELD_KEY);
      setIsRegistryPublished(Boolean(draftRow?.is_published ?? publishedRow?.is_published));

      const draftOnly = draftRow?.content
        ? parseNewsletterPostsRegistry(draftRow.content)
        : { version: 1 as const, posts: [] };

      const merged = buildUnifiedNewsletterRegistry({
        draft: draftRows,
        published: publishedRows,
      });

      const imported = countNewPosts(draftOnly, merged);
      if (imported > 0 || !draftRow?.content) {
        await WebsiteDataService.saveDraft(
          NEWSLETTER_POSTS_FIELD_KEY,
          merged as unknown as Record<string, unknown>,
        );
        setLastSyncedCount(imported > 0 ? imported : merged.posts.length);
      } else {
        setLastSyncedCount(0);
      }

      setRegistry(merged);
    } catch (err) {
      console.error('Failed to load newsletter posts', err);
      setError('Could not load newsletter posts.');
      setRegistry(defaultNewsletterPostsRegistry());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useWebsiteDataRealtime(NEWSLETTER_POSTS_FIELD_KEY, load);

  const persist = useCallback(async (next: NewsletterPostsRegistry, publish = false) => {
    setIsSaving(true);
    setError(null);
    try {
      await WebsiteDataService.saveDraft(
        NEWSLETTER_POSTS_FIELD_KEY,
        next as unknown as Record<string, unknown>,
        { publish },
      );
      if (publish) setIsRegistryPublished(true);
      setRegistry(next);
    } catch (err) {
      console.error('Failed to save newsletter posts', err);
      setError('Could not save newsletter posts.');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const publishRegistry = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      await WebsiteDataService.saveDraft(
        NEWSLETTER_POSTS_FIELD_KEY,
        registry as unknown as Record<string, unknown>,
        { publish: true },
      );
      setIsRegistryPublished(true);
    } catch (err) {
      console.error('Failed to publish newsletter posts', err);
      setError('Could not publish newsletter posts.');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [registry]);

  const syncFromSite = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      const [draftRows, publishedRows] = await Promise.all([
        WebsiteDataService.getData('draft'),
        WebsiteDataService.getData('published'),
      ]);
      const draftOnly = parseNewsletterPostsRegistry(
        draftRows.find((item) => item.field_key === NEWSLETTER_POSTS_FIELD_KEY)?.content ?? null,
      );
      const merged = buildUnifiedNewsletterRegistry({
        draft: draftRows,
        published: publishedRows,
      });
      const imported = countNewPosts(draftOnly, merged);
      await WebsiteDataService.saveDraft(
        NEWSLETTER_POSTS_FIELD_KEY,
        merged as unknown as Record<string, unknown>,
      );
      setRegistry(merged);
      setLastSyncedCount(imported);
      return imported;
    } catch (err) {
      console.error('Failed to sync newsletter posts', err);
      setError('Could not sync newsletter posts from site sources.');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const upsertPost = useCallback(
    async (post: NewsletterPost, publish = false) => {
      const nextPosts = [...registry.posts];
      const index = nextPosts.findIndex((item) => item.id === post.id);
      const now = new Date().toISOString();
      const updated: NewsletterPost = {
        ...post,
        modifiedDate: now,
        status: publish ? 'published' : post.status,
        publishDate:
          (publish || post.status === 'published' || post.status === 'scheduled') && !post.publishDate
            ? now
            : post.publishDate,
      };
      if (index >= 0) nextPosts[index] = updated;
      else nextPosts.unshift(updated);
      const shouldPublishRegistry =
        publish || updated.status === 'published' || updated.status === 'scheduled';
      await persist({ version: 1, posts: nextPosts }, shouldPublishRegistry);
      return updated;
    },
    [persist, registry.posts],
  );

  const deletePost = useCallback(
    async (id: string) => {
      const next = {
        version: 1 as const,
        posts: registry.posts.filter((post) => post.id !== id),
      };
      await persist(next, isRegistryPublished);
    },
    [persist, registry.posts, isRegistryPublished],
  );

  const getPostById = useCallback(
    (id: string) => registry.posts.find((post) => post.id === id),
    [registry.posts],
  );

  return {
    posts: registry.posts,
    isLoading,
    isSaving,
    isRegistryPublished,
    lastSyncedCount,
    error,
    refresh: load,
    syncFromSite,
    publishRegistry,
    upsertPost,
    deletePost,
    getPostById,
  };
}

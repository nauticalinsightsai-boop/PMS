'use client';

import { useCallback, useEffect, useState } from 'react';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import { useWebsiteDataRealtime } from '@/hooks/useWebsiteDataRealtime';
import {
  CMS_POSTS_FIELD_KEY,
  createEmptyCmsPost,
  defaultCmsPostsRegistry,
  parseCmsPostsRegistry,
  type CmsPost,
  type CmsPostsRegistry,
} from '@/lib/cms/posts';

export function useCmsPosts() {
  const [registry, setRegistry] = useState<CmsPostsRegistry>(defaultCmsPostsRegistry());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const rows = await WebsiteDataService.getData('draft');
      const row = rows.find((item) => item.field_key === CMS_POSTS_FIELD_KEY);
      if (row?.content) {
        setRegistry(parseCmsPostsRegistry(row.content));
      } else {
        const seeded = defaultCmsPostsRegistry();
        setRegistry(seeded);
        await WebsiteDataService.saveDraft(
          CMS_POSTS_FIELD_KEY,
          seeded as unknown as Record<string, unknown>,
        );
      }
    } catch (err) {
      console.error('Failed to load posts', err);
      setError('Could not load posts.');
      setRegistry(defaultCmsPostsRegistry());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useWebsiteDataRealtime(CMS_POSTS_FIELD_KEY, load);

  const persist = useCallback(async (next: CmsPostsRegistry, publish = false) => {
    setIsSaving(true);
    setError(null);
    try {
      await WebsiteDataService.saveDraft(
        CMS_POSTS_FIELD_KEY,
        next as unknown as Record<string, unknown>,
      );
      if (publish) await WebsiteDataService.publish(CMS_POSTS_FIELD_KEY);
      setRegistry(next);
    } catch (err) {
      console.error('Failed to save posts', err);
      setError('Could not save posts.');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const upsertPost = useCallback(
    async (post: CmsPost, publish = false) => {
      const nextPosts = [...registry.posts];
      const index = nextPosts.findIndex((item) => item.id === post.id);
      const updated: CmsPost = { ...post, modifiedDate: new Date().toISOString() };
      if (index >= 0) nextPosts[index] = updated;
      else nextPosts.unshift(updated);
      await persist({ version: 1, posts: nextPosts }, publish);
      return updated;
    },
    [persist, registry.posts],
  );

  const deletePost = useCallback(
    async (id: string) => {
      await persist({ version: 1, posts: registry.posts.filter((p) => p.id !== id) });
    },
    [persist, registry.posts],
  );

  return {
    posts: registry.posts,
    isLoading,
    isSaving,
    error,
    refresh: load,
    upsertPost,
    deletePost,
    getPostById: (id: string) => registry.posts.find((p) => p.id === id),
    createEmptyCmsPost,
  };
}

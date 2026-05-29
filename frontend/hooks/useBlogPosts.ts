'use client';

import { useCallback, useEffect, useState } from 'react';
import type { BlogArticle } from '@pms/site-content/cms-posts';
import { CMS_POSTS_FIELD_KEY, CMS_TOPICS_FIELD_KEY } from '@pms/site-content/cms-posts';
import { loadBlogArticlesClient } from '@/lib/blog/posts';
import { blogArticles as fileFallback } from '@/data/blogArticles';
import { useWebsiteDataRealtime } from '@/hooks/useWebsiteDataRealtime';

export function useBlogPosts() {
  const [articles, setArticles] = useState<BlogArticle[]>(fileFallback);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const next = await loadBlogArticlesClient();
      if (next.length > 0) setArticles(next);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useWebsiteDataRealtime([CMS_POSTS_FIELD_KEY, CMS_TOPICS_FIELD_KEY], refresh);

  return { articles, isLoading, refresh };
}

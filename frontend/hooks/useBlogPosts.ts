'use client';

import { useCallback, useEffect, useState } from 'react';
import type { BlogArticle } from '@pms/site-content/cms-posts';
import { CMS_POSTS_FIELD_KEY, CMS_TOPICS_FIELD_KEY } from '@pms/site-content/cms-posts';
import { loadBlogArticlesClient } from '@/lib/blog/posts';
import { blogArticles as fileFallback } from '@/data/blogArticles';
import { useWebsiteDataRealtime } from '@/hooks/useWebsiteDataRealtime';

export function useBlogPosts(initialArticles?: BlogArticle[]) {
  const [articles, setArticles] = useState<BlogArticle[]>(initialArticles ?? fileFallback);
  const [isLoading, setIsLoading] = useState(initialArticles === undefined);

  const refresh = useCallback(async () => {
    try {
      const next = await loadBlogArticlesClient();
      if (next.length > 0) setArticles(next);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialArticles !== undefined) {
      setArticles(initialArticles);
      setIsLoading(false);
    }
    void refresh();
  }, [initialArticles, refresh]);

  useWebsiteDataRealtime([CMS_POSTS_FIELD_KEY, CMS_TOPICS_FIELD_KEY], refresh);

  return { articles, isLoading, refresh };
}

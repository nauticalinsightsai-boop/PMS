'use client';

import { useEffect, useState } from 'react';
import type { NewsletterArticle } from '@pms/site-content/newsletter-posts';
import { NEWSLETTER_POSTS_FIELD_KEY } from '@pms/site-content/newsletter-posts';
import { loadNewsletterArticlesClient } from '@/lib/newsletter/articles';
import { newsletterArticles as fileFallback } from '@/data/newsletterArticles';
import { useWebsiteDataRealtime } from '@/hooks/useWebsiteDataRealtime';

export function useNewsletterArticles() {
  const [articles, setArticles] = useState<NewsletterArticle[]>(fileFallback);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = () => {
    void loadNewsletterArticlesClient()
      .then((next) => {
        if (next.length > 0) setArticles(next);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    refresh();
  }, []);

  useWebsiteDataRealtime(NEWSLETTER_POSTS_FIELD_KEY, refresh);

  return { articles, isLoading, refresh };
}

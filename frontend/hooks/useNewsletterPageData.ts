'use client';

import { useCallback, useEffect, useState } from 'react';
import { FIELD_KEYS } from '@pms/site-content/keys';
import {
  defaultNewsletterHubConfig,
  parseNewsletterHubConfig,
  type NewsletterHubConfig,
} from '@pms/site-content/newsletter';
import {
  NEWSLETTER_POSTS_FIELD_KEY,
  type NewsletterArticle,
} from '@pms/site-content/newsletter-posts';
import { CMS_TOPICS_FIELD_KEY } from '@pms/site-content/cms-posts';
import { newsletterArticles as fileFallback } from '@/data/newsletterArticles';
import { mergeCmsRegistryArticles } from '@/lib/newsletter/merge-cms-articles';
import { buildNewsletterCategories } from '@/lib/newsletter/categories';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import { useWebsiteDataRealtime } from '@/hooks/useWebsiteDataRealtime';

const BATCH_KEYS = [
  FIELD_KEYS.NEWSLETTER_HUB_CONFIG,
  NEWSLETTER_POSTS_FIELD_KEY,
  CMS_TOPICS_FIELD_KEY,
] as const;

type TopicRow = { id: string; name: string; status: string };

function parseTopicNames(raw: unknown): string[] {
  if (!raw || typeof raw !== 'object') return [];
  const data = raw as { topics?: TopicRow[] };
  if (!Array.isArray(data.topics)) return [];
  return data.topics
    .filter((t) => t?.status === 'active' && t.name)
    .map((t) => t.name);
}

function mergeArticles(cmsRaw: unknown): NewsletterArticle[] {
  return mergeCmsRegistryArticles(cmsRaw);
}

export function useNewsletterPageData(initial?: {
  hub?: NewsletterHubConfig;
  articles?: NewsletterArticle[];
  topicNames?: string[];
}) {
  const [hub, setHub] = useState<NewsletterHubConfig>(initial?.hub ?? defaultNewsletterHubConfig());
  const [articles, setArticles] = useState<NewsletterArticle[]>(initial?.articles ?? fileFallback);
  const [topicNames, setTopicNames] = useState<string[]>(initial?.topicNames ?? []);
  const [isLoading, setIsLoading] = useState(!initial?.hub);

  const refresh = useCallback(async () => {
    try {
      WebsiteDataService.invalidatePublishedCache([...BATCH_KEYS]);
      const rows = await WebsiteDataService.getPublishedByFieldKeys([...BATCH_KEYS]);
      const hubRow = rows.find((r) => r.field_key === FIELD_KEYS.NEWSLETTER_HUB_CONFIG);
      const postsRow = rows.find((r) => r.field_key === NEWSLETTER_POSTS_FIELD_KEY);
      const topicsRow = rows.find((r) => r.field_key === CMS_TOPICS_FIELD_KEY);

      if (hubRow?.content) setHub(parseNewsletterHubConfig(hubRow.content));
      if (postsRow?.content) setArticles(mergeArticles(postsRow.content));
      else setArticles(fileFallback);
      if (topicsRow?.content) setTopicNames(parseTopicNames(topicsRow.content));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initial?.hub) {
      setHub(initial.hub);
      if (initial.articles) setArticles(initial.articles);
      if (initial.topicNames) setTopicNames(initial.topicNames);
      setIsLoading(false);
    }
    void refresh();
  }, [initial?.hub, initial?.articles, initial?.topicNames, refresh]);

  useWebsiteDataRealtime([...BATCH_KEYS], refresh);

  const categories = buildNewsletterCategories(articles, topicNames);

  return { hub, articles, categories, isLoading, refresh };
}

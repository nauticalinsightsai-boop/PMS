import { cache } from 'react';
import { FIELD_KEYS } from '@pms/site-content/keys';
import {
  defaultNewsletterHubConfig,
  parseNewsletterHubConfig,
} from '@pms/site-content/newsletter';
import { CMS_TOPICS_FIELD_KEY } from '@pms/site-content/cms-posts';
import { getPublishedNewsletterArticles } from '@/lib/newsletter/articles';
import { fetchPublishedDocuments } from '@/lib/cms/fetch-published-document';

type TopicRow = { id: string; name: string; status: string };

function parseTopicNames(raw: unknown): string[] {
  if (!raw || typeof raw !== 'object') return [];
  const data = raw as { topics?: TopicRow[] };
  if (!Array.isArray(data.topics)) return [];
  return data.topics
    .filter((t) => t?.status === 'active' && t.name)
    .map((t) => t.name);
}

export const getNewsletterPageData = cache(async () => {
  const keys = [FIELD_KEYS.NEWSLETTER_HUB_CONFIG, CMS_TOPICS_FIELD_KEY];
  const [rows, articles] = await Promise.all([
    fetchPublishedDocuments(keys),
    getPublishedNewsletterArticles(),
  ]);

  const hubRow = rows.find((r) => r.field_key === FIELD_KEYS.NEWSLETTER_HUB_CONFIG);
  const topicsRow = rows.find((r) => r.field_key === CMS_TOPICS_FIELD_KEY);

  return {
    hub: hubRow?.content
      ? parseNewsletterHubConfig(hubRow.content)
      : defaultNewsletterHubConfig(),
    articles,
    topicNames: topicsRow?.content ? parseTopicNames(topicsRow.content) : [],
  };
});

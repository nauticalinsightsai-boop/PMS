import {
  CMS_POSTS_FIELD_KEY,
  CMS_TOPICS_FIELD_KEY,
  parseCmsPostsRegistry,
} from '@pms/site-content/cms-posts';
import {
  cmsPostToNewsletterPost,
  defaultNewsletterPostsRegistry,
  mergeNewsletterRegistries,
  newsletterFileSeedArticles,
  newsletterArticleToPost,
  parseNewsletterPostsRegistry,
  type NewsletterPostsRegistry,
} from '@pms/site-content/newsletter-posts';
import { parseCmsTopicsRegistry } from '@/lib/cms/topics';
import type { WebsiteData } from '@/services/WebsiteDataService';
import { NEWSLETTER_POSTS_FIELD_KEY } from '@/lib/newsletter-posts';

function emptyRegistry(): NewsletterPostsRegistry {
  return { version: 1, posts: [] };
}

function registryFromCmsPosts(
  cmsContent: unknown,
  topicsContent: unknown | null | undefined,
): NewsletterPostsRegistry {
  const cmsReg = parseCmsPostsRegistry(cmsContent);
  const topicsReg = parseCmsTopicsRegistry(topicsContent);
  const topicMap = Object.fromEntries(topicsReg.topics.map((topic) => [topic.id, topic.name]));
  return {
    version: 1,
    posts: cmsReg.posts.map((post) => cmsPostToNewsletterPost(post, topicMap)),
  };
}

function registryFromFileSeeds(): NewsletterPostsRegistry {
  return {
    version: 1,
    posts: newsletterFileSeedArticles.map((article) => newsletterArticleToPost(article)),
  };
}

export function buildUnifiedNewsletterRegistry(rows: {
  draft: WebsiteData[];
  published: WebsiteData[];
}): NewsletterPostsRegistry {
  const draftRow = rows.draft.find((item) => item.field_key === NEWSLETTER_POSTS_FIELD_KEY);
  const publishedRow = rows.published.find((item) => item.field_key === NEWSLETTER_POSTS_FIELD_KEY);

  const draftRegistry = draftRow?.content
    ? parseNewsletterPostsRegistry(draftRow.content)
    : emptyRegistry();
  const publishedRegistry = publishedRow?.content
    ? parseNewsletterPostsRegistry(publishedRow.content)
    : emptyRegistry();

  const cmsDraftRow = rows.draft.find((item) => item.field_key === CMS_POSTS_FIELD_KEY);
  const cmsPublishedRow = rows.published.find((item) => item.field_key === CMS_POSTS_FIELD_KEY);
  const cmsContent = cmsDraftRow?.content ?? cmsPublishedRow?.content;

  const topicsDraftRow = rows.draft.find((item) => item.field_key === CMS_TOPICS_FIELD_KEY);
  const topicsPublishedRow = rows.published.find((item) => item.field_key === CMS_TOPICS_FIELD_KEY);
  const topicsContent = topicsDraftRow?.content ?? topicsPublishedRow?.content;

  const cmsRegistry = cmsContent ? registryFromCmsPosts(cmsContent, topicsContent) : emptyRegistry();
  const fileSeedRegistry = registryFromFileSeeds();
  const defaults = defaultNewsletterPostsRegistry();

  return mergeNewsletterRegistries(
    publishedRegistry,
    cmsRegistry,
    fileSeedRegistry,
    defaults,
    draftRegistry,
  );
}

export function countNewPosts(
  before: NewsletterPostsRegistry,
  after: NewsletterPostsRegistry,
): number {
  const beforeSlugs = new Set(before.posts.map((post) => post.slug));
  return after.posts.filter((post) => !beforeSlugs.has(post.slug)).length;
}

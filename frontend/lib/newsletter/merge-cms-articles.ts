import {
  mergeNewsletterArticles,
  newsletterPostToArticle,
  parseNewsletterPostsRegistry,
  publishedPostsFromRegistry,
  type NewsletterArticle,
} from '@pms/site-content/newsletter-posts';
import { newsletterArticles as fileFallback } from '@/data/newsletterArticles';

/** Merge published CMS registry posts with file seed articles (CMS wins on slug). */
export function mergeCmsRegistryArticles(cmsRaw: unknown): NewsletterArticle[] {
  const registry = parseNewsletterPostsRegistry(cmsRaw);
  const cmsArticles = publishedPostsFromRegistry(registry).map(newsletterPostToArticle);
  return mergeNewsletterArticles(fileFallback, cmsArticles);
}

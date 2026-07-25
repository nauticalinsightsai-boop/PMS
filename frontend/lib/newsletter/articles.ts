import { cache } from 'react';
import {
  NEWSLETTER_POSTS_FIELD_KEY,
  type NewsletterArticle,
  mergeNewsletterArticles,
  newsletterPostToArticle,
  normalizeNewsletterAuthorName,
} from '@pms/site-content/newsletter-posts';
import { newsletterDraftRegistry } from '@pms/site-content/newsletter-draft-registry';
import { newsletterArticles as fileArticles } from '@/data/newsletterArticles';
import {
  LEGACY_THIN_NEWSLETTER_SLUGS,
  publishedLongFormNewsletterPosts,
} from '@/content/newsletter/publication';
import { mergeCmsRegistryArticles } from '@/lib/newsletter/merge-cms-articles';
import { enrichArticlesWithAuthors, getPublishedNewsletterAuthors } from '@/lib/newsletter/authors';
import { supabase } from '@/lib/supabase';

export type { NewsletterArticle };
export { getNewsletterArticleHref } from '@pms/site-content/newsletter-posts';

const publishedLongFormArticles = publishedLongFormNewsletterPosts.map(newsletterPostToArticle);

function withoutLegacyThinArticles(articles: NewsletterArticle[]): NewsletterArticle[] {
  return articles.filter((article) => !LEGACY_THIN_NEWSLETTER_SLUGS.has(article.slug));
}

function mergePublishedLongFormArticles(articles: NewsletterArticle[]): NewsletterArticle[] {
  return mergeNewsletterArticles(
    withoutLegacyThinArticles(articles),
    publishedLongFormArticles,
  );
}

function withNormalizedAuthors(articles: NewsletterArticle[]): NewsletterArticle[] {
  return articles.map((article) => ({
    ...article,
    author: normalizeNewsletterAuthorName(article.author),
  }));
}

async function fetchPublishedArticles(): Promise<NewsletterArticle[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return mergePublishedLongFormArticles(fileArticles);

  try {
    const { data, error } = await supabase
      .from('website_data')
      .select('content')
      .eq('field_key', NEWSLETTER_POSTS_FIELD_KEY)
      .eq('is_published', true)
      .maybeSingle();

    if (error || !data?.content) return mergePublishedLongFormArticles(fileArticles);

    return mergePublishedLongFormArticles(mergeCmsRegistryArticles(data.content));
  } catch {
    return mergePublishedLongFormArticles(fileArticles);
  }
}

/** Server: published CMS posts merged with file seed (CMS wins on slug conflict). */
export const getPublishedNewsletterArticles = cache(async (): Promise<NewsletterArticle[]> => {
  const [articles, authors] = await Promise.all([
    fetchPublishedArticles(),
    getPublishedNewsletterAuthors(),
  ]);
  return withNormalizedAuthors(enrichArticlesWithAuthors(articles, authors));
});

export async function getNewsletterArticle(slug: string): Promise<NewsletterArticle | undefined> {
  const articles = await getPublishedNewsletterArticles();
  return articles.find((a) => a.slug === slug);
}

/** Development-only: get draft article from imported draft registry. */
export async function getDraftNewsletterArticle(slug: string): Promise<NewsletterArticle | undefined> {
  if (process.env.NODE_ENV !== 'development') return undefined;

  const draftPost = newsletterDraftRegistry.posts.find((p) => p.slug === slug);
  if (!draftPost) return undefined;

  // Convert post to article
  const article = newsletterPostToArticle(draftPost);

  // Published author loading merges CMS profiles over the complete seed registry.
  const authors = await getPublishedNewsletterAuthors();
  const enriched = enrichArticlesWithAuthors([article], authors);

  return withNormalizedAuthors(enriched)[0];
}

/** Client hook data loader: same merge rules as server. */
export async function loadNewsletterArticlesClient(): Promise<NewsletterArticle[]> {
  return getPublishedNewsletterArticles();
}

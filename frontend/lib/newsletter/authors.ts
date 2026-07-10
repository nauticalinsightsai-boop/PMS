import { cache } from 'react';
import {
  NEWSLETTER_AUTHORS_FIELD_KEY,
  attachAuthorToArticle,
  findAuthorForArticle,
  parseNewsletterAuthorsRegistry,
  publishedAuthorsFromRegistry,
  type NewsletterAuthor,
} from '@pms/site-content/newsletter-authors';
import type { NewsletterArticle } from '@pms/site-content/newsletter-posts';
import { resolveNewsletterAuthorAvatar } from '@/lib/marketing-stock-images';
import { supabase } from '@/lib/supabase';

async function fetchPublishedAuthors(): Promise<NewsletterAuthor[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  try {
    const { data, error } = await supabase
      .from('website_data')
      .select('content')
      .eq('field_key', NEWSLETTER_AUTHORS_FIELD_KEY)
      .eq('is_published', true)
      .maybeSingle();

    if (error || !data?.content) return [];
    return publishedAuthorsFromRegistry(parseNewsletterAuthorsRegistry(data.content));
  } catch {
    return [];
  }
}

/** Server: published newsletter authors from Supabase. */
export const getPublishedNewsletterAuthors = cache(async (): Promise<NewsletterAuthor[]> => {
  return fetchPublishedAuthors();
});

export async function getNewsletterAuthor(slug: string): Promise<NewsletterAuthor | undefined> {
  const authors = await getPublishedNewsletterAuthors();
  return authors.find((author) => author.slug === slug);
}

/** Attach author profile fields to a list of articles. */
export function enrichArticlesWithAuthors(
  articles: NewsletterArticle[],
  authors: NewsletterAuthor[],
): NewsletterArticle[] {
  if (authors.length === 0) return articles;
  return articles.map((article) => attachAuthorToArticle(article, authors));
}

/** Best-effort avatar: registry photo → resolved profile → hardcoded fallback. */
export function resolveArticleAuthorAvatar(article: NewsletterArticle): string {
  if (article.authorImage?.trim()) return article.authorImage.trim();
  return resolveNewsletterAuthorAvatar(article.author);
}

export { findAuthorForArticle };

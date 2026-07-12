import { cache } from 'react';
import {
  CANONICAL_NEWSLETTER_AUTHOR,
  NEWSLETTER_POSTS_FIELD_KEY,
  type NewsletterArticle,
} from '@pms/site-content/newsletter-posts';
import { newsletterArticles as fileArticles } from '@/data/newsletterArticles';
import { mergeCmsRegistryArticles } from '@/lib/newsletter/merge-cms-articles';
import { enrichArticlesWithAuthors, getPublishedNewsletterAuthors } from '@/lib/newsletter/authors';
import { supabase } from '@/lib/supabase';

export type { NewsletterArticle };
export { getNewsletterArticleHref } from '@pms/site-content/newsletter-posts';

function withCanonicalAuthor(articles: NewsletterArticle[]): NewsletterArticle[] {
  return articles.map((article) =>
    article.author === CANONICAL_NEWSLETTER_AUTHOR
      ? article
      : { ...article, author: CANONICAL_NEWSLETTER_AUTHOR },
  );
}

async function fetchPublishedArticles(): Promise<NewsletterArticle[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return fileArticles;

  try {
    const { data, error } = await supabase
      .from('website_data')
      .select('content')
      .eq('field_key', NEWSLETTER_POSTS_FIELD_KEY)
      .eq('is_published', true)
      .maybeSingle();

    if (error || !data?.content) return fileArticles;

    return mergeCmsRegistryArticles(data.content);
  } catch {
    return fileArticles;
  }
}

/** Server: published CMS posts merged with file seed (CMS wins on slug conflict). */
export const getPublishedNewsletterArticles = cache(async (): Promise<NewsletterArticle[]> => {
  const [articles, authors] = await Promise.all([
    fetchPublishedArticles(),
    getPublishedNewsletterAuthors(),
  ]);
  return withCanonicalAuthor(enrichArticlesWithAuthors(articles, authors));
});

export async function getNewsletterArticle(slug: string): Promise<NewsletterArticle | undefined> {
  const articles = await getPublishedNewsletterArticles();
  return articles.find((a) => a.slug === slug);
}

/** Client hook data loader: same merge rules as server. */
export async function loadNewsletterArticlesClient(): Promise<NewsletterArticle[]> {
  return getPublishedNewsletterArticles();
}

import {
  mergeNewsletterArticles,
  NEWSLETTER_POSTS_FIELD_KEY,
  newsletterPostToArticle,
  parseNewsletterPostsRegistry,
  publishedPostsFromRegistry,
  type NewsletterArticle,
} from '@pms/site-content/newsletter-posts';
import { newsletterArticles as fileArticles } from '@/data/newsletterArticles';
import { supabase } from '@/lib/supabase';

export type { NewsletterArticle };
export { getNewsletterArticleHref } from '@pms/site-content/newsletter-posts';

async function fetchCmsArticles(): Promise<NewsletterArticle[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  try {
    const { data, error } = await supabase
      .from('website_data')
      .select('content')
      .eq('field_key', NEWSLETTER_POSTS_FIELD_KEY)
      .eq('is_published', true)
      .maybeSingle();

    if (error || !data?.content) return [];

    const registry = parseNewsletterPostsRegistry(data.content);
    return publishedPostsFromRegistry(registry).map(newsletterPostToArticle);
  } catch {
    return [];
  }
}

/** Server: published CMS posts merged with file seed (CMS wins on slug conflict). */
export async function getPublishedNewsletterArticles(): Promise<NewsletterArticle[]> {
  const cmsArticles = await fetchCmsArticles();
  return mergeNewsletterArticles(fileArticles, cmsArticles);
}

export async function getNewsletterArticle(slug: string): Promise<NewsletterArticle | undefined> {
  const articles = await getPublishedNewsletterArticles();
  return articles.find((a) => a.slug === slug);
}

/** Client hook data loader — same merge rules as server. */
export async function loadNewsletterArticlesClient(): Promise<NewsletterArticle[]> {
  return getPublishedNewsletterArticles();
}

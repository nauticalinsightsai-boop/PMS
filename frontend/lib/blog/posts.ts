import { cache } from 'react';
import {
  mergeNewsletterArticles,
  NEWSLETTER_POSTS_FIELD_KEY,
  newsletterPostToArticle,
  parseNewsletterPostsRegistry,
  publishedPostsFromRegistry,
  type NewsletterArticle,
} from '@pms/site-content/newsletter-posts';
import type { BlogArticle } from '@pms/site-content/cms-posts';
import { blogArticles as fileArticles } from '@/data/blogArticles';
import { supabase } from '@/lib/supabase';

export type { BlogArticle };
export { getBlogArticleHref } from '@pms/site-content/cms-posts';

function toBlogArticle(article: NewsletterArticle): BlogArticle {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    date: article.date,
    author: article.author,
    readTime: article.readTime,
    image: article.image,
    body: article.body,
    markdown: article.markdown,
    audioUrl: article.audioUrl,
    youtubeUrl: article.youtubeUrl,
  };
}

async function fetchCmsArticles(): Promise<BlogArticle[]> {
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
    return publishedPostsFromRegistry(registry).map((post) => toBlogArticle(newsletterPostToArticle(post)));
  } catch {
    return [];
  }
}

function mergeBlogArticlesFromNewsletter(
  file: BlogArticle[],
  cms: BlogArticle[],
): BlogArticle[] {
  const cmsAsNewsletter = cms.map((a) => a as unknown as NewsletterArticle);
  const fileAsNewsletter = file.map((a) => ({
    ...a,
    imageMobile: undefined,
    heroImageAlt: undefined,
  })) as NewsletterArticle[];
  return mergeNewsletterArticles(fileAsNewsletter, cmsAsNewsletter).map(toBlogArticle);
}

/** Server: published newsletter registry merged with file seed (CMS wins on slug conflict). */
export const getPublishedBlogArticles = cache(async (): Promise<BlogArticle[]> => {
  const cmsArticles = await fetchCmsArticles();
  return mergeBlogArticlesFromNewsletter(fileArticles, cmsArticles);
});

export async function getBlogArticle(slug: string): Promise<BlogArticle | undefined> {
  const articles = await getPublishedBlogArticles();
  return articles.find((a) => a.slug === slug);
}

/** Client hook data loader: same merge rules as server. */
export async function loadBlogArticlesClient(): Promise<BlogArticle[]> {
  return getPublishedBlogArticles();
}

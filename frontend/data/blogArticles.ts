import type { BlogArticle } from '@pms/site-content/cms-posts';
import { defaultCmsPostsRegistry, cmsPostToArticle } from '@pms/site-content/cms-posts';

/** File seed articles — used when Supabase is unavailable or as merge fallback. */
export const blogArticles: BlogArticle[] = publishedSeedArticles();

function publishedSeedArticles(): BlogArticle[] {
  return defaultCmsPostsRegistry()
    .posts.filter((p) => p.status === 'active')
    .map((p) => cmsPostToArticle(p));
}

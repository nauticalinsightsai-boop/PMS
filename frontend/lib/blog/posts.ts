import {
  CMS_POSTS_FIELD_KEY,
  CMS_TOPICS_FIELD_KEY,
  cmsPostToArticle,
  mergeBlogArticles,
  parseCmsPostsRegistry,
  publishedPostsFromRegistry,
  type BlogArticle,
} from '@pms/site-content/cms-posts';
import { blogArticles as fileArticles } from '@/data/blogArticles';
import { supabase } from '@/lib/supabase';

export type { BlogArticle };
export { getBlogArticleHref } from '@pms/site-content/cms-posts';

type TopicRow = { id: string; name: string; status: string };

function parseTopicNames(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== 'object') return {};
  const data = raw as { topics?: TopicRow[] };
  if (!Array.isArray(data.topics)) return {};
  const map: Record<string, string> = {};
  for (const topic of data.topics) {
    if (topic?.id && topic.status === 'active') map[topic.id] = topic.name;
  }
  return map;
}

async function fetchCmsArticles(): Promise<BlogArticle[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  try {
    const { data, error } = await supabase
      .from('website_data')
      .select('field_key, content')
      .in('field_key', [CMS_POSTS_FIELD_KEY, CMS_TOPICS_FIELD_KEY])
      .eq('is_published', true);

    if (error || !data?.length) return [];

    const postsRow = data.find((row) => row.field_key === CMS_POSTS_FIELD_KEY);
    if (!postsRow?.content) return [];

    const topicsRow = data.find((row) => row.field_key === CMS_TOPICS_FIELD_KEY);
    const topicNameById = parseTopicNames(topicsRow?.content);

    const registry = parseCmsPostsRegistry(postsRow.content);
    return publishedPostsFromRegistry(registry).map((post) =>
      cmsPostToArticle(post, topicNameById),
    );
  } catch {
    return [];
  }
}

/** Server: published CMS posts merged with file seed (CMS wins on slug conflict). */
export async function getPublishedBlogArticles(): Promise<BlogArticle[]> {
  const cmsArticles = await fetchCmsArticles();
  return mergeBlogArticles(fileArticles, cmsArticles);
}

export async function getBlogArticle(slug: string): Promise<BlogArticle | undefined> {
  const articles = await getPublishedBlogArticles();
  return articles.find((a) => a.slug === slug);
}

/** Client hook data loader — same merge rules as server. */
export async function loadBlogArticlesClient(): Promise<BlogArticle[]> {
  return getPublishedBlogArticles();
}

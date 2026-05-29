import { z } from 'zod';

export const CMS_POSTS_FIELD_KEY = 'cms_posts_registry';
export const CMS_TOPICS_FIELD_KEY = 'cms_topics_registry';

export const cmsStatusSchema = z.enum(['active', 'draft']);

export const cmsPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  status: cmsStatusSchema,
  featuredImageUrl: z.string(),
  content: z.string(),
  topicIds: z.array(z.string()),
  publishDate: z.string(),
  modifiedDate: z.string(),
  author: z.string(),
});

export const cmsPostsRegistrySchema = z.object({
  version: z.literal(1),
  posts: z.array(cmsPostSchema),
});

export type CmsStatus = z.infer<typeof cmsStatusSchema>;
export type CmsPost = z.infer<typeof cmsPostSchema>;
export type CmsPostsRegistry = z.infer<typeof cmsPostsRegistrySchema>;

/** Public marketing article shape (file seed + CMS mapped output). */
export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  body: string[];
};

export function slugifyCmsTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatCmsPostDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function contentToBodyParagraphs(content: string): string[] {
  const trimmed = content.trim();
  if (!trimmed) return [];
  return trimmed
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function isPublicCmsPost(post: CmsPost): boolean {
  return post.status === 'active';
}

export function cmsPostToArticle(
  post: CmsPost,
  topicNameById: Record<string, string> = {},
): BlogArticle {
  const image =
    post.featuredImageUrl.trim() ||
    `https://picsum.photos/seed/${encodeURIComponent(post.slug)}/800/600`;

  const category =
    post.topicIds.map((id) => topicNameById[id]).find(Boolean) || 'Insights';

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.description || post.metaDescription || post.title,
    category,
    date: formatCmsPostDate(post.publishDate),
    author: post.author || 'PM Structure Editorial',
    readTime: estimateReadTime(post.content),
    image,
    body: contentToBodyParagraphs(post.content),
  };
}

export function parseCmsPostsRegistry(raw: unknown): CmsPostsRegistry {
  const result = cmsPostsRegistrySchema.safeParse(raw);
  if (result.success) return result.data;
  if (!raw || typeof raw !== 'object') return defaultCmsPostsRegistry();
  const data = raw as Partial<CmsPostsRegistry>;
  if (data.version !== 1 || !Array.isArray(data.posts)) return defaultCmsPostsRegistry();
  return {
    version: 1,
    posts: data.posts.filter((post): post is CmsPost => Boolean(post?.id && post?.title)),
  };
}

export function defaultCmsPostsRegistry(): CmsPostsRegistry {
  const now = new Date().toISOString();
  return {
    version: 1,
    posts: [
      {
        id: 'post-workplace-safety-basics',
        title: 'Workplace Safety Basics Every Team Should Know',
        slug: 'workplace-safety-basics',
        description:
          'Foundational safety practices for teams starting or refreshing their HSE program.',
        metaTitle: 'Workplace Safety Basics Every Team Should Know',
        metaDescription:
          'Foundational safety practices for teams starting or refreshing their HSE program.',
        status: 'active',
        featuredImageUrl: '',
        content:
          'Safety culture starts with clear expectations, visible leadership, and practical controls.\n\n## Start with hazard identification\n\nWalk the site regularly and document risks before incidents occur.',
        topicIds: ['topic-safety'],
        publishDate: now,
        modifiedDate: now,
        author: 'PM Structure Editorial',
      },
      {
        id: 'post-employer-compliance-checklist',
        title: 'Employer Compliance Checklist for 2026',
        slug: 'employer-compliance-checklist-2026',
        description: 'A practical checklist for employers managing health and safety compliance.',
        metaTitle: 'Employer Compliance Checklist for 2026',
        metaDescription:
          'A practical checklist for employers managing health and safety compliance in 2026.',
        status: 'draft',
        featuredImageUrl: '',
        content:
          'Use this checklist during quarterly reviews to confirm policies, training, and records.',
        topicIds: ['topic-employer', 'topic-laws-and-regulations'],
        publishDate: now,
        modifiedDate: now,
        author: 'PM Structure Editorial',
      },
    ],
  };
}

export function createEmptyCmsPost(): CmsPost {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: '',
    slug: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    status: 'draft',
    featuredImageUrl: '',
    content: '',
    topicIds: [],
    publishDate: now,
    modifiedDate: now,
    author: '',
  };
}

export function publishedPostsFromRegistry(registry: CmsPostsRegistry): CmsPost[] {
  return registry.posts.filter(isPublicCmsPost);
}

export function mergeBlogArticles(
  fileArticles: BlogArticle[],
  cmsArticles: BlogArticle[],
): BlogArticle[] {
  const bySlug = new Map<string, BlogArticle>();
  for (const article of fileArticles) bySlug.set(article.slug, article);
  for (const article of cmsArticles) bySlug.set(article.slug, article);
  return Array.from(bySlug.values()).sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    if (!Number.isNaN(da) && !Number.isNaN(db) && da !== db) return db - da;
    return a.title.localeCompare(b.title);
  });
}

export function getBlogArticleHref(article: Pick<BlogArticle, 'slug'>): string {
  return `/blog/${article.slug}`;
}

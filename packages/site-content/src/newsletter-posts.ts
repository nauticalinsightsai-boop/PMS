import { z } from 'zod';

export const NEWSLETTER_POSTS_FIELD_KEY = 'newsletter_posts_registry';

export const newsletterPostStatusSchema = z.enum(['published', 'draft', 'scheduled']);

export const newsletterPostSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  keywords: z.string(),
  status: newsletterPostStatusSchema,
  publishDate: z.string(),
  modifiedDate: z.string(),
  author: z.string(),
  topics: z.array(z.string()),
  youtubeUrl: z.string(),
  featuredImageUrl: z.string(),
  audioUrl: z.string(),
  content: z.string(),
});

export const newsletterPostsRegistrySchema = z.object({
  version: z.literal(1),
  posts: z.array(newsletterPostSchema),
});

export type NewsletterPostStatus = z.infer<typeof newsletterPostStatusSchema>;
export type NewsletterPost = z.infer<typeof newsletterPostSchema>;
export type NewsletterPostsRegistry = z.infer<typeof newsletterPostsRegistrySchema>;

/** Public marketing article shape (file seed + CMS mapped output). */
export type NewsletterArticle = {
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

export function slugifyNewsletterTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatNewsletterPostDate(iso: string): string {
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

export function isPublicNewsletterPost(post: NewsletterPost, now = new Date()): boolean {
  if (post.status === 'published') return true;
  if (post.status === 'scheduled') {
    const publishAt = new Date(post.publishDate);
    return !Number.isNaN(publishAt.getTime()) && publishAt <= now;
  }
  return false;
}

export function newsletterPostToArticle(post: NewsletterPost): NewsletterArticle {
  const image =
    post.featuredImageUrl.trim() ||
    `https://picsum.photos/seed/${encodeURIComponent(post.slug)}/800/600`;

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.description || post.metaDescription || post.title,
    category: post.topics[0] || 'Insights',
    date: formatNewsletterPostDate(post.publishDate),
    author: post.author || 'PM Structure Editorial',
    readTime: estimateReadTime(post.content),
    image,
    body: contentToBodyParagraphs(post.content),
  };
}

export function parseNewsletterPostsRegistry(raw: unknown): NewsletterPostsRegistry {
  const result = newsletterPostsRegistrySchema.safeParse(raw);
  if (result.success) return result.data;
  if (!raw || typeof raw !== 'object') return defaultNewsletterPostsRegistry();
  const data = raw as Partial<NewsletterPostsRegistry>;
  if (data.version !== 1 || !Array.isArray(data.posts)) return defaultNewsletterPostsRegistry();
  return {
    version: 1,
    posts: data.posts.filter((post): post is NewsletterPost => Boolean(post?.id && post?.title)),
  };
}

export function defaultNewsletterPostsRegistry(): NewsletterPostsRegistry {
  const now = new Date().toISOString();
  return {
    version: 1,
    posts: [
      {
        id: 'post-moral-legal-financial-safety',
        slug: 'moral-legal-financial-reasons-managing-safety',
        title: 'Moral, Legal, and Financial Reasons for Managing Health and Safety',
        description:
          'Why manage safety? Expert auditor Badr Javed explains the three pillars: moral duty, legal compliance, and financial benefit.',
        metaTitle: 'Moral, Legal, and Financial Reasons for Managing Health and Safety',
        metaDescription:
          'Why manage safety? Expert auditor Badr Javed explains the 3 pillars: Moral duty, Legal compliance, and Financial benefit. Essential reading for HSE pros.',
        keywords:
          'Moral Legal Financial reasons, managing health and safety, cost of accidents, safety management justification, HSE compliance',
        status: 'published',
        publishDate: '2026-01-01T00:00:00.000Z',
        modifiedDate: now,
        author: 'Badar Javed',
        topics: ['Safety'],
        youtubeUrl: '',
        featuredImageUrl: '',
        audioUrl: '',
        content:
          'I vividly remember sitting across from a Project Director during a tense budget meeting for a massive offshore expansion project. The conversation turned to safety investment—and whether it was optional.\n\n## The Moral Reason\n\nEvery organization has an ethical duty to protect people who depend on its operations.\n\n## The Legal Reason\n\nRegulators expect documented controls, not good intentions.\n\n## The Financial Reason\n\nAccidents destroy margin through downtime, fines, and reputational loss.',
      },
      {
        id: 'post-certification-strategies-2026',
        slug: 'top-certification-strategies-2026',
        title: 'Top Certification Strategies for 2026',
        description:
          'Master the art of project management certifications with structured study rhythms and weak-area tracking.',
        metaTitle: 'Top Certification Strategies for 2026',
        metaDescription:
          'Structured certification strategies for PMP, PRINCE2, and Six Sigma candidates preparing in 2026.',
        keywords: 'PMP, PRINCE2, certification strategy, exam prep',
        status: 'draft',
        publishDate: now,
        modifiedDate: now,
        author: 'PM Structure Editorial',
        topics: ['Certification'],
        youtubeUrl: '',
        featuredImageUrl: '',
        audioUrl: '',
        content: 'Structured pathways beat random content consumption every time.',
      },
    ],
  };
}

export function createEmptyNewsletterPost(): NewsletterPost {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    slug: '',
    title: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    status: 'draft',
    publishDate: now,
    modifiedDate: now,
    author: '',
    topics: [],
    youtubeUrl: '',
    featuredImageUrl: '',
    audioUrl: '',
    content: '',
  };
}

export function publishedPostsFromRegistry(
  registry: NewsletterPostsRegistry,
  now = new Date(),
): NewsletterPost[] {
  return registry.posts.filter((post) => isPublicNewsletterPost(post, now));
}

export function mergeNewsletterArticles(
  fileArticles: NewsletterArticle[],
  cmsArticles: NewsletterArticle[],
): NewsletterArticle[] {
  const bySlug = new Map<string, NewsletterArticle>();
  for (const article of fileArticles) bySlug.set(article.slug, article);
  for (const article of cmsArticles) bySlug.set(article.slug, article);
  return Array.from(bySlug.values()).sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    if (!Number.isNaN(da) && !Number.isNaN(db) && da !== db) return db - da;
    return a.title.localeCompare(b.title);
  });
}

export function getNewsletterArticleHref(article: Pick<NewsletterArticle, 'slug'>): string {
  return `/newsletter/${article.slug}`;
}

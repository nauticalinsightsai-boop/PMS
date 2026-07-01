import { z } from 'zod';
import type { CmsPost } from './cms-posts';
import { newsletterFileSeedArticles } from './newsletter-file-seeds';

export { newsletterFileSeedArticles };

export const NEWSLETTER_POSTS_FIELD_KEY = 'newsletter_posts_registry';

export const newsletterPostStatusSchema = z.enum(['published', 'draft', 'scheduled']);

export const newsletterEditorMetaSchema = z.object({
  tone: z.string().default('informative'),
  template: z.string().default('news_roundup'),
  segment: z.string().default('all'),
  sectionCount: z.number().default(4),
  rawNotes: z.string().default(''),
});

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
  featuredImageMobileUrl: z.string().default(''),
  heroImageAlt: z.string().default(''),
  emailSubject: z.string().default(''),
  emailPreheader: z.string().default(''),
  ctaLabel: z.string().default(''),
  ctaUrl: z.string().default(''),
  editorMeta: newsletterEditorMetaSchema.default({}),
  audioUrl: z.string(),
  content: z.string(),
});

export const newsletterPostsRegistrySchema = z.object({
  version: z.literal(1),
  posts: z.array(newsletterPostSchema),
});

export type NewsletterPostStatus = z.infer<typeof newsletterPostStatusSchema>;
export type NewsletterEditorMeta = z.infer<typeof newsletterEditorMetaSchema>;
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
  imageMobile?: string;
  heroImageAlt?: string;
  body: string[];
  /** Full markdown source when mapped from CMS (preferred for rendering). */
  markdown?: string;
  audioUrl?: string;
  youtubeUrl?: string;
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
  if (Number.isNaN(date.getTime())) return '. ';
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

/** Self-hosted marketing WebP fallbacks when CMS featuredImageUrl is empty. */
export const NEWSLETTER_ARTICLE_IMAGE_FALLBACKS: Record<string, string> = {
  '2026-pmp-exam-changes': '/images/marketing/community-collab-600.webp',
  'hybrid-methodologies-enterprise': '/images/marketing/community-workshop-600.webp',
  'risk-beyond-probability-matrix': '/images/marketing/community-mentor-600.webp',
  'ai-augmented-project-manager': '/images/marketing/community-network-600.webp',
  'prince2-7th-edition-practitioner': '/images/marketing/about-workshop-800.webp',
  'building-high-performance-pmo': '/images/marketing/about-session-800.webp',
  'moral-legal-financial-reasons-managing-safety': '/images/marketing/mentorship-circle-900.webp',
  'top-certification-strategies-2026': '/images/marketing/membership-guides-500.webp',
};

const DEFAULT_NEWSLETTER_ARTICLE_IMAGE = '/images/marketing/community-collab-600.webp';

export function resolveNewsletterArticleImage(slug: string, featuredImageUrl?: string): string {
  const trimmed = featuredImageUrl?.trim() ?? '';
  if (trimmed && !trimmed.includes('picsum.photos')) return trimmed;
  return NEWSLETTER_ARTICLE_IMAGE_FALLBACKS[slug] ?? DEFAULT_NEWSLETTER_ARTICLE_IMAGE;
}

export function newsletterPostToArticle(post: NewsletterPost): NewsletterArticle {
  const image = resolveNewsletterArticleImage(post.slug, post.featuredImageUrl);
  const mobileRaw = post.featuredImageMobileUrl?.trim() ?? '';
  const imageMobile = mobileRaw
    ? mobileRaw
    : image;

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.description || post.metaDescription || post.title,
    category: post.topics[0] || 'Insights',
    date: formatNewsletterPostDate(post.publishDate),
    author: post.author || 'PM Structure Editorial',
    readTime: estimateReadTime(post.content),
    image,
    imageMobile,
    heroImageAlt: post.heroImageAlt?.trim() || post.title,
    body: contentToBodyParagraphs(post.content),
    markdown: post.content.trim() || undefined,
    audioUrl: post.audioUrl?.trim() || undefined,
    youtubeUrl: post.youtubeUrl?.trim() || undefined,
  };
}

export function parseNewsletterPostsRegistry(raw: unknown): NewsletterPostsRegistry {
  const result = newsletterPostsRegistrySchema.safeParse(raw);
  if (result.success) return result.data;
  if (!raw || typeof raw !== 'object') return defaultNewsletterPostsRegistry();
  const data = raw as Partial<NewsletterPostsRegistry>;
  if (data.version !== 1 || !Array.isArray(data.posts)) return defaultNewsletterPostsRegistry();
  const posts = data.posts
    .map((post) => newsletterPostSchema.safeParse(post))
    .filter((row): row is { success: true; data: NewsletterPost } => row.success)
    .map((row) => row.data);
  return { version: 1, posts };
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
        featuredImageUrl: '/images/marketing/mentorship-circle-900.webp',
        featuredImageMobileUrl: '',
        heroImageAlt: '',
        emailSubject: '',
        emailPreheader: '',
        ctaLabel: '',
        ctaUrl: '',
        editorMeta: {
          tone: 'informative',
          template: 'news_roundup',
          segment: 'all',
          sectionCount: 4,
          rawNotes: '',
        },
        audioUrl: '',
        content:
          'I vividly remember sitting across from a Project Director during a tense budget meeting for a massive offshore expansion project. The conversation turned to safety investment: and whether it was optional.\n\n## The Moral Reason\n\nEvery organization has an ethical duty to protect people who depend on its operations.\n\n## The Legal Reason\n\nRegulators expect documented controls, not good intentions.\n\n## The Financial Reason\n\nAccidents destroy margin through downtime, fines, and reputational loss.',
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
        featuredImageMobileUrl: '',
        heroImageAlt: '',
        emailSubject: '',
        emailPreheader: '',
        ctaLabel: '',
        ctaUrl: '',
        editorMeta: {
          tone: 'informative',
          template: 'news_roundup',
          segment: 'all',
          sectionCount: 4,
          rawNotes: '',
        },
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
    featuredImageMobileUrl: '',
    heroImageAlt: '',
    emailSubject: '',
    emailPreheader: '',
    ctaLabel: '',
    ctaUrl: '',
    editorMeta: {
      tone: 'informative',
      template: 'news_roundup',
      segment: 'all',
      sectionCount: 4,
      rawNotes: '',
    },
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

export function newsletterArticleToPost(
  article: NewsletterArticle,
  status: NewsletterPostStatus = 'published',
): NewsletterPost {
  const now = new Date().toISOString();
  const content = article.markdown?.trim() || article.body.join('\n\n');
  const parsedDate = new Date(article.date);
  const publishDate = !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : now;

  return {
    id: `post-${article.slug}`,
    slug: article.slug,
    title: article.title,
    description: article.excerpt,
    metaTitle: article.title,
    metaDescription: article.excerpt,
    keywords: article.category,
    status,
    publishDate,
    modifiedDate: now,
    author: article.author,
    topics: [article.category],
    youtubeUrl: '',
    featuredImageUrl: article.image,
    featuredImageMobileUrl: article.imageMobile ?? '',
    heroImageAlt: article.heroImageAlt?.trim() || article.title,
    emailSubject: '',
    emailPreheader: '',
    ctaLabel: '',
    ctaUrl: '',
    editorMeta: {
      tone: 'informative',
      template: 'news_roundup',
      segment: 'all',
      sectionCount: 4,
      rawNotes: '',
    },
    audioUrl: '',
    content,
  };
}

export function cmsPostToNewsletterPost(
  post: CmsPost,
  topicNameById: Record<string, string> = {},
): NewsletterPost {
  const now = new Date().toISOString();
  const topics = post.topicIds
    .map((id) => topicNameById[id])
    .filter((name): name is string => Boolean(name));

  return {
    id: post.id.startsWith('post-') ? post.id : `post-${post.id}`,
    slug: post.slug,
    title: post.title,
    description: post.description,
    metaTitle: post.metaTitle || post.title,
    metaDescription: post.metaDescription || post.description,
    keywords: '',
    status: post.status === 'active' ? 'published' : 'draft',
    publishDate: post.publishDate || now,
    modifiedDate: post.modifiedDate || now,
    author: post.author || 'PM Structure Editorial',
    topics: topics.length > 0 ? topics : ['Insights'],
    youtubeUrl: '',
    featuredImageUrl: post.featuredImageUrl,
    featuredImageMobileUrl: '',
    heroImageAlt: post.title,
    emailSubject: '',
    emailPreheader: '',
    ctaLabel: '',
    ctaUrl: '',
    editorMeta: {
      tone: 'informative',
      template: 'news_roundup',
      segment: 'all',
      sectionCount: 4,
      rawNotes: '',
    },
    audioUrl: '',
    content: post.content,
  };
}

/** Later registries in the list win on slug collision — pass draft last so it takes priority. */
export function mergeNewsletterRegistries(
  ...sources: NewsletterPostsRegistry[]
): NewsletterPostsRegistry {
  const bySlug = new Map<string, NewsletterPost>();
  for (const reg of sources) {
    for (const post of reg.posts) {
      bySlug.set(post.slug, post);
    }
  }
  const posts = Array.from(bySlug.values()).sort(
    (a, b) =>
      new Date(b.modifiedDate || b.publishDate).getTime() -
      new Date(a.modifiedDate || a.publishDate).getTime(),
  );
  return { version: 1, posts };
}

export function registryFromNewsletterArticles(
  articles: NewsletterArticle[] = newsletterFileSeedArticles,
): NewsletterPostsRegistry {
  return {
    version: 1,
    posts: articles.map((article) => newsletterArticleToPost(article)),
  };
}
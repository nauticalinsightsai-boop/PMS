import { z } from 'zod';
import type { NewsletterArticle } from './newsletter-posts';

export const NEWSLETTER_AUTHORS_FIELD_KEY = 'newsletter_authors_registry';

export const newsletterAuthorStatusSchema = z.enum(['active', 'draft']);

export const newsletterAuthorSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  /** Role shown under the byline, e.g. "Senior Editor". */
  title: z.string().default(''),
  bio: z.string().default(''),
  avatarUrl: z.string().default(''),
  status: newsletterAuthorStatusSchema.default('draft'),
  linkedinUrl: z.string().default(''),
  twitterUrl: z.string().default(''),
  websiteUrl: z.string().default(''),
  email: z.string().default(''),
  modifiedDate: z.string(),
});

export const newsletterAuthorsRegistrySchema = z.object({
  version: z.literal(1),
  authors: z.array(newsletterAuthorSchema),
});

export type NewsletterAuthorStatus = z.infer<typeof newsletterAuthorStatusSchema>;
export type NewsletterAuthor = z.infer<typeof newsletterAuthorSchema>;
export type NewsletterAuthorsRegistry = z.infer<typeof newsletterAuthorsRegistrySchema>;

export function slugifyAuthorName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function isPublicNewsletterAuthor(author: NewsletterAuthor): boolean {
  return author.status === 'active';
}

export function parseNewsletterAuthorsRegistry(raw: unknown): NewsletterAuthorsRegistry {
  const result = newsletterAuthorsRegistrySchema.safeParse(raw);
  if (result.success) return result.data;
  if (!raw || typeof raw !== 'object') return defaultNewsletterAuthorsRegistry();
  const data = raw as Partial<NewsletterAuthorsRegistry>;
  if (data.version !== 1 || !Array.isArray(data.authors)) return defaultNewsletterAuthorsRegistry();
  const authors = data.authors
    .map((author) => newsletterAuthorSchema.safeParse(author))
    .filter((row): row is { success: true; data: NewsletterAuthor } => row.success)
    .map((row) => row.data);
  return { version: 1, authors };
}

export function defaultNewsletterAuthorsRegistry(): NewsletterAuthorsRegistry {
  const now = new Date().toISOString();
  const seed = (
    id: string,
    name: string,
    title: string,
    bio: string,
    avatarUrl = '',
  ): NewsletterAuthor => ({
    id,
    slug: slugifyAuthorName(name),
    name,
    title,
    bio,
    avatarUrl,
    status: 'active',
    linkedinUrl: '',
    twitterUrl: '',
    websiteUrl: '',
    email: '',
    modifiedDate: now,
  });

  return {
    version: 1,
    authors: [
      seed(
        'author-pm-structure-editorial',
        'PM Structure Editorial',
        'Editorial Team',
        'The PM Structure editorial team publishes structured guidance on project management certification, exam strategy, and delivery leadership.',
      ),
    ],
  };
}

export function createEmptyNewsletterAuthor(): NewsletterAuthor {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    slug: '',
    name: '',
    title: '',
    bio: '',
    avatarUrl: '',
    status: 'draft',
    linkedinUrl: '',
    twitterUrl: '',
    websiteUrl: '',
    email: '',
    modifiedDate: now,
  };
}

export function publishedAuthorsFromRegistry(
  registry: NewsletterAuthorsRegistry,
): NewsletterAuthor[] {
  return registry.authors.filter(isPublicNewsletterAuthor);
}

/** Resolve the author for an article: match by authorId first, then by name. */
export function findAuthorForArticle(
  article: Pick<NewsletterArticle, 'authorId' | 'author'>,
  authors: NewsletterAuthor[],
): NewsletterAuthor | undefined {
  const byId = article.authorId
    ? authors.find((author) => author.id === article.authorId)
    : undefined;
  if (byId) return byId;
  const name = article.author?.trim().toLowerCase();
  if (!name) return undefined;
  return authors.find((author) => author.name.trim().toLowerCase() === name);
}

/** Merge author profile fields (avatar, title, bio, slug, socials) into an article. */
export function attachAuthorToArticle(
  article: NewsletterArticle,
  authors: NewsletterAuthor[],
): NewsletterArticle {
  const author = findAuthorForArticle(article, authors);
  if (!author) return article;
  return {
    ...article,
    author: author.name || article.author,
    authorId: author.id,
    authorSlug: author.slug,
    authorTitle: author.title || article.authorTitle,
    authorBio: author.bio || article.authorBio,
    authorImage: author.avatarUrl || article.authorImage,
    authorLinkedinUrl: author.linkedinUrl || article.authorLinkedinUrl,
    authorTwitterUrl: author.twitterUrl || article.authorTwitterUrl,
    authorWebsiteUrl: author.websiteUrl || article.authorWebsiteUrl,
  };
}

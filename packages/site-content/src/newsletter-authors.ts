import { z } from 'zod';
import authorProfilesPacketRaw from '../data/newsletter-author-profiles.json';
import {
  normalizeNewsletterAuthorName,
  type NewsletterArticle,
} from './newsletter-posts';

export const NEWSLETTER_AUTHORS_FIELD_KEY = 'newsletter_authors_registry';

export const newsletterAuthorStatusSchema = z.enum(['active', 'draft']);
export const newsletterAuthorBylineTypeSchema = z.enum(['person', 'editorial_role']);

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
  /** Explicitly distinguishes a real person from a transparent organisation/editorial byline. */
  bylineType: newsletterAuthorBylineTypeSchema.default('person'),
  /**
   * When false, do not emit schema.org Person for this byline.
   * Editorial roles must always remain false and use the PM Structure organisation fallback.
   */
  personSchemaEligible: z.boolean().default(false),
  /** True only when a real-person profile is incomplete and must block publication. */
  profilePending: z.boolean().default(false),
  /** Initials for neutral branded avatar fallbacks. */
  initials: z.string().default(''),
});

export const newsletterAuthorsRegistrySchema = z.object({
  version: z.literal(1),
  authors: z.array(newsletterAuthorSchema),
});

export type NewsletterAuthorStatus = z.infer<typeof newsletterAuthorStatusSchema>;
export type NewsletterAuthorBylineType = z.infer<typeof newsletterAuthorBylineTypeSchema>;
export type NewsletterAuthor = z.infer<typeof newsletterAuthorSchema>;
export type NewsletterAuthorsRegistry = z.infer<typeof newsletterAuthorsRegistrySchema>;

const authorProfilesPacketSchema = z.object({
  version: z.literal(1),
  profiles: z.array(newsletterAuthorSchema),
  allocationByPriority: z.record(z.string()),
});

const authorProfilesPacket = authorProfilesPacketSchema.parse(authorProfilesPacketRaw);

/** Replaceable seed profiles: change the JSON registry, not article bodies. */
export const NEWSLETTER_AUTHOR_PROFILE_SEED: NewsletterAuthor[] = authorProfilesPacket.profiles;

/** Priority → authorId allocation for the 13-draft import. */
export const NEWSLETTER_DRAFT_AUTHOR_ALLOCATION: Readonly<Record<number, string>> = Object.fromEntries(
  Object.entries(authorProfilesPacket.allocationByPriority).map(([priority, authorId]) => [
    Number(priority),
    authorId,
  ]),
);

export function getNewsletterAuthorProfileById(id: string): NewsletterAuthor | undefined {
  return NEWSLETTER_AUTHOR_PROFILE_SEED.find((author) => author.id === id);
}

export function resolveDraftAuthorProfile(priority: number): NewsletterAuthor {
  const authorId = NEWSLETTER_DRAFT_AUTHOR_ALLOCATION[priority];
  if (!authorId) {
    throw new Error(`No author allocation for newsletter priority ${priority}`);
  }
  const profile = getNewsletterAuthorProfileById(authorId);
  if (!profile) {
    throw new Error(`Missing newsletter author profile for id ${authorId}`);
  }
  return profile;
}

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
  return {
    version: 1,
    authors: NEWSLETTER_AUTHOR_PROFILE_SEED.map((author) => ({ ...author })),
  };
}

/**
 * Merge persisted author profiles over the replaceable seed registry by stable ID.
 * Seed profiles remain available when a partial CMS registry omits them.
 */
export function mergeNewsletterAuthorProfiles(
  seeds: NewsletterAuthor[],
  persisted: NewsletterAuthor[],
): NewsletterAuthor[] {
  const byId = new Map(seeds.map((author) => [author.id, { ...author }]));
  for (const author of persisted) {
    byId.set(author.id, { ...author });
  }
  return Array.from(byId.values());
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
    bylineType: 'person',
    personSchemaEligible: false,
    profilePending: false,
    initials: '',
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
  const authorId = article.authorId?.trim();
  if (authorId) {
    return authors.find((author) => author.id === authorId);
  }
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
  if (!author) {
    return {
      ...article,
      author: article.authorId
        ? article.author
        : normalizeNewsletterAuthorName(article.author),
    };
  }
  const canonicalName = normalizeNewsletterAuthorName(author.name);
  return {
    ...article,
    author: canonicalName,
    authorId: author.id,
    authorSlug: author.slug,
    authorTitle: author.title || article.authorTitle,
    authorBio: author.bio || article.authorBio,
    authorImage: author.avatarUrl || article.authorImage,
    authorLinkedinUrl: author.linkedinUrl || article.authorLinkedinUrl,
    authorTwitterUrl: author.twitterUrl || article.authorTwitterUrl,
    authorWebsiteUrl: author.websiteUrl || article.authorWebsiteUrl,
    authorBylineType: author.bylineType,
    authorPersonSchemaEligible: author.personSchemaEligible,
    authorProfilePending: author.profilePending,
  };
}

import { z } from 'zod';
import newsletterHeroManifestRaw from '../data/newsletter-hero-manifest-2026-07-26.json';

const newsletterHeroArticleSchema = z.object({
  slug: z.string().min(1),
  image: z.string().regex(/^\/images\/newsletter\/generated-2026-07-26\/.+\.webp$/),
  alt: z.string().min(1),
});

const newsletterHeroManifestSchema = z.object({
  version: z.literal(1),
  preparedAt: z.string(),
  assetRoot: z.string(),
  format: z.literal('webp'),
  width: z.literal(1600),
  height: z.literal(900),
  branding: z.string().optional(),
  audience: z.string().optional(),
  articles: z.array(newsletterHeroArticleSchema).length(13),
});

export type NewsletterHeroManifest = z.infer<typeof newsletterHeroManifestSchema>;
export type NewsletterHeroArticle = z.infer<typeof newsletterHeroArticleSchema>;

const GENERIC_NEWSLETTER_HERO_PREFIXES = [
  '/images/marketing/',
  'picsum.photos',
] as const;

function loadManifest(): NewsletterHeroManifest {
  return newsletterHeroManifestSchema.parse(newsletterHeroManifestRaw);
}

let cached: NewsletterHeroManifest | undefined;
let bySlugCache: Map<string, NewsletterHeroArticle> | undefined;

export function getNewsletterHeroManifest(): NewsletterHeroManifest {
  if (!cached) cached = loadManifest();
  return cached;
}

export function getNewsletterHeroBySlug(slug: string): NewsletterHeroArticle | undefined {
  if (!bySlugCache) {
    bySlugCache = new Map(getNewsletterHeroManifest().articles.map((a) => [a.slug, a]));
  }
  return bySlugCache.get(slug);
}

/** Authoritative hero image for the 13 live catalogue slugs. */
export function resolveNewsletterHeroImage(slug: string, featuredImageUrl?: string): string | undefined {
  const hero = getNewsletterHeroBySlug(slug);
  if (hero) return hero.image;
  const trimmed = featuredImageUrl?.trim() ?? '';
  if (trimmed && !GENERIC_NEWSLETTER_HERO_PREFIXES.some((p) => trimmed.includes(p))) {
    return trimmed;
  }
  return undefined;
}

/** Authoritative alt text for the 13 live catalogue slugs. */
export function resolveNewsletterHeroAlt(slug: string, heroImageAlt?: string, titleFallback?: string): string {
  const hero = getNewsletterHeroBySlug(slug);
  if (hero?.alt.trim()) return hero.alt.trim();
  const trimmed = heroImageAlt?.trim() ?? '';
  if (trimmed) return trimmed;
  return titleFallback?.trim() || slug;
}

export function isGenericNewsletterHeroPath(path: string): boolean {
  return GENERIC_NEWSLETTER_HERO_PREFIXES.some((p) => path.includes(p));
}

export function listNewsletterHeroSlugs(): string[] {
  return getNewsletterHeroManifest().articles.map((a) => a.slug);
}

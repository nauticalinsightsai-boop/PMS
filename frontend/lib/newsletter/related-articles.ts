import type { NewsletterArticle } from '@pms/site-content/newsletter-posts';

const DEFAULT_LIMIT = 4;

function articleTimestamp(article: NewsletterArticle): number {
  const t = new Date(article.date).getTime();
  return Number.isNaN(t) ? 0 : t;
}

function seedFromSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let state = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const j = state % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Pick related newsletter articles: same category first, then recent/random from the rest. */
export function pickRelatedNewsletterArticles(
  article: NewsletterArticle,
  all: NewsletterArticle[],
  limit = DEFAULT_LIMIT,
): NewsletterArticle[] {
  const others = all.filter((candidate) => candidate.slug !== article.slug);
  if (others.length === 0) return [];

  const picked: NewsletterArticle[] = [];
  const seen = new Set<string>();

  for (const match of others.filter((candidate) => candidate.category === article.category)) {
    if (picked.length >= limit) break;
    picked.push(match);
    seen.add(match.slug);
  }

  if (picked.length < limit) {
    const recentPool = others
      .filter((candidate) => !seen.has(candidate.slug))
      .sort((a, b) => articleTimestamp(b) - articleTimestamp(a))
      .slice(0, Math.max(limit * 2, 8));

    for (const match of seededShuffle(recentPool, seedFromSlug(article.slug))) {
      if (picked.length >= limit) break;
      picked.push(match);
      seen.add(match.slug);
    }
  }

  return picked;
}

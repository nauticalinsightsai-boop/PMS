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

/** Pick related newsletter articles.
 * - Same-category first
 * - Then recent/deterministic random from the remaining pool
 * - Never returns empty when `all` contains other articles
 */
export function pickRelatedNewsletterArticles(
  article: NewsletterArticle,
  all: NewsletterArticle[],
  limit = DEFAULT_LIMIT,
): NewsletterArticle[] {
  const others = all.filter((candidate) => candidate.slug !== article.slug);
  if (others.length === 0) return [];

  const picked: NewsletterArticle[] = [];
  const seen = new Set<string>();

  const sameCategory = others.filter(
    (candidate) => candidate.category === article.category,
  );

  for (const match of sameCategory) {
    if (picked.length >= limit) break;
    if (seen.has(match.slug)) continue;
    picked.push(match);
    seen.add(match.slug);
  }

  if (picked.length < limit) {
    const fallbackPool = others
      .filter((candidate) => !seen.has(candidate.slug))
      .sort((a, b) => articleTimestamp(b) - articleTimestamp(a))
      .slice(0, Math.max(limit * 2, 8));

    const shuffled = seededShuffle(fallbackPool, seedFromSlug(article.slug));
    for (const match of shuffled) {
      if (picked.length >= limit) break;
      if (seen.has(match.slug)) continue;
      picked.push(match);
      seen.add(match.slug);
    }
  }

  // Final guard: if we somehow didn’t pick anything (e.g. unexpected data), still return something.
  if (picked.length === 0) {
    return seededShuffle(others, seedFromSlug(article.slug)).slice(0, limit);
  }

  return picked;
}


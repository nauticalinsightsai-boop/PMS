import type { Metadata } from 'next';
import { isGscSoftNoindexPath } from '@/content/indexation/gsc-crawled-not-indexed-noindex';

/** Explicit index,follow for public authority pages. */
export const ROBOTS_INDEX_FOLLOW: NonNullable<Metadata['robots']> = {
  index: true,
  follow: true,
};

/** Utility, payment, enrollment, and admin surfaces. */
export const ROBOTS_NOINDEX_NOFOLLOW: NonNullable<Metadata['robots']> = {
  index: false,
  follow: false,
};

/** Path prefixes that must never appear in sitemaps or organic index.
 *  Governance matrix: frontend/content/indexation/strategy.ts (T-038) */
export const NOINDEX_PATH_PREFIXES = [
  '/admin',
  '/checkout',
  '/membership/checkout',
  '/api',
  '/compare',
  '/store',
] as const;

/** Exact paths that redirect or are not organic landings (children may still index). */
export const NOINDEX_EXACT_PATHS = ['/go'] as const;

/** Regex patterns for noindex routes (enrollment flows, etc.). */
export const NOINDEX_PATH_PATTERNS = [
  /^\/certifications\/[^/]+\/[^/]+\/enroll(?:\/|$)/,
] as const;

export function normalizePath(path: string): string {
  if (!path || path === '/') return '/';
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  return withSlash.replace(/\/+$/, '') || '/';
}

export function isIndexablePath(path: string): boolean {
  const p = normalizePath(path);
  if (isGscSoftNoindexPath(p)) return false;
  for (const exact of NOINDEX_EXACT_PATHS) {
    if (p === exact) return false;
  }
  for (const prefix of NOINDEX_PATH_PREFIXES) {
    if (p === prefix || p.startsWith(`${prefix}/`)) return false;
  }
  for (const pattern of NOINDEX_PATH_PATTERNS) {
    if (pattern.test(p)) return false;
  }
  return true;
}

export function robotsForPath(path: string): Metadata['robots'] {
  return isIndexablePath(path) ? ROBOTS_INDEX_FOLLOW : ROBOTS_NOINDEX_NOFOLLOW;
}

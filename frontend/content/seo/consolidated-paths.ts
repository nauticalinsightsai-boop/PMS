/**
 * Routes consolidated after the 9 July 2026 PMP exam launch.
 * These paths must redirect and must not appear in XML/HTML sitemaps.
 */
export const CONSOLIDATED_SEO_PATHS = new Set([
  '/topics/pmp-exam-2026',
  '/pmp-before-8-july-2026',
  '/answers/should-i-rush-pmp-before-july-2026',
  '/answers/should-i-take-pmp-before-july-2026',
  '/answers/should-i-take-pmp-before-8-july-2026',
  '/answers/should-i-take-the-pmp-before-8-july-2026',
]);

export function isConsolidatedSeoPath(path: string): boolean {
  const normalized = path !== '/' ? path.replace(/\/+$/, '') : path;
  return CONSOLIDATED_SEO_PATHS.has(normalized);
}

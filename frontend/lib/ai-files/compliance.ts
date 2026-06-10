/** Safe / unsafe language and URL rules for public AI files (Run 7). */

export const AI_FILE_VERSION = '1.0.0';

export const UNSAFE_PHRASES = [
  'guaranteed pass',
  'guarantee a pass',
  'pmi authorized training partner',
  'pmi atp',
  'official pmi training provider',
] as const;

export const DO_NOT_CITE_PATH_PREFIXES = [
  '/checkout',
  '/admin',
  '/dashboard',
  '/login',
  '/certifications/',
  '/enroll',
] as const;

export const DO_NOT_CITE_EXACT = [
  '/checkout',
  '/checkout/success',
  '/checkout/cancel',
  '/admin',
  '/admin/login',
] as const;

export const COMPLIANCE_DISCLAIMER =
  'Independent exam preparation provider. Not a PMI ATP unless explicitly stated on a live page. No guaranteed pass rates. Official exam fees excluded from tuition.';

export function stripMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

export function isSafeCitationUrl(url: string): boolean {
  if (!url.startsWith('https://')) return false;
  if (url.includes('/checkout') || url.includes('/admin') || url.includes('/dashboard')) {
    return false;
  }
  if (/\/certifications\/[^/]+\/[^/]+\/enroll/.test(url)) return false;
  return true;
}

export function containsUnsafePhrase(text: string): boolean {
  const lower = text.toLowerCase();
  return UNSAFE_PHRASES.some((p) => lower.includes(p));
}

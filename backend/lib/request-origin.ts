import { PRODUCTION_SITE_URL, resolvePublicSiteUrl } from '@pms/site-content/public-site-url';

export function requestOrigin(request: Request): string {
  const header = request.headers.get('origin')?.trim();
  if (header) return header.replace(/\/$/, '');
  return resolvePublicSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, PRODUCTION_SITE_URL);
}

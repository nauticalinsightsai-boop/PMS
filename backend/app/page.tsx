import { redirect } from 'next/navigation';
import { PRODUCTION_SITE_URL, resolvePublicSiteUrl } from '@pms/site-content/public-site-url';

/** API-only app: send humans to the main website. */
export default function ApiRootRedirect() {
  redirect(resolvePublicSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, PRODUCTION_SITE_URL));
}

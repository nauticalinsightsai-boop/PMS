import { redirect } from 'next/navigation';
import { PRODUCTION_SITE_URL, resolvePublicSiteUrl } from '@pms/site-content/public-site-url';

const dashboardLogin = `${resolvePublicSiteUrl(
  process.env.NEXT_PUBLIC_DASHBOARD_URL ?? process.env.NEXT_PUBLIC_SITE_URL,
  PRODUCTION_SITE_URL,
)}/admin/login`;

/** Dashboard API only: send humans to the dashboard UI login. */
export default function DashboardApiRootRedirect() {
  redirect(dashboardLogin);
}

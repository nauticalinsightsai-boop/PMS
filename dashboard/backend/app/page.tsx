import { redirect } from 'next/navigation';

const dashboardLogin =
  `${process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:5174'}/login`;

/** Dashboard API only — send humans to the dashboard UI login. */
export default function DashboardApiRootRedirect() {
  redirect(dashboardLogin);
}

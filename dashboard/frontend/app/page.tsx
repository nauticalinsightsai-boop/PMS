import { redirect } from 'next/navigation';

/** Dashboard app entry — send to login; public site is the main website app. */
export default function DashboardRoot() {
  redirect('/login');
}

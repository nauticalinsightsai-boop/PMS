import { redirect } from 'next/navigation';

/** API-only app — send humans to the main website. */
export default function ApiRootRedirect() {
  redirect(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3050');
}

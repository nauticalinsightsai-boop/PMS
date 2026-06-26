import { redirect } from 'next/navigation';

/** Legacy route — site images live under Home → Site images tab. */
export default function MediaLibraryRedirectPage() {
  redirect('/dashboard/site-system/home?tab=media');
}

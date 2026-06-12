import { redirect } from 'next/navigation';

/** Legacy path — canonical home editor is `/dashboard/site-system/home`. */
export default function LegacyPagesHomeRedirect() {
  redirect('/dashboard/site-system/home');
}

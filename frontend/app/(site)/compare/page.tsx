import { redirect } from 'next/navigation';

/** Legacy URL — canonical route is /certifications/compare */
export default function CompareRedirectPage() {
  redirect('/certifications/compare');
}

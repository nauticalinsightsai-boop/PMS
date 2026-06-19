import { permanentRedirect } from 'next/navigation';

/** Legacy URL: canonical route is /certifications/compare */
export default function CompareRedirectPage() {
  permanentRedirect('/certifications/compare');
}

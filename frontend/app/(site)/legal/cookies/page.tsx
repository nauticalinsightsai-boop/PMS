import { LegalCookiesPage } from '@/components/pages/legal/LegalCookiesPage';
import { cookiesDocument } from '@/content/legal/cookies';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: cookiesDocument.title,
  description: cookiesDocument.jurisdictionNote,
  path: '/legal/cookies',
});

export default function Page() {
  return <LegalCookiesPage />;
}

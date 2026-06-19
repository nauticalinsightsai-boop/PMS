import { Contact } from '@/components/pages/Contact';
import { buildPageMetadata } from '@/lib/site-metadata';
import { fetchPublishedGlobalContent } from '@/lib/cms/fetch-published-document';

export const metadata = buildPageMetadata({
  title: 'Contact & consultation',
  description: 'Book a pathway consultation or contact PM Structure support.',
  path: '/contact',
});

export default async function Page() {
  const globalContent = await fetchPublishedGlobalContent();

  return <Contact globalContent={globalContent} />;
}

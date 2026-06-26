import { Contact } from '@/components/pages/Contact';
import { buildPageMetadataWithCms } from '@/lib/cms/page-metadata';
import { fetchPublishedGlobalContent } from '@/lib/cms/fetch-published-document';

export async function generateMetadata() {
  return buildPageMetadataWithCms('contact', {
    title: 'Contact & consultation',
    description: 'Book a pathway consultation or contact PM Structure support.',
    path: '/contact',
  });
}

export default async function Page() {
  const globalContent = await fetchPublishedGlobalContent();

  return <Contact globalContent={globalContent} />;
}

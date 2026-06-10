import type { Metadata } from 'next';
import { PmpAuthorityPage } from '@/components/pmp/PmpAuthorityPage';
import { buildPageMetadata } from '@/lib/site-metadata';
import { getPmpPage } from './pages';

export function createPmpPageExports(slug: string) {
  const page = getPmpPage(slug);
  if (!page) throw new Error(`Unknown PMP page slug: ${slug}`);

  const metadata: Metadata = buildPageMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
  });

  function Page() {
    return <PmpAuthorityPage page={page} />;
  }

  return { metadata, Page };
}

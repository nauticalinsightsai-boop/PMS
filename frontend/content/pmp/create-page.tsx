import type { Metadata } from 'next';
import { PmpAuthorityPage } from '@/components/pmp/PmpAuthorityPage';
import { buildPageMetadata, buildPhase2PageMetadata } from '@/lib/site-metadata';
import { titleNeedsNoSuffix } from '@/content/seo/phase-2-page-seo';
import { getPmpPage } from './pages';

export function createPmpPageExports(slug: string) {
  const page = getPmpPage(slug);
  if (!page) throw new Error(`Unknown PMP page slug: ${slug}`);

  const metadata: Metadata =
    buildPhase2PageMetadata(page.path) ??
    buildPageMetadata({
      title: page.title,
      description: page.description,
      path: page.path,
      noSuffix: titleNeedsNoSuffix(page.title),
    });

  function Page() {
    return <PmpAuthorityPage page={page} />;
  }

  return { metadata, Page };
}

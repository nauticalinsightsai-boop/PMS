import type { Metadata } from 'next';
import { PmpServicePage } from '@/components/pmp/PmpServicePage';
import { buildPageMetadata, buildPhase2PageMetadata } from '@/lib/site-metadata';
import { titleNeedsNoSuffix } from '@/content/seo/phase-2-page-seo';
import { getPmpService } from './services';

export function createPmpServicePageExports(slug: string) {
  const service = getPmpService(slug);
  if (!service) throw new Error(`Unknown PMP service slug: ${slug}`);

  const metadata: Metadata =
    buildPhase2PageMetadata(service.path) ??
    buildPageMetadata({
      title: service.title,
      description: service.description,
      path: service.path,
      noSuffix: titleNeedsNoSuffix(service.title),
    });

  function Page() {
    return <PmpServicePage service={service} />;
  }

  return { metadata, Page };
}

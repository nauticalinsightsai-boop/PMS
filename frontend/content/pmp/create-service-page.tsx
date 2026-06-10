import type { Metadata } from 'next';
import { PmpServicePage } from '@/components/pmp/PmpServicePage';
import { buildPageMetadata } from '@/lib/site-metadata';
import { getPmpService } from './services';

export function createPmpServicePageExports(slug: string) {
  const service = getPmpService(slug);
  if (!service) throw new Error(`Unknown PMP service slug: ${slug}`);

  const metadata: Metadata = buildPageMetadata({
    title: service.title,
    description: service.description,
    path: service.path,
  });

  function Page() {
    return <PmpServicePage service={service} />;
  }

  return { metadata, Page };
}

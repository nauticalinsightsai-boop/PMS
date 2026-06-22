import type { Metadata } from 'next';
import { Pmp2026PathwayPage } from '@/components/pmp/Pmp2026PathwayPage';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';
import { PMP_PATHWAY_PAGE } from '@/content/pmp/pathway-page';

export const metadata: Metadata =
  buildPhase2PageMetadata(PMP_PATHWAY_PAGE.path) ?? {
    title: PMP_PATHWAY_PAGE.title,
    description: PMP_PATHWAY_PAGE.description,
    alternates: { canonical: PMP_PATHWAY_PAGE.path },
  };

export default function Page() {
  return <Pmp2026PathwayPage />;
}

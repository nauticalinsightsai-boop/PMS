import { Suspense } from 'react';
import { Compare } from '@/components/pages/Compare';
import { CompareServerHeading } from '@/components/certifications/CompareServerHeading';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { RelatedGuidesLinks } from '@/components/seo/RelatedGuidesLinks';
import { getCompareBreadcrumbs } from '@/content/site-architecture/routes';
import { getPhase2RelatedBlock } from '@/content/seo/phase-2-page-seo';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';

export const metadata = buildPhase2PageMetadata('/certifications/compare')!;

const compareRelated = getPhase2RelatedBlock('/certifications/compare');
const compareBreadcrumbs = getCompareBreadcrumbs();

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd items={compareBreadcrumbs} currentPath="/certifications/compare" />
      <div className="container relative z-10 mx-auto max-w-3xl px-4 pt-8">
        <Breadcrumbs items={compareBreadcrumbs} />
      </div>
      <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950" />}>
        <CompareServerHeading />
        <Compare />
      </Suspense>
      {compareRelated ? (
        <div className="container relative z-10 mx-auto max-w-3xl px-4 pb-16">
          <RelatedGuidesLinks
            title={compareRelated.title}
            links={compareRelated.links}
            currentPath="/certifications/compare"
          />
        </div>
      ) : null}
    </>
  );
}

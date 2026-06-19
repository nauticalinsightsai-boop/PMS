import { Suspense } from 'react';
import { Compare } from '@/components/pages/Compare';
import { CompareServerHeading } from '@/components/certifications/CompareServerHeading';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { getCompareBreadcrumbs } from '@/content/site-architecture/routes';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';
import { fetchPublishedGlobalContent } from '@/lib/cms/fetch-published-document';

export const metadata = buildPhase2PageMetadata('/certifications/compare')!;

const compareBreadcrumbs = getCompareBreadcrumbs();

export default async function Page() {
  const globalContent = await fetchPublishedGlobalContent();

  return (
    <>
      <BreadcrumbJsonLd items={compareBreadcrumbs} currentPath="/certifications/compare" />
      <div className="container relative z-10 mx-auto max-w-3xl px-4 pt-8">
        <Breadcrumbs items={compareBreadcrumbs} />
      </div>
      <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950" />}>
        <CompareServerHeading />
        <Compare globalContent={globalContent} />
      </Suspense>
    </>
  );
}

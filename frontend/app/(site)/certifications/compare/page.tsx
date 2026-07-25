import { Suspense } from 'react';
import { Compare } from '@/components/pages/Compare';
import { CompareServerHeading } from '@/components/certifications/CompareServerHeading';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { getCompareBreadcrumbs } from '@/content/site-architecture/routes';
import { getPhase2Seo, titleNeedsNoSuffix } from '@/content/seo/phase-2-page-seo';
import { buildPageMetadataWithCms } from '@/lib/cms/page-metadata';
import { fetchPublishedGlobalContent } from '@/lib/cms/fetch-published-document';

export async function generateMetadata() {
  const seo = getPhase2Seo('/certifications/compare')!;
  return buildPageMetadataWithCms('compare', {
    title: seo.title,
    description: seo.description,
    path: seo.canonicalPath,
    noSuffix: titleNeedsNoSuffix(seo.title),
  });
}

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

import { Suspense } from 'react';
import { FAQ } from '@/components/pages/FAQ';
import { FaqCrawlableContent } from '@/components/faq/FaqCrawlableContent';
import { FaqServerHeading } from '@/components/faq/FaqServerHeading';
import { FaqPageJsonLd } from '@/components/seo/FaqPageJsonLd';
import { RelatedGuidesLinks } from '@/components/seo/RelatedGuidesLinks';
import { getPhase2Seo } from '@/content/seo/phase-2-page-seo';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';

const faqSeo = getPhase2Seo('/faq')!;

export const metadata = buildPhase2PageMetadata('/faq')!;

export default function Page() {
  return (
    <>
      <FaqPageJsonLd />
      <FaqServerHeading />
      <FaqCrawlableContent />
      <Suspense fallback={null}>
        <FAQ />
      </Suspense>
      {faqSeo.relatedLinks?.length ? (
        <div className="container mx-auto max-w-3xl px-4 pb-16">
          <RelatedGuidesLinks
            title="PMP readiness on PM Structure"
            links={faqSeo.relatedLinks}
            currentPath="/faq"
          />
        </div>
      ) : null}
    </>
  );
}

import { PMService } from '@/components/pages/PMService';
import { PmServiceJsonLd } from '@/components/seo/PmServiceJsonLd';
import { RelatedGuidesLinks } from '@/components/seo/RelatedGuidesLinks';
import { getPhase2Seo } from '@/content/seo/phase-2-page-seo';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';

const seo = getPhase2Seo('/pm-service')!;

export const metadata = buildPhase2PageMetadata('/pm-service')!;

export default function Page() {
  return (
    <>
      <PmServiceJsonLd />
      <PMService />
      {seo.relatedLinks?.length ? (
        <div className="container mx-auto max-w-3xl px-4 pb-16">
          <RelatedGuidesLinks
            title="Corporate PMP readiness"
            links={seo.relatedLinks}
            currentPath="/pm-service"
          />
        </div>
      ) : null}
    </>
  );
}

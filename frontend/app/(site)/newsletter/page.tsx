import { Newsletter } from '@/components/pages/Newsletter';
import { RelatedGuidesLinks } from '@/components/seo/RelatedGuidesLinks';
import { getPhase2Seo } from '@/content/seo/phase-2-page-seo';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';

const seo = getPhase2Seo('/newsletter')!;

export const metadata = buildPhase2PageMetadata('/newsletter')!;

export default function Page() {
  return (
    <>
      <Newsletter />
      {seo.relatedLinks?.length ? (
        <div className="container mx-auto max-w-3xl px-4 pb-16">
          <RelatedGuidesLinks
            title="PMP 2026 readiness"
            links={seo.relatedLinks}
            currentPath="/newsletter"
          />
        </div>
      ) : null}
    </>
  );
}

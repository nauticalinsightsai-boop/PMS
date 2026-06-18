import { Membership } from '@/components/pages/Membership';
import { MarketingPageJsonLd } from '@/components/seo/MarketingPageJsonLd';
import { RelatedGuidesLinks } from '@/components/seo/RelatedGuidesLinks';
import { getPhase2Seo } from '@/content/seo/phase-2-page-seo';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';

const seo = getPhase2Seo('/membership')!;

export const metadata = buildPhase2PageMetadata('/membership')!;

export default function Page() {
  return (
    <>
      <MarketingPageJsonLd
        path="/membership"
        name={seo.h1 ?? 'Project Management Learning Membership'}
        description={seo.description}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Membership', path: '/membership' },
        ]}
      />
      <Membership />
      {seo.relatedLinks?.length ? (
        <div className="container mx-auto max-w-3xl px-4 pb-16">
          <RelatedGuidesLinks
            title="Continue your preparation"
            links={seo.relatedLinks}
            currentPath="/membership"
          />
        </div>
      ) : null}
    </>
  );
}

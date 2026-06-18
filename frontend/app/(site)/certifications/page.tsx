import { Certifications } from '@/components/pages/Certifications';
import { CertificationsServerHeading } from '@/components/certifications/CertificationsServerHeading';
import { RelatedGuidesLinks } from '@/components/seo/RelatedGuidesLinks';
import { MarketingPageJsonLd } from '@/components/seo/MarketingPageJsonLd';
import { getPhase2RelatedBlock, getPhase2Seo } from '@/content/seo/phase-2-page-seo';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';

const seo = getPhase2Seo('/certifications')!;
const related = getPhase2RelatedBlock('/certifications');

export const metadata = buildPhase2PageMetadata('/certifications')!;

export default function Page() {
  return (
    <>
      <MarketingPageJsonLd
        path="/certifications"
        name={seo.title.replace(/\s*\|\s*PM Structure$/, '')}
        description={seo.description}
        collection
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Certifications', path: '/certifications' },
        ]}
      />
      <CertificationsServerHeading />
      <Certifications />
      {related ? (
        <div className="container mx-auto max-w-3xl px-4 pb-16">
          <RelatedGuidesLinks
            title={related.title}
            links={related.links}
            currentPath="/certifications"
          />
        </div>
      ) : null}
    </>
  );
}

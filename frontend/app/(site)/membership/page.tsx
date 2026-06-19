import { Membership } from '@/components/pages/Membership';
import { MarketingPageJsonLd } from '@/components/seo/MarketingPageJsonLd';
import { RelatedGuidesLinks } from '@/components/seo/RelatedGuidesLinks';
import { getPhase2Seo } from '@/content/seo/phase-2-page-seo';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';
import {
  fetchPublishedDocument,
  fetchPublishedGlobalContent,
} from '@/lib/cms/fetch-published-document';
import {
  defaultMembershipPageConfig,
  parseMembershipPageConfig,
} from '@pms/site-content';
import { FIELD_KEYS } from '@pms/site-content/keys';

const seo = getPhase2Seo('/membership')!;

export const metadata = buildPhase2PageMetadata('/membership')!;

export default async function Page() {
  const [initialPageConfig, globalContent] = await Promise.all([
    fetchPublishedDocument(
      FIELD_KEYS.MEMBERSHIP_PAGE_CONFIG,
      (raw) => (raw ? parseMembershipPageConfig(raw) : null),
      defaultMembershipPageConfig(),
    ),
    fetchPublishedGlobalContent(),
  ]);

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
      <Membership initialPageConfig={initialPageConfig} globalContent={globalContent} />
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

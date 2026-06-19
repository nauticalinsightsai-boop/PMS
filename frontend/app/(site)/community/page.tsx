import { Community } from '@/components/pages/Community';
import { MarketingPageJsonLd } from '@/components/seo/MarketingPageJsonLd';
import { RelatedGuidesLinks } from '@/components/seo/RelatedGuidesLinks';
import { getPhase2Seo } from '@/content/seo/phase-2-page-seo';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';
import {
  fetchPublishedDocument,
  fetchPublishedGlobalContent,
} from '@/lib/cms/fetch-published-document';
import {
  defaultCommunityPageConfig,
  defaultStoreCatalog,
  parseCommunityPageConfig,
  parseStoreCatalog,
} from '@pms/site-content';
import { FIELD_KEYS } from '@pms/site-content/keys';

const seo = getPhase2Seo('/community')!;

export const metadata = buildPhase2PageMetadata('/community')!;

type CommunityTab = 'community' | 'store';

function resolveCommunityTab(view: string | string[] | undefined): CommunityTab {
  const value = Array.isArray(view) ? view[0] : view;
  return value === 'store' ? 'store' : 'community';
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ view?: string | string[] }>;
}) {
  const { view } = await searchParams;

  const [initialPageConfig, globalContent, initialStoreCatalog] = await Promise.all([
    fetchPublishedDocument(
      FIELD_KEYS.COMMUNITY_PAGE_CONFIG,
      (raw) => (raw ? parseCommunityPageConfig(raw) : null),
      defaultCommunityPageConfig(),
    ),
    fetchPublishedGlobalContent(),
    fetchPublishedDocument(
      FIELD_KEYS.STORE_CATALOG,
      (raw) => (raw ? parseStoreCatalog(raw) : null),
      defaultStoreCatalog(),
    ),
  ]);

  return (
    <>
      <MarketingPageJsonLd
        path="/community"
        name={seo.h1 ?? 'Project Management Learning Community'}
        description={seo.description}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Community', path: '/community' },
        ]}
      />
      <Community
        initialTab={resolveCommunityTab(view)}
        initialPageConfig={initialPageConfig}
        globalContent={globalContent}
        initialStoreCatalog={initialStoreCatalog}
      />
      {seo.relatedLinks?.length ? (
        <div className="container mx-auto max-w-3xl px-4 pb-16">
          <RelatedGuidesLinks
            title="PMP preparation support"
            links={seo.relatedLinks}
            currentPath="/community"
          />
        </div>
      ) : null}
    </>
  );
}

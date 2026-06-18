import { Community } from '@/components/pages/Community';
import { MarketingPageJsonLd } from '@/components/seo/MarketingPageJsonLd';
import { RelatedGuidesLinks } from '@/components/seo/RelatedGuidesLinks';
import { getPhase2Seo } from '@/content/seo/phase-2-page-seo';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';

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
      <Community initialTab={resolveCommunityTab(view)} />
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

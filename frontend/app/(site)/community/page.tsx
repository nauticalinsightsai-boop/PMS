import { Community } from '@/components/pages/Community';
import { MarketingPageJsonLd } from '@/components/seo/MarketingPageJsonLd';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Community & resources',
  description: 'Study community, forums, and resource store for project management learners.',
  path: '/community',
});

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
        name="Community & resources"
        description="Study community, forums, and resource store for project management learners."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Community', path: '/community' },
        ]}
      />
      <Community initialTab={resolveCommunityTab(view)} />
    </>
  );
}

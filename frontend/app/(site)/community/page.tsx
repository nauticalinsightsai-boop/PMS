import { Suspense } from 'react';
import { Community } from '@/components/pages/Community';
import { MarketingPageJsonLd } from '@/components/seo/MarketingPageJsonLd';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Community & resources',
  description: 'Study community, forums, and resource store for project management learners.',
  path: '/community',
});

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950" />}>
      <MarketingPageJsonLd
        path="/community"
        name="Community & resources"
        description="Study community, forums, and resource store for project management learners."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Community', path: '/community' },
        ]}
      />
      <Community />
    </Suspense>
  );
}

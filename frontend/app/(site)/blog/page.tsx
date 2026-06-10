import { Blog } from '@/components/pages/Blog';
import { MarketingPageJsonLd } from '@/components/seo/MarketingPageJsonLd';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Blog',
  description: 'Certification strategies, safety leadership, and professional development from PM Structure.',
  path: '/blog',
});

export default function Page() {
  return (
    <>
      <MarketingPageJsonLd
        path="/blog"
        name="Blog"
        description="Certification strategies, safety leadership, and professional development from PM Structure."
        collection
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ]}
      />
      <Blog />
    </>
  );
}

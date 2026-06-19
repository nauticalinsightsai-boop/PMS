import { Blog } from '@/components/pages/Blog';
import { MarketingPageJsonLd } from '@/components/seo/MarketingPageJsonLd';
import { buildPageMetadata } from '@/lib/site-metadata';
import { getPublishedBlogArticles } from '@/lib/blog/posts';
import { fetchPublishedGlobalContent } from '@/lib/cms/fetch-published-document';

export const metadata = buildPageMetadata({
  title: 'Blog',
  description: 'Certification strategies, safety leadership, and professional development from PM Structure.',
  path: '/blog',
  robots: { index: false, follow: true },
});

export default async function Page() {
  const [initialArticles, globalContent] = await Promise.all([
    getPublishedBlogArticles(),
    fetchPublishedGlobalContent(),
  ]);

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
      <Blog initialArticles={initialArticles} globalContent={globalContent} />
    </>
  );
}

import { Home } from '@/components/pages/Home';
import { HomeHeroServer } from '@/components/home/HomeHeroServer';
import { HomePageJsonLd } from '@/components/seo/HomePageJsonLd';
import { buildPageMetadata } from '@/lib/site-metadata';
import { T169_SEO } from '@/content/pmp/flagship-t169';
import { fetchPublishedHomeConfig } from '@/lib/cms/fetch-published-document';

export const metadata = buildPageMetadata({
  title: T169_SEO.homeTitle,
  description: T169_SEO.homeDescription,
  path: '/',
  noSuffix: true,
});

export default async function Page() {
  const initialHomeConfig = await fetchPublishedHomeConfig();
  return (
    <>
      <HomePageJsonLd />
      <Home
        initialHomeConfig={initialHomeConfig}
        heroShell={<HomeHeroServer config={initialHomeConfig} />}
      />
    </>
  );
}

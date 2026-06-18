import { Home } from '@/components/pages/Home';
import { HomeServerHeading } from '@/components/home/HomeServerHeading';
import { HomePageJsonLd } from '@/components/seo/HomePageJsonLd';
import { buildPageMetadata } from '@/lib/site-metadata';
import { T169_SEO } from '@/content/pmp/flagship-t169';

export const metadata = buildPageMetadata({
  title: T169_SEO.homeTitle,
  description: T169_SEO.homeDescription,
  path: '/',
});

export default function Page() {
  return (
    <>
      <HomePageJsonLd />
      <HomeServerHeading />
      <Home />
    </>
  );
}

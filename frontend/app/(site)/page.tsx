import { Home } from '@/components/pages/Home';
import { HomeServerHeading } from '@/components/home/HomeServerHeading';
import { HomePageJsonLd } from '@/components/seo/HomePageJsonLd';
import { RelatedGuidesLinks } from '@/components/seo/RelatedGuidesLinks';
import { getPhase2Seo } from '@/content/seo/phase-2-page-seo';
import { buildPageMetadata } from '@/lib/site-metadata';
import { T169_SEO } from '@/content/pmp/flagship-t169';
import { defaultHomePageConfigV2 } from '@pms/site-content';

export const metadata = buildPageMetadata({
  title: T169_SEO.homeTitle,
  description: T169_SEO.homeDescription,
  path: '/',
  noSuffix: true,
});

const homeSeo = getPhase2Seo('/');

export default function Page() {
  return (
    <>
      <HomePageJsonLd />
      <HomeServerHeading />
      <Home initialHomeConfig={defaultHomePageConfigV2()} />
      {homeSeo?.relatedLinks?.length ? (
        <div className="container mx-auto max-w-3xl px-4 pb-16">
          <RelatedGuidesLinks
            title="Explore PM Structure guides"
            links={homeSeo.relatedLinks}
            currentPath="/"
          />
        </div>
      ) : null}
    </>
  );
}

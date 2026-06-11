import { Home } from '@/components/pages/Home';
import { HomeServerHeading } from '@/components/home/HomeServerHeading';
import { HomePageJsonLd } from '@/components/seo/HomePageJsonLd';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Project management guidance & exam prep',
  description:
    'Independent PMI, PRINCE2, and Six Sigma exam preparation with structured pathways, mentorship, and regional scholarship pricing.',
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

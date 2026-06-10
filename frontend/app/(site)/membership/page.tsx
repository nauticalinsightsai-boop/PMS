import { Membership } from '@/components/pages/Membership';
import { MarketingPageJsonLd } from '@/components/seo/MarketingPageJsonLd';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Membership plans',
  description: 'Membership tiers with community access and 20% off eligible certification pathway tuition.',
  path: '/membership',
});

export default function Page() {
  return (
    <>
      <MarketingPageJsonLd
        path="/membership"
        name="Membership plans"
        description="Membership tiers with community access and 20% off eligible certification pathway tuition."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Membership', path: '/membership' },
        ]}
      />
      <Membership />
    </>
  );
}

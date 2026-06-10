import { LegalHub } from '@/components/pages/legal/LegalHub';
import { MarketingPageJsonLd } from '@/components/seo/MarketingPageJsonLd';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Legal & compliance',
  description: 'Terms, privacy, cookies, services, regional pricing, refunds, and compliance policies.',
  path: '/legal',
});

export default function Page() {
  return (
    <>
      <MarketingPageJsonLd
        path="/legal"
        name="Legal & compliance"
        description="Terms, privacy, cookies, services, regional pricing, refunds, and compliance policies."
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Legal', path: '/legal' },
        ]}
      />
      <LegalHub />
    </>
  );
}

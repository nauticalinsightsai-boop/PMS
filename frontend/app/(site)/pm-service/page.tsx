import { PMService } from '@/components/pages/PMService';
import { PmServiceJsonLd } from '@/components/seo/PmServiceJsonLd';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Advisory & corporate training',
  description: 'Pathway consultation, readiness reviews, and corporate PM training services.',
  path: '/pm-service',
});

export default function Page() {
  return (
    <>
      <PmServiceJsonLd />
      <PMService />
    </>
  );
}

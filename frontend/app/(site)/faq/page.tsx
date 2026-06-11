import { Suspense } from 'react';
import { FAQ } from '@/components/pages/FAQ';
import { FaqCrawlableContent } from '@/components/faq/FaqCrawlableContent';
import { FaqServerHeading } from '@/components/faq/FaqServerHeading';
import { FaqPageJsonLd } from '@/components/seo/FaqPageJsonLd';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'FAQ: PMP 2026, Certifications, Pricing & Support',
  description:
    'PMP exam 2026 FAQs plus PRINCE2 pathways, regional scholarship pricing, membership, delivery, privacy, and exam preparation on PM Structure.',
  path: '/faq',
});

export default function Page() {
  return (
    <>
      <FaqPageJsonLd />
      <FaqServerHeading />
      <FaqCrawlableContent />
      <Suspense fallback={null}>
        <FAQ />
      </Suspense>
    </>
  );
}

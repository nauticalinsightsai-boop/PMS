import { Suspense } from 'react';
import { FAQ } from '@/components/pages/FAQ';
import { FaqJsonLd } from '@/components/seo/FaqJsonLd';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'FAQ — Certifications, Pricing & Support',
  description:
    'Answers on PMP and PRINCE2 pathways, regional scholarship pricing, membership, delivery, checkout, privacy, and exam preparation.',
  path: '/faq',
});

export default function Page() {
  return (
    <>
      <FaqJsonLd />
      <Suspense fallback={null}>
        <FAQ />
      </Suspense>
    </>
  );
}

import { PmpFaqPage } from '@/components/faq/PmpFaqPage';
import { PmpFaqCrawlableContent } from '@/components/faq/PmpFaqCrawlableContent';
import { PmpFaqPageJsonLd } from '@/components/seo/PmpFaqPageJsonLd';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'PMP Frequently Asked Questions | PM Structure',
  description:
    'PMP exam 2026 FAQs: transition dates, domain weights, readiness, scenario practice, Foundation/Professional/Mastery pathways, regional pricing, and compliance.',
  path: '/pmp-faq',
});

export default function Page() {
  return (
    <>
      <PmpFaqPageJsonLd />
      <PmpFaqCrawlableContent />
      <PmpFaqPage />
    </>
  );
}

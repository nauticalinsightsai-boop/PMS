import { PMS_SITE_URL } from '@/config/pms-site';
import { getFaqsForSchemaByPath } from '@/content/faq';
import { buildBreadcrumbSchema, buildFaqPageSchema, buildWebPageSchema } from '@/lib/schema';

export function PmpFaqPageJsonLd() {
  const items = getFaqsForSchemaByPath('/pmp-faq');
  const graph = [
    buildWebPageSchema({
      path: '/pmp-faq',
      name: 'PMP Frequently Asked Questions | PM Structure',
      description:
        'PMP exam 2026 FAQs on transition timing, domains, readiness, scenario practice, pathways, regional pricing, and independent-platform compliance.',
    }),
    buildFaqPageSchema(items, `${PMS_SITE_URL}/pmp-faq`),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'PMP', path: '/pmp' },
      { name: 'PMP FAQ', path: '/pmp-faq' },
    ]),
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  );
}

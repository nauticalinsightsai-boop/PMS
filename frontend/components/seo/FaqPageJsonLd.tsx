import { PMS_SITE_URL } from '@/config/pms-site';
import { getFaqForSchema } from '@/content/faq';
import { buildBreadcrumbSchema, buildFaqPageSchema, buildWebPageSchema } from '@/lib/schema';

export function FaqPageJsonLd() {
  const items = getFaqForSchema();
  const graph = [
    buildWebPageSchema({
      path: '/faq',
      name: 'FAQ — Certifications, Pricing & Support',
      description:
        'Answers on PMP and PRINCE2 pathways, regional scholarship pricing, membership, delivery, checkout, privacy, and exam preparation.',
    }),
    buildFaqPageSchema(items, `${PMS_SITE_URL}/faq`),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'FAQ', path: '/faq' },
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

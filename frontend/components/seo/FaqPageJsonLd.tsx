import { PMS_SITE_URL } from '@/config/pms-site';
import { getFaqsForSchemaByPath } from '@/content/faq';
import { breadcrumbItemsToSchema } from '@/components/navigation/breadcrumb-schema';
import { getFaqBreadcrumbs } from '@/content/site-architecture/routes';
import { buildFaqPageSchema, buildWebPageSchema } from '@/lib/schema';

export function FaqPageJsonLd() {
  const items = getFaqsForSchemaByPath('/faq');
  const graph = [
    buildWebPageSchema({
      path: '/faq',
      name: 'FAQ. PMP 2026, Certifications, Pricing & Support',
      description:
        'PMP exam 2026 FAQs plus PRINCE2 pathways, regional scholarship pricing, membership, delivery, privacy, and exam preparation.',
    }),
    buildFaqPageSchema(items, `${PMS_SITE_URL}/faq`),
    breadcrumbItemsToSchema(getFaqBreadcrumbs(), '/faq'),
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
import { PMS_SITE_URL } from '@/config/pms-site';
import { breadcrumbItemsToSchema } from '@/components/navigation/breadcrumb-schema';
import {
  buildFaqPageSchema,
  buildWebPageSchema,
} from '@/lib/schema';
import { PMP_PATHWAY_PAGE } from '@/content/pmp/pathway-page';
import {
  T169_ENGINEER_FAQS,
  T169_TRUST_FAQS,
} from '@/content/pmp/flagship-t169';

const pathwayBreadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'PMP', href: '/pmp' },
  { label: PMP_PATHWAY_PAGE.shortLabel },
];

export function Pmp2026PathwayJsonLd() {
  const path = PMP_PATHWAY_PAGE.path;
  const faqItems = [...T169_ENGINEER_FAQS, ...T169_TRUST_FAQS].map((faq) => ({
    question: faq.question,
    answer: faq.answer,
  }));

  const graph = [
    buildWebPageSchema({
      path,
      name: PMP_PATHWAY_PAGE.h1,
      description: PMP_PATHWAY_PAGE.description,
    }),
    breadcrumbItemsToSchema(pathwayBreadcrumbs, path),
    buildFaqPageSchema(faqItems, `${PMS_SITE_URL}${path}`),
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}

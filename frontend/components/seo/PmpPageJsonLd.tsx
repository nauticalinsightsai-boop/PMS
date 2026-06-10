import { PMS_SITE_URL } from '@/config/pms-site';
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildWebPageSchema,
} from '@/lib/schema';
import type { PmpPageContent } from '@/content/pmp/types';

export function PmpPageJsonLd({ page }: { page: PmpPageContent }) {
  const graph = [
    buildWebPageSchema({ path: page.path, name: page.h1, description: page.description }),
    buildArticleSchema({
      path: page.path,
      headline: page.h1,
      description: page.description,
    }),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'PMP', path: '/pmp' },
      { name: page.h1, path: page.path },
    ]),
  ];

  if (page.faqs?.length) {
    graph.push(buildFaqPageSchema(page.faqs, `${PMS_SITE_URL}${page.path}`));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}

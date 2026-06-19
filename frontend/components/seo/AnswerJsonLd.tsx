import { PMS_SITE_URL } from '@/config/pms-site';
import { breadcrumbItemsToSchema } from '@/components/navigation/breadcrumb-schema';
import { getAnswerPageBreadcrumbs } from '@/content/site-architecture/routes';
import type { AnswerPageContent } from '@/content/answers/types';
import { getAnswerFaqsForPage } from '@/content/answers';
import {
  buildArticleSchema,
  buildFaqPageSchema,
  buildWebPageSchema,
} from '@/lib/schema';

export function AnswerJsonLd({ page }: { page: AnswerPageContent }) {
  const visibleFaqs = [...(page.faqs ?? []), ...getAnswerFaqsForPage(page)];
  const breadcrumbItems = getAnswerPageBreadcrumbs(page);
  const graph = [
    buildWebPageSchema({ path: page.path, name: page.question, description: page.description }),
    buildArticleSchema({
      path: page.path,
      headline: page.question,
      description: page.description,
      dateModified: page.dateModified,
    }),
    breadcrumbItemsToSchema(breadcrumbItems, page.path),
  ];

  if (visibleFaqs.length) {
    graph.push(buildFaqPageSchema(visibleFaqs, `${PMS_SITE_URL}${page.path}`));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}

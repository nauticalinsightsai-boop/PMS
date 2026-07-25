import { PMS_SITE_URL } from '@/config/pms-site';
import { breadcrumbItemsToSchema } from '@/components/navigation/breadcrumb-schema';
import { getPmpPageBreadcrumbs } from '@/content/site-architecture/routes';
import {
  buildArticleSchema,
  buildFaqPageSchema,
  buildWebPageSchema,
} from '@/lib/schema';
import {
  getFaqsForPmpSurface,
  isFaqSchemaEligible,
  resolveFaqShortAnswer,
} from '@/content/faq';
import type { PmpPageContent } from '@/content/pmp/types';

export function PmpPageJsonLd({ page }: { page: PmpPageContent }) {
  const relatedFaqs =
    page.path === '/pmp-exam-2026'
      ? []
      : getFaqsForPmpSurface(page.path, undefined, 5)
          .filter(isFaqSchemaEligible)
          .map((f) => ({ question: f.question, answer: resolveFaqShortAnswer(f) }));
  const inlineFaqs = page.faqs ?? [];
  const faqSchemaItems = [
    ...inlineFaqs,
    ...relatedFaqs.filter(
      (rf) => !inlineFaqs.some((i) => i.question === rf.question),
    ),
  ].slice(0, 10);

  const graph = [
    buildWebPageSchema({ path: page.path, name: page.h1, description: page.description }),
    buildArticleSchema({
      path: page.path,
      headline: page.h1,
      description: page.description,
    }),
    breadcrumbItemsToSchema(getPmpPageBreadcrumbs(page), page.path),
  ];

  if (faqSchemaItems.length) {
    graph.push(buildFaqPageSchema(faqSchemaItems, `${PMS_SITE_URL}${page.path}`));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}

import { PMS_SITE_URL } from '@/config/pms-site';
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildWebPageSchema,
} from '@/lib/schema';
import type { AnswerPageContent } from '@/content/answers/types';

export function AnswerJsonLd({ page }: { page: AnswerPageContent }) {
  const graph = [
    buildWebPageSchema({ path: page.path, name: page.question, description: page.description }),
    buildArticleSchema({
      path: page.path,
      headline: page.question,
      description: page.description,
    }),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Answers', path: '/answers' },
      { name: page.question, path: page.path },
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

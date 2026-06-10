import { PMS_SITE_URL } from '@/config/pms-site';
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildFaqPageSchema,
  buildItemListSchema,
} from '@/lib/schema';
import type { TopicHubContent } from '@/content/topics/types';

export function TopicHubJsonLd({
  hub,
  relatedFaqs = [],
}: {
  hub: TopicHubContent;
  relatedFaqs?: { question: string; answer: string }[];
}) {
  const url = `${PMS_SITE_URL}${hub.path}`;
  const resources = [...hub.resources, ...(hub.relatedCourses ?? []), ...hub.relatedAnswers];

  const graph = [
    buildCollectionPageSchema({ path: hub.path, name: hub.h1, description: hub.description }),
    buildItemListSchema(
      resources.map((r) => ({ name: r.label, path: r.href })),
      `${url}#itemlist`,
    ),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Topics', path: '/topics' },
      { name: hub.h1, path: hub.path },
    ]),
  ];

  const faqSchema = [...(hub.faqs ?? []), ...relatedFaqs];
  if (faqSchema.length) {
    graph.push(buildFaqPageSchema(faqSchema, url));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}

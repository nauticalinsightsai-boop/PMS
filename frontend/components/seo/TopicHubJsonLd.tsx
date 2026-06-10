import { PMS_SITE_URL } from '@/config/pms-site';
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildFaqPageSchema,
  buildItemListSchema,
} from '@/lib/schema';
import type { TopicHubContent } from '@/content/topics/types';

export function TopicHubJsonLd({ hub }: { hub: TopicHubContent }) {
  const url = `${PMS_SITE_URL}${hub.path}`;
  const resources = [
    ...hub.resources,
    ...hub.relatedAnswers,
  ];

  const graph = [
    buildCollectionPageSchema({ path: hub.path, name: hub.h1, description: hub.description }),
    buildItemListSchema(resources, `${url}#itemlist`),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Topics', path: '/topics' },
      { name: hub.h1, path: hub.path },
    ]),
  ];

  if (hub.faqs?.length) {
    graph.push(buildFaqPageSchema(hub.faqs, url));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}

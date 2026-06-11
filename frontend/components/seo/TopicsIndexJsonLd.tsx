import { PMS_SITE_URL } from '@/config/pms-site';
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from '@/lib/schema';
import { getPublishedTopicHubs } from '@/content/topics';

export function TopicsIndexJsonLd() {
  const hubs = getPublishedTopicHubs();
  const path = '/topics';
  const url = `${PMS_SITE_URL}${path}`;
  const items = hubs.map((h) => ({ name: h.h1, path: h.path }));

  const graph = [
    buildWebPageSchema({
      path,
      name: 'Project Management Topics. PM Structure knowledge hubs',
      description:
        'Topic hubs for PMP exam preparation, 2026 transition, readiness, domains, and pathways.',
    }),
    buildCollectionPageSchema({
      path,
      name: 'Project Management Topics',
      description: 'Knowledge hubs on PM Structure',
    }),
    buildItemListSchema(items, `${url}#itemlist`),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Topics', path },
    ]),
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}
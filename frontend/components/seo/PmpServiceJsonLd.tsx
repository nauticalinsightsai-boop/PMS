import { PMS_SITE_URL } from '@/config/pms-site';
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildServiceSchema,
  buildWebPageSchema,
} from '@/lib/schema';
import type { PmpServiceContent } from '@/content/pmp/types';

export function PmpServiceJsonLd({ service }: { service: PmpServiceContent }) {
  const graph = [
    buildWebPageSchema({ path: service.path, name: service.h1, description: service.description }),
    buildServiceSchema({ path: service.path, name: service.h1, description: service.description }),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'PMP', path: '/pmp' },
      { name: service.h1, path: service.path },
    ]),
  ];

  if (service.faqs?.length) {
    graph.push(buildFaqPageSchema(service.faqs, `${PMS_SITE_URL}${service.path}`));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}

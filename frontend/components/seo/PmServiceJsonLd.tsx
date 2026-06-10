import { buildBreadcrumbSchema, buildServiceSchema, buildWebPageSchema } from '@/lib/schema';

export function PmServiceJsonLd() {
  const path = '/pm-service';
  const name = 'Project management advisory services';
  const description =
    'Independent PM advisory, mentoring, and corporate readiness services from PM Structure.';
  const graph = [
    buildWebPageSchema({ path, name, description }),
    buildServiceSchema({ path, name, description }),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'PM Service', path },
    ]),
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

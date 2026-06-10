import {
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  buildWebPageSchema,
} from '@/lib/schema';

export function AboutPageJsonLd({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const graph = [
    buildOrganizationSchema(),
    buildWebPageSchema({ path: '/about', name: title, description }),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
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

import { buildBreadcrumbSchema, buildWebPageSchema } from '@/lib/schema';

export function LegalPageJsonLd({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}) {
  const graph = [
    buildWebPageSchema({ path, name: title, description }),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Legal', path: '/legal' },
      { name: title, path },
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

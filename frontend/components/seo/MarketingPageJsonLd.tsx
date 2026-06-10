import { buildBreadcrumbSchema, buildCollectionPageSchema, buildWebPageSchema } from '@/lib/schema';

export function MarketingPageJsonLd({
  path,
  name,
  description,
  breadcrumbs,
  collection,
}: {
  path: string;
  name: string;
  description: string;
  breadcrumbs?: { name: string; path: string }[];
  collection?: boolean;
}) {
  const graph = [
    buildWebPageSchema({ path, name, description }),
    ...(collection
      ? [buildCollectionPageSchema({ path, name, description })]
      : []),
    ...(breadcrumbs?.length ? [buildBreadcrumbSchema(breadcrumbs)] : []),
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

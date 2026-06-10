import { buildArticleSchema, buildBreadcrumbSchema, buildWebPageSchema } from '@/lib/schema';

export function ArticleJsonLd({
  path,
  headline,
  description,
  breadcrumbs,
}: {
  path: string;
  headline: string;
  description: string;
  breadcrumbs: { name: string; path: string }[];
}) {
  const graph = [
    buildWebPageSchema({ path, name: headline, description }),
    buildArticleSchema({ path, headline, description }),
    buildBreadcrumbSchema(breadcrumbs),
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

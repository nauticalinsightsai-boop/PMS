import { buildArticleSchema, buildBreadcrumbSchema, buildWebPageSchema } from '@/lib/schema';
import { escapeJsonForScript } from '@pms/site-content/sanitize-html';

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
        __html: escapeJsonForScript(
          JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
        ),
      }}
    />
  );
}

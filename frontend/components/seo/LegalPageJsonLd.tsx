import { breadcrumbItemsToSchema } from '@/components/navigation/breadcrumb-schema';
import { getLegalPageBreadcrumbs } from '@/content/site-architecture/routes';
import { buildWebPageSchema } from '@/lib/schema';

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
    breadcrumbItemsToSchema(getLegalPageBreadcrumbs(title), path),
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

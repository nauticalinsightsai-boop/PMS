import {
  breadcrumbItemsToSchema,
  type BreadcrumbItem,
} from '@/components/navigation/breadcrumb-schema';

export function BreadcrumbJsonLd({
  items,
  currentPath,
}: {
  items: BreadcrumbItem[];
  currentPath: string;
}) {
  const schema = breadcrumbItemsToSchema(items, currentPath);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

import { buildBreadcrumbSchema } from '@/lib/schema';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

/** Map visible breadcrumb items to schema.org `{ name, path }` entries. */
export function toBreadcrumbSchemaItems(
  items: BreadcrumbItem[],
  currentPath: string,
): { name: string; path: string }[] {
  return items.map((item, index) => {
    const isLast = index === items.length - 1;
    return {
      name: item.label,
      path: item.href ?? (isLast ? currentPath : currentPath),
    };
  });
}

export function breadcrumbItemsToSchema(items: BreadcrumbItem[], currentPath: string) {
  return buildBreadcrumbSchema(toBreadcrumbSchemaItems(items, currentPath));
}

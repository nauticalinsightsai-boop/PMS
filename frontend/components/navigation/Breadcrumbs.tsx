import Link from 'next/link';
import type { BreadcrumbItem } from '@/components/navigation/breadcrumb-schema';
import { cn } from '@/lib/utils';

export type { BreadcrumbItem };

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (!items.length) return null;

  return (
    <nav className={cn('text-sm text-slate-500 mb-6', className)} aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 list-none p-0 m-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1 || !item.href;

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2 min-w-0">
              {index > 0 ? (
                <span className="text-slate-400" aria-hidden>
                  /
                </span>
              ) : null}
              {isLast ? (
                <span
                  className="text-slate-700 dark:text-slate-300 line-clamp-1"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link href={item.href!} className="hover:text-brand-purple">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

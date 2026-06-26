'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { dashboardHref, normalizeDashboardPath } from '@/lib/base-path';

export function DashboardNavLink({
  href,
  children,
  className,
  exact,
  title,
  onMouseEnter,
  onMouseLeave,
}: {
  href: string;
  children: React.ReactNode;
  className?: string | ((active: boolean) => string);
  exact?: boolean;
  title?: string;
  onMouseEnter?: React.MouseEventHandler<HTMLAnchorElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  const pathname = normalizeDashboardPath(usePathname() ?? '');
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  const resolvedClass = typeof className === 'function' ? className(isActive) : className;

  return (
    <Link
      href={dashboardHref(href)}
      className={cn(resolvedClass)}
      title={title}
      aria-current={isActive ? 'page' : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Link>
  );
}

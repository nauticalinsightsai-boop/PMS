'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function DashboardNavLink({
  href,
  children,
  className,
  exact,
  title,
}: {
  href: string;
  children: React.ReactNode;
  className?: string | ((active: boolean) => string);
  exact?: boolean;
  title?: string;
}) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  const resolvedClass = typeof className === 'function' ? className(isActive) : className;

  return (
    <Link
      href={href}
      className={cn(resolvedClass)}
      title={title}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}

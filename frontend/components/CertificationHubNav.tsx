'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GitCompare, LayoutGrid, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const HUB_LINKS = [
  {
    label: 'All pathways',
    href: '/certifications',
    icon: LayoutGrid,
    isActive: (pathname: string) =>
      pathname === '/certifications' ||
      (pathname.startsWith('/certifications/') && !pathname.startsWith('/certifications/compare')),
  },
  {
    label: 'Compare',
    href: '/certifications/compare',
    icon: GitCompare,
    isActive: (pathname: string) => pathname.startsWith('/certifications/compare'),
  },
  {
    label: 'Membership',
    href: '/membership',
    icon: Crown,
    isActive: (pathname: string) => pathname === '/membership' || pathname.startsWith('/membership/'),
  },
] as const;

export function CertificationHubNav() {
  const pathname = usePathname();

  return (
    <section
      className="py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 sticky top-16 z-40 backdrop-blur-md"
      aria-label="Certification hub"
    >
      <div className="container mx-auto flex justify-center">
        <nav
          className="inline-flex flex-col sm:flex-row flex-wrap justify-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
          aria-label="Certifications, compare, and membership"
        >
          {HUB_LINKS.map(({ label, href, icon: Icon, isActive }) => {
            const active = isActive(pathname);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'inline-flex min-h-11 items-center justify-center gap-2 h-12 px-5 rounded-xl font-bold text-sm transition-all',
                  active
                    ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/25'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}

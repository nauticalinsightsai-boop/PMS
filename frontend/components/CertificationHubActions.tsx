'use client';

import Link from 'next/link';
import { GitCompare, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const ACTIONS = [
  {
    label: 'Compare',
    href: '/certifications/compare',
    icon: GitCompare,
    variant: 'brand' as const,
  },
  {
    label: 'Membership',
    href: '/membership',
    icon: Crown,
    variant: 'outline' as const,
  },
] as const;

export function CertificationHubActions({ className }: { className?: string }) {
  return (
    <div
      className={cn('flex flex-col sm:flex-row items-stretch sm:items-center gap-3', className)}
      aria-label="Certification tools"
    >
      {ACTIONS.map(({ label, href, icon: Icon, variant }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'inline-flex min-h-12 flex-1 sm:flex-none items-center justify-center gap-2 rounded-2xl px-6 font-bold text-sm transition-all',
            variant === 'brand'
              ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/25 hover:bg-brand-hover'
              : 'border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 hover:border-brand-orange hover:text-brand-orange',
          )}
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden />
          {label}
        </Link>
      ))}
    </div>
  );
}

'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
};

export function DashboardPageHeader({ title, description, icon: Icon, actions, className }: Props) {
  return (
    <header
      className={cn(
        'dashboard-panel flex flex-col gap-4 px-4 py-4 sm:px-5 sm:py-5 md:flex-row md:items-start md:justify-between',
        className,
      )}
    >
      <div className="min-w-0 space-y-1.5">
        <h1 className="flex items-center gap-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {Icon ? (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
          ) : null}
          <span className="truncate">{title}</span>
        </h1>
        {description ? (
          <p
            className={cn(
              'max-w-3xl text-sm leading-relaxed text-muted-foreground',
              Icon && 'md:pl-[3.25rem]',
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2 md:pt-0.5">{actions}</div>
      ) : null}
    </header>
  );
}

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
    <div className={cn('flex flex-wrap items-start justify-between gap-4 pb-1', className)}>
      <div className="min-w-0 space-y-1">
        <h1 className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {Icon ? <Icon className="h-6 w-6 shrink-0 text-brand-orange" aria-hidden /> : null}
          {title}
        </h1>
        {description ? (
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div> : null}
    </div>
  );
}

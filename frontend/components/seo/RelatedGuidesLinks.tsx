'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { RelatedLink } from '@/content/seo/phase-2-page-seo';
import { cn } from '@/lib/utils';

type Props = {
  title?: string;
  links: RelatedLink[];
  currentPath?: string;
  className?: string;
  collapsible?: boolean;
  variant?: 'default' | 'dark' | 'dark-adaptive';
  /** Title alignment for the collapsible header (default start/left). */
  align?: 'start' | 'center';
  children?: React.ReactNode;
};

function useMinLgViewport() {
  const [isLg, setIsLg] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsLg(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return isLg;
}

export function RelatedGuidesLinks({
  title = 'Related PM Structure guides',
  links,
  currentPath,
  className,
  collapsible = false,
  variant = 'default',
  align = 'start',
  children,
}: Props) {
  const [toggled, setToggled] = React.useState(false);
  const [hovering, setHovering] = React.useState(false);
  const isLg = useMinLgViewport();
  const expanded = isLg ? hovering || toggled : toggled;
  const visible = links.filter((l) => l.href !== currentPath);
  if (!visible.length) return null;

  const isDark = variant === 'dark' || variant === 'dark-adaptive';
  const isAdaptive = variant === 'dark-adaptive';
  const isCentered = align === 'center';

  const asideClass = cn(
    'rounded-2xl border p-6',
    !collapsible && 'mt-12',
    isCentered ? 'text-center' : 'text-left',
    isDark
      ? isAdaptive
        ? 'border-white/10 bg-white/5 dark:border-slate-200 dark:bg-slate-900/[0.04]'
        : 'border-white/10 bg-white/5'
      : 'border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50',
    className,
  );

  const titleClass = cn(
    'font-heading text-lg font-bold',
    isDark
      ? isAdaptive
        ? 'text-white dark:text-slate-900'
        : 'text-white'
      : 'text-slate-900 dark:text-white',
  );

  const linkClass = isDark
    ? isAdaptive
      ? 'font-medium text-slate-300 hover:text-brand-orange hover:underline dark:text-slate-600 dark:hover:text-brand-orange'
      : 'font-medium text-slate-300 hover:text-brand-orange hover:underline'
    : 'font-medium text-brand-purple hover:underline';

  const linkList = (
    <ul className={cn('space-y-2', isCentered && 'text-center')}>
      {visible.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className={linkClass}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  if (!collapsible) {
    return (
      <aside className={asideClass} aria-label={title}>
        <h2 className={cn(titleClass, 'mb-4')}>{title}</h2>
        {linkList}
        {children}
      </aside>
    );
  }

  return (
    <aside
      className={asideClass}
      aria-label={title}
      onMouseEnter={() => {
        if (isLg) setHovering(true);
      }}
      onMouseLeave={() => {
        if (isLg) setHovering(false);
      }}
    >
      <button
        type="button"
        className={cn(
          'flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent p-0 outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-brand-orange/50',
          isCentered
            ? 'relative justify-center text-center'
            : 'justify-between text-left',
        )}
        onClick={() => setToggled((open) => !open)}
        aria-expanded={expanded}
      >
        <h2 className={titleClass}>{title}</h2>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 transition-transform duration-300',
            isCentered && 'absolute right-0 top-1/2 -translate-y-1/2',
            isDark
              ? isAdaptive
                ? 'text-slate-400 dark:text-slate-500'
                : 'text-slate-400'
              : 'text-slate-500 dark:text-slate-400',
            expanded && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          expanded ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className={cn('min-h-0 overflow-hidden', !expanded && 'pointer-events-none')}>
          {linkList}
          {children}
        </div>
      </div>
    </aside>
  );
}

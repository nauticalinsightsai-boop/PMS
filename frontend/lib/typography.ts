import { cn } from '@/lib/utils';

/** Marketing page H1 — capped at 7xl on large screens */
export const textHero = cn(
  'font-heading text-4xl font-bold tracking-tight leading-[1.1]',
  'sm:text-5xl md:text-6xl lg:text-7xl',
  'text-slate-900 dark:text-white',
);

/** Section H2 */
export const textSection = cn(
  'font-heading text-3xl font-bold tracking-tight leading-tight',
  'md:text-4xl lg:text-5xl',
  'text-slate-900 dark:text-white',
);

/** Micro labels (chips, badges) */
export const textLabel = cn(
  'text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500',
);

/** Price / stat values */
export const textPrice = cn('text-sm font-extrabold tabular-nums text-slate-900 dark:text-white');

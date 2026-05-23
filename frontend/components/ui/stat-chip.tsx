import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Compact label + value cell — content centered within the chip area. */
export function StatChip({
  label,
  children,
  className,
  valueClassName,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div
      className={cn(
        'flex min-h-[5rem] min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-xl',
        'bg-slate-50 px-2 py-2 text-center dark:bg-slate-800 sm:px-2.5',
        className,
      )}
    >
      <span className="w-full text-label leading-none">
        {label}
      </span>
      <div
        className={cn(
          'flex w-full min-w-0 flex-col items-center justify-center text-center',
          valueClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

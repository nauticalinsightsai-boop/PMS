import type { ReactNode } from 'react';
import { cn } from './utils';

export function StatChip({
  label,
  subtitle,
  children,
  className,
  valueClassName,
}: {
  label: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div
      className={cn(
        'flex min-h-[5rem] min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-xl',
        'bg-muted/60 px-2 py-2 text-center sm:px-2.5',
        className,
      )}
    >
      <div className="flex w-full flex-col items-center gap-0.5">
        <span className="w-full text-label leading-none">{label}</span>
        {subtitle ? (
          <span className="w-full text-[9px] font-semibold leading-tight text-brand-orange">
            {subtitle}
          </span>
        ) : null}
      </div>
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

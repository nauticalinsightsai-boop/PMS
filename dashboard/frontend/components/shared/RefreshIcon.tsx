'use client';

import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Icon-only spinner for refresh buttons — keeps label text static while loading. */
export function RefreshIcon({
  loading = false,
  size = 16,
  className,
}: {
  loading?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <RefreshCw
      size={size}
      aria-hidden
      className={cn(
        'shrink-0 origin-center',
        loading && 'motion-safe:animate-spin [animation-duration:1.25s]',
        className,
      )}
    />
  );
}

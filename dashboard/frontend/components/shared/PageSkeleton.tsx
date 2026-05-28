'use client';

import React from 'react';

interface PageSkeletonProps {
  rows?: number;
  className?: string;
  label?: string;
}

export function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      className={`h-4 rounded animate-pulse bg-brand-subtle ${className ?? ''}`}
      aria-hidden
    />
  );
}

/** Simple block skeleton for page-level loading. */
const PageSkeleton: React.FC<PageSkeletonProps> = ({
  rows = 4,
  className = '',
  label = 'Loading content',
}) => (
  <div
    className={`space-y-3 py-6 ${className}`}
    role="status"
    aria-live="polite"
    aria-busy="true"
    aria-label={label}
  >
    <span className="sr-only">{label}</span>
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="h-4 rounded animate-pulse bg-brand-subtle"
        style={{ width: `${Math.max(40, 88 - i * 12)}%` }}
        aria-hidden
      />
    ))}
  </div>
);

export default PageSkeleton;
export { PageSkeleton };

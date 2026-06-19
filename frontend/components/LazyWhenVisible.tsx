'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type LazyWhenVisibleProps = {
  children: React.ReactNode;
  className?: string;
  minHeightClassName?: string;
  rootMargin?: string;
};

/** Mount children only when near the viewport — defers below-fold JS and network work. */
export function LazyWhenVisible({
  children,
  className,
  minHeightClassName = 'min-h-[1px]',
  rootMargin = '280px 0px',
}: LazyWhenVisibleProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (visible) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref} className={cn(!visible && minHeightClassName, className)}>
      {visible ? children : null}
    </div>
  );
}

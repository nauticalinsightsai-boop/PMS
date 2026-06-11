'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type ResponsiveSnapScrollProps = {
  children: React.ReactNode;
  className?: string;
  /** Grid / layout classes from the `md` breakpoint upward */
  desktopLayoutClassName: string;
  gapClassName?: string;
  /** Fixed slide width below `md` */
  mobileItemClassName?: string;
};

const DEFAULT_MOBILE_ITEM = 'w-[min(92vw,19rem)]';
const AXIS_THRESHOLD_PX = 8;

/**
 * On mobile, decide horizontal (carousel) vs vertical (page) intent early so
 * vertical swipes on cards are not trapped by overflow-x-auto.
 */
function useMobileScrollAxis(ref: React.RefObject<HTMLDivElement | null>) {
  React.useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => {
      if (!mq.matches) root.removeAttribute('data-scroll-axis');
    };
    apply();

    let startX = 0;
    let startY = 0;
    let axis: 'horizontal' | 'vertical' | null = null;

    const reset = () => {
      axis = null;
      root.removeAttribute('data-scroll-axis');
    };

    const onTouchStart = (event: TouchEvent) => {
      if (!mq.matches || event.touches.length !== 1) return;
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      axis = null;
      root.removeAttribute('data-scroll-axis');
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!mq.matches || event.touches.length !== 1) return;
      const dx = event.touches[0].clientX - startX;
      const dy = event.touches[0].clientY - startY;

      if (!axis) {
        if (Math.abs(dx) < AXIS_THRESHOLD_PX && Math.abs(dy) < AXIS_THRESHOLD_PX) return;
        axis = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
        root.setAttribute('data-scroll-axis', axis);
      }
    };

    mq.addEventListener('change', apply);
    root.addEventListener('touchstart', onTouchStart, { passive: true });
    root.addEventListener('touchmove', onTouchMove, { passive: true });
    root.addEventListener('touchend', reset, { passive: true });
    root.addEventListener('touchcancel', reset, { passive: true });

    return () => {
      mq.removeEventListener('change', apply);
      root.removeEventListener('touchstart', onTouchStart);
      root.removeEventListener('touchmove', onTouchMove);
      root.removeEventListener('touchend', reset);
      root.removeEventListener('touchcancel', reset);
      reset();
    };
  }, [ref]);
}

/**
 * Horizontal snap scroll on mobile; grid (or other layout) from `md` up.
 * Use negative horizontal margin so cards can scroll edge-to-edge inside `.container`.
 */
export function ResponsiveSnapScroll({
  children,
  className,
  desktopLayoutClassName,
  gapClassName = 'gap-6 md:gap-8',
  mobileItemClassName = DEFAULT_MOBILE_ITEM,
}: ResponsiveSnapScrollProps) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  useMobileScrollAxis(scrollerRef);
  const items = React.Children.toArray(children);

  return (
    <div
      ref={scrollerRef}
      className={cn(
        'flex w-full flex-nowrap snap-x snap-proximity overflow-x-auto overflow-y-hidden scroll-px-4 pb-3',
        '-mx-4 px-4 [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]',
        'max-md:overscroll-x-contain max-md:items-start',
        'max-md:touch-pan-y max-md:data-[scroll-axis=horizontal]:touch-pan-x',
        'max-md:data-[scroll-axis=vertical]:overflow-x-hidden',
        gapClassName,
        'md:mx-0 md:px-0 md:snap-none md:overflow-visible md:overflow-y-visible md:pb-0 md:touch-auto',
        desktopLayoutClassName,
        className,
      )}
    >
      {items.map((child, index) => (
        <div
          key={React.isValidElement(child) && child.key != null ? child.key : index}
          className={cn(
            mobileItemClassName,
            'flex shrink-0 snap-start md:w-auto md:min-w-0 md:shrink',
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

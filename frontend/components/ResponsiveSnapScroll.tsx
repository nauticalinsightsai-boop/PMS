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
  const items = React.Children.toArray(children);

  return (
    <div
      className={cn(
        'flex w-full flex-nowrap snap-x snap-mandatory overflow-x-auto overflow-y-visible scroll-px-4 pb-3',
        '-mx-4 px-4 [scrollbar-width:thin] max-md:touch-pan-x max-md:overscroll-y-contain max-md:items-start',
        gapClassName,
        'md:mx-0 md:px-0 md:snap-none md:overflow-visible md:pb-0',
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

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

/** Map slide width utilities to grid `auto-cols` so one row keeps equal card heights on mobile. */
function mobileItemWidthToAutoCols(mobileItemClassName: string): string {
  const arbitrary = mobileItemClassName.match(/^w-\[(.+)\]$/);
  if (arbitrary) return `max-md:auto-cols-[${arbitrary[1]}]`;
  if (mobileItemClassName.startsWith('w-')) {
    return mobileItemClassName.replace(/^w-/, 'max-md:auto-cols-');
  }
  return 'max-md:auto-cols-[min(92vw,19rem)]';
}

/** Native horizontal scroll + Embla viewports: allow both axes (pan-y default blocked horizontal scroll). */
export const MOBILE_CAROUSEL_TOUCH_CLASS = 'touch-manipulation overscroll-x-contain';

/** @deprecated Use MOBILE_CAROUSEL_TOUCH_CLASS */
export const MOBILE_EMLA_VIEWPORT_TOUCH_CLASS = MOBILE_CAROUSEL_TOUCH_CLASS;

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

  const mobileAutoCols = mobileItemWidthToAutoCols(mobileItemClassName);

  return (
    <div
      className={cn(
        // Mobile: one grid row → equal slide heights; md+: desktopLayoutClassName grid/flex
        'grid w-full grid-flow-col snap-x snap-proximity overflow-x-auto overflow-y-hidden scroll-px-4',
        mobileAutoCols,
        '-mx-4 px-4 [-webkit-overflow-scrolling:touch]',
        'max-md:[scrollbar-width:none] max-md:[-ms-overflow-style:none] max-md:[&::-webkit-scrollbar]:hidden',
        'max-md:items-stretch max-md:overscroll-x-contain',
        MOBILE_CAROUSEL_TOUCH_CLASS,
        gapClassName,
        'md:mx-0 md:px-0 md:auto-cols-auto md:grid-flow-row md:snap-none md:overflow-visible md:overflow-y-visible md:pb-0 md:touch-auto',
        desktopLayoutClassName,
        className,
      )}
    >
      {items.map((child, index) => (
        <div
          key={React.isValidElement(child) && child.key != null ? child.key : index}
          className={cn(
            'flex min-h-full snap-start flex-col max-md:min-w-0 md:w-auto md:min-w-0',
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { PATHWAY_MOBILE_CAROUSEL_GAP_CLASS, PATHWAY_MOBILE_CAROUSEL_SLIDE_CLASS } from '@/lib/brand-visual';

type ResponsiveSnapScrollProps = {
  children: React.ReactNode;
  className?: string;
  /** Grid / layout classes from the `md` breakpoint upward */
  desktopLayoutClassName: string;
  gapClassName?: string;
  /** Fixed slide width below `md` */
  mobileItemClassName?: string;
  /** When true, slides size to their content on mobile instead of stretching to the tallest card. */
  mobileNaturalHeight?: boolean;
};

const DEFAULT_MOBILE_ITEM = 'w-[min(92vw,19rem)]';

/** Width class applied directly to each slide below `md` (flex row). */
function mobileItemWidthOnSlide(mobileItemClassName: string): string {
  // Pathway carousels pass fully-qualified static `max-md:` utilities for Tailwind JIT.
  if (mobileItemClassName.includes('max-md:')) {
    return mobileItemClassName;
  }
  if (mobileItemClassName.match(/^w-\[/)) {
    return mobileItemClassName.replace(/^w-/, 'max-md:w-');
  }
  if (mobileItemClassName.startsWith('w-')) {
    return mobileItemClassName.replace(/^w-/, 'max-md:w-');
  }
  return 'max-md:w-[min(92vw,19rem)]';
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
  mobileNaturalHeight = false,
}: ResponsiveSnapScrollProps) {
  const items = React.Children.toArray(children);

  const mobileSlideWidth = mobileItemWidthOnSlide(mobileItemClassName);
  const pathwayMobileSlides = mobileItemClassName === PATHWAY_MOBILE_CAROUSEL_SLIDE_CLASS;

  return (
    <div
      className={cn(
        // Mobile: flex row + explicit slide widths; md+: grid from desktopLayoutClassName
        'flex w-full max-md:flex-nowrap md:grid md:grid-flow-row snap-x max-md:snap-mandatory snap-proximity overflow-x-auto overflow-y-hidden',
        pathwayMobileSlides
          ? 'max-md:-mx-[var(--site-gutter)] max-md:px-[var(--site-gutter)] max-md:scroll-px-[var(--site-gutter)]'
          : 'max-md:-mx-[var(--site-gutter)] max-md:px-[var(--site-gutter)] max-md:scroll-px-[var(--site-gutter)]',
        '[-webkit-overflow-scrolling:touch]',
        'max-md:[scrollbar-width:none] max-md:[-ms-overflow-style:none] max-md:[&::-webkit-scrollbar]:hidden',
        mobileNaturalHeight ? 'max-md:items-start' : 'max-md:items-stretch',
        'max-md:overscroll-x-contain',
        MOBILE_CAROUSEL_TOUCH_CLASS,
        gapClassName,
        pathwayMobileSlides && PATHWAY_MOBILE_CAROUSEL_GAP_CLASS,
        'md:mx-0 md:px-0 md:auto-cols-auto md:grid-flow-row md:snap-none md:overflow-visible md:overflow-y-visible md:pb-0 md:touch-auto',
        desktopLayoutClassName,
        pathwayMobileSlides && 'pathway-snap-scroll',
        className,
      )}
    >
      {items.map((child, index) => (
        <div
          key={React.isValidElement(child) && child.key != null ? child.key : index}
          className={cn(
            'flex shrink-0 snap-start flex-col max-md:min-w-0 md:w-auto md:min-w-0 md:shrink',
            mobileSlideWidth,
            mobileNaturalHeight ? 'max-md:h-auto' : 'max-md:h-full max-md:min-h-full max-md:self-stretch',
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

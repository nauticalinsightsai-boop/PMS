'use client';

import Image from 'next/image';
import { BRAND_ICON } from '@/lib/brand-visual';
import { cn } from '@/lib/utils';

type BrandIconMarkProps = {
  size?: number;
  className?: string;
  /** Portal theme toggle — pick one mark explicitly. Omit for site shell (Tailwind dark:). */
  colorMode?: 'light' | 'dark';
  priority?: boolean;
};

function sizeClassForPixels(size: number): string {
  if (size === 56) return 'h-14 w-14';
  if (size === 48) return 'h-12 w-12';
  if (size === 40) return 'h-10 w-10';
  return '';
}

export default function BrandIconMark({
  size = 56,
  className,
  colorMode,
  priority = false,
}: BrandIconMarkProps) {
  const sizeClass = sizeClassForPixels(size);
  const imageClass = cn(sizeClass || undefined, 'object-contain shrink-0', className);

  if (colorMode) {
    return (
      <Image
        src={colorMode === 'dark' ? BRAND_ICON.dark : BRAND_ICON.light}
        alt=""
        width={size}
        height={size}
        className={imageClass}
        priority={priority}
        aria-hidden
      />
    );
  }

  return (
    <div className={cn('relative shrink-0', sizeClass)} aria-hidden>
      <Image
        src={BRAND_ICON.light}
        alt=""
        width={size}
        height={size}
        className={cn(imageClass, 'dark:hidden')}
        priority={priority}
      />
      <Image
        src={BRAND_ICON.dark}
        alt=""
        width={size}
        height={size}
        className={cn(imageClass, 'hidden dark:block')}
        priority={priority}
      />
    </div>
  );
}

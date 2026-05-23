import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Light header/footer backgrounds */
export const BRAND_LOGO_LIGHT = '/brand/pms-logo-light.png';
/** Dark header/footer backgrounds */
export const BRAND_LOGO_DARK = '/brand/pms-logo-dark.png';

const SIZE_MAP = {
  nav: { height: 40, width: 220, className: 'h-9 md:h-10 max-w-[min(220px,52vw)]' },
  footer: { height: 96, width: 528, className: 'h-16 sm:h-20 md:h-24 max-w-[min(480px,85vw)]' },
  /** Card headers & family tiles (on light panels) */
  card: { height: 28, width: 160, className: 'h-7 w-auto max-w-[160px]' },
  /** Compact inline mark */
  mark: { height: 22, width: 120, className: 'h-5 w-auto max-w-[120px]' },
} as const;

type BrandLogoSize = keyof typeof SIZE_MAP;

const BRAND_ALT = 'PM Structure — Project Management Structure';

/** Wordmark for light backgrounds (card pills, family tiles). */
export function BrandLogoOnLight({ size = 'card', className }: { size?: 'card' | 'mark'; className?: string }) {
  const { height, width, className: sizeClass } = SIZE_MAP[size];
  return (
    <Image
      src={BRAND_LOGO_LIGHT}
      alt={BRAND_ALT}
      width={width}
      height={height}
      className={cn(sizeClass, 'object-contain object-left', className)}
    />
  );
}

interface BrandLogoProps {
  href?: string;
  size?: BrandLogoSize;
  className?: string;
  imageClassName?: string;
}

export function BrandLogo({
  href = '/',
  size = 'nav',
  className,
  imageClassName,
}: BrandLogoProps) {
  const { height, width, className: sizeClass } = SIZE_MAP[size];
  const images = (
    <>
      <Image
        src={BRAND_LOGO_LIGHT}
        alt={BRAND_ALT}
        width={width}
        height={height}
        className={cn(sizeClass, 'w-auto object-contain object-left dark:hidden', imageClassName)}
        priority
      />
      <Image
        src={BRAND_LOGO_DARK}
        alt={BRAND_ALT}
        width={width}
        height={height}
        className={cn(sizeClass, 'w-auto object-contain object-left hidden dark:block', imageClassName)}
        priority
      />
    </>
  );

  if (!href) {
    return <span className={cn('inline-flex items-center', className)}>{images}</span>;
  }

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex shrink-0 items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2',
        className,
      )}
      aria-label="PM Structure home"
    >
      {images}
    </Link>
  );
}

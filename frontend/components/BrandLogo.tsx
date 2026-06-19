import Image from 'next/image';
import Link from 'next/link';
import { BRAND_LOGO } from '@/lib/brand-visual';
import { cn } from '@/lib/utils';

/** Light header/footer backgrounds */
export const BRAND_LOGO_LIGHT = BRAND_LOGO.light;
/** Dark header/footer backgrounds */
export const BRAND_LOGO_DARK = BRAND_LOGO.dark;
/** Square PMS mark — below xl (mobile, tablet, laptop) */
export const BRAND_MARK_LIGHT = '/brand/pms-mark-light.png';
/** Square PMS mark — below xl (mobile, tablet, laptop) */
export const BRAND_MARK_DARK = '/brand/pms-mark-dark.png';

/** Processed wordmark is 640×154 (~4.16:1) — see `scripts/process-pms-wordmarks.mjs` */
const SIZE_MAP = {
  nav: {
    height: 40,
    width: 166,
    wordmarkClassName: 'h-9 md:h-10 max-w-[min(300px,62vw)] w-auto object-contain object-left',
    markSize: 36,
    markClassName: 'h-9 w-9 shrink-0 object-contain',
  },
  footer: {
    height: 48,
    width: 200,
    wordmarkClassName: 'h-8 sm:h-10 md:h-12 max-w-[min(300px,92vw)] w-auto object-contain object-left',
    markSize: 40,
    markClassName: 'h-8 w-8 sm:h-10 sm:w-10 shrink-0 object-contain',
  },
  /** Card headers & family tiles (on light panels) */
  card: { height: 28, width: 104, className: 'h-7 w-auto max-w-[180px]' },
  /** Compact inline mark */
  mark: { height: 22, width: 81, className: 'h-5 w-auto max-w-[140px]' },
} as const;

type BrandLogoSize = keyof typeof SIZE_MAP;

const BRAND_ALT = 'PM Structure. Project Management Structure';

/** Wordmark for light backgrounds (card pills, family tiles). */
export function BrandLogoOnLight({ size = 'card', className }: { size?: 'card' | 'mark'; className?: string }) {
  const config = SIZE_MAP[size];
  const sizeClass = 'className' in config ? config.className : config.wordmarkClassName;
  return (
    <Image
      src={BRAND_LOGO_LIGHT}
      alt={BRAND_ALT}
      width={config.width}
      height={config.height}
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
  const sizeConfig = SIZE_MAP[size];
  const { height, width } = sizeConfig;
  const usesShellMark = size === 'nav' || size === 'footer';
  const wordmarkClassName =
    'wordmarkClassName' in sizeConfig ? sizeConfig.wordmarkClassName : sizeConfig.className;
  const markSize = usesShellMark ? sizeConfig.markSize : null;
  const markClassName = usesShellMark ? sizeConfig.markClassName : null;

  const images = (
    <>
      {usesShellMark && markSize != null && markClassName != null ? (
        <>
          <Image
            src={BRAND_MARK_LIGHT}
            alt={BRAND_ALT}
            width={markSize}
            height={markSize}
            className={cn(
              markClassName,
              'hidden max-xl:block max-xl:dark:hidden',
              imageClassName,
            )}
            priority={size === 'nav'}
          />
          <Image
            src={BRAND_MARK_DARK}
            alt={BRAND_ALT}
            width={markSize}
            height={markSize}
            className={cn(markClassName, 'hidden max-xl:dark:block', imageClassName)}
            priority={size === 'nav'}
            loading={size === 'nav' ? undefined : 'lazy'}
          />
        </>
      ) : null}
      <Image
        src={BRAND_LOGO_LIGHT}
        alt={BRAND_ALT}
        width={width}
        height={height}
        className={cn(wordmarkClassName, 'hidden xl:block dark:xl:hidden', imageClassName)}
        priority={size === 'nav'}
      />
      <Image
        src={BRAND_LOGO_DARK}
        alt={BRAND_ALT}
        width={width}
        height={height}
        className={cn(wordmarkClassName, 'hidden xl:dark:block', imageClassName)}
        priority={size === 'nav'}
        loading={size === 'nav' ? undefined : 'lazy'}
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

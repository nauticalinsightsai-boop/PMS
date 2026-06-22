import Image from 'next/image';
import Link from 'next/link';
import { BRAND_LOGO } from '@/lib/brand-visual';
import { cn } from '@/lib/utils';

/** Light header/footer backgrounds */
export const BRAND_LOGO_LIGHT = BRAND_LOGO.light;
/** Dark header/footer backgrounds */
export const BRAND_LOGO_DARK = BRAND_LOGO.dark;
/** Square PMS mark: below xl (mobile, tablet, laptop) */
export const BRAND_MARK_LIGHT = '/brand/pms-mark-light.png';
/** Square PMS mark: below xl (mobile, tablet, laptop) */
export const BRAND_MARK_DARK = '/brand/pms-mark-dark.png';

/** Processed wordmark is 640×173 (~3.7:1): see `scripts/process-pms-wordmarks.mjs` */
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

function ShellWordmark({
  width,
  height,
  shellClassName,
  imageClassName,
  priority,
}: {
  width: number;
  height: number;
  shellClassName: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  return (
    <span className={cn('relative inline-block shrink-0', shellClassName)} aria-hidden>
      <Image
        src={BRAND_LOGO_LIGHT}
        alt=""
        width={width}
        height={height}
        className={cn(
          'absolute inset-0 h-full w-full object-contain object-left dark:hidden',
          imageClassName,
        )}
        priority={priority}
        quality={priority ? 70 : 75}
      />
      <Image
        src={BRAND_LOGO_DARK}
        alt=""
        width={width}
        height={height}
        className={cn(
          'absolute inset-0 h-full w-full object-contain object-left hidden dark:block',
          imageClassName,
        )}
        priority={priority}
        quality={priority ? 70 : 75}
        loading={priority ? undefined : 'lazy'}
      />
    </span>
  );
}

function ShellMark({
  markSize,
  shellClassName,
  imageClassName,
  priority,
}: {
  markSize: number;
  shellClassName: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  return (
    <span className={cn('relative inline-block shrink-0', shellClassName)} aria-hidden>
      <Image
        src={BRAND_MARK_LIGHT}
        alt=""
        width={markSize}
        height={markSize}
        className={cn(
          'absolute inset-0 h-full w-full object-contain dark:hidden',
          imageClassName,
        )}
        priority={priority}
        quality={priority ? 70 : 75}
      />
      <Image
        src={BRAND_MARK_DARK}
        alt=""
        width={markSize}
        height={markSize}
        className={cn(
          'absolute inset-0 h-full w-full object-contain hidden dark:block',
          imageClassName,
        )}
        priority={priority}
        quality={priority ? 70 : 75}
        loading={priority ? undefined : 'lazy'}
      />
    </span>
  );
}

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
        <ShellMark
          markSize={markSize}
          shellClassName={cn(markClassName, 'xl:hidden')}
          imageClassName={imageClassName}
          priority={size === 'nav'}
        />
      ) : null}
      {usesShellMark ? (
        <ShellWordmark
          width={width}
          height={height}
          shellClassName={cn(
            'hidden xl:block',
            size === 'nav' ? 'h-9 w-[166px] md:h-10' : 'h-8 w-[200px] sm:h-10 md:h-12',
          )}
          imageClassName={imageClassName}
          priority={size === 'nav'}
        />
      ) : (
        <>
          <Image
            src={BRAND_LOGO_LIGHT}
            alt={BRAND_ALT}
            width={width}
            height={height}
            className={cn(wordmarkClassName, 'object-contain object-left dark:hidden', imageClassName)}
            priority={size === 'nav'}
          />
          <Image
            src={BRAND_LOGO_DARK}
            alt={BRAND_ALT}
            width={width}
            height={height}
            className={cn(
              wordmarkClassName,
              'hidden object-contain object-left dark:block',
              imageClassName,
            )}
            priority={size === 'nav'}
            loading={size === 'nav' ? undefined : 'lazy'}
          />
        </>
      )}
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

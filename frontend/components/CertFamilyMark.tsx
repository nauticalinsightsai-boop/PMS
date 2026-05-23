import Image from 'next/image';
import { TrendingUp } from 'lucide-react';
import { BRAND_CERT_LOGOS } from '@/lib/brand-visual';
import { cn } from '@/lib/utils';

/** PRINCE2 wordmark is wide (~5.8:1); PMI mark is roughly square. */
const LOGO_MARK_PROPS: Record<
  string,
  { src: string; alt: string; width: number; height: number; imageClassName: string }
> = {
  PMI: {
    src: BRAND_CERT_LOGOS.PMI,
    alt: 'Project Management Institute (PMI)',
    width: 64,
    height: 64,
    imageClassName: 'h-10 w-10 object-contain',
  },
  PRINCE2: {
    src: BRAND_CERT_LOGOS.PRINCE2,
    alt: 'PRINCE2',
    width: 138,
    height: 24,
    imageClassName: 'h-9 w-auto max-w-[5.25rem] object-contain object-center',
  },
  SixSigma: {
    src: BRAND_CERT_LOGOS.SixSigma,
    alt: 'Lean Six Sigma',
    width: 64,
    height: 64,
    imageClassName: 'h-11 w-11 object-contain',
  },
};

export function CertFamilyMark({
  familyId,
  className,
  imageClassName,
  iconClassName = 'h-8 w-8',
}: {
  familyId: string;
  className?: string;
  imageClassName?: string;
  iconClassName?: string;
}) {
  const logo = LOGO_MARK_PROPS[familyId];
  if (logo) {
    return (
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className={cn(logo.imageClassName, imageClassName, className)}
        priority={false}
      />
    );
  }

  return <TrendingUp className={cn(iconClassName, className)} aria-hidden />;
}

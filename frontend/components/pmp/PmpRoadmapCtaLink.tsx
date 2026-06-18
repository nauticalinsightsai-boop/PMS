'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import {
  COMPARE_PATHWAYS_CTA_LABEL,
  COMPARE_PATHWAYS_HREF,
  PMP_ROADMAP_CTA_HREF,
  PMP_ROADMAP_CTA_LABEL,
  scrollToPmpRoadmapForm,
} from '@/lib/pmp-roadmap-cta';
import { cn } from '@/lib/utils';

type PmpRoadmapCtaLinkProps = {
  className?: string;
  size?: ComponentProps<typeof Button>['size'];
  variant?: ComponentProps<typeof Button>['variant'];
  label?: string;
  asButton?: boolean;
};

export function PmpRoadmapCtaLink({
  className,
  size = 'lg',
  variant = 'default',
  label = PMP_ROADMAP_CTA_LABEL,
  asButton = true,
}: PmpRoadmapCtaLinkProps) {
  const pathname = usePathname();
  const onHome = pathname === '/';

  if (onHome) {
    return (
      <Button
        type="button"
        size={size}
        variant={variant}
        className={cn(className)}
        onClick={scrollToPmpRoadmapForm}
      >
        {label}
      </Button>
    );
  }

  if (!asButton) {
    return (
      <Link href={PMP_ROADMAP_CTA_HREF} className={cn(className)}>
        {label}
      </Link>
    );
  }

  return (
    <Link href={PMP_ROADMAP_CTA_HREF} className={cn('inline-flex', className)}>
      <Button size={size} variant={variant} className="w-full sm:w-auto">
        {label}
      </Button>
    </Link>
  );
}

export function ComparePathwaysCtaLink({
  className,
  buttonClassName,
  size = 'lg',
}: {
  className?: string;
  buttonClassName?: string;
  size?: ComponentProps<typeof Button>['size'];
}) {
  return (
    <Link href={COMPARE_PATHWAYS_HREF} className={cn('w-full sm:w-auto', className)}>
      <Button size={size} variant="outline" className={cn('w-full sm:w-auto', buttonClassName)}>
        {COMPARE_PATHWAYS_CTA_LABEL}
      </Button>
    </Link>
  );
}

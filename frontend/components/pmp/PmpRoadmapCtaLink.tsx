'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { WebsiteCalendlyButton } from '@/components/calendly/WebsiteCalendlyButton';
import {
  COMPARE_PATHWAYS_CTA_LABEL,
  COMPARE_PATHWAYS_HREF,
  PMP_ROADMAP_CTA_LABEL,
} from '@/lib/pmp-roadmap-cta';
import { cn } from '@/lib/utils';
import type { CtaLocation } from '@/lib/analytics/pms-events';
import { trackRoadmapCtaClick } from '@/lib/analytics/track-roadmap-cta';

type PmpRoadmapCtaLinkProps = {
  className?: string;
  size?: ComponentProps<typeof Button>['size'];
  variant?: ComponentProps<typeof Button>['variant'];
  label?: string;
  ctaLocation?: CtaLocation;
};

function funnelSuffixFromPath(pathname: string): string {
  if (pathname === '/') return 'home';
  const slug = pathname.replace(/^\/+|\/+$/g, '').replace(/\//g, '_');
  return slug || 'site';
}

export function PmpRoadmapCtaLink({
  className,
  size = 'lg',
  variant = 'default',
  label = PMP_ROADMAP_CTA_LABEL,
  ctaLocation,
}: PmpRoadmapCtaLinkProps) {
  const pathname = usePathname() ?? '/';
  const location: CtaLocation = ctaLocation ?? (pathname === '/' ? 'hero' : 'body');
  const funnelSuffix = funnelSuffixFromPath(pathname);

  return (
    <WebsiteCalendlyButton
      size={size}
      variant={variant}
      className={cn('w-full sm:w-auto', className)}
      tier="discovery"
      funnelLabel={`roadmap_cta_${funnelSuffix}`}
      utm={{
        utm_source: 'pmstructure',
        utm_medium: location,
        utm_campaign: 'roadmap',
      }}
      onBeforeOpen={() => trackRoadmapCtaClick({ ctaText: label, ctaLocation: location })}
    >
      {label}
    </WebsiteCalendlyButton>
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

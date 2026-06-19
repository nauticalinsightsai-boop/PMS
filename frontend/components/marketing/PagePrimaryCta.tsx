'use client';

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { WebsiteCalendlyButton } from '@/components/calendly/WebsiteCalendlyButton';
import { isRoadmapSchedulingHref } from '@/lib/pmp-roadmap-cta';
import { trackRoadmapCtaClick } from '@/lib/analytics/track-roadmap-cta';
import { cn } from '@/lib/utils';

type PagePrimaryCtaProps = {
  href: string;
  label: string;
  funnelLabel: string;
  className?: string;
  ctaLocation?: 'hero' | 'body' | 'footer' | 'pricing';
};

export function PagePrimaryCta({
  href,
  label,
  funnelLabel,
  className,
  ctaLocation = 'body',
}: PagePrimaryCtaProps) {
  if (isRoadmapSchedulingHref(href)) {
    return (
      <WebsiteCalendlyButton
        tier="discovery"
        funnelLabel={funnelLabel}
        className={cn(buttonVariants({ size: 'lg' }), className)}
        utm={{
          utm_source: 'pmstructure',
          utm_medium: funnelLabel,
          utm_campaign: 'roadmap',
        }}
        onBeforeOpen={() => trackRoadmapCtaClick({ ctaText: label, ctaLocation })}
      >
        {label}
      </WebsiteCalendlyButton>
    );
  }

  return (
    <Link href={href} className={cn(buttonVariants({ size: 'lg' }), className)}>
      {label}
    </Link>
  );
}

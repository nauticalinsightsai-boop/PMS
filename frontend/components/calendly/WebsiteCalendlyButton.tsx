'use client';

import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';
import type { CalendlyUtmParams } from '@/lib/calendly/embed-types';
import {
  buildWebsiteCalendlySchedulingHref,
  type WebsiteCalendlyTier,
} from '@/lib/calendly/scheduling-href';
import { openWebsiteCalendly } from '@/lib/calendly/website-events';
import { mergeCalendlyUtmWithInbound } from '@/lib/analytics/utm-calendly';
import { markIntent } from '@/lib/conversion-recovery/engagement-score';
import { cn } from '@/lib/utils';

export type WebsiteCalendlyButtonProps = Omit<
  React.ComponentPropsWithoutRef<'a'>,
  'href' | 'onClick'
> &
  VariantProps<typeof buttonVariants> & {
  tier?: WebsiteCalendlyTier;
  funnelLabel?: string;
  utm?: CalendlyUtmParams;
  onBeforeOpen?: () => void;
};

/** Opens the themed popup on normal clicks; the anchor itself remains crawl-safe. */
export function WebsiteCalendlyButton({
  tier = 'mentor',
  funnelLabel = 'website_calendly',
  utm,
  onBeforeOpen,
  children,
  className,
  variant = 'default',
  size = 'default',
  ...rest
}: WebsiteCalendlyButtonProps) {
  const [resolvedUtm, setResolvedUtm] = React.useState<CalendlyUtmParams | undefined>(utm);

  React.useEffect(() => {
    setResolvedUtm(mergeCalendlyUtmWithInbound(utm));
  }, [
    utm?.utm_source,
    utm?.utm_medium,
    utm?.utm_campaign,
    utm?.utm_content,
    utm?.utm_term,
  ]);

  const href = React.useMemo(
    () => buildWebsiteCalendlySchedulingHref(tier, resolvedUtm),
    [tier, resolvedUtm],
  );

  const openPopup = React.useCallback(
    (event?: React.MouseEvent<HTMLAnchorElement>) => {
      if (event?.defaultPrevented) return;
      if (event?.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      event.preventDefault();
      onBeforeOpen?.();
      markIntent();
      openWebsiteCalendly(tier, { funnelLabel, utm });
    },
    [funnelLabel, onBeforeOpen, tier, utm],
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={openPopup}
      {...rest}
    >
      {children}
    </a>
  );
}

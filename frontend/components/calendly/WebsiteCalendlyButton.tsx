'use client';

import * as React from 'react';
import { buttonVariants, type ButtonProps } from '@/components/ui/button';
import type { CalendlyUtmParams } from '@/lib/calendly/embed-types';
import {
  buildWebsiteCalendlySchedulingHref,
  type WebsiteCalendlyTier,
} from '@/lib/calendly/scheduling-href';
import { openWebsiteCalendly } from '@/lib/calendly/website-events';
import { markIntent } from '@/lib/conversion-recovery/engagement-score';
import { cn } from '@/lib/utils';

export type WebsiteCalendlyButtonProps = Omit<ButtonProps, 'onClick' | 'type'> & {
  tier?: WebsiteCalendlyTier;
  funnelLabel?: string;
  utm?: CalendlyUtmParams;
  onBeforeOpen?: () => void;
};

/** Opens a website Calendly popup; includes a real scheduling href for accessibility. */
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
  const href = React.useMemo(() => buildWebsiteCalendlySchedulingHref(tier, utm), [tier, utm]);

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

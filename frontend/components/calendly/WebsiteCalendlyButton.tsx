'use client';

import * as React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import type { CalendlyUtmParams } from '@/lib/calendly/embed-url';
import {
  openWebsiteCalendly,
  type WebsiteCalendlyTier,
} from '@/lib/calendly/website-events';
import { markIntent } from '@/lib/conversion-recovery/engagement-score';
import { trackConversionEvent, CONVERSION_EVENTS } from '@/lib/analytics/conversion-events';

export type WebsiteCalendlyButtonProps = Omit<ButtonProps, 'onClick' | 'type'> & {
  tier?: WebsiteCalendlyTier;
  funnelLabel?: string;
  utm?: CalendlyUtmParams;
  onBeforeOpen?: () => void;
};

/** Opens a website Calendly popup (hero / discovery / executive / services). */
export function WebsiteCalendlyButton({
  tier = 'hero',
  funnelLabel = 'website_calendly',
  utm,
  onBeforeOpen,
  children,
  type = 'button',
  ...buttonProps
}: WebsiteCalendlyButtonProps) {
  const handleClick = () => {
    onBeforeOpen?.();
    markIntent();
    trackConversionEvent(CONVERSION_EVENTS.CONSULTATION_BOOK, {
      source: funnelLabel,
      calendly_tier: tier,
    });
    openWebsiteCalendly(tier, { funnelLabel, utm });
  };

  return (
    <Button type={type} {...buttonProps} onClick={handleClick}>
      {children}
    </Button>
  );
}

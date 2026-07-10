'use client';

import * as React from 'react';
import { buttonVariants, type ButtonProps } from '@/components/ui/button';
import type { CalendlyUtmParams } from '@/lib/calendly/embed-types';
import {
  buildCalendlyPopupWidgetUrl,
  getCalendlyEmbedTheme,
} from '@/lib/calendly/embed-url';
import {
  buildWebsiteCalendlySchedulingHref,
  getWebsiteCalendlyUrl,
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

/** Themed proxy href — rebuilds when light/dark changes (C5). */
function buildThemedProxyHref(
  tier: WebsiteCalendlyTier,
  theme: 'light' | 'dark',
  utm?: CalendlyUtmParams,
): string {
  try {
    const host = typeof window !== 'undefined' ? window.location.host : 'localhost';
    return (
      buildCalendlyPopupWidgetUrl(getWebsiteCalendlyUrl(tier), {
        host,
        theme,
        utm,
        channelId: 'website',
        useProxy: true,
      }) || buildWebsiteCalendlySchedulingHref(tier, utm)
    );
  } catch {
    return buildWebsiteCalendlySchedulingHref(tier, utm);
  }
}

/** Opens a website Calendly popup; href is themed proxy URL so middle-click stays themed. */
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
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() =>
    typeof window !== 'undefined' ? getCalendlyEmbedTheme() : 'dark',
  );

  React.useEffect(() => {
    const sync = () => setTheme(getCalendlyEmbedTheme());
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    const portalRoots = document.querySelectorAll('.portal-root');
    portalRoots.forEach((el) =>
      mo.observe(el, { attributes: true, attributeFilter: ['data-color-mode'] }),
    );
    return () => mo.disconnect();
  }, []);

  const href = React.useMemo(() => buildThemedProxyHref(tier, theme, utm), [tier, theme, utm]);

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

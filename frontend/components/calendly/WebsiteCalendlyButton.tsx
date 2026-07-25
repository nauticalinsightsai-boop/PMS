'use client';

import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';
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

/** Themed proxy href - rebuilds when light/dark changes (C5). */
function buildThemedProxyHref(
  tier: WebsiteCalendlyTier,
  host: string,
  theme: 'light' | 'dark',
  utm?: CalendlyUtmParams,
): string {
  try {
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
  const [host, setHost] = React.useState('localhost');
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark');
  const [resolvedUtm, setResolvedUtm] = React.useState<CalendlyUtmParams | undefined>(utm);

  React.useEffect(() => {
    setHost(window.location.host);
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
    () => buildThemedProxyHref(tier, host, theme, resolvedUtm),
    [tier, host, theme, resolvedUtm],
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

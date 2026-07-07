'use client';

import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes';
import { cn } from '@/lib/utils';

export const portalSectionHeadingClass = 'text-meta font-mono uppercase tracking-[0.2em]';
export const portalSectionSubtitleClass = 'text-body-sm w-full leading-relaxed';

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  theme: PlatformPortalTheme;
  titleId?: string;
  className?: string;
  titleAs?: 'h3' | 'p';
};

export default function PortalSectionHead({
  title,
  subtitle,
  theme,
  titleId,
  className,
  titleAs: TitleTag = 'h3',
}: Props) {
  const mutedStyle = { color: theme.textMuted, fontFamily: theme.fontFamily };

  return (
    <div className={cn('portal-tier-section-head mb-3 sm:mb-4 space-y-1', className)}>
      <TitleTag id={titleId} className={portalSectionHeadingClass} style={mutedStyle}>
        {title}
      </TitleTag>
      {subtitle ? (
        <p className={portalSectionSubtitleClass} style={mutedStyle}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

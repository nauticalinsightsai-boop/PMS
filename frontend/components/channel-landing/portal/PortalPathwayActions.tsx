'use client';

import Link from 'next/link';
import type { ChannelLandingPage } from '@/types/channelLandingPage';
import { CTAS } from '@/lib/brand-voice';
import PortalButton from '@/components/channel-landing/portal/primitives/PortalButton';
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes';

type Props = {
  page: ChannelLandingPage;
  theme: PlatformPortalTheme;
  sectionOrder?: number;
};

export default function PortalPathwayActions({ page, theme, sectionOrder }: Props) {
  if (page.channelId === 'webinar') return null;

  const e = page.portalEngagement;
  const showExplore = e?.showExplorePathways === true;
  const showCompare = e?.showComparePathways === true;
  if (!showExplore && !showCompare) return null;

  return (
    <div
      className="portal-pathway-actions flex flex-wrap justify-center gap-3 py-6 sm:py-8 border-t"
      style={{
        order: sectionOrder,
        borderColor: theme.cardBorder,
      }}
    >
      {showExplore ? (
        <Link href="/certifications" className="inline-flex">
          <PortalButton theme={theme} variant="primary">
            {CTAS.exploreCertifications}
          </PortalButton>
        </Link>
      ) : null}
      {showCompare ? (
        <Link href="/certifications/compare" className="inline-flex">
          <PortalButton theme={theme} variant="ghost">
            Compare pathways
          </PortalButton>
        </Link>
      ) : null}
    </div>
  );
}

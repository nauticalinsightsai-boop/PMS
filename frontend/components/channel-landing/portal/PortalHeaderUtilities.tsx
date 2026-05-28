'use client';

import Link from 'next/link';
import type { ChannelLandingPage } from '@/types/channelLandingPage';
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes';
import { useRegion } from '@/contexts/RegionContext';
import PortalMembershipPopout from '@/components/channel-landing/portal/PortalMembershipPopout';
import { membershipTiers } from '@/data/siteData';
import { getRegionalMembershipAmounts } from '@/lib/membership-regional-pricing';

type Props = {
  page: ChannelLandingPage;
  theme: PlatformPortalTheme;
};

export default function PortalHeaderUtilities({ page, theme }: Props) {
  const e = page.portalEngagement;
  const { regionId, gccCountry, regionLabel, openRegionModal } = useRegion();
  const showStore = e?.showStoreLink !== false;
  const showMembership = e?.showMembershipLink !== false;
  const proTier = membershipTiers.find((t) => t.name === 'Professional');
  const proMembership = proTier
    ? getRegionalMembershipAmounts(proTier.monthlyPriceUsd, proTier.yearlyPriceUsd, regionId, gccCountry)
    : null;

  if (!showStore && !showMembership) {
    return (
      <button
        type="button"
        onClick={openRegionModal}
        className="shrink-0 text-meta px-3 py-1.5"
        style={{
          borderRadius: theme.radius,
          border: `1px solid ${theme.cardBorder}`,
          color: theme.textMuted,
          backgroundColor: theme.surfaceMuted,
        }}
      >
        {regionLabel}
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
      <button
        type="button"
        onClick={openRegionModal}
        className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 hidden sm:inline-flex"
        style={{
          borderRadius: theme.radius,
          border: `1px solid ${theme.cardBorder}`,
          color: theme.textMuted,
          backgroundColor: 'transparent',
        }}
        title="Change pricing region"
      >
        {regionLabel}
      </button>
      {showStore ? (
        <Link
          href="/community?view=store"
          className="text-meta font-medium px-3 py-1.5 transition-opacity hover:opacity-90"
          style={{
            borderRadius: theme.radius,
            border: `1px solid ${theme.cardBorder}`,
            color: theme.text,
            backgroundColor: theme.surfaceMuted,
          }}
        >
          Store
        </Link>
      ) : null}
      {showMembership ? (
        <PortalMembershipPopout
          theme={theme}
          membershipPrice={proMembership?.monthly}
        />
      ) : null}
    </div>
  );
}

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
  /** When false, only the region chip is shown (Store/Membership live in {@link PortalSiteChips}). */
  engagementLinks?: boolean;
};

function PortalRegionChip({
  theme,
  regionLabel,
  onChange,
}: {
  theme: PlatformPortalTheme;
  regionLabel: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-label={`Region: ${regionLabel}. Click to change region.`}
      title="Change pricing region"
      className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 transition-opacity hover:opacity-90"
      style={{
        borderRadius: theme.radius,
        border: `1px solid ${theme.cardBorder}`,
        color: theme.textMuted,
        backgroundColor: theme.surfaceMuted,
      }}
    >
      <span>{regionLabel}</span>
      <span aria-hidden style={{ color: theme.primary }}>
        · Change
      </span>
    </button>
  );
}

export default function PortalHeaderUtilities({ page, theme, engagementLinks = true }: Props) {
  const e = page.portalEngagement;
  const { regionId, gccCountry, regionLabel, openRegionModal } = useRegion();
  const showStore = e?.showStoreLink !== false;
  const showMembership = e?.showMembershipLink !== false;
  const proTier = membershipTiers.find((t) => t.name === 'Professional');
  const proMembership = proTier
    ? getRegionalMembershipAmounts(proTier.monthlyPriceUsd, proTier.yearlyPriceUsd, regionId, gccCountry)
    : null;

  const regionChip = (
    <PortalRegionChip theme={theme} regionLabel={regionLabel} onChange={openRegionModal} />
  );

  if (!engagementLinks || (!showStore && !showMembership)) {
    return regionChip;
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
      {regionChip}
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

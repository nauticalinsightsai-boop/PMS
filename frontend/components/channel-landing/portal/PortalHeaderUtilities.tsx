'use client';

import Link from 'next/link';
import type { ChannelLandingPage } from '@/types/channelLandingPage';
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes';
import { useRegion } from '@/contexts/RegionContext';
import PortalMembershipPopout from '@/components/channel-landing/portal/PortalMembershipPopout';
import { membershipTiers } from '@/data/siteData';
import { getRegionalMembershipAmounts } from '@/lib/membership-regional-pricing';
import { cn } from '@/lib/utils';

type Props = {
  page: ChannelLandingPage;
  theme: PlatformPortalTheme;
  /** When false, only the region chip is shown (Store/Membership live in {@link PortalSiteChips}). */
  engagementLinks?: boolean;
  className?: string;
};

function PortalRegionChip({
  theme,
  regionLabel,
}: {
  theme: PlatformPortalTheme;
  regionLabel: string;
}) {
  return (
    <span
      aria-label={`Region: ${regionLabel}`}
      className="inline-flex w-full items-center justify-center text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 sm:w-auto sm:shrink-0 sm:justify-start"
      style={{
        borderRadius: theme.radius,
        border: `1px solid ${theme.cardBorder}`,
        color: theme.textMuted,
        backgroundColor: theme.surfaceMuted,
      }}
    >
      {regionLabel}
    </span>
  );
}

export default function PortalHeaderUtilities({
  page,
  theme,
  engagementLinks = true,
  className,
}: Props) {
  const e = page.portalEngagement;
  const { regionId, gccCountry, regionLabel } = useRegion();
  const showStore = e?.showStoreLink !== false;
  const showMembership = e?.showMembershipLink !== false;
  const proTier = membershipTiers.find((t) => t.name === 'Professional');
  const proMembership = proTier
    ? getRegionalMembershipAmounts(proTier.monthlyPriceUsd, proTier.yearlyPriceUsd, regionId, gccCountry)
    : null;

  const regionChip = <PortalRegionChip theme={theme} regionLabel={regionLabel} />;

  if (!engagementLinks || (!showStore && !showMembership)) {
    return <div className={cn('w-full sm:w-auto sm:flex sm:justify-end', className)}>{regionChip}</div>;
  }

  return (
    <div
      className={cn(
        'flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:shrink-0',
        className,
      )}
    >
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

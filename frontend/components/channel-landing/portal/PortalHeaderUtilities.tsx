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
  canChangeRegion,
  isDetectingRegion,
  onInteract,
}: {
  theme: PlatformPortalTheme;
  regionLabel: string;
  canChangeRegion: boolean;
  isDetectingRegion: boolean;
  onInteract: () => void;
}) {
  const suffix = canChangeRegion ? '· Change' : '· Share location';
  const title = canChangeRegion
    ? 'Change pricing region'
    : 'Share your location to update pricing for your area';

  return (
    <button
      type="button"
      onClick={onInteract}
      disabled={isDetectingRegion}
      aria-label={
        canChangeRegion
          ? `Region: ${regionLabel}. Click to change region.`
          : `Region: ${regionLabel}. Share your location to change region.`
      }
      title={title}
      className={cn(
        'inline-flex w-full items-center justify-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 transition-opacity sm:w-auto sm:shrink-0 sm:justify-start',
        !isDetectingRegion && 'hover:opacity-90',
        isDetectingRegion && 'opacity-70',
      )}
      style={{
        borderRadius: theme.radius,
        border: `1px solid ${theme.cardBorder}`,
        color: theme.textMuted,
        backgroundColor: theme.surfaceMuted,
      }}
    >
      <span>{regionLabel}</span>
      <span aria-hidden style={{ color: theme.primary }}>
        {isDetectingRegion ? '· Detecting…' : ` ${suffix}`}
      </span>
    </button>
  );
}

export default function PortalHeaderUtilities({
  page,
  theme,
  engagementLinks = true,
  className,
}: Props) {
  const e = page.portalEngagement;
  const {
    regionId,
    gccCountry,
    regionLabel,
    canChangeRegion,
    isDetectingRegion,
    openRegionModal,
    shareLocationForRegion,
  } = useRegion();
  const showStore = e?.showStoreLink !== false;
  const showMembership = e?.showMembershipLink !== false;
  const proTier = membershipTiers.find((t) => t.name === 'Professional');
  const proMembership = proTier
    ? getRegionalMembershipAmounts(proTier.monthlyPriceUsd, proTier.yearlyPriceUsd, regionId, gccCountry)
    : null;

  const handleRegionInteract = () => {
    if (canChangeRegion) {
      openRegionModal();
      return;
    }
    void shareLocationForRegion();
  };

  const regionChip = (
    <PortalRegionChip
      theme={theme}
      regionLabel={regionLabel}
      canChangeRegion={canChangeRegion}
      isDetectingRegion={isDetectingRegion}
      onInteract={handleRegionInteract}
    />
  );

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

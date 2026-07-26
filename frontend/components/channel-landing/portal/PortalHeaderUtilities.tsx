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
  /** When false, header utility links are hidden (Store/Membership live in {@link PortalSiteChips}). */
  engagementLinks?: boolean;
  className?: string;
};

export default function PortalHeaderUtilities({
  page,
  theme,
  engagementLinks = true,
  className,
}: Props) {
  const e = page.portalEngagement;
  const { regionId, gccCountry } = useRegion();
  const showStore = e?.showStoreLink !== false;
  const showMembership = e?.showMembershipLink !== false;
  const proTier = membershipTiers.find((t) => t.name === 'Professional');
  const proMembership = proTier
    ? getRegionalMembershipAmounts(proTier.monthlyPriceUsd, proTier.yearlyPriceUsd, regionId, gccCountry)
    : null;

  if (!engagementLinks || (!showStore && !showMembership)) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:shrink-0',
        className,
      )}
    >
      {showStore ? (
        <Link
          href="/community?view=store"
          className="inline-flex min-h-11 items-center px-3 py-1.5 text-meta font-medium transition-opacity hover:opacity-90"
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

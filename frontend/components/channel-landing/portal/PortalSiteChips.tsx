'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ChevronDown, Crown, GitCompare, ShoppingBag } from 'lucide-react';
import type { ChannelLandingPage } from '@/types/channelLandingPage';
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes';
import { useRegion } from '@/contexts/RegionContext';
import { membershipTiers } from '@/data/siteData';
import { getRegionalMembershipAmounts } from '@/lib/membership-regional-pricing';
import { REGION_COPY } from '@/lib/brand-voice';
import { cn } from '@/lib/utils';

type Props = {
  page: ChannelLandingPage;
  theme: PlatformPortalTheme;
  /** Website portal always surfaces compare alongside store/membership. */
  includeCompare?: boolean;
};

type ChipId = 'store' | 'compare' | 'membership';

type ChipConfig = {
  id: ChipId;
  label: string;
  icon: ReactNode;
  body: string;
  href: string;
  cta: string;
  price?: string;
};

export default function PortalSiteChips({ page, theme, includeCompare = false }: Props) {
  const e = page.portalEngagement;
  const { regionId, gccCountry } = useRegion();
  const [active, setActive] = useState<ChipId | null>(null);
  const showStore = e?.showStoreLink !== false;
  const showMembership = e?.showMembershipLink !== false;
  const showCompare = includeCompare || e?.showComparePathways === true;
  const proTier = membershipTiers.find((t) => t.name === 'Professional');
  const proMembership = proTier
    ? getRegionalMembershipAmounts(proTier.monthlyPriceUsd, proTier.yearlyPriceUsd, regionId, gccCountry)
    : null;
  const membershipPrice = proMembership?.monthly?.trim() || '—';

  const chips: ChipConfig[] = [];
  if (showStore) {
    chips.push({
      id: 'store',
      label: 'Store',
      icon: <ShoppingBag size={14} aria-hidden />,
      body: 'Browse prep resources, session add-ons, and learner materials in the community store.',
      href: '/community?view=store',
      cta: 'Open store →',
    });
  }
  if (showCompare) {
    chips.push({
      id: 'compare',
      label: 'Compare',
      icon: <GitCompare size={14} aria-hidden />,
      body: 'Compare certification pathways side by side — credentials, cohort timing, and regional tuition.',
      href: '/certifications/compare',
      cta: 'Compare pathways →',
    });
  }
  if (showMembership) {
    chips.push({
      id: 'membership',
      label: 'Membership',
      icon: <Crown size={14} aria-hidden />,
      body: REGION_COPY.membershipDiscountNote,
      href: '/membership',
      cta: 'View membership details →',
      price: membershipPrice,
    });
  }

  if (!chips.length) return null;

  const toggle = (id: ChipId) => setActive((cur) => (cur === id ? null : id));
  const panel = chips.find((chip) => chip.id === active);

  return (
    <div className="portal-site-chips w-full">
      <div className="flex w-full items-stretch gap-2" role="tablist" aria-label="Site shortcuts">
        {chips.map((chip) => {
          const isOpen = active === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              role="tab"
              aria-selected={isOpen}
              aria-expanded={isOpen}
              aria-controls={`portal-site-chip-panel-${chip.id}`}
              onClick={() => toggle(chip.id)}
              className="flex flex-1 min-w-0 items-center justify-center gap-1.5 text-meta font-medium px-3 py-1.5 transition-opacity hover:opacity-90"
              style={{
                borderRadius: theme.radius,
                border: isOpen ? `2px solid ${theme.primary}` : `1px solid ${theme.cardBorder}`,
                color: theme.text,
                backgroundColor: isOpen ? theme.cardBg : theme.surfaceMuted,
              }}
            >
              <span style={{ color: theme.primary }}>{chip.icon}</span>
              {chip.label}
              <ChevronDown
                size={14}
                className={cn('shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
                style={{ color: theme.textMuted }}
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      {panel ? (
        <div
          id={`portal-site-chip-panel-${panel.id}`}
          role="tabpanel"
          className="mt-2 p-3 sm:p-3.5 w-full"
          style={{
            borderRadius: theme.radiusLg,
            border: `1px solid ${theme.cardBorder}`,
            backgroundColor: theme.cardBg,
            color: theme.text,
          }}
        >
          <p className="text-body-sm leading-relaxed mb-2" style={{ color: theme.textMuted }}>
            {panel.body}
          </p>
          {panel.price ? (
            <p className="text-body-sm font-semibold tabular-nums mb-2" style={{ color: theme.primary }}>
              {panel.price}
              <span className="text-meta font-normal ml-1.5" style={{ color: theme.textMuted }}>
                / month
              </span>
            </p>
          ) : null}
          <Link
            href={panel.href}
            className="text-meta font-semibold underline-offset-2 hover:underline inline-flex"
            style={{ color: theme.primary }}
          >
            {panel.cta}
          </Link>
        </div>
      ) : null}
    </div>
  );
}

'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Award, ChevronDown, Crown, GitCompare, ShoppingBag } from 'lucide-react';
import { pickReadableForeground } from '@/lib/channel-landing-pages/contrastUtils';
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
  /** Pro final CTA row: mentor + certificates, compare, membership (no store). */
  proFinalRow?: boolean;
  mentorCta?: { label: string; onClick: () => void };
};

type ChipId = 'store' | 'certificates' | 'compare' | 'membership';

type ChipConfig = {
  id: ChipId;
  label: string;
  icon: ReactNode;
  body: string;
  href: string;
  cta: string;
  price?: string;
};

export default function PortalSiteChips({
  page,
  theme,
  includeCompare = false,
  proFinalRow = false,
  mentorCta,
}: Props) {
  const e = page.portalEngagement;
  const { regionId, gccCountry } = useRegion();
  const [active, setActive] = useState<ChipId | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setActive(null), 600);
  }, [clearCloseTimer]);

  const openChip = useCallback(
    (id: ChipId) => {
      clearCloseTimer();
      setActive(id);
    },
    [clearCloseTimer]
  );

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);
  const showStore = e?.showStoreLink !== false;
  const showMembership = e?.showMembershipLink !== false;
  const showCompare = includeCompare || e?.showComparePathways === true;
  const proTier = membershipTiers.find((t) => t.name === 'Professional');
  const proMembership = proTier
    ? getRegionalMembershipAmounts(proTier.monthlyPriceUsd, proTier.yearlyPriceUsd, regionId, gccCountry)
    : null;
  const membershipPrice = proMembership?.monthly?.trim() || 'N/A';

  const chips: ChipConfig[] = [];
  if (proFinalRow) {
    chips.push({
      id: 'certificates',
      label: 'Certificates',
      icon: <Award size={14} aria-hidden />,
      body: 'View PMI, PRINCE2, and Six Sigma pathways with cohort timing and regional tuition on PM Structure.',
      href: '/certifications',
      cta: 'Browse certifications →',
    });
  } else if (showStore) {
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
      body: 'Compare certification pathways side by side: credentials, cohort timing, and regional tuition.',
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

  if (!chips.length && !mentorCta) return null;

  const toggle = (id: ChipId) => setActive((cur) => (cur === id ? null : id));
  const panel = chips.find((chip) => chip.id === active);
  const mentorBg =
    typeof theme.recommendedBg === 'string' && !theme.recommendedBg.includes('gradient')
      ? theme.recommendedBg
      : theme.primary;
  const mentorFg = theme.recommendedText ?? pickReadableForeground(mentorBg);

  return (
    <div
      ref={rootRef}
      className="portal-site-chips w-full flex flex-col gap-3"
      onPointerEnter={clearCloseTimer}
      onPointerLeave={scheduleClose}
    >
      <div
        className="flex w-full items-stretch gap-2"
        role={mentorCta ? 'group' : 'tablist'}
        aria-label={mentorCta ? 'Booking and site shortcuts' : 'Site shortcuts'}
      >
        {mentorCta ? (
          <button
            type="button"
            onClick={mentorCta.onClick}
            className="flex flex-1 min-w-0 items-center justify-center gap-1.5 text-meta font-semibold px-3 py-1.5 transition-opacity hover:opacity-90"
            style={{
              borderRadius: theme.radius,
              border: 'none',
              color: mentorFg,
              backgroundColor: mentorBg,
            }}
          >
            {mentorCta.label}
          </button>
        ) : null}
        {chips.map((chip) => {
          const isOpen = active === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              role={mentorCta ? undefined : 'tab'}
              aria-selected={mentorCta ? undefined : isOpen}
              aria-expanded={isOpen}
              aria-controls={`portal-site-chip-panel-${chip.id}`}
              onClick={() => toggle(chip.id)}
              onPointerEnter={() => openChip(chip.id)}
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
          <p className="text-body-sm leading-relaxed mb-2" style={{ color: theme.text }}>
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

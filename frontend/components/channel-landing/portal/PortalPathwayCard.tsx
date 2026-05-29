'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import type { CertificationSummary } from '@/types/site';
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes';
import { useRegion } from '@/contexts/RegionContext';
import { isEnrollmentOpen, getCohortEnrollmentDisplay } from '@/lib/certification-enrollment';
import { getCertGradientClassName } from '@/lib/brand-visual';
import { getCertDurationLabel, getListingPriceForCert } from '@/lib/regional-catalogue';
import { resolvePricingPresentation } from '@/lib/regional-price-display';
import { cn } from '@/lib/utils';
import PortalMembershipPopout from '@/components/channel-landing/portal/PortalMembershipPopout';

type Props = {
  cert: CertificationSummary;
  theme: PlatformPortalTheme;
  familyLabel?: string;
  title?: string;
  description?: string;
  collapsible?: boolean;
  /** `compact` = side-by-side summary row (for 2-col grids). */
  layout?: 'default' | 'compact';
  className?: string;
};

function MetaChip({
  label,
  children,
  theme,
  highlight,
}: {
  label: string;
  children: React.ReactNode;
  theme: PlatformPortalTheme;
  highlight?: boolean;
}) {
  return (
    <span
      className="inline-flex min-w-[5rem] flex-col gap-0.5 px-3 py-2 text-left"
      style={{
        borderRadius: theme.radius,
        backgroundColor: highlight ? theme.priceBadgeBg : theme.surfaceMuted,
        color: highlight ? theme.priceBadgeText : theme.text,
        border: `1px solid ${theme.cardBorder}`,
      }}
    >
      <span
        className="text-[9px] font-mono uppercase tracking-[0.14em]"
        style={{ color: theme.textMuted }}
      >
        {label}
      </span>
      <span className="text-body-sm font-semibold leading-tight tabular-nums">{children}</span>
    </span>
  );
}

export default function PortalPathwayCard({
  cert,
  theme,
  familyLabel,
  title,
  description,
  collapsible = true,
  layout = 'default',
  className,
}: Props) {
  const isCompact = layout === 'compact';
  const [expanded, setExpanded] = useState(false);
  const { regionId, gccCountry, regionLabel } = useRegion();
  const displayTitle = title ?? cert.name;
  const displayDesc = description ?? cert.desc;
  const badgeLabel = familyLabel ?? cert.familyId;
  const accent = cert.color?.trim() || theme.primary;
  const gradientBar = getCertGradientClassName(cert);
  const { isOpen, badgeText } = getCohortEnrollmentDisplay(cert.id, regionId);
  const listing = getListingPriceForCert(cert.id, regionId, gccCountry);
  const duration = getCertDurationLabel(cert.id);
  const presentation = listing.active
    ? resolvePricingPresentation({
        original: listing.original,
        active: listing.active,
        membership: listing.membership,
        showScholarshipLabels: listing.showScholarshipLabels,
        footnote: listing.footnote,
        regionalLabel: listing.regionalLabel,
      })
    : null;
  const outcomes =
    cert.learningOutcomes?.slice(0, 3) ?? ['Structured study plan', 'Mock exam practice'];
  const ctaLabel = isEnrollmentOpen(cert.id, regionId) ? 'View pathway' : 'View overview';
  const tuitionSummary = listing.active ?? 'N/A';

  const shellStyle = {
    borderRadius: theme.radiusLg,
    border: `1px solid ${theme.cardBorder}`,
    backgroundColor: theme.cardBg,
    boxShadow: `0 2px 12px ${theme.cardBorder}44`,
  };

  const accentBar = gradientBar ? (
    <div className={cn('h-1 w-full shrink-0', gradientBar)} aria-hidden />
  ) : (
    <div className="h-1 w-full shrink-0" style={{ backgroundColor: accent }} aria-hidden />
  );

  if (collapsible) {
    return (
      <article
        className={cn('portal-pathway-card portal-tier-card relative overflow-hidden', className)}
        style={shellStyle}
      >
        {accentBar}
        <button
          type="button"
          className={cn(
            'flex w-full text-left bg-transparent border-0 p-4 sm:p-5',
            isCompact ? 'flex-row items-center gap-3 sm:gap-4' : 'flex-col items-start gap-3',
          )}
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          <div
            className={cn(
              'min-w-0 flex-1',
              isCompact ? 'flex flex-wrap items-center gap-x-2 gap-y-1.5' : 'space-y-2',
            )}
          >
            <span
              className="text-[10px] font-mono uppercase tracking-[0.16em] px-2.5 py-1"
              style={{
                borderRadius: theme.radius,
                backgroundColor: theme.surfaceMuted,
                color: theme.textMuted,
                border: `1px solid ${theme.cardBorder}`,
              }}
            >
              {badgeLabel}
            </span>
            <span
              className="text-[10px] font-mono uppercase tracking-[0.12em] px-2.5 py-1"
              style={{
                borderRadius: theme.radius,
                backgroundColor: isOpen ? theme.primary : theme.surfaceMuted,
                color: isOpen ? theme.primaryForeground : theme.textMuted,
              }}
            >
              {badgeText}
            </span>
            <h4
              className={cn(
                'portal-tier-title leading-snug',
                isCompact ? 'text-body-lg font-semibold w-full sm:w-auto sm:flex-1' : 'text-h4',
              )}
              style={{ color: theme.text, fontFamily: theme.fontFamily }}
            >
              {displayTitle}
            </h4>
            {isCompact ? (
              <p
                className="sm:hidden w-full text-meta flex flex-wrap gap-x-2 gap-y-0.5"
                style={{ color: theme.textMuted }}
              >
                <span>{duration ?? 'Flexible'}</span>
                <span className="font-semibold tabular-nums" style={{ color: theme.text }}>
                  {tuitionSummary}
                </span>
                <span className="text-[10px]">({regionLabel})</span>
              </p>
            ) : null}
            {!isCompact ? (
              <p className="text-meta flex flex-wrap items-center gap-x-3 gap-y-1 w-full" style={{ color: theme.textMuted }}>
                <span>
                  <span className="uppercase tracking-wider text-[10px]">{duration ?? 'Flexible'}</span>
                  {' · '}
                  <span className="font-semibold tabular-nums" style={{ color: theme.text }}>
                    {tuitionSummary}
                  </span>
                </span>
                <span className="text-[10px] opacity-80">({regionLabel})</span>
              </p>
            ) : null}
          </div>
          {isCompact ? (
            <div
              className="hidden sm:flex flex-col items-end shrink-0 text-right gap-0.5 px-1"
              style={{ color: theme.textMuted }}
            >
              <span className="text-[10px] uppercase tracking-wider">{duration ?? 'Flexible'}</span>
              <span className="text-body-sm font-semibold tabular-nums" style={{ color: theme.text }}>
                {tuitionSummary}
              </span>
              <span className="text-[10px] opacity-80">{regionLabel}</span>
            </div>
          ) : null}
          <ChevronDown
            size={20}
            className="shrink-0 transition-transform duration-200"
            style={{
              color: theme.textMuted,
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
            aria-hidden
          />
        </button>

        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-out border-t',
            expanded ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0',
          )}
          style={{ borderColor: theme.cardBorder }}
        >
          <div className="p-4 sm:p-5 pt-3 space-y-3">
            <p
              className="text-meta leading-snug px-3 py-2"
              style={{
                borderRadius: theme.radius,
                border: `1px solid ${theme.cardBorder}`,
                backgroundColor: theme.surfaceMuted,
                color: theme.text,
              }}
            >
              {cert.outputValue}
            </p>
            <p className="text-body-sm leading-relaxed" style={{ color: theme.textMuted }}>
              {displayDesc}
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              <MetaChip label="Prep time" theme={theme}>
                {duration ?? 'Flexible'}
              </MetaChip>
              <MetaChip label="Tuition" theme={theme} highlight={presentation?.kind === 'scholarship'}>
                {tuitionSummary}
              </MetaChip>
              {listing.membership ? (
                <PortalMembershipPopout theme={theme} membershipPrice={listing.membership} />
              ) : null}
            </div>
            <ul className="space-y-2">
              {outcomes.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-meta leading-snug"
                  style={{ color: theme.textMuted }}
                >
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: accent }} aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href={`/certifications/${cert.id}`} className="block w-full">
              <span
                className="flex w-full items-center justify-center px-4 py-2.5 text-body-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  borderRadius: theme.radius,
                  background: theme.primary,
                  color: theme.primaryForeground,
                }}
              >
                {ctaLabel}
              </span>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        'portal-pathway-card portal-tier-card relative flex h-full flex-col p-5 sm:p-6 transition-shadow hover:shadow-md',
        className,
      )}
      style={shellStyle}
    >
      <div className="absolute inset-x-0 top-0">{accentBar}</div>
      <div className="portal-pathway-body flex flex-1 flex-col gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-block text-[10px] font-mono uppercase tracking-[0.16em] px-2.5 py-1"
            style={{
              borderRadius: theme.radius,
              backgroundColor: theme.surfaceMuted,
              color: theme.textMuted,
              border: `1px solid ${theme.cardBorder}`,
            }}
          >
            {badgeLabel}
          </span>
          <span
            className="inline-block text-[10px] font-mono uppercase tracking-[0.12em] px-2.5 py-1"
            style={{
              borderRadius: theme.radius,
              backgroundColor: isOpen ? theme.primary : theme.surfaceMuted,
              color: isOpen ? theme.primaryForeground : theme.textMuted,
            }}
          >
            {badgeText}
          </span>
        </div>
        <h4 className="portal-tier-title text-h4 leading-snug" style={{ color: theme.text, fontFamily: theme.fontFamily }}>
          {displayTitle}
        </h4>
        <p
          className="text-meta leading-snug px-3 py-2"
          style={{
            borderRadius: theme.radius,
            border: `1px solid ${theme.cardBorder}`,
            backgroundColor: theme.surfaceMuted,
            color: theme.text,
          }}
        >
          {cert.outputValue}
        </p>
        <p className="portal-tier-desc text-body-sm leading-relaxed line-clamp-3" style={{ color: theme.textMuted }}>
          {displayDesc}
        </p>
        <div className="portal-pathway-meta flex flex-wrap gap-2 items-center">
          <MetaChip label="Prep time" theme={theme}>
            {duration ?? 'Flexible'}
          </MetaChip>
          <MetaChip label="Tuition" theme={theme} highlight={presentation?.kind === 'scholarship'}>
            {tuitionSummary}
          </MetaChip>
          {listing.membership ? (
            <PortalMembershipPopout theme={theme} membershipPrice={listing.membership} />
          ) : null}
        </div>
        <ul className="space-y-2">
          {outcomes.map((item) => (
            <li key={item} className="flex items-start gap-2 text-meta leading-snug" style={{ color: theme.textMuted }}>
              <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: accent }} aria-hidden />
              <span className="line-clamp-2">{item}</span>
            </li>
          ))}
        </ul>
        <div className="portal-pathway-footer mt-auto pt-2">
          <Link href={`/certifications/${cert.id}`} className="block w-full">
            <span
              className="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-body-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                borderRadius: theme.radius,
                background: theme.primary,
                color: theme.primaryForeground,
              }}
            >
              {ctaLabel}
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}

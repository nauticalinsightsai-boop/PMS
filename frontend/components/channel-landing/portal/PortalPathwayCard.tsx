'use client';

import { useEffect, useRef } from 'react';
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
import { portalSpacing } from '@/lib/channel-landing-pages/portalSpacing';
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
  /** Disclosure state is owned by the containing pathway section. */
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
};

export type PortalPathwayCardDetailsProps = {
  cert: CertificationSummary;
  theme: PlatformPortalTheme;
  description?: string;
  duration: string | null;
  tuitionSummary: string;
  presentation: ReturnType<typeof resolvePricingPresentation> | null;
  listingMembership?: string;
  outcomes: string[];
  accent: string;
  ctaLabel?: string;
};

export function PortalPathwayCardDetails({
  cert,
  theme,
  description,
  duration,
  tuitionSummary,
  presentation,
  listingMembership,
  outcomes,
  accent,
  ctaLabel,
}: PortalPathwayCardDetailsProps) {
  const displayDesc = description ?? cert.desc;

  return (
    <div
      className="portal-pathway-details flex flex-1 flex-col gap-3 p-4 sm:p-5 pt-3"
      style={{ color: theme.text }}
    >
      <p
        className={`${portalSpacing.detailMeta} px-3 py-2 min-h-[2.75rem]`}
        style={{
          borderRadius: theme.radius,
          border: `1px solid ${theme.cardBorder}`,
          backgroundColor: theme.surfaceMuted,
          color: theme.text,
        }}
      >
        {cert.outputValue}
      </p>
      <p
        className={`${portalSpacing.detailBody} min-h-[2.75rem]`}
        style={{ color: theme.textMuted }}
      >
        {displayDesc}
      </p>
      {/* Grid (not flex-row): Membership panel uses contents+col-span-full as a full-width row below chips. */}
      <div className="portal-pathway-meta-chip-row grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-3 sm:items-stretch">
        <MetaChip label="Prep time" theme={theme}>
          {duration ?? 'Flexible'}
        </MetaChip>
        <MetaChip label="Tuition" theme={theme} highlight={presentation?.kind === 'scholarship'}>
          {tuitionSummary}
        </MetaChip>
        {listingMembership ? (
          <PortalMembershipPopout
            theme={theme}
            membershipPrice={listingMembership}
            variant="chip"
            placement="inline"
          />
        ) : null}
      </div>
      <ul className="space-y-2 min-h-[6.5rem] flex-1">
        {outcomes.map((item) => (
          <li
            key={item}
            className={`flex items-start gap-2 ${portalSpacing.detailMeta}`}
            style={{ color: theme.textMuted }}
          >
            <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: accent }} aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {ctaLabel ? (
        <Link href={`/certifications/${cert.id}`} prefetch={false} className="mt-auto block w-full">
          <span
            className="flex min-h-11 w-full items-center justify-center px-4 py-2.5 text-body-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              borderRadius: theme.radius,
              background: theme.primary,
              color: theme.primaryForeground,
            }}
          >
            {ctaLabel}
          </span>
        </Link>
      ) : null}
    </div>
  );
}

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
      className={portalSpacing.metaChip}
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
      <span
        className={portalSpacing.detailValue}
        style={{ color: highlight ? theme.priceBadgeText : theme.text }}
      >
        {children}
      </span>
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
  expanded: expandedProp,
  onExpandedChange,
}: Props) {
  const isCompact = layout === 'compact';
  const expanded = expandedProp;
  const setExpanded = onExpandedChange;
  const { regionId, gccCountry, regionLabel } = useRegion();
  const displayTitle = title ?? cert.name;
  const displayDesc = description ?? cert.desc;
  const badgeLabel = familyLabel ?? cert.familyId;
  const accent = cert.color?.trim() || theme.primary;
  const gradientBar = getCertGradientClassName(cert);
  const { isOpen, nextCohortLabel } = getCohortEnrollmentDisplay(cert.id, regionId);
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
  const durationTuition = `${duration ?? 'Flexible'} · ${tuitionSummary}`;
  const panelId = `portal-pathway-panel-${cert.id}`;
  const titleId = `portal-pathway-title-${cert.id}`;
  const detailsButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded) panelRef.current?.focus();
  }, [expanded]);

  const closeDetails = () => {
    setExpanded(false);
    requestAnimationFrame(() => detailsButtonRef.current?.focus());
  };

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
        className={cn('portal-pathway-card portal-tier-card relative flex flex-col overflow-hidden', className)}
        style={shellStyle}
      >
        {accentBar}
        <div
          className={cn(
            'flex w-full min-w-0 flex-col gap-3',
            isCompact ? portalSpacing.pathwaySummary : 'p-4 sm:p-5',
          )}
        >
          <div
            className={cn(
              'min-w-0 flex-1',
              isCompact
                ? 'flex flex-wrap sm:flex-nowrap items-center gap-x-2 gap-y-1.5'
                : 'space-y-2',
            )}
          >
            <span
              className="inline-block shrink-0 text-[10px] font-mono uppercase tracking-[0.16em] px-2.5 py-1"
              style={{
                borderRadius: theme.radius,
                backgroundColor: theme.surfaceMuted,
                color: theme.textMuted,
                border: `1px solid ${theme.cardBorder}`,
              }}
            >
              {badgeLabel}
            </span>
            <h4
              id={titleId}
              className={cn(
                'portal-tier-title leading-snug font-semibold',
                isCompact ? 'shrink-0 text-body-lg' : 'text-h4',
              )}
              style={{ color: theme.text, fontFamily: theme.fontFamily }}
            >
              {displayTitle}
            </h4>
            <span
              className="shrink-0 text-[10px] font-mono uppercase tracking-[0.12em] px-2.5 py-1"
              style={{
                borderRadius: theme.radius,
                backgroundColor: isOpen ? theme.primary : theme.surfaceMuted,
                color: isOpen ? theme.primaryForeground : theme.textMuted,
              }}
            >
              {nextCohortLabel}
            </span>
            <p
              className={cn(
                'text-meta min-w-0',
                isCompact ? 'w-full sm:w-auto sm:ml-auto' : 'w-full',
              )}
              style={{ color: theme.textMuted }}
            >
              <span className="font-semibold tabular-nums" style={{ color: theme.text }}>
                {durationTuition}
              </span>
              {!isCompact ? (
                <span className="text-[10px] opacity-80 ml-2">({regionLabel})</span>
              ) : null}
            </p>
          </div>

          {!expanded ? (
            <button
              ref={detailsButtonRef}
              data-pathway-details={cert.id}
              type="button"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 border px-4 py-2.5 text-body-sm font-semibold transition-opacity hover:opacity-90"
              style={{ borderRadius: theme.radius, borderColor: theme.cardBorder, backgroundColor: theme.surfaceMuted, color: theme.text }}
              onClick={() => setExpanded(true)}
              aria-expanded={false}
              aria-controls={panelId}
            >
              Details
              <ChevronDown size={18} className="shrink-0" style={{ color: theme.textMuted }} aria-hidden />
            </button>
          ) : null}
        </div>

        {expanded ? (
          <div
            ref={panelRef}
            data-pathway-region={cert.id}
            id={panelId}
            role="region"
            aria-labelledby={titleId}
            tabIndex={-1}
            onKeyDown={(event) => {
              if (event.key === 'Escape') closeDetails();
            }}
            className="border-t"
            style={{ borderColor: theme.cardBorder }}
          >
            <PortalPathwayCardDetails
              cert={cert}
              theme={theme}
              description={description}
              duration={duration}
              tuitionSummary={tuitionSummary}
              presentation={presentation}
              listingMembership={listing.membership}
              outcomes={outcomes}
              accent={accent}
              ctaLabel={ctaLabel}
            />
          </div>
        ) : null}
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
            {nextCohortLabel}
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
        <div className="portal-pathway-meta portal-pathway-meta-chip-row grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-3 sm:items-stretch">
          <MetaChip label="Prep time" theme={theme}>
            {duration ?? 'Flexible'}
          </MetaChip>
          <MetaChip label="Tuition" theme={theme} highlight={presentation?.kind === 'scholarship'}>
            {tuitionSummary}
          </MetaChip>
          {listing.membership ? (
            <PortalMembershipPopout
              theme={theme}
              membershipPrice={listing.membership}
              variant="chip"
              placement="inline"
            />
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
              className="flex min-h-11 w-full items-center justify-center gap-2 px-4 py-2.5 text-body-sm font-semibold transition-opacity hover:opacity-90"
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

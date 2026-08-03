'use client';

import Link from 'next/link';
import * as React from 'react';
import { CheckCircle2, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { StatChip } from '@/components/ui/stat-chip';
import { MembershipPriceChip } from '@/components/MembershipPriceChip';
import { CertificationPathwayVisual } from '@/components/CertificationPathwayVisual';
import { PathwayEnrollmentBadge } from '@/components/PathwayEnrollmentBadge';
import { WebsiteCalendlyButton } from '@/components/calendly/WebsiteCalendlyButton';
import { isRoadmapSchedulingHref } from '@/lib/pmp-roadmap-cta';
import { trackRoadmapCtaClick } from '@/lib/analytics/track-roadmap-cta';
import {
  buildFeaturedCardWaitlistContext,
  isWaitlistContactHref,
} from '@/lib/waitlist-contact-href';
import {
  JoinWaitlistDialog,
  type JoinWaitlistContext,
} from '@/components/forms/JoinWaitlistDialog';
import { cn } from '@/lib/utils';
import { useRegion } from '@/contexts/RegionContext';
import { isEnrollmentOpen } from '@/lib/certification-enrollment';
import { REGION_COPY } from '@/lib/brand-voice';
import { getCertGradientClassName, PATHWAY_CARD_RADIUS_CLASS, PATHWAY_FEATURED_CARD_CLASS, PATHWAY_FEATURED_MOBILE_HEADER_CLASS, PATHWAY_MOBILE_CARD_SHELL_CLASS } from '@/lib/brand-visual';
import { resolvePricingPresentation } from '@/lib/regional-price-display';
import { getCertDurationLabel, getListingPriceForCert } from '@/lib/regional-catalogue';
import type { CertificationSummary } from '@/types/site';
import type { RegionId } from '@/types/regional-catalogue';

/** Prep time, tuition, and membership: three aligned chips from the same listing tier. */
function PathwayFeaturedPricingChips({
  certId,
  nonInteractiveMembership = false,
}: {
  certId: string;
  /** Flagship desktop cards reserve their sole action for the pathway CTA. */
  nonInteractiveMembership?: boolean;
}) {
  const { regionId, gccCountry } = useRegion();
  const listing = getListingPriceForCert(certId, regionId, gccCountry);
  const duration = getCertDurationLabel(certId) ?? undefined;

  if (!duration && !listing.active) return null;

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

  const showGlobalReference =
    Boolean(presentation?.showGlobalReference && listing.original);
  const showMembership = Boolean(listing.membership?.trim());

  return (
    <div className="mb-0 flex shrink-0 flex-col space-y-2">
      <div
        className={cn(
          'grid items-stretch gap-1.5 overflow-visible max-md:min-h-[4.25rem] sm:gap-2 sm:min-h-[5rem]',
          showMembership ? 'grid-cols-3' : 'grid-cols-2',
        )}
      >
        <StatChip
          label="Prep time"
          className="h-full min-h-[4.25rem] px-1.5 py-1.5 sm:min-h-[5rem] sm:px-2.5"
        >
          <p className="text-xs font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-sm">
            {duration ?? 'Flexible'}
          </p>
        </StatChip>

        <StatChip
          label="Tuition"
          subtitle={
            presentation?.kind === 'scholarship' ? REGION_COPY.scholarshipChipSubtitle : undefined
          }
          className="h-full min-h-[4.25rem] px-1.5 py-1.5 sm:min-h-[5rem] sm:px-2.5"
        >
          {listing.active ? (
            <p
              className={cn(
                'text-xs font-extrabold leading-tight tracking-tight sm:text-sm',
                presentation?.kind === 'scholarship'
                  ? 'text-brand-orange'
                  : 'text-slate-900 dark:text-white',
              )}
            >
              {listing.active}
            </p>
          ) : (
            <p className="text-xs font-extrabold text-slate-400 sm:text-sm">: </p>
          )}
        </StatChip>

        {showMembership ? (
          nonInteractiveMembership ? (
            <StatChip
              label={REGION_COPY.membershipChipLabel}
              className="h-full min-h-[4.25rem] px-1 py-1.5 sm:min-h-[5rem] sm:px-2.5"
            >
              <p className="text-xs font-extrabold leading-tight tracking-tight text-brand-purple sm:text-sm">
                {listing.membership?.trim()}
              </p>
            </StatChip>
          ) : (
            <MembershipPriceChip
              price={listing.membership}
              className="h-full min-h-[4.25rem] px-1.5 py-1.5 sm:min-h-[5rem] sm:px-2.5"
            />
          )
        ) : null}
      </div>

      {showGlobalReference && listing.original ? (
        <div
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-center dark:border-slate-700 dark:bg-slate-950/40"
          aria-label={`${presentation!.globalReferenceLabel} ${listing.original}`}
        >
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {presentation!.globalReferenceLabel}
          </span>
          <span className="text-xs font-bold text-slate-600 line-through decoration-slate-400 dark:text-slate-300 dark:decoration-slate-500">
            {listing.original}
          </span>
        </div>
      ) : null}
    </div>
  );
}

export interface PathwayFeaturedCardProps {
  cert: CertificationSummary;
  /** Badge label (Home uses featured.family, e.g. PMI) */
  familyLabel?: string;
  /** Override family badge (e.g. Featured Pathway) */
  badgeLabel?: string;
  title?: string;
  description?: string;
  /** Shown under description (e.g. PMP exam date line) */
  metaLine?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Shown under the icon in the visual header */
  visualSubtitle?: string;
  /** `visual` = gradient image header (Home). `catalog` = listing card, no image (Certifications). */
  layout?: 'visual' | 'catalog';
  className?: string;
  /** Certifications flagship cards: always show pricing/outcomes + CTA (like the hero form). */
  desktopFlagshipOpen?: boolean;
  /**
   * Optional disclosure for non-flagship catalog cards.
   * Visual (Home) and flagship catalog (`desktopFlagshipOpen`) ignore these.
   */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

const featuredCardShell = cn(
  'group/pathway flex flex-col gap-0 border border-slate-100 dark:border-slate-800 py-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-900 overflow-hidden',
  PATHWAY_CARD_RADIUS_CLASS,
  PATHWAY_MOBILE_CARD_SHELL_CLASS,
  PATHWAY_FEATURED_CARD_CLASS,
);

const featuredCardHeaderClass = cn('p-4 pb-0 md:p-5', PATHWAY_FEATURED_MOBILE_HEADER_CLASS);
const featuredCardBodyClass =
  'flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4 pt-0 md:gap-4 md:px-5 md:pb-5';
const featuredCardFooterClass =
  'mt-auto flex w-full shrink-0 items-center justify-center border-t border-border bg-muted/50 px-4 pb-4 pt-4 md:px-5 md:pb-5 md:pt-6 [&>*]:w-full';
const featuredCardTitleClass =
  'mb-2 text-xl font-bold leading-tight tracking-tight max-md:line-clamp-2 max-md:min-h-[3.25rem] md:mb-3 md:min-h-0 md:text-2xl';
const featuredCardOutputClass =
  'mb-3 flex items-center justify-center gap-2 rounded-lg border border-brand-orange/10 bg-brand-orange/5 p-2 text-center max-md:min-h-[2.75rem] md:mb-4 md:min-h-0 md:rounded-xl md:p-2.5';
const featuredCardDescClass =
  'text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400 max-md:line-clamp-3 max-md:min-h-[4.5rem] md:min-h-0';
const featuredCardMetaClass =
  'mt-3 text-xs font-semibold leading-snug text-brand-purple dark:text-brand-purple/90 max-md:min-h-[1.25rem] md:min-h-0';
const featuredCardOutcomesClass =
  'space-y-2 max-md:min-h-[4.25rem] md:min-h-[4.5rem] md:space-y-3';
const featuredCardCtaClass =
  'w-full max-w-none h-11 rounded-xl font-bold text-sm text-white border-transparent shadow-md hover:opacity-90 md:h-12 md:rounded-2xl md:text-base';

function certAccentColor(cert: CertificationSummary): string | undefined {
  return cert.color?.trim() || undefined;
}

function PathwayCardCta({
  certId,
  certName,
  regionId,
  accentColor,
  ctaLabel,
  ctaHref,
}: {
  certId: string;
  certName?: string;
  regionId: RegionId;
  accentColor?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const label =
    ctaLabel ?? (isEnrollmentOpen(certId, regionId) ? 'View pathway' : 'View overview');
  const href = ctaHref ?? `/certifications/${certId}`;
  const pathwayAriaLabel = certName
    ? `${label} for ${certName}`
    : `${label} for ${certId.toUpperCase()}`;
  const btnClass = featuredCardCtaClass;
  const [waitlistOpen, setWaitlistOpen] = React.useState(false);
  const waitlistContext = React.useMemo<JoinWaitlistContext | null>(() => {
    if (!isWaitlistContactHref(href)) return null;
    return buildFeaturedCardWaitlistContext(certId, label, href);
  }, [certId, href, label]);

  if (isRoadmapSchedulingHref(href)) {
    return (
      <WebsiteCalendlyButton
        tier="discovery"
        funnelLabel={`featured_card_${certId}`}
        utm={{
          utm_source: 'pmstructure',
          utm_medium: 'featured_card',
          utm_campaign: certId,
        }}
        onBeforeOpen={() => trackRoadmapCtaClick({ ctaText: label, ctaLocation: 'body' })}
        className={cn(
          btnClass,
          'flex w-full',
          accentColor ? '' : 'bg-brand-orange hover:bg-brand-hover',
        )}
        style={accentColor ? { backgroundColor: accentColor } : undefined}
      >
        {label}
      </WebsiteCalendlyButton>
    );
  }

  if (waitlistContext) {
    return (
      <>
        <Button
          type="button"
          onClick={() => setWaitlistOpen(true)}
          variant={accentColor ? 'default' : 'brand'}
          className={cn(btnClass, 'flex w-full')}
          style={accentColor ? { backgroundColor: accentColor } : undefined}
        >
          {label}
        </Button>
        <JoinWaitlistDialog
          open={waitlistOpen}
          onOpenChange={setWaitlistOpen}
          context={waitlistContext}
        />
      </>
    );
  }

  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={pathwayAriaLabel}
      className={cn(
        buttonVariants({ variant: accentColor ? 'default' : 'brand' }),
        btnClass,
        'flex w-full',
      )}
      style={accentColor ? { backgroundColor: accentColor } : undefined}
    >
      {label}
    </Link>
  );
}

/** Home: featured card with gradient visual header — details + CTA always open (no expand). */
function PathwayFeaturedVisualCard({
  cert,
  familyLabel,
  badgeLabel,
  title,
  description,
  metaLine,
  ctaLabel,
  ctaHref,
  visualSubtitle,
  className,
}: PathwayFeaturedCardProps) {
  const { regionId } = useRegion();
  const displayTitle = title ?? cert.name;
  const displayDesc = description ?? cert.desc;
  const familyBadge = badgeLabel ?? familyLabel ?? cert.familyId;
  const subtitle = visualSubtitle ?? displayTitle;
  const outcomes =
    cert.learningOutcomes?.slice(0, 3) ?? [
      'Structured study plan',
      'Mock exam practice',
      'Weak-area tracking',
    ];

  return (
    <Card className={cn(featuredCardShell, className)}>
      <CertificationPathwayVisual cert={cert} subtitle={subtitle} />
      <CardHeader className={featuredCardHeaderClass}>
        <div className="mb-2 flex flex-wrap items-center justify-start gap-2 md:mb-3">
          <Badge className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none text-[10px] font-bold px-3 py-1 text-center">
            {familyBadge}
          </Badge>
          <PathwayEnrollmentBadge certId={cert.id} />
        </div>
        <CardTitle className={featuredCardTitleClass}>{displayTitle}</CardTitle>
        <div className={featuredCardOutputClass}>
          <Zap className="h-3 w-3 shrink-0 text-brand-orange" />
          <span className="line-clamp-2 text-[10px] font-bold uppercase leading-snug tracking-tight text-slate-700 dark:text-slate-300">
            {cert.outputValue}
          </span>
        </div>
        <div className="flex flex-col pb-3 md:pb-4">
          <p className={featuredCardDescClass}>{displayDesc}</p>
          <p className={cn(featuredCardMetaClass, !metaLine && 'md:hidden')}>{metaLine ?? '\u00A0'}</p>
        </div>
      </CardHeader>
      <div data-pathway-region={cert.id} role="region" aria-label={`${displayTitle} pathway details`} className="flex min-h-0 flex-1 flex-col">
        <CardContent className={featuredCardBodyClass}>
          <PathwayFeaturedPricingChips certId={cert.id} />
          <ul className={cn(featuredCardOutcomesClass, 'flex-1')}>
            {outcomes.map((item) => (
              <li key={item} className="flex min-h-5 items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="mr-2 h-3 w-3 shrink-0 text-brand-orange" />
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </div>
      <CardFooter className={featuredCardFooterClass}>
        <PathwayCardCta certId={cert.id} certName={displayTitle} regionId={regionId} ctaLabel={ctaLabel} ctaHref={ctaHref} />
      </CardFooter>
    </Card>
  );
}

/** Certifications listing: catalog card with cert-colored accents, no visual header */
function PathwayFeaturedCatalogCard({
  cert,
  familyLabel,
  title,
  description,
  className,
  desktopFlagshipOpen = false,
  expanded = false,
  onExpandedChange,
}: PathwayFeaturedCardProps) {
  const detailsButtonRef = React.useRef<HTMLButtonElement>(null);
  const detailsRegionRef = React.useRef<HTMLDivElement>(null);
  /** Flagship catalog cards mirror the hero form: all details stay visible (no expand). */
  const alwaysOpen = desktopFlagshipOpen;
  const showDetails = alwaysOpen || expanded;
  React.useEffect(() => {
    if (expanded && !alwaysOpen) detailsRegionRef.current?.focus();
  }, [expanded, alwaysOpen]);
  const { regionId } = useRegion();
  const displayTitle = title ?? cert.name;
  const displayDesc = description ?? cert.desc;
  const badgeLabel = familyLabel ?? cert.familyId;
  const accent = certAccentColor(cert);
  const gradientBar = getCertGradientClassName(cert);
  const outcomes =
    cert.learningOutcomes?.slice(0, 3) ?? [
      'Structured study plan',
      'Mock exam practice',
      'Weak-area tracking',
    ];
  const setExpanded = onExpandedChange ?? (() => undefined);

  return (
    <Card
      className={cn(featuredCardShell, className)}
      onKeyDown={(event) => {
        if (!alwaysOpen && expanded && event.key === 'Escape') {
          setExpanded(false);
          requestAnimationFrame(() => detailsButtonRef.current?.focus());
        }
      }}
    >
      {gradientBar ? (
        <div className="h-1.5 w-full shrink-0" aria-hidden>
          <div className={cn('h-full w-full', gradientBar)} />
        </div>
      ) : accent ? (
        <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: accent }} aria-hidden />
      ) : null}
      <CardHeader className={featuredCardHeaderClass}>
        <div className="mb-2 flex flex-wrap items-center justify-start gap-2 md:mb-3">
          <Badge className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none text-[10px] font-bold px-3 py-1 text-center">
            {badgeLabel}
          </Badge>
          <PathwayEnrollmentBadge certId={cert.id} />
        </div>
        <CardTitle className={featuredCardTitleClass}>{displayTitle}</CardTitle>
        <div
          className={cn(
            featuredCardOutputClass,
            !accent && 'border-brand-orange/10 bg-brand-orange/5',
          )}
          style={
            accent
              ? { backgroundColor: `${accent}12`, borderColor: `${accent}28` }
              : undefined
          }
        >
          <Zap
            className={cn('h-3 w-3 shrink-0', !accent && 'text-brand-orange')}
            style={accent ? { color: accent } : undefined}
          />
          <span className="line-clamp-2 text-[10px] font-bold uppercase leading-snug tracking-tight text-slate-700 dark:text-slate-300">
            {cert.outputValue}
          </span>
        </div>
        <div className="flex flex-col pb-3 md:pb-4">
          <CardDescription className={featuredCardDescClass}>{displayDesc}</CardDescription>
          <p className={cn(featuredCardMetaClass, 'max-md:opacity-0 md:hidden')} aria-hidden>
            {'\u00A0'}
          </p>
        </div>
      </CardHeader>
      {showDetails ? (
        <div
          ref={detailsRegionRef}
          data-pathway-region={cert.id}
          role="region"
          aria-label={`${displayTitle} pathway details`}
          tabIndex={alwaysOpen ? undefined : -1}
          className="flex min-h-0 flex-1 flex-col"
        >
          <CardContent className={featuredCardBodyClass}>
            <PathwayFeaturedPricingChips certId={cert.id} nonInteractiveMembership={alwaysOpen} />
            <ul className={cn(featuredCardOutcomesClass, 'flex-1')}>
              {outcomes.map((item) => (
                <li key={item} className="flex min-h-5 items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className={cn('h-3 w-3 mr-2 shrink-0', !accent && 'text-brand-orange')} style={accent ? { color: accent } : undefined} />
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </div>
      ) : null}
      <CardFooter className={featuredCardFooterClass}>
        {alwaysOpen ? (
          <PathwayCardCta
            certId={cert.id}
            certName={displayTitle}
            regionId={regionId}
            accentColor={accent}
            ctaLabel="View pathway"
          />
        ) : expanded ? (
          <PathwayCardCta certId={cert.id} certName={displayTitle} regionId={regionId} accentColor={accent} />
        ) : (
          <Button ref={detailsButtonRef} data-pathway-details={cert.id} type="button" variant="outline" className={featuredCardCtaClass} onClick={() => setExpanded(true)}>
            Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function PathwayFeaturedCard(props: PathwayFeaturedCardProps) {
  const layout = props.layout ?? 'visual';

  if (layout === 'catalog') {
    return <PathwayFeaturedCatalogCard {...props} />;
  }

  return <PathwayFeaturedVisualCard {...props} />;
}

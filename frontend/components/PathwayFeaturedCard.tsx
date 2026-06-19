'use client';

import Link from 'next/link';
import * as React from 'react';
import { CheckCircle2, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { getCertGradientClassName } from '@/lib/brand-visual';
import { resolvePricingPresentation } from '@/lib/regional-price-display';
import { getCertDurationLabel, getListingPriceForCert } from '@/lib/regional-catalogue';
import type { CertificationSummary } from '@/types/site';
import type { RegionId } from '@/types/regional-catalogue';

function ClampedText({
  text,
  className,
  clampClassName = 'line-clamp-3',
}: {
  text: string;
  className?: string;
  clampClassName?: string;
}) {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = React.useState(false);
  const [overflows, setOverflows] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || expanded) return;
    setOverflows(el.scrollHeight > el.clientHeight + 1);
  }, [text, expanded, clampClassName]);

  return (
    <div>
      <p
        ref={ref}
        className={cn(className, !expanded && clampClassName)}
      >
        {text}
      </p>
      {overflows && !expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-1 text-xs font-bold text-brand-orange hover:underline"
        >
          Show more
        </button>
      ) : null}
    </div>
  );
}

/** Prep time, tuition, and membership: three aligned chips from the same listing tier. */
function PathwayFeaturedPricingChips({ certId }: { certId: string }) {
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

  return (
    <div className="mb-0 flex flex-col space-y-2">
      <div className="grid grid-cols-2 items-stretch gap-1.5 overflow-visible sm:grid-cols-3 sm:gap-2">
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

        <MembershipPriceChip
          price={listing.membership}
          className="hidden h-full min-h-[4.25rem] px-1 py-1.5 sm:flex sm:min-h-[5rem] sm:px-2.5"
        />
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
}

const featuredCardShell =
  'group/pathway h-full flex flex-col gap-0 border border-slate-100 dark:border-slate-800 py-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden';

/** Three outcome rows at equal height across cards. */
const PATHWAY_FEATURED_OUTCOMES_MIN_H = 'min-h-[4.5rem]';

function certAccentColor(cert: CertificationSummary): string | undefined {
  return cert.color?.trim() || undefined;
}

function PathwayCardCta({
  certId,
  regionId,
  accentColor,
  ctaLabel,
  ctaHref,
}: {
  certId: string;
  regionId: RegionId;
  accentColor?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const label =
    ctaLabel ?? (isEnrollmentOpen(certId, regionId) ? 'View pathway' : 'View overview');
  const href = ctaHref ?? `/certifications/${certId}`;
  const btnClass =
    'w-full h-12 rounded-2xl font-bold text-base text-white border-transparent shadow-md hover:opacity-90';
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
          className={btnClass}
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
    <Link href={href} className="w-full">
      <Button
        variant={accentColor ? 'default' : 'brand'}
        className={btnClass}
        style={accentColor ? { backgroundColor: accentColor } : undefined}
      >
        {label}
      </Button>
    </Link>
  );
}

/** Home: original featured card with gradient visual header and brand accents */
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
      <CardHeader className="p-5 pb-0">
        <div className="flex flex-wrap items-center justify-start gap-2 mb-3">
          <Badge className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none text-[10px] font-bold px-3 py-1 text-center">
            {familyBadge}
          </Badge>
          <PathwayEnrollmentBadge certId={cert.id} />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight mb-3 leading-tight">{displayTitle}</CardTitle>
        <div className="flex items-center justify-center gap-2 mb-4 p-2.5 rounded-xl bg-brand-orange/5 border border-brand-orange/10 text-center">
          <Zap className="h-3 w-3 text-brand-orange shrink-0" />
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight leading-snug">
            {cert.outputValue}
          </span>
        </div>
        <div className="flex flex-col">
          <ClampedText
            text={displayDesc}
            className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed"
          />
          {metaLine ? (
            <ClampedText
              text={metaLine}
              className="mt-3 text-xs font-semibold text-brand-purple dark:text-brand-purple/90 leading-snug"
              clampClassName="line-clamp-2"
            />
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-5 pb-5 pt-0">
        <PathwayFeaturedPricingChips certId={cert.id} />
        <ul className={cn(PATHWAY_FEATURED_OUTCOMES_MIN_H, 'space-y-3')}>
          {outcomes.map((item) => (
            <li
              key={item}
              className="flex min-h-5 items-center text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              <CheckCircle2 className="h-3 w-3 mr-2 text-brand-orange shrink-0" />
              <span className="line-clamp-1">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="border-t border-border bg-muted/50 px-5 pb-5 pt-6">
        <PathwayCardCta
          certId={cert.id}
          regionId={regionId}
          ctaLabel={ctaLabel}
          ctaHref={ctaHref}
        />
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
}: PathwayFeaturedCardProps) {
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

  return (
    <Card className={cn(featuredCardShell, className)}>
      {gradientBar ? (
        <div className="h-1.5 w-full shrink-0" aria-hidden>
          <div className={cn('h-full w-full', gradientBar)} />
        </div>
      ) : accent ? (
        <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: accent }} aria-hidden />
      ) : null}
      <CardHeader className="p-5 pb-0">
        <div className="flex flex-wrap items-center justify-start gap-2 mb-3">
          <Badge className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none text-[10px] font-bold px-3 py-1 text-center">
            {badgeLabel}
          </Badge>
          <PathwayEnrollmentBadge certId={cert.id} />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight mb-3 leading-tight">{displayTitle}</CardTitle>
        <div
          className={cn(
            'flex items-center justify-center gap-2 mb-4 p-2.5 rounded-xl border text-center',
            !accent && 'bg-brand-orange/5 border-brand-orange/10',
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
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight leading-snug">
            {cert.outputValue}
          </span>
        </div>
        <div className="flex flex-col">
          <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {displayDesc}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 px-5 pb-5 pt-0">
        <PathwayFeaturedPricingChips certId={cert.id} />
        <ul className={cn(PATHWAY_FEATURED_OUTCOMES_MIN_H, 'space-y-3')}>
          {outcomes.map((item) => (
            <li
              key={item}
              className="flex min-h-5 items-center text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              <CheckCircle2
                className={cn('h-3 w-3 mr-2 shrink-0', !accent && 'text-brand-orange')}
                style={accent ? { color: accent } : undefined}
              />
              <span className="line-clamp-1">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="border-t border-border bg-muted/50 px-5 pb-5 pt-6">
        <PathwayCardCta certId={cert.id} regionId={regionId} accentColor={accent} />
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
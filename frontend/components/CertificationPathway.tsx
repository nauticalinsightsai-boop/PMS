'use client';

import * as React from 'react';
import Link from 'next/link';
import { m } from 'motion/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatChip } from '@/components/ui/stat-chip';
import { MembershipPriceChip } from '@/components/MembershipPriceChip';
import { CheckCircle2, ChevronDown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PathwayTier, FamilyId } from '../types/site';
import { RegionalStatusBanner } from '@/components/RegionalStatusBanner';
import { PathwayTierCta } from '@/components/PathwayTierCta';
import { REGION_COPY } from '@/lib/brand-voice';
import { resolvePricingPresentation } from '@/lib/regional-price-display';
import type { OfferingStatus } from '@/types/regional-catalogue';
import { ResponsiveSnapScroll } from '@/components/ResponsiveSnapScroll';
import { PATHWAY_CARD_RADIUS_CLASS, PATHWAY_MOBILE_CAROUSEL_ITEM_CLASS, PATHWAY_MOBILE_CAROUSEL_SLIDE_CLASS, PATHWAY_MOBILE_CARD_SHELL_CLASS } from '@/lib/brand-visual';

export interface CertificationPathwayProps {
  certificationName: string;
  siteCertId: string;
  family: FamilyId;
  tiers: PathwayTier[];
  color?: string;
  gradient?: string;
}

const familyConfigs = {
  PMI: {
    text: 'text-brand-orange',
    defaultColor: '#f97316',
  },
  PRINCE2: {
    text: 'text-teal-700 dark:text-teal-400',
    defaultColor: '#0f766e',
  },
  SixSigma: {
    text: 'text-slate-700 dark:text-slate-300',
    defaultColor: '#334155',
  },
} as const;

const tierLevelLabel: Record<PathwayTier['level'], string> = {
  Foundation: 'Tier 1 · Foundation',
  Professional: 'Tier 2 · Professional',
  Mastery: 'Tier 3 · Mastery',
};

const pathwayCardShell = cn(
  'group/pathway relative flex flex-col gap-0 border border-slate-100 dark:border-slate-800 py-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-900 overflow-hidden',
  PATHWAY_CARD_RADIUS_CLASS,
  PATHWAY_MOBILE_CARD_SHELL_CLASS,
);

function tierAccentColor(color: string | undefined, family: FamilyId): string {
  if (color) return color;
  return familyConfigs[family as keyof typeof familyConfigs]?.defaultColor ?? familyConfigs.PMI.defaultColor;
}

function PathwayTierPricingChips({
  tier,
  accentColor,
}: {
  tier: PathwayTier;
  accentColor: string;
}) {
  const presentation = tier.price
    ? resolvePricingPresentation({
        original: tier.originalPrice ?? null,
        active: tier.price,
        membership: tier.membershipPrice || null,
        showScholarshipLabels: tier.showScholarshipLabels ?? false,
        footnote: tier.priceFootnote ?? null,
        regionalLabel: tier.regionalLabel ?? '',
      })
    : null;

  const showGlobalReference = Boolean(presentation?.showGlobalReference && tier.originalPrice);
  const isScholarship = presentation?.kind === 'scholarship';

  return (
    <div className="mb-5 space-y-2">
      <div className="grid grid-cols-2 gap-1.5 items-stretch overflow-visible sm:grid-cols-3 sm:gap-2">
        <StatChip
          label="Prep time"
          className="min-h-[4.25rem] px-1.5 py-1.5 sm:min-h-[5rem] sm:px-2.5"
        >
          <p className="text-xs font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-sm">
            {tier.duration?.trim() || 'Flexible'}
          </p>
        </StatChip>

        <StatChip
          label="Tuition"
          subtitle={isScholarship ? REGION_COPY.scholarshipChipSubtitle : undefined}
          className="min-h-[4.25rem] px-1.5 py-1.5 sm:min-h-[5rem] sm:px-2.5"
        >
          {tier.price ? (
            <p
              className={cn(
                'text-xs font-extrabold leading-tight tracking-tight sm:text-sm',
                isScholarship ? 'text-brand-orange' : 'text-slate-900 dark:text-white',
              )}
            >
              {tier.price}
            </p>
          ) : (
            <p className="text-xs font-extrabold text-slate-400 sm:text-sm">: </p>
          )}
        </StatChip>

        <MembershipPriceChip
          price={tier.membershipPrice}
          className="hidden min-h-[4.25rem] px-1 py-1.5 sm:flex sm:min-h-[4.5rem] sm:px-2.5"
        />
      </div>

      {showGlobalReference && tier.originalPrice && (
        <div
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-center dark:border-slate-700 dark:bg-slate-950/40"
          aria-label={`${presentation!.globalReferenceLabel} ${tier.originalPrice}`}
        >
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {presentation!.globalReferenceLabel}
          </span>
          <span className="text-xs font-bold text-slate-600 line-through decoration-slate-400 dark:text-slate-300 dark:decoration-slate-500">
            {tier.originalPrice}
          </span>
        </div>
      )}

      {(tier.tierDelivery || tier.deliveryMode) && (
        <p
          className="text-center text-[11px] font-semibold leading-snug text-slate-500 dark:text-slate-400"
          style={{ color: accentColor }}
        >
          {tier.tierDelivery ?? tier.deliveryMode}
        </p>
      )}
    </div>
  );
}

function PathwayOutcomeList({
  outcomes,
  accentColor,
  className,
}: {
  outcomes: string[];
  accentColor: string;
  className?: string;
}) {
  return (
    <ul className={cn('space-y-3', className)}>
      {outcomes.map((outcome) => (
        <li
          key={outcome}
          className="flex items-start text-xs font-semibold text-slate-600 dark:text-slate-400"
        >
          <CheckCircle2
            className="mr-2 mt-0.5 h-3.5 w-3.5 shrink-0"
            style={{ color: accentColor }}
          />
          <span className="leading-relaxed">{outcome}</span>
        </li>
      ))}
    </ul>
  );
}

const MOBILE_OUTCOMES_COLLAPSED_COUNT = 2;
const MOBILE_OUTCOMES_EXPANDED_COUNT = 4;

function PathwayTierOutcomes({
  outcomes,
  accentColor,
}: {
  outcomes: string[];
  accentColor: string;
}) {
  const [expanded, setExpanded] = React.useState(false);

  if (outcomes.length === 0) return null;

  const mobileVisibleCount = expanded
    ? Math.min(outcomes.length, MOBILE_OUTCOMES_EXPANDED_COUNT)
    : Math.min(outcomes.length, MOBILE_OUTCOMES_COLLAPSED_COUNT);
  const mobileHiddenCount = Math.max(
    0,
    Math.min(outcomes.length, MOBILE_OUTCOMES_EXPANDED_COUNT) - MOBILE_OUTCOMES_COLLAPSED_COUNT,
  );
  const showMobileToggle = outcomes.length > MOBILE_OUTCOMES_COLLAPSED_COUNT;

  return (
    <div>
      <div className="md:hidden">
        <PathwayOutcomeList
          outcomes={outcomes.slice(0, mobileVisibleCount)}
          accentColor={accentColor}
        />
        {showMobileToggle ? (
          <button
            type="button"
            className="mt-2 flex w-full items-center justify-between gap-2 py-1 text-left"
            onClick={(event) => {
              event.stopPropagation();
              setExpanded((open) => !open);
            }}
            aria-expanded={expanded}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange">
              {expanded
                ? 'Show less'
                : `+${mobileHiddenCount} more`}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 shrink-0 text-brand-orange transition-transform duration-300',
                expanded && 'rotate-180',
              )}
              aria-hidden
            />
          </button>
        ) : null}
      </div>
      <div className="hidden md:block">
        <PathwayOutcomeList outcomes={outcomes} accentColor={accentColor} />
      </div>
    </div>
  );
}

export const PathwayCard: React.FC<{
  tier: PathwayTier;
  siteCertId: string;
  family: FamilyId;
  color?: string;
  gradient?: string;
}> = ({ tier, siteCertId, family, color, gradient }) => {
  const accent = tierAccentColor(color, family);

  const ctaButtonStyle: React.CSSProperties | undefined = gradient
    ? undefined
    : { backgroundColor: accent };

  const ctaButtonClass = cn(
    'w-full h-11 rounded-xl font-bold text-sm text-white border-transparent shadow-md transition-all hover:opacity-90 md:h-12 md:rounded-2xl md:text-base',
    gradient && cn('bg-gradient-to-r', gradient),
  );

  return (
    <div className="flex h-full min-h-0 flex-col motion-reduce:transform-none md:transition-transform md:duration-300 md:hover:-translate-y-1">
      <Card
        className={cn(
          pathwayCardShell,
          tier.isPopular && 'ring-2 ring-offset-2 dark:ring-offset-slate-950',
        )}
        style={
          tier.isPopular
            ? ({ borderColor: `${accent}55`, '--tw-ring-color': `${accent}66` } as React.CSSProperties)
            : undefined
        }
      >
        <div
          className="h-1.5 w-full shrink-0"
          style={
            gradient
              ? undefined
              : { backgroundColor: accent }
          }
          aria-hidden
        >
          {gradient ? <div className={cn('h-full w-full bg-gradient-to-r', gradient)} /> : null}
        </div>

        {tier.isPopular && (
          <div className="absolute top-5 right-5 z-10">
            <Badge
              className="border-none text-[10px] font-bold uppercase tracking-widest text-white shadow-md"
              style={{ backgroundColor: accent }}
            >
              Most popular
            </Badge>
          </div>
        )}

        <CardHeader className="relative p-4 pb-2 md:p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2 md:mb-3">
            <Badge
              variant="outline"
              className="border-slate-200 text-[10px] font-bold uppercase tracking-widest dark:border-slate-700"
              style={{ color: accent, borderColor: `${accent}40` }}
            >
              {tierLevelLabel[tier.level]}
            </Badge>
          </div>
          <CardTitle className="pr-12 text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white md:pr-16 md:text-2xl">
            {tier.title}
          </CardTitle>
          <div
            className="mb-3 mt-2 flex items-center justify-center gap-2 rounded-lg border p-2 text-center md:mb-4 md:mt-3 md:rounded-xl md:p-2.5"
            style={{
              backgroundColor: `${accent}12`,
              borderColor: `${accent}28`,
            }}
          >
            <Zap className="h-3 w-3 shrink-0" style={{ color: accent }} />
            <span className="text-[10px] font-bold uppercase leading-snug tracking-tight text-slate-700 dark:text-slate-300">
              {tier.level} pathway
            </span>
          </div>
          <CardDescription className="line-clamp-2 text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400 md:line-clamp-3">
            {tier.details}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col px-4 pb-4 md:px-5 md:pb-5">
          <PathwayTierPricingChips tier={tier} accentColor={accent} />
          <PathwayTierOutcomes outcomes={tier.outcomes} accentColor={accent} />
        </CardContent>

        <CardFooter className="mt-auto flex flex-col gap-3 border-t border-border bg-muted/50 px-4 pb-4 pt-4 md:px-5 md:pb-5 md:pt-6">
          {tier.regionMessage && tier.status && (
            <RegionalStatusBanner
              status={tier.status as OfferingStatus}
              message={tier.regionMessage}
            />
          )}

          {tier.pathwayCta ? (
            <PathwayTierCta
              tier={tier}
              siteCertId={siteCertId}
              pathwayCta={tier.pathwayCta}
              popular={tier.isPopular}
              gradient={gradient}
              color={accent}
              className={ctaButtonClass}
            />
          ) : (
            <Link href={tier.primaryHref ?? '#'} className="w-full">
              <Button className={ctaButtonClass} style={ctaButtonStyle}>
                {tier.ctaText}
              </Button>
            </Link>
          )}

          <p className="text-[10px] text-slate-400 font-medium text-center leading-tight">
            Tuition only. Official exam fees are separate.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export const CertificationPathway: React.FC<CertificationPathwayProps> = ({
  siteCertId,
  family,
  tiers,
  color,
  gradient,
}) => {
  const desktopLayout = cn(
    'md:grid md:items-stretch',
    tiers.length === 1 && 'md:grid-cols-1 lg:max-w-xl lg:mx-auto',
    tiers.length === 2 && 'md:grid-cols-2',
    tiers.length >= 3 && 'md:grid-cols-2 lg:grid-cols-3',
  );

  return (
    <div className="w-full">
      <ResponsiveSnapScroll
        desktopLayoutClassName={desktopLayout}
        gapClassName="gap-6 md:gap-8"
        mobileItemClassName={PATHWAY_MOBILE_CAROUSEL_SLIDE_CLASS}
      >
        {tiers.map((tier, index) => (
          <m.div
            key={tier.offeringId ?? tier.level}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className={PATHWAY_MOBILE_CAROUSEL_ITEM_CLASS}
          >
            <PathwayCard
              tier={tier}
              siteCertId={siteCertId}
              family={family}
              color={color}
              gradient={gradient}
            />
          </m.div>
        ))}
      </ResponsiveSnapScroll>
    </div>
  );
};
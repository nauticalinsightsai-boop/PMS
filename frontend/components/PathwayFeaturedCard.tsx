'use client';

import Link from 'next/link';
import { Award, CheckCircle2, ShieldCheck, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatChip } from '@/components/ui/stat-chip';
import { CertificationPathwayVisual } from '@/components/CertificationPathwayVisual';
import { PathwayEnrollmentBadge } from '@/components/PathwayEnrollmentBadge';
import { cn } from '@/lib/utils';
import { getFamilyGradient } from '@/lib/brand-visual';
import { useRegion } from '@/contexts/RegionContext';
import { isEnrollmentOpen } from '@/lib/certification-enrollment';
import { resolvePricingPresentation } from '@/lib/regional-price-display';
import { getCertDurationLabel, getListingPriceForCert } from '@/lib/regional-catalogue';
import type { CertificationSummary } from '@/types/site';
import type { RegionId } from '@/types/regional-catalogue';

const familyStyles = {
  PMI: {
    text: 'text-brand-orange',
    accent: 'bg-brand-orange',
    gradient: 'from-brand-orange to-amber-600',
  },
  PRINCE2: {
    text: 'text-teal-700 dark:text-teal-400',
    accent: 'bg-teal-700',
    gradient: 'from-teal-600 to-blue-700',
  },
  SixSigma: {
    text: 'text-slate-700 dark:text-slate-300',
    accent: 'bg-slate-700',
    gradient: 'from-slate-600 to-slate-900',
  },
  FoundationDirect: {
    text: 'text-brand-orange',
    accent: 'bg-brand-orange',
    gradient: 'from-brand-orange to-amber-600',
  },
} as const;

function familyIcon(familyId: string) {
  if (familyId === 'PRINCE2') return ShieldCheck;
  if (familyId === 'SixSigma') return TrendingUp;
  return Award;
}

/** Prep time, tuition, and membership — three aligned chips from the same listing tier. */
function PathwayFeaturedPricingChips({ certId }: { certId: string }) {
  const { regionId, gccCountry } = useRegion();
  const listing = getListingPriceForCert(certId, regionId, gccCountry);
  const duration =
    getCertDurationLabel(certId) ?? undefined;

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
    <div className="mb-5 space-y-2">
      <div className="grid grid-cols-2 gap-2 items-stretch sm:grid-cols-3">
        <StatChip label="Prep time">
          <p className="text-sm font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
            {duration ?? 'Flexible'}
          </p>
        </StatChip>

        <StatChip label="Tuition">
          {listing.active ? (
            <p
              className={cn(
                'text-sm font-extrabold leading-tight tracking-tight',
                presentation?.kind === 'scholarship'
                  ? 'text-brand-orange'
                  : 'text-slate-900 dark:text-white',
              )}
            >
              {listing.active}
            </p>
          ) : (
            <p className="text-sm font-extrabold text-slate-400">—</p>
          )}
        </StatChip>

        <StatChip label="Member">
          {listing.membership ? (
            <p className="text-sm font-extrabold leading-tight tracking-tight text-brand-purple">
              {listing.membership}
            </p>
          ) : (
            <p className="text-sm font-extrabold text-slate-400">—</p>
          )}
        </StatChip>
      </div>

      {showGlobalReference && listing.original && (
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
      )}
    </div>
  );
}

export interface PathwayFeaturedCardProps {
  cert: CertificationSummary;
  /** Badge label (Home uses featured.family, e.g. PMI) */
  familyLabel?: string;
  title?: string;
  description?: string;
  /** Shown under the icon in the visual header */
  visualSubtitle?: string;
  /** `visual` = gradient header (Home). `directory` = detail-style card, no image, always-visible CTA. */
  layout?: 'visual' | 'directory';
  className?: string;
}

/** Featured pathway card — shared by Home and Certifications flagship grids */
function PathwayCardCta({ certId, regionId }: { certId: string; regionId: RegionId }) {
  return (
    <Link href={`/certifications/${certId}`} className="w-full">
      <Button variant="brand" className="w-full h-12 rounded-2xl font-bold text-base">
        {isEnrollmentOpen(certId, regionId) ? 'View pathway' : 'View overview'}
      </Button>
    </Link>
  );
}

export function PathwayFeaturedCard({
  cert,
  familyLabel,
  title,
  description,
  visualSubtitle,
  layout = 'visual',
  className,
}: PathwayFeaturedCardProps) {
  const { regionId } = useRegion();
  const displayTitle = title ?? cert.name;
  const displayDesc = description ?? cert.desc;
  const badgeLabel = familyLabel ?? cert.familyId;
  const subtitle = visualSubtitle ?? displayTitle;
  const family =
    familyStyles[cert.familyId as keyof typeof familyStyles] ?? familyStyles.PMI;
  const Icon = familyIcon(cert.familyId);
  const outcomes =
    cert.learningOutcomes?.slice(0, 4) ?? [
      'Structured study plan',
      'Mock exam practice',
      'Weak-area tracking',
    ];

  if (layout === 'directory') {
    const headerGradient = getFamilyGradient(cert.familyId);
    const accent = cert.color ?? '#2851b9';

    return (
      <Card
        className={cn(
          'group/pathway h-full flex flex-col gap-0 border border-sandstone/30 dark:border-slate-800 py-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-[2.5rem] bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm overflow-hidden relative',
          className,
        )}
      >
        <div className="absolute top-0 left-0 w-full h-1.5" style={{ background: headerGradient }} />
        <CardHeader className="p-6 pb-3">
          <div className="flex items-start gap-3 mb-4">
            <div
              className={cn(
                'p-3 rounded-2xl bg-ivory dark:bg-slate-800 shadow-inner border border-sandstone/20 dark:border-slate-700 shrink-0',
                family.text,
              )}
              style={{ color: accent }}
            >
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
              <Badge className="text-[10px] font-bold uppercase tracking-widest border-slate-200 dark:border-slate-700">
                {badgeLabel}
              </Badge>
              <PathwayEnrollmentBadge certId={cert.id} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight leading-tight text-slate-900 dark:text-white">
            {displayTitle}
          </CardTitle>
          <div className="flex items-center gap-2 mt-3 p-2.5 rounded-xl bg-brand-orange/5 border border-brand-orange/10">
            <Zap className="h-3 w-3 text-brand-orange shrink-0" />
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight leading-snug">
              {cert.outputValue}
            </span>
          </div>
          <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-3 leading-relaxed line-clamp-3">
            {displayDesc}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-4 flex-1 flex flex-col">
          <PathwayFeaturedPricingChips certId={cert.id} />
          <div className="h-px bg-gradient-to-r from-transparent via-sandstone/50 dark:via-slate-800 to-transparent w-full my-2" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center mb-3">
            Key outcomes
          </p>
          <ul className="space-y-2.5 flex-1">
            {outcomes.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300"
              >
                <CheckCircle2 className={cn('h-4 w-4 mt-0.5 shrink-0', family.text)} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="border-t border-border bg-muted/40 dark:bg-slate-800/40 px-6 py-5 flex flex-col gap-2">
          <PathwayCardCta certId={cert.id} regionId={regionId} />
          <p className="text-[10px] text-slate-400 font-medium text-center leading-tight">
            Tuition only. Official exam fees are separate.
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card
      className={
        className ??
        'group/pathway h-full flex flex-col gap-0 border border-slate-100 dark:border-slate-800 py-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden'
      }
    >
      <CertificationPathwayVisual cert={cert} subtitle={subtitle} />
      <CardHeader className="p-5 pb-2">
        <div className="flex flex-wrap items-center justify-start gap-2 mb-3">
          <Badge className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none text-[10px] font-bold px-3 py-1 text-center">
            {badgeLabel}
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
        <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {displayDesc}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5 pb-5 flex-1">
        <PathwayFeaturedPricingChips certId={cert.id} />

        <ul className="space-y-3">
          {outcomes.slice(0, 3).map((item) => (
            <li key={item} className="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="h-3 w-3 mr-2 text-brand-orange shrink-0" />
              <span className="line-clamp-1">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="border-t border-border bg-muted/50 px-5 pb-5 pt-6">
        <PathwayCardCta certId={cert.id} regionId={regionId} />
      </CardFooter>
    </Card>
  );
}

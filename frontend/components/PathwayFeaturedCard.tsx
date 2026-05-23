'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { CheckCircle2, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CertificationPathwayVisual } from '@/components/CertificationPathwayVisual';
import { PathwayEnrollmentBadge } from '@/components/PathwayEnrollmentBadge';
import { cn } from '@/lib/utils';
import { useRegion } from '@/contexts/RegionContext';
import { isEnrollmentOpen } from '@/lib/certification-enrollment';
import { resolvePricingPresentation } from '@/lib/regional-price-display';
import { getCertDurationLabel, getListingPriceForCert } from '@/lib/regional-catalogue';
import type { CertificationSummary } from '@/types/site';

function FeaturedPricingChip({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 flex-col gap-0.5 rounded-xl bg-slate-50 px-2 py-1.5 dark:bg-slate-800 sm:px-2.5',
        className,
      )}
    >
      <span className="text-[8px] font-bold uppercase leading-tight tracking-widest text-slate-400 dark:text-slate-500">
        {label}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
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

  return (
    <div className="mb-5 grid grid-cols-3 gap-1.5">
      <FeaturedPricingChip label="Prep time">
        <p className="text-[11px] font-bold leading-tight text-slate-800 dark:text-slate-100">
          {duration ?? 'Flexible'}
        </p>
      </FeaturedPricingChip>

      <FeaturedPricingChip label="Tuition">
        {listing.active ? (
          <div className="space-y-0.5">
            <p
              className={cn(
                'text-[11px] font-bold leading-tight',
                presentation?.kind === 'scholarship'
                  ? 'text-brand-orange'
                  : 'text-slate-800 dark:text-slate-100',
              )}
            >
              {listing.active}
            </p>
            {presentation?.showGlobalReference && listing.original && (
              <p className="text-[8px] leading-tight text-slate-400 dark:text-slate-500">
                <span className="font-semibold">{presentation.globalReferenceLabel}</span>{' '}
                <span className="line-through decoration-slate-300">{listing.original}</span>
              </p>
            )}
          </div>
        ) : (
          <p className="text-[11px] font-bold text-slate-400">—</p>
        )}
      </FeaturedPricingChip>

      <FeaturedPricingChip label="Member">
        {listing.membership ? (
          <p className="text-[11px] font-bold leading-tight text-brand-purple">{listing.membership}</p>
        ) : (
          <p className="text-[11px] font-bold text-slate-400">—</p>
        )}
      </FeaturedPricingChip>
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
  className?: string;
}

/** Featured pathway card — shared by Home and Certifications flagship grids */
export function PathwayFeaturedCard({
  cert,
  familyLabel,
  title,
  description,
  visualSubtitle,
  className,
}: PathwayFeaturedCardProps) {
  const { regionId } = useRegion();
  const displayTitle = title ?? cert.name;
  const displayDesc = description ?? cert.desc;
  const badgeLabel = familyLabel ?? cert.familyId;
  const subtitle = visualSubtitle ?? displayTitle;

  return (
    <Card
      className={
        className ??
        'group/pathway h-full flex flex-col gap-0 border border-slate-100 dark:border-slate-800 py-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden'
      }
    >
      <CertificationPathwayVisual cert={cert} subtitle={subtitle} />
      <CardHeader className="p-5 pb-2">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge className="w-fit bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none text-[10px] font-bold px-3 py-1">
            {badgeLabel}
          </Badge>
          <PathwayEnrollmentBadge certId={cert.id} />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight mb-3 leading-tight">{displayTitle}</CardTitle>
        <div className="flex items-center gap-2 mb-4 p-2 rounded-xl bg-brand-orange/5 border border-brand-orange/10">
          <Zap className="h-3 w-3 text-brand-orange shrink-0" />
          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
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
          {(cert.learningOutcomes?.slice(0, 3) || [
            'Structured study plan',
            'Mock exam practice',
            'Weak-area tracking',
          ]).map((item) => (
            <li key={item} className="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="h-3 w-3 mr-2 text-brand-orange shrink-0" />
              <span className="line-clamp-1">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="max-h-0 overflow-hidden border-t-0 bg-transparent p-0 opacity-0 transition-all duration-300 ease-out max-md:max-h-28 max-md:border-t max-md:bg-muted/50 max-md:px-5 max-md:pb-5 max-md:pt-6 max-md:opacity-100 md:group-hover/pathway:max-h-28 md:group-hover/pathway:border-t md:group-hover/pathway:bg-muted/50 md:group-hover/pathway:px-5 md:group-hover/pathway:pb-5 md:group-hover/pathway:pt-6 md:group-hover/pathway:opacity-100 md:group-focus-within/pathway:max-h-28 md:group-focus-within/pathway:border-t md:group-focus-within/pathway:bg-muted/50 md:group-focus-within/pathway:px-5 md:group-focus-within/pathway:pb-5 md:group-focus-within/pathway:pt-6 md:group-focus-within/pathway:opacity-100">
        <Link href={`/certifications/${cert.id}`} className="w-full">
          <Button className="w-full h-12 rounded-2xl font-bold text-base bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-brand-orange dark:hover:bg-brand-orange dark:hover:text-white text-white transition-all">
            {isEnrollmentOpen(cert.id, regionId) ? 'View pathway' : 'View overview'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

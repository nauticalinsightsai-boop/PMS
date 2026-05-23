'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
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
import { CheckCircle2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PathwayTier, FamilyId } from '../types/site';
import { RegionalStatusBanner } from '@/components/RegionalStatusBanner';
import { PathwayTierCta } from '@/components/PathwayTierCta';
import { resolvePricingPresentation } from '@/lib/regional-price-display';
import type { OfferingStatus } from '@/types/regional-catalogue';

export interface CertificationPathwayProps {
  certificationName: string;
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
  Elite: 'Tier 3 · Mastery',
};

const pathwayCardShell =
  'group/pathway h-full flex flex-col gap-0 border border-slate-100 dark:border-slate-800 py-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden';

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
      <div className="grid grid-cols-2 gap-2 items-stretch sm:grid-cols-3">
        <StatChip label="Prep time">
          <p className="text-sm font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
            {tier.duration?.trim() || 'Flexible'}
          </p>
        </StatChip>

        <StatChip label="Tuition">
          {tier.price ? (
            <p
              className={cn(
                'text-sm font-extrabold leading-tight tracking-tight',
                isScholarship ? 'text-brand-orange' : 'text-slate-900 dark:text-white',
              )}
            >
              {tier.price}
            </p>
          ) : (
            <p className="text-sm font-extrabold text-slate-400">—</p>
          )}
        </StatChip>

        <StatChip label="Member">
          {tier.membershipPrice ? (
            <p className="text-sm font-extrabold leading-tight tracking-tight text-brand-purple">
              {tier.membershipPrice}
            </p>
          ) : (
            <p className="text-sm font-extrabold text-slate-400">—</p>
          )}
        </StatChip>
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

export const PathwayCard: React.FC<{
  tier: PathwayTier;
  family: FamilyId;
  color?: string;
  gradient?: string;
}> = ({ tier, family, color, gradient }) => {
  const accent = tierAccentColor(color, family);

  const ctaButtonStyle: React.CSSProperties | undefined = gradient
    ? undefined
    : { backgroundColor: accent };

  const ctaButtonClass = cn(
    'w-full h-12 rounded-2xl font-bold text-base text-white border-transparent shadow-md transition-all hover:opacity-90',
    gradient && cn('bg-gradient-to-r', gradient),
  );

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className="h-full motion-reduce:transform-none max-md:[&]:transform-none"
    >
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

        <CardHeader className="p-5 pb-2 relative">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge
              variant="outline"
              className="text-[10px] font-bold uppercase tracking-widest border-slate-200 dark:border-slate-700"
              style={{ color: accent, borderColor: `${accent}40` }}
            >
              {tierLevelLabel[tier.level]}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight leading-tight text-slate-900 dark:text-white pr-16">
            {tier.title}
          </CardTitle>
          <div
            className="flex items-center justify-center gap-2 mb-4 mt-3 p-2.5 rounded-xl border text-center"
            style={{
              backgroundColor: `${accent}12`,
              borderColor: `${accent}28`,
            }}
          >
            <Zap className="h-3 w-3 shrink-0" style={{ color: accent }} />
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight leading-snug">
              {tier.level} pathway
            </span>
          </div>
          <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
            {tier.details}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 pb-5 flex-1">
          <PathwayTierPricingChips tier={tier} accentColor={accent} />
          <ul className="space-y-3">
            {tier.outcomes.map((outcome) => (
              <li
                key={outcome}
                className="flex items-start text-xs font-semibold text-slate-600 dark:text-slate-400"
              >
                <CheckCircle2
                  className="h-3.5 w-3.5 mr-2 mt-0.5 shrink-0"
                  style={{ color: accent }}
                />
                <span className="leading-relaxed">{outcome}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="border-t border-border bg-muted/50 px-5 pb-5 pt-6 flex flex-col gap-3">
          {tier.regionMessage && tier.status && (
            <RegionalStatusBanner
              status={tier.status as OfferingStatus}
              message={tier.regionMessage}
            />
          )}

          {tier.pathwayCta ? (
            <PathwayTierCta
              tier={tier}
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
    </motion.div>
  );
};

export const CertificationPathway: React.FC<CertificationPathwayProps> = ({
  family,
  tiers,
  color,
  gradient,
}) => {
  return (
    <div className="w-full">
      <div
        className={cn(
          'grid grid-cols-1 gap-8 items-stretch',
          tiers.length === 1 && 'lg:max-w-xl lg:mx-auto',
          tiers.length === 2 && 'md:grid-cols-2',
          tiers.length >= 3 && 'md:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.offeringId ?? tier.level}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="h-full"
          >
            <PathwayCard tier={tier} family={family} color={color} gradient={gradient} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

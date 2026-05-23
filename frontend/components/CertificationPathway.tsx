'use client';
import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Globe, ArrowRight, Sparkles, Target, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { PathwayTier, FamilyId } from "../types/site";
import { RegionalPrice } from "@/components/RegionalPrice";
import { RegionalStatusBanner } from "@/components/RegionalStatusBanner";
import { PathwayTierCta } from "@/components/PathwayTierCta";
import type { OfferingStatus } from "@/types/regional-catalogue";

export interface CertificationPathwayProps {
  certificationName: string;
  family: FamilyId;
  tiers: PathwayTier[];
  color?: string;
  gradient?: string;
}

const familyConfigs = {
  "PMI": {
    accent: "bg-brand-orange",
    text: "text-brand-orange",
    border: "border-brand-orange/10",
    lightBg: "bg-brand-orange/5",
    gradient: "from-brand-orange to-amber-600"
  },
  "PRINCE2": {
    accent: "bg-teal-700",
    text: "text-teal-700",
    border: "border-teal-100",
    lightBg: "bg-teal-50/50",
    gradient: "from-teal-600 to-blue-700"
  },
  "SixSigma": {
    accent: "bg-slate-700",
    text: "text-slate-700",
    border: "border-slate-100",
    lightBg: "bg-slate-50/50",
    gradient: "from-slate-600 to-slate-900"
  }
};

const tierIcons = {
  Foundation: Sparkles,
  Professional: Target,
  Elite: Award
};

export const PathwayCard: React.FC<{ tier: PathwayTier; config: any; color?: string; gradient?: string }> = ({ tier, config, color, gradient }) => {
  const Icon = tierIcons[tier.level];

  return (
    <motion.div
      whileHover={{
        y: -6,
        transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
      }}
      className="h-full motion-reduce:transform-none max-md:[&]:transform-none"
    >
      <Card className={cn(
        "h-full flex flex-col transition-all duration-500 border border-sandstone/30 dark:border-slate-800 relative group overflow-hidden rounded-[3.5rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl",
        tier.isPopular ? cn("shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] ring-2 ring-offset-4 dark:ring-offset-slate-950") : "premium-shadow"
      )}
      style={tier.isPopular && color ? { borderColor: `${color}40` } as React.CSSProperties : {}}
      >
        {/* Subtle Background Gradient */}
        <div className={cn("absolute top-0 left-0 w-full h-1.5", gradient ? cn("bg-gradient-to-r", gradient) : config.accent)} />
        
        {/* Animated Background Accent */}
        <div 
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-5 transition-opacity group-hover:opacity-20"
          style={{ backgroundColor: color || 'var(--pms-orange)' }}
        />

        {tier.isPopular && (
          <div 
            className={cn("absolute top-0 right-0 px-10 py-2 rotate-45 translate-x-10 translate-y-4 text-[10px] font-black text-white uppercase tracking-[0.3em] shadow-lg z-20", !color && config.accent)}
            style={color ? { backgroundColor: color } : {}}
          >
            Popular
          </div>
        )}

        <CardHeader className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div 
              className={cn("p-3 rounded-2xl bg-ivory dark:bg-slate-800 shadow-inner border border-sandstone/20 dark:border-slate-800 transition-transform group-hover:scale-110 duration-500", !color && config.text)}
              style={color ? { color: color } : {}}
            >
              <Icon className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="text-[10px] uppercase tracking-[0.25em] font-black border-sandstone/50 dark:border-slate-700 text-slate-400 px-2 py-0.5">
              Tier {tier.level === "Foundation" ? "1" : tier.level === "Professional" ? "2" : "3"}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold text-obsidian dark:text-white tracking-tighter leading-tight">{tier.title}</CardTitle>
          <CardDescription className="text-carbon/60 dark:text-slate-400 mt-3 text-sm leading-relaxed font-medium">
            {tier.details}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6 flex-1">
          <div className="space-y-6">
            <div className="space-y-3 text-center">
              {tier.duration && (
                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-obsidian/70 dark:text-slate-300 uppercase tracking-tight">
                  <Clock className="h-4 w-4 text-brand-orange shrink-0" />
                  <span>{tier.duration}</span>
                </div>
              )}
              {tier.tierDelivery && (
                <div className="flex items-center justify-center gap-2 text-[10px] font-medium text-obsidian/70 dark:text-slate-300 leading-snug">
                  <Globe className="h-4 w-4 text-brand-orange shrink-0" />
                  <span>{tier.tierDelivery}</span>
                </div>
              )}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-sandstone/50 dark:via-slate-800 to-transparent w-full" />

            <div className="space-y-4">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                Key Outcomes
              </div>
              <ul className="space-y-3">
                {tier.outcomes.map((outcome, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-bold text-carbon/80 dark:text-slate-300">
                    <CheckCircle2 
                      className={cn("h-4 w-4 mt-0.5 shrink-0 transition-transform group-hover:scale-110", !color && config.text)} 
                      style={color ? { color: color } : {}}
                    />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex flex-col items-center gap-4 text-center">
          {tier.regionMessage && tier.status && (
            <RegionalStatusBanner
              status={tier.status as OfferingStatus}
              message={tier.regionMessage}
            />
          )}
          <RegionalPrice
            original={tier.originalPrice ?? null}
            active={tier.price}
            membership={tier.membershipPrice || null}
            showScholarshipLabels={tier.showScholarshipLabels ?? false}
            regionalLabel={tier.regionalLabel}
            footnote={null}
            variant="tier"
          />
          {tier.pathwayCta ? (
            <PathwayTierCta
              tier={tier}
              pathwayCta={tier.pathwayCta}
              popular={tier.isPopular}
              gradient={gradient}
              accentClass={config.accent}
              color={color}
            />
          ) : (
            <Link
              href={tier.primaryHref ?? '#'}
              className={cn(
                buttonVariants(),
                "w-full h-14 rounded-[1rem] font-black text-lg group/btn transition-all shadow-xl hover:shadow-brand-orange/20 inline-flex",
                tier.isPopular ? (gradient ? cn("bg-gradient-to-r text-white", gradient) : cn(config.accent, "hover:opacity-90 text-white")) : "bg-obsidian hover:bg-brand-orange text-white dark:bg-slate-800 dark:hover:bg-brand-orange"
              )}
              style={tier.isPopular && !gradient && color ? { backgroundColor: color } : {}}
            >
              {tier.ctaText}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          )}
          <p className="text-[10px] text-slate-400 font-medium leading-tight max-w-[220px] mx-auto">
            Tuition only. Official fees are separate.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export const CertificationPathway: React.FC<CertificationPathwayProps> = ({ certificationName, family, tiers, color, gradient }) => {
  const config = familyConfigs[family as keyof typeof familyConfigs] || familyConfigs["PMI"];

  return (
    <div className="w-full">
      <div
        className={cn(
          'grid grid-cols-1 gap-10 items-stretch',
          tiers.length === 1 && 'lg:grid-cols-1',
          tiers.length === 2 && 'lg:grid-cols-2',
          tiers.length >= 3 && 'lg:grid-cols-3'
        )}
      >
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.offeringId ?? tier.level}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <PathwayCard tier={tier} config={config} color={color} gradient={gradient} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

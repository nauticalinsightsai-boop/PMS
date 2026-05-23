'use client';
import { useState } from 'react';
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Users, BookOpen, Sparkles, MessageCircle, FileText, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebsiteData } from "@/services/WebsiteDataService";
import Link from "next/link";
import { BRAND, HOME_COPY } from "@/lib/brand-voice";
import { PAGE_HERO_PADDING, SectionAmbience, sectionSurface } from "@/components/SectionAmbience";
import { MembershipDualPrice } from '@/components/MembershipDualPrice';
import {
  type BillingCycle,
  formatMembershipSavingsPercent,
  formatMembershipUsd,
  getMembershipDisplayPrice,
  membershipAnnualSavingsPercent,
  MEMBERSHIP_PRICING,
} from '@/lib/membership-plans';

import * as siteData from "@/data/siteData";

const MAX_ANNUAL_SAVINGS_PERCENT = membershipAnnualSavingsPercent(
  MEMBERSHIP_PRICING.mastery.monthlyUsd,
  MEMBERSHIP_PRICING.mastery.yearlyUsd,
);

const benefits = [
  {
    title: "AI CV Maker",
    desc: "Build a professional, ATS-friendly PM resume in minutes with our specialized templates.",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/10"
  },
  {
    title: "Direct mentor access",
    desc: "Professional members can reach mentors during their membership month for exam and career questions.",
    icon: Users,
    color: "text-brand-orange",
    bg: "bg-brand-orange/5 dark:bg-brand-orange/10"
  },
  {
    title: "Private Slack",
    desc: "Real-time access to thousands of PMs, mentors, and industry experts in our private channels.",
    icon: MessageCircle,
    color: "text-brand-purple",
    bg: "bg-brand-purple/5 dark:bg-brand-purple/10"
  },
  {
    title: "Exclusive Sessions",
    desc: "Join weekly deep-dives into complex PM topics, exam strategies, and career growth.",
    icon: Sparkles,
    color: "text-brand-orange",
    bg: "bg-brand-orange/5 dark:bg-brand-orange/10"
  },
  {
    title: "Store Discounts",
    desc: "Save up to 35% on all mock exams, templates, and study packs in our resource store.",
    icon: Gift,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-900/10"
  }
];

function MembershipBillingToggle({
  billing,
  onChange,
}: {
  billing: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}) {
  return (
    <div className="flex justify-center mb-12" role="group" aria-label="Billing period">
      <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
        <button
          type="button"
          onClick={() => onChange('monthly')}
          className={cn(
            'min-h-11 px-6 rounded-xl text-sm font-bold transition-all',
            billing === 'monthly'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200',
          )}
          aria-pressed={billing === 'monthly'}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => onChange('yearly')}
          className={cn(
            'min-h-11 px-6 rounded-xl text-sm font-bold transition-all inline-flex items-center gap-2',
            billing === 'yearly'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200',
          )}
          aria-pressed={billing === 'yearly'}
        >
          Yearly
          {MAX_ANNUAL_SAVINGS_PERCENT > 0 ? (
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-purple/15 text-brand-purple">
              Save up to {MAX_ANNUAL_SAVINGS_PERCENT}%
            </span>
          ) : null}
        </button>
      </div>
    </div>
  );
}

export function Membership() {
  const { get } = useWebsiteData();
  const tiers = siteData.membershipTiers;
  const [billing, setBilling] = useState<BillingCycle>('monthly');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className={sectionSurface('blend', cn('relative', PAGE_HERO_PADDING))}>
        <SectionAmbience tone="blend" />
        
        <div className="container relative z-10 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-brand-purple/10 text-brand-purple border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
              {get('membership_hero_badge', 'Membership Plans')}
            </Badge>
            <h1 className="font-heading text-hero font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
              {get('membership_hero_title', 'Invest in Your Future Self')}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
              {get('membership_hero_subtitle', HOME_COPY.membershipSubtitle)}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 -mt-12 relative z-20">
        <div className="container mx-auto">
          <MembershipBillingToggle billing={billing} onChange={setBilling} />
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto -mt-6 mb-10">
            Professional is {MEMBERSHIP_PRICING.professional.monthlyUsd}/month or{' '}
            {MEMBERSHIP_PRICING.professional.yearlyUsd}/year (
            {formatMembershipSavingsPercent(
              MEMBERSHIP_PRICING.professional.monthlyUsd,
              MEMBERSHIP_PRICING.professional.yearlyUsd,
            )}
            ). Mastery is {MEMBERSHIP_PRICING.mastery.monthlyUsd}/month or{' '}
            {MEMBERSHIP_PRICING.mastery.yearlyUsd}/year (
            {formatMembershipSavingsPercent(
              MEMBERSHIP_PRICING.mastery.monthlyUsd,
              MEMBERSHIP_PRICING.mastery.yearlyUsd,
            )}
            ).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {tiers.map((tier, index) => {
              const display = getMembershipDisplayPrice(
                tier.monthlyPriceUsd,
                tier.yearlyPriceUsd,
                billing,
              );
              return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="h-full"
              >
                <Card className={cn(
                  "h-full flex flex-col transition-all duration-300 border border-slate-100 dark:border-slate-800 relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900",
                  tier.highlight ? "shadow-xl ring-2 ring-brand-purple/20" : "shadow-sm"
                )}>
                  {tier.highlight && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-brand-purple text-white border-none text-[10px] font-bold px-3 py-1">
                        Best Value
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="p-8">
                    <CardTitle className="text-2xl font-bold tracking-tight">{tier.name}</CardTitle>
                    <div className="mt-6 flex flex-col items-start gap-2">
                      {billing === 'monthly' && tier.monthlyPriceUsd > 0 ? (
                        <MembershipDualPrice
                          monthlyUsd={tier.monthlyPriceUsd}
                          yearlyUsd={tier.yearlyPriceUsd}
                        />
                      ) : (
                        <>
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                              {display.price}
                            </span>
                            {display.period ? (
                              <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                {display.period}
                              </span>
                            ) : null}
                            {display.savingsLabel ? (
                              <span className="rounded-full bg-brand-purple/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-brand-purple">
                                {display.savingsLabel}
                              </span>
                            ) : null}
                          </div>
                          {tier.monthlyPriceUsd > 0 ? (
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                              or {formatMembershipUsd(tier.monthlyPriceUsd)}/month
                            </p>
                          ) : null}
                        </>
                      )}
                    </div>
                    <CardDescription className="mt-4 text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {tier.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 flex-1">
                    <div className="space-y-4">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">What's included</div>
                      <ul className="space-y-3">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
                            <Check className="h-4 w-4 text-brand-purple shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="p-8 pt-0">
                    <Link href={tier.highlight ? "/membership" : "/contact"} className="w-full">
                      <Button
                        variant={tier.highlight ? "brand" : "outline"}
                        className="w-full h-14 text-lg font-bold rounded-2xl transition-all"
                      >
                        {tier.cta}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Benefits */}
      <section className={sectionSurface('purple', 'py-32')}>
        <SectionAmbience tone="purple" />
        <div className="container relative z-10 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="font-heading text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              {get('membership_benefits_title', `Why join ${BRAND.name}?`)}
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {get('membership_benefits_subtitle', 'Beyond certifications, we provide the infrastructure for your entire professional journey.')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={cn("p-8 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md", benefit.bg)}
              >
                <div className={cn("p-4 rounded-xl bg-white dark:bg-slate-900 shadow-sm mb-6 w-fit", benefit.color)}>
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{benefit.title}</h3>
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Member Resources Preview */}
      <section className={sectionSurface('warm', 'py-32')}>
        <SectionAmbience tone="warm" />
        <div className="container relative z-10 mx-auto">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-brand-orange/10 to-brand-purple/10 pointer-events-none" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <Badge className="mb-6 bg-brand-orange text-white border-none px-4 py-1 text-[10px] font-bold uppercase tracking-widest">Member Only</Badge>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
                  Access the Vault of PM Resources
                </h2>
                <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
                  Our members get instant access to 500+ downloadable templates, planners, 
                  and study packs. Stop reinventing the wheel and start leading.
                </p>
                <div className="space-y-4 mb-12">
                  {["Exclusive Exam Simulators", "Career Coaching Sessions", "Industry Salary Reports"].map(item => (
                    <div key={item} className="flex items-center gap-3 text-slate-300 text-base font-semibold">
                      <div className="h-5 w-5 rounded-full bg-brand-orange/20 flex items-center justify-center">
                        <Check className="h-3 w-3 text-brand-orange" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
                <Link href="/community?view=store">
                  <Button size="lg" variant="brand" className="h-14 px-10 rounded-2xl font-bold text-lg shadow-xl transition-all">
                    Explore Resource Library
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={cn(
                    "aspect-square rounded-3xl bg-slate-800/50 border border-slate-700 flex items-center justify-center p-8 shadow-lg transition-transform hover:scale-105",
                    i % 2 === 0 ? "mt-8" : ""
                  )}>
                    <BookOpen className="h-12 w-12 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

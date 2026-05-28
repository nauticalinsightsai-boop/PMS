'use client';
import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CertificationPathway } from "@/components/CertificationPathway";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, Award, ShieldCheck, CheckCircle2, TrendingUp, Sparkles, Target, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { PathwayTier } from "@/types/site";
import * as siteData from "@/data/siteData";
import { BRAND, CERTIFICATIONS_COPY, CTAS } from "@/lib/brand-voice";
import { SectionAmbience, sectionSurface } from "@/components/SectionAmbience";
import { PathwayEnrollmentBadge } from "@/components/PathwayEnrollmentBadge";
import { useRegion } from "@/contexts/RegionContext";
import { buildPathwayTiersForCert } from "@/lib/pathway-from-catalogue";
import { getOfferingsForSiteCert } from "@/lib/regional-catalogue";
import { CertFamilyMark } from "@/components/CertFamilyMark";
import { PricingComplianceNote } from "@/components/PricingComplianceNote";
import { hrefForCtaAction } from "@/lib/cta-router";
import { canCheckout } from "@/lib/status-normalize";
import type { RegionId } from "@/types/regional-catalogue";
import {
  PUBLIC_NAVBAR_HEIGHT_CLASS,
  PUBLIC_NAVBAR_OFFSET_CLASS,
  PUBLIC_NAVBAR_TOP_CLASS,
  PUBLIC_SUBNAV_SPACER_CLASS,
} from "@/components/PublicShell";
import {
  DossierBulletList,
  DossierCard,
  ExpandableExamRegistration,
  ExpandableLearningOutcomes,
} from "@/components/CertDossierBlocks";

function certHasOpenEnrollment(siteId: string, regionId: string): boolean {
  return getOfferingsForSiteCert(siteId).some((o) => {
    const s = o.regional[regionId as keyof typeof o.regional]?.status;
    return s === 'direct_checkout' || s === 'scholarship_verify';
  });
}

export function CertificationDetail() {
  const { id } = useParams();
  const { regionId, gccCountry } = useRegion();
  const cert = siteData.certifications.find(c => c.id === id) || siteData.certifications[0];
  const certName = cert.name;
  const family = siteData.familyConfigs[cert.familyId] || siteData.familyConfigs["PMI"];
  const enrollmentOpen = certHasOpenEnrollment(cert.id, regionId);

  const foundationCheckoutHref = React.useMemo(() => {
    const foundation = getOfferingsForSiteCert(cert.id).find((o) => o.tierId === "foundation");
    if (!foundation) return null;
    const status = foundation.regional[regionId as RegionId]?.status;
    if (!canCheckout(status)) return null;
    return hrefForCtaAction("checkout", foundation.offeringId, cert.id);
  }, [cert.id, regionId]);

  const pathway: PathwayTier[] = React.useMemo(
    () =>
      buildPathwayTiersForCert(
        cert.id,
        certName,
        regionId,
        gccCountry,
        cert.pathwayOutcomes,
        cert.learningOutcomes ?? [],
      ),
    [cert.id, certName, regionId, gccCountry, cert.pathwayOutcomes, cert.learningOutcomes]
  );

  return (
    <div
      className={cn(
        'flex flex-col min-h-screen selection:bg-brand-orange selection:text-white',
        /* Cancel main pt-16 so subnav can sit flush under the fixed navbar */
        PUBLIC_NAVBAR_OFFSET_CLASS,
      )}
    >
      {/* Subnav — fixed directly under navbar (avoids gap from main padding + sticky top) */}
      <section
        className={cn(
          'fixed inset-x-0 z-40 py-3 border-b border-border',
          'bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/90',
          PUBLIC_NAVBAR_TOP_CLASS,
        )}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/certifications">
            <Button variant="ghost" className="text-slate-500 hover:text-brand-orange -ml-4 font-bold transition-all">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
            </Button>
          </Link>
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/certifications/compare"
              className="text-sm font-bold text-slate-500 hover:text-brand-orange transition-colors"
            >
              Compare
            </Link>
            <Link
              href="/membership"
              className="text-sm font-bold text-slate-500 hover:text-brand-orange transition-colors"
            >
              Membership
            </Link>
            <span className="text-slate-300 dark:text-slate-600" aria-hidden>
              |
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Currently Viewing:</span>
            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-none">
              {certName}
            </Badge>
          </div>
        </div>
      </section>

      {/* Reserve space for fixed navbar + subnav */}
      <div className={cn(PUBLIC_NAVBAR_HEIGHT_CLASS, PUBLIC_SUBNAV_SPACER_CLASS, 'shrink-0')} aria-hidden />

      {/* Hero Section */}
      <section className={sectionSurface('blend', 'relative pt-16 pb-32 md:pt-20')}>
        <SectionAmbience tone="blend" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-orange/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-purple/5 rounded-full blur-[120px]" />
        </div>

        <div className="container relative z-10 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Badge className="bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                  {family.name}
                </Badge>
                <PathwayEnrollmentBadge certId={cert.id} />
              </div>

              <h1 className="font-heading text-hero font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
                {certName} <br />
                <span className="text-brand-orange">Pathway</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-xl leading-relaxed font-medium">
                {cert.desc}
              </p>

              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm mb-10">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="h-5 w-5 text-brand-orange" />
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Primary Value</div>
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{cert.outputValue}</div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { icon: Clock, label: "Flexible Learning", color: "text-brand-orange" },
                  { icon: Award, label: "Global Recognition", color: "text-brand-deep" },
                  { icon: ShieldCheck, label: "Verified Content", color: "text-green-600" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className={cn("p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 transition-transform group-hover:scale-110", item.color)}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-200">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div
                className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 bg-gradient-to-br from-brand-purple/10 via-white to-brand-orange/10 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-12"
                role="img"
                aria-label={`${certName} exam preparation pathway`}
              >
                <CertFamilyMark familyId={cert.familyId} className="mb-8 scale-150" />
                <p className="text-center font-heading text-2xl font-bold text-slate-900 dark:text-white">
                  {certName}
                </p>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  Structured exam preparation pathway
                </p>
              </div>

              {/* Minimal Career Growth Card */}
              <div className="absolute -bottom-8 -left-8 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-xs z-20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div className="font-bold text-xl tracking-tight">Career Growth</div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Certified professionals earn up to <span className="font-bold text-brand-orange">33% more</span> than their non-certified peers.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pathway Component */}
      <section className={sectionSurface('soft', 'py-32')}>
        <SectionAmbience tone="soft" />
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-none">
                The <span className="text-brand-orange">Certification</span> Journey
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                Choose the tier that matches your current experience and career goals. Each step is designed for maximum impact.
              </p>
            </motion.div>
          </div>
          <CertificationPathway 
            certificationName={certName} 
            family={cert.familyId} 
            tiers={pathway} 
            color={cert.color}
            gradient={cert.gradient}
          />
        </div>
      </section>

      {/* Detailed Certification Dossier Info */}
      <section className={sectionSurface('purple', 'py-32 border-y border-sandstone/60 dark:border-slate-800')}>
        <SectionAmbience tone="purple" />
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                {/* Core Details */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Target className="h-6 w-6 text-brand-orange" />
                    Target Audience & Prerequisites
                  </h3>
                  <div className="space-y-6">
                    <DossierCard title="Who is this for?">
                      <DossierBulletList
                        text={
                          cert.targetAudience ||
                          'Professionals looking to validate their expertise in this domain.'
                        }
                      />
                    </DossierCard>
                    <DossierCard title="Prerequisites">
                      <DossierBulletList
                        text={
                          cert.prerequisites ||
                          'Varies by experience level. Contact us for a personalized assessment.'
                        }
                      />
                    </DossierCard>
                  </div>
                </div>

                <ExpandableExamRegistration
                  examFormat={cert.examFormat}
                  registrationSteps={cert.registrationSteps}
                />

                {/* Learning Outcomes */}
                {cert.learningOutcomes && cert.learningOutcomes.length > 0 && (
                  <ExpandableLearningOutcomes outcomes={cert.learningOutcomes} />
                )}
              </div>

              <div className="space-y-8">
                {/* Fees & Costs */}
                <div className="p-8 rounded-[2rem] bg-slate-900 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-3xl" />
                  <h3 className="text-xl font-bold mb-6 relative z-10">Investment Details</h3>
                  <div className="space-y-6 relative z-10">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Official Exam Fee</h4>
                      <div className="text-lg font-bold text-brand-orange">{cert.officialFee || "Varies by region"}</div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Training Range</h4>
                      <div className="text-slate-300 text-sm">{cert.trainingPriceRange || "Market competitive rates"}</div>
                    </div>
                    <div className="pt-6 border-t border-white/10">
                      <p className="text-xs text-slate-400 leading-relaxed italic">
                        * Prices are sourced from official handbooks and may vary based on membership status and location.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Regional Demand */}
                <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-brand-orange" />
                    Market Demand
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {cert.regionalDemand || "High demand across global markets for certified professionals."}
                  </p>
                </div>

                {/* Suggested Resources */}
                {cert.suggestedResources && (
                  <div className="p-8 rounded-[2rem] bg-brand-orange/5 border border-brand-orange/10">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-brand-orange" />
                      Study Resources
                    </h3>
                    <ul className="space-y-3">
                      {cert.suggestedResources.map((resource, i) => (
                        <li key={i} className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose This Pathway */}
      <section className={sectionSurface('cool', 'py-32')}>
        <SectionAmbience tone="cool" />
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-none">Why Choose Our {certName} Pathway?</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">Independent exam prep focused on readiness and practical judgment.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Structured progression",
                  desc: "Foundation → Professional → Mastery with clear milestones.",
                  icon: Target
                },
                {
                  title: "Expert mentorship",
                  desc: "Certified mentors who have passed the exams you are targeting.",
                  icon: Sparkles
                },
                {
                  title: "Real-world application",
                  desc: "Concepts you can use on active projects — not exam trivia alone.",
                  icon: Zap
                },
                {
                  title: "Readiness focus",
                  desc: "Mocks, weak-area diagnosis, and mentor review on higher tiers.",
                  icon: ShieldCheck
                }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="shrink-0">
                    <div className="h-14 w-14 rounded-xl bg-slate-50 dark:bg-slate-800 text-brand-orange flex items-center justify-center">
                      <item.icon className="h-7 w-7" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{item.title}</h3>
                    <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={sectionSurface('soft', 'py-32')}>
        <SectionAmbience tone="soft" />
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-100 dark:bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800"
          >
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-brand-orange/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
                Ready to start your <br />
                <span className="text-brand-orange">professional</span> journey?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl mb-12 leading-relaxed font-medium max-w-2xl mx-auto">
                Structured pathways, practice, and advisory support for {certName}.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {enrollmentOpen ? (
                  <Link href={foundationCheckoutHref ?? "/contact"}>
                    <Button size="lg" variant="brand" className="h-14 px-10 rounded-2xl font-bold text-lg shadow-xl transition-all">
                      Enroll in Foundation
                    </Button>
                  </Link>
                ) : (
                  <Link href="/contact">
                    <Button size="lg" className="bg-brand-orange hover:bg-brand-hover text-white h-14 px-10 rounded-2xl font-bold text-lg shadow-xl transition-all">
                      Join waitlist — next cohort
                    </Button>
                  </Link>
                )}
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="h-14 px-10 rounded-2xl font-bold text-lg transition-all border border-slate-900/15 dark:border-white/10 bg-white dark:bg-transparent text-black dark:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    {CTAS.pathwayConsultation}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-t border-slate-100 dark:border-slate-800">
        <div className="container mx-auto max-w-3xl">
          <PricingComplianceNote className="text-center" />
          <p className="text-center mt-4 text-sm">
            <Link href="/legal/pricing-disclaimers" className="text-brand-orange font-bold hover:underline">
              Full pricing & certification disclaimers
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

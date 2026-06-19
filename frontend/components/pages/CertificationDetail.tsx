'use client';
import dynamic from 'next/dynamic';
import * as React from "react";
import Link from "next/link";
import { CertificationPathway } from "@/components/CertificationPathway";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, Award, ShieldCheck, TrendingUp, Target, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LazyMotion, domAnimation, m } from "motion/react";
import { cn } from "@/lib/utils";
import { PathwayTier } from "@/types/site";
import { certifications, familyConfigs } from "@/data/certification-index";
import { SectionAmbience, sectionSurface } from "@/components/SectionAmbience";
import { PathwayEnrollmentBadge } from "@/components/PathwayEnrollmentBadge";
import { useRegion } from "@/contexts/RegionContext";
import { buildPathwayTiersForCert } from "@/lib/pathway-from-catalogue";
import { getOfferingsForSiteCert } from "@/lib/regional-catalogue";
import { PricingComplianceNote } from "@/components/PricingComplianceNote";
import { pathwayEnrollLabelForTier } from '@/lib/pathway-tier-cta';
import { hrefForCtaAction } from "@/lib/cta-router";
import { canCheckout } from "@/lib/status-normalize";
import type { RegionId } from "@/types/regional-catalogue";
import {
  PUBLIC_NAVBAR_HEIGHT_CLASS,
  PUBLIC_NAVBAR_OFFSET_CLASS,
  PUBLIC_NAVBAR_TOP_CLASS,
  PUBLIC_SUBNAV_SPACER_CLASS,
} from "@/components/PublicShell";
import { useIsLgUp } from '@/hooks/useIsLgUp';
import { LazyWhenVisible } from '@/components/LazyWhenVisible';
import { usePublishedSiteDocument } from "@/lib/usePublishedSiteDocument";
import { FIELD_KEYS, parseCertificationsRegistry, type CertificationsRegistry } from "@pms/site-content";
import { resolveCertMarketing } from "@/lib/cert-detail";
import {
  DossierBulletList,
  DossierCard,
  ExpandableExamRegistration,
  ExpandableLearningOutcomes,
} from "@/components/CertDossierBlocks";
import { ConversionViewTracker } from '@/components/analytics/ConversionViewTracker';
import { CONVERSION_EVENTS } from '@/lib/analytics/conversion-events';
import { PmpRoadmapLeadForm } from '@/components/forms/PmpRoadmapLeadForm';
import { CertRoadmapCta } from '@/components/cert/CertProgramHighlightsSection';
import {
  CERT_ROADMAP_FORM_ANCHOR,
  getCertProgramOffer,
} from '@/lib/cert-program-offer';
import { EnrollReturnRecovery } from '@/components/conversion-recovery/EnrollReturnRecovery';
import { PmpEnrollTrackedLink } from '@/components/conversion-recovery/PmpEnrollTrackedLink';
import { markIntent } from '@/lib/conversion-recovery/engagement-score';
import { setEnrollStarted } from '@/lib/conversion-recovery/session-state';
import { CertComplianceNote } from '@/components/cert/CertComplianceNote';
import { Pmp2026ComplianceNote } from '@/components/pmp/Pmp2026ComplianceNote';
import { PmpRelatedFaqs } from '@/components/pmp/PmpRelatedFaqs';
import { PMP_PACKAGE_TIER_POSITIONING } from '@/content/pmp/program-offer';
import { T176_SCHOLARSHIP_SAFE_BLOCK } from '@/content/t176-claims';

const Pmp2026FlagshipSections = dynamic(
  () =>
    import('@/components/home/Pmp2026FlagshipSections').then((m) => ({
      default: m.Pmp2026FlagshipSections,
    })),
  { loading: () => null },
);
import { RelatedGuidesLinks } from '@/components/seo/RelatedGuidesLinks';
import { getPhase2RelatedBlock } from '@/content/seo/phase-2-page-seo';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import {
  getCertBreadcrumbItems,
  PMP_COMMERCIAL_LABEL,
} from '@/content/site-architecture/routes';

const CertProgramHighlightsContent = dynamic(
  () =>
    import('@/components/cert/CertProgramHighlightsSection').then((m) => ({
      default: m.CertProgramHighlightsContent,
    })),
  { loading: () => null },
);

function certHasOpenEnrollment(siteId: string, regionId: string): boolean {
  return getOfferingsForSiteCert(siteId).some((o) => {
    const s = o.regional[regionId as keyof typeof o.regional]?.status;
    return s === 'direct_checkout' || s === 'scholarship_verify';
  });
}

const emptyRegistry: CertificationsRegistry = { entries: [] };

export function CertificationDetail({
  certId,
  initialRegistry,
}: {
  certId: string;
  initialRegistry?: CertificationsRegistry;
}) {
  const isLgUp = useIsLgUp();
  const { regionId, gccCountry } = useRegion();
  const { data: registry } = usePublishedSiteDocument(FIELD_KEYS.CERTIFICATIONS_REGISTRY, {
    parse: (raw) => (raw ? parseCertificationsRegistry(raw) : null),
    initialData: initialRegistry ?? emptyRegistry,
  });
  const siteCert = certifications.find((c) => c.id === certId) || certifications[0];
  const registryEntry = registry?.entries.find((e) => e.id === siteCert.id && !e.archived);
  const cert = resolveCertMarketing(siteCert, registryEntry);
  const certName = cert.name;
  const family = familyConfigs[cert.familyId] || familyConfigs["PMI"];
  const enrollmentOpen = certHasOpenEnrollment(cert.id, regionId);

  const foundationOffering = React.useMemo(
    () => getOfferingsForSiteCert(cert.id).find((o) => o.tierId === 'foundation'),
    [cert.id],
  );

  const foundationCheckoutHref = React.useMemo(() => {
    if (!foundationOffering) return null;
    const status = foundationOffering.regional[regionId as RegionId]?.status;
    if (!canCheckout(status)) return null;
    return hrefForCtaAction('checkout', foundationOffering.offeringId, cert.id);
  }, [cert.id, foundationOffering, regionId]);

  const programOffer = React.useMemo(
    () => getCertProgramOffer(cert.id, certName, cert.familyId),
    [cert.id, certName, cert.familyId],
  );

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

  const breadcrumbLabel = cert.id === 'pmp' ? PMP_COMMERCIAL_LABEL : cert.detailHeroTitle;
  const breadcrumbs = getCertBreadcrumbItems(cert.id, breadcrumbLabel);

  return (
    <LazyMotion features={domAnimation} strict>
    <div
      className={cn(
        'flex flex-col min-h-screen selection:bg-brand-orange selection:text-white',
        /* Cancel main pt-16 so subnav can sit flush under the fixed navbar */
        PUBLIC_NAVBAR_OFFSET_CLASS,
      )}
    >
      <EnrollReturnRecovery siteCertId={cert.id} certName={certName} />
      {cert.id === 'pmp' ? (
        <ConversionViewTracker
          event={CONVERSION_EVENTS.VIEW_PMP_PATHWAY}
          pagePath="/certifications/pmp"
        />
      ) : null}
      {/* Subnav: fixed directly under navbar (avoids gap from main padding + sticky top) */}
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
          <Breadcrumbs items={breadcrumbs} className="mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <m.div
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

              <h1
                className={cn(
                  'font-heading text-hero font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight',
                  cert.id === 'pmp' && 'whitespace-nowrap',
                )}
              >
                {cert.id === 'pmp' ? (
                  <>
                    PMP <span className="text-brand-orange">Pathway</span>
                  </>
                ) : cert.detailHeroTitle.includes('Pathway') ? (
                  cert.detailHeroTitle
                ) : (
                  <>
                    {certName} <br />
                    <span className="text-brand-orange">Pathway</span>
                  </>
                )}
              </h1>

              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-xl leading-relaxed font-medium">
                {cert.detailHeroSubtitle}
              </p>

              {cert.id === 'pmp' ? (
                <RelatedGuidesLinks
                  title={getPhase2RelatedBlock('/certifications/pmp')?.title ?? 'Plan your PMP 2026 route'}
                  links={getPhase2RelatedBlock('/certifications/pmp')?.links ?? []}
                  currentPath="/certifications/pmp"
                  collapsible
                  className="mb-8"
                />
              ) : null}

              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm mb-10">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="h-5 w-5 text-brand-orange" />
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Primary Value</div>
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{cert.outputValueDisplay}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { icon: Clock, label: "Flexible Learning", color: "text-brand-orange" },
                  { icon: Award, label: "Global Recognition", color: "text-brand-deep" },
                  { icon: ShieldCheck, label: "Structured Preparation", color: "text-green-600" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className={cn("p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 transition-transform group-hover:scale-110", item.color)}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-200">{item.label}</span>
                  </div>
                ))}
              </div>
            </m.div>

            <m.div
              id={CERT_ROADMAP_FORM_ANCHOR}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative scroll-mt-40 lg:scroll-mt-48"
            >
              <PmpRoadmapLeadForm
                placement={isLgUp ? 'cert_hero' : 'cert_mobile'}
                variant="cert"
                certId={cert.id}
                certName={certName}
                familyId={cert.familyId}
              />
            </m.div>
          </div>
        </div>
      </section>

      {cert.id === 'pmp' && (regionId === 'gcc' || regionId === 'india' || regionId === 'pakistan') ? (
        <section className={sectionSurface('cool', 'py-16 border-b border-slate-100 dark:border-slate-800')}>
          <SectionAmbience tone="cool" />
          <div className="container relative z-10 mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              {regionId === 'gcc' ? 'GCC readiness positioning' : 'Career mobility positioning'}
            </h2>
            <p className="text-base font-medium leading-relaxed text-slate-600 dark:text-slate-400">
              {regionId === 'gcc'
                ? 'For GCC-based project professionals, PMP 2026 preparation should be structured around exam readiness, project-delivery context, and career mobility. PM Structure helps candidates build a readiness roadmap before choosing a study path or exam date.'
                : 'For South Asian project professionals targeting GCC or international opportunities, PMP 2026 readiness should be planned as a career-mobility step, not just a low-cost course purchase.'}
            </p>
            {regionId === 'india' || regionId === 'pakistan' ? (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{T176_SCHOLARSHIP_SAFE_BLOCK}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Pathway Component */}
      <section className={sectionSurface('soft', 'pt-10 pb-32')}>
        <SectionAmbience tone="soft" />
        <div className="container mx-auto">
          <div className="mb-20 pt-[40px] text-center">
            <m.div
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
              {cert.id === 'pmp' ? (
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
                  {(['foundation', 'professional', 'mastery'] as const).map((tierKey) => {
                    const tier = PMP_PACKAGE_TIER_POSITIONING[tierKey];
                    return (
                      <div
                        key={tierKey}
                        className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6"
                      >
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{tier.title}</h3>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{tier.positioning}</p>
                      </div>
                    );
                  })}
                </div>
              ) : null}
              {cert.id === 'pmp' ? (
                <p className="mt-8 text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                  {PMP_PACKAGE_TIER_POSITIONING.fallback}{' '}
                  <Link href="/faq" className="font-bold text-brand-orange hover:underline">
                    Compare tiers in FAQ
                  </Link>
                </p>
              ) : null}
            </m.div>
          </div>
          <CertificationPathway 
            certificationName={certName}
            siteCertId={cert.id}
            family={cert.familyId} 
            tiers={pathway} 
            color={cert.color}
            gradient={cert.gradient}
          />
        </div>
      </section>

      {/* Programme highlights + certification dossier */}
      <LazyWhenVisible minHeightClassName="min-h-[32rem]">
      <section
        className={sectionSurface(
          'purple',
          'border-y border-sandstone/60 dark:border-slate-800 pt-10 pb-32',
        )}
      >
        <SectionAmbience tone="purple" />
        <div className="container mx-auto">
          <CertProgramHighlightsContent
            offer={programOffer}
            roadmapAnchor={CERT_ROADMAP_FORM_ANCHOR}
            embedded
            className="mb-16 pt-[40px] sm:mb-20 md:mb-24"
          />
          <CertComplianceNote certId={cert.id} familyId={cert.familyId} className="mx-auto mb-16 max-w-6xl" />
          {cert.id === 'pmp' ? (
            <div className="mx-auto mb-16 max-w-6xl space-y-8">
              <Pmp2026ComplianceNote showSourceLinks />
              <PmpRelatedFaqs relatedPage="/certifications/pmp" limit={6} heading="PMP 2026 frequently asked questions" />
            </div>
          ) : null}
          {cert.id === 'pmp' ? <Pmp2026FlagshipSections /> : null}
          <div className="mx-auto max-w-6xl">
            <h2 className="sr-only">Certification details</h2>
            <div className="mb-10 border-t border-slate-200/80 pt-10 dark:border-slate-700/80 sm:mb-12 sm:pt-12">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Eligibility, exam &amp; investment
              </h3>
            </div>
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-3">
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

              <div className="space-y-8 lg:-mt-[40px]">
                {/* Fees & Costs */}
                <div className="rounded-[2rem] bg-slate-900 px-8 pb-8 pt-0 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-3xl" />
                  <div className="relative z-10 space-y-6">
                    <div className="pt-[15px]">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Official Exam Fee</h4>
                      <div className="text-lg font-bold text-brand-orange">{cert.officialFee || "Varies by region"}</div>
                    </div>
                    <div className="mb-[-10px]">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Training Range</h4>
                      <div className="text-slate-300 text-sm">{cert.trainingPriceRange || "Market competitive rates"}</div>
                    </div>
                    <div className="pt-[14px] border-t border-white/10">
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
      </LazyWhenVisible>

      {/* Final CTA */}
      <section className={sectionSurface('soft', 'py-32')}>
        <SectionAmbience tone="soft" />
        <div className="container mx-auto">
          <m.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-100 dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-24 text-center relative overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800"
          >
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-brand-orange/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                Ready for your{' '}
                <span className="text-brand-orange">{certName} roadmap</span>?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
                {programOffer.finalCtaSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <CertRoadmapCta
                  anchor={CERT_ROADMAP_FORM_ANCHOR}
                  label={programOffer.ctaLabel}
                  rounded="2xl"
                  className="shadow-xl transition-all"
                />
                {enrollmentOpen && foundationCheckoutHref ? (
                  cert.id === 'pmp' ? (
                    <PmpEnrollTrackedLink
                      href={foundationCheckoutHref}
                      tierSlug="foundation"
                      event={CONVERSION_EVENTS.CLICK_ENROLL_PMP_FOUNDATION}
                      className={cn(
                        buttonVariants({ size: 'lg', variant: 'outline' }),
                        'inline-flex min-h-14 h-auto w-full items-center justify-center whitespace-normal rounded-2xl border-2 px-5 py-3 text-center text-base font-bold leading-snug shadow-xl transition-all sm:w-auto sm:px-10 sm:py-0 sm:text-lg',
                      )}
                    >
                      Enroll in Foundation
                    </PmpEnrollTrackedLink>
                  ) : (
                    <Link
                      href={foundationCheckoutHref}
                      onClick={() => {
                        if (foundationOffering) {
                          setEnrollStarted(foundationOffering.offeringId, 'foundation', cert.id);
                          markIntent();
                        }
                      }}
                      className={cn(
                        buttonVariants({ size: 'lg', variant: 'outline' }),
                        'inline-flex min-h-14 h-auto w-full items-center justify-center whitespace-normal rounded-2xl border-2 px-5 py-3 text-center text-base font-bold leading-snug shadow-xl transition-all sm:w-auto sm:px-10 sm:py-0 sm:text-lg',
                      )}
                    >
                      {pathwayEnrollLabelForTier('foundation', cert.id)}
                    </Link>
                  )
                ) : null}
              </div>
            </div>
          </m.div>
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
    </LazyMotion>
  );
}
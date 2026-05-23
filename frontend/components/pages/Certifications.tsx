'use client';
import { motion, AnimatePresence } from "motion/react";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { 
  ArrowRight, 
  Clock, 
  Tag, 
  CheckCircle2,
  Search,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as siteData from "@/data/siteData";
import type { CertificationSummary } from "@/types/site";
import { CERTIFICATIONS_COPY, CTAS } from "@/lib/brand-voice";
import { PathwayFeaturedCard } from "@/components/PathwayFeaturedCard";
import { PAGE_HERO_PADDING, SectionAmbience, sectionSurface } from "@/components/SectionAmbience";
import { PathwayEnrollmentBadge } from "@/components/PathwayEnrollmentBadge";
import { CertificationHubActions } from "@/components/CertificationHubActions";
import { useRegion } from "@/contexts/RegionContext";
import {
  isEnrollmentOpen,
  PATHWAY_FAMILY_TABS,
  pickFeaturedPathwayCerts,
  type PathwayFamilyTab,
} from "@/lib/certification-enrollment";

const FAMILY_TAB_LABEL: Record<PathwayFamilyTab, string> = {
  PMI: "PMI®",
  PRINCE2: "PRINCE2®",
  SixSigma: "Lean Six Sigma",
};

const FAMILY_TAB_SELECTED: Record<PathwayFamilyTab, string> = {
  PMI: "bg-pms-gradient-orange text-white shadow-lg shadow-brand-orange/25 border-transparent",
  PRINCE2:
    "bg-pms-gradient-blue-cyan text-white shadow-lg shadow-[#0859b3]/20 border-transparent",
  SixSigma:
    "bg-pms-gradient-charcoal text-white shadow-lg shadow-slate-900/30 border-transparent",
};

const FAMILY_TAB_IDLE: Record<PathwayFamilyTab, string> = {
  PMI: "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-orange-50/80 dark:hover:bg-orange-950/30 hover:text-brand-orange border-transparent",
  PRINCE2:
    "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-cyan-50/60 dark:hover:bg-cyan-950/20 hover:text-[#0859b3] dark:hover:text-brand-cyan border-transparent",
  SixSigma:
    "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200 border-transparent",
};

function CertificationFamilyTabs({
  activeTab,
  onChange,
}: {
  activeTab: PathwayFamilyTab;
  onChange: (tab: PathwayFamilyTab) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Certification families"
      className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 rounded-[1.75rem] border border-slate-200/80 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 p-2.5 sm:p-3 shadow-sm backdrop-blur-sm"
    >
      {PATHWAY_FAMILY_TABS.map((familyId) => {
        const selected = activeTab === familyId;
        return (
          <button
            key={familyId}
            type="button"
            role="tab"
            aria-selected={selected ? "true" : "false"}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(familyId)}
            className={cn(
              "min-h-[3.25rem] w-full px-4 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg text-center transition-all duration-200 border",
              selected ? FAMILY_TAB_SELECTED[familyId] : FAMILY_TAB_IDLE[familyId],
            )}
          >
            {FAMILY_TAB_LABEL[familyId]}
          </button>
        );
      })}
    </div>
  );
}
const certifications = siteData.certifications.filter((c) =>
  PATHWAY_FAMILY_TABS.includes(c.familyId as PathwayFamilyTab),
);

export function Certifications() {
  const { regionId } = useRegion();
  const sortByEnrollmentThenName = React.useCallback(
    (a: CertificationSummary, b: CertificationSummary) => {
      const aOpen = isEnrollmentOpen(a.id, regionId) ? 0 : 1;
      const bOpen = isEnrollmentOpen(b.id, regionId) ? 0 : 1;
      if (aOpen !== bOpen) return aOpen - bOpen;
      return a.name.localeCompare(b.name);
    },
    [regionId],
  );
  const [activeTab, setActiveTab] = React.useState<PathwayFamilyTab>("PMI");
  const [searchQuery, setSearchQuery] = React.useState("");

  const familyCerts = (familyId: PathwayFamilyTab) => {
    const q = searchQuery.trim().toLowerCase();
    return certifications
      .filter((cert) => cert.familyId === familyId)
      .filter(
        (cert) =>
          !q ||
          cert.name.toLowerCase().includes(q) ||
          cert.desc.toLowerCase().includes(q),
      )
      .sort(sortByEnrollmentThenName);
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-brand-orange selection:text-white">
      {/* Hero Section */}
      <section
        className={cn(
          'relative overflow-hidden bg-gradient-to-b from-orange-50/80 via-slate-50 to-slate-50 dark:from-[#1a0f0c] dark:via-slate-950 dark:to-slate-950',
          PAGE_HERO_PADDING,
        )}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-15%] right-[-10%] w-[45%] h-[50%] rounded-full blur-[120px] opacity-35 bg-pms-gradient-orange" />
          <div className="absolute bottom-[-20%] left-[-15%] w-[40%] h-[45%] rounded-full blur-[120px] opacity-25 bg-pms-gradient-orange" />
          <div className="absolute top-[20%] left-[30%] w-[25%] h-[30%] rounded-full blur-[100px] opacity-15 bg-pms-gradient-blue-purple dark:opacity-20" />
        </div>
        
        <div className="container relative z-10 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
              {CERTIFICATIONS_COPY.heroBadge}
            </Badge>
            <h1 className="font-heading text-hero font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
              Find your <span className="text-pms-gradient-orange">pathway</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
              {CERTIFICATIONS_COPY.heroSubtitle}
            </p>

            <div className="mt-10 max-w-3xl mx-auto space-y-4">
              <div className="relative w-full group">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-orange transition-colors pointer-events-none"
                  aria-hidden
                />
                <label htmlFor="cert-family-search" className="sr-only">
                  Search certifications in the active family
                </label>
                <input
                  id="cert-family-search"
                  type="search"
                  placeholder={`Search ${FAMILY_TAB_LABEL[activeTab]} pathways…`}
                  className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-700 shadow-lg shadow-slate-900/5 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 font-bold text-base transition-all dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <CertificationHubActions className="justify-center" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content — full-width section (same pattern as Home Featured Pathways) */}
      <section className={sectionSurface('soft', 'py-32 relative')}>
        <SectionAmbience tone="soft" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="container relative z-10 mx-auto"
        >
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as PathwayFamilyTab)}
            className="w-full flex flex-col"
          >
            <div className="mb-12 w-full max-w-none">
              <CertificationFamilyTabs
                activeTab={activeTab}
                onChange={(tab) => setActiveTab(tab)}
              />
            </div>

              {PATHWAY_FAMILY_TABS.map((familyId) => {
                const family = siteData.familyConfigs[familyId];
                const certs = familyCerts(familyId);
                const openCerts = certs.filter((c) => isEnrollmentOpen(c.id, regionId));
                const closedCerts = certs.filter((c) => !isEnrollmentOpen(c.id, regionId));
                const featuredTop = pickFeaturedPathwayCerts(certs, familyId);
                const featuredIds = new Set(featuredTop.map((c) => c.id));
                const moreOpen = openCerts.filter((c) => !featuredIds.has(c.id));
                const closedRest = closedCerts.filter((c) => !featuredIds.has(c.id));

                return (
                  <TabsContent key={familyId} value={familyId} className="mt-0 data-[hidden]:hidden">
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-base md:text-lg leading-relaxed mb-10 max-w-3xl mx-auto text-center md:text-left md:mx-0">
                      {family.description}
                    </p>

                    {certs.length === 0 ? (
                      <div className="py-24 text-center">
                        <Search className="h-12 w-12 text-slate-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold mb-3 dark:text-white">No pathways match your search</h3>
                        <Button
                          variant="link"
                          className="text-brand-orange font-bold"
                          onClick={() => setSearchQuery("")}
                        >
                          Clear search
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-10">
                        {featuredTop.length > 0 && (
                          <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 text-center md:text-left">
                              Flagship pathways
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              <AnimatePresence mode="popLayout">
                                {featuredTop.map((cert) => (
                                  <motion.div
                                    key={cert.id}
                                    layout
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 12 }}
                                    transition={{ duration: 0.35 }}
                                    className="h-full motion-reduce:transform-none"
                                  >
                                    <PathwayFeaturedCard
                                      cert={cert}
                                      familyLabel={cert.familyId}
                                      layout="catalog"
                                    />
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>
                          </div>
                        )}

                        {moreOpen.length > 0 && (
                          <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
                              More open pathways
                            </h3>
                            <ul className="rounded-2xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-800/30">
                              {moreOpen.map((cert) => (
                                <PathwayCompactRow key={cert.id} cert={cert} />
                              ))}
                            </ul>
                          </div>
                        )}

                        {closedRest.length > 0 && (
                          <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
                              {openCerts.length > 0
                                ? CERTIFICATIONS_COPY.familyMorePathways
                                : CERTIFICATIONS_COPY.nextCohortLabel}
                            </h3>
                            <ul className="rounded-2xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-800/30">
                              {closedRest.map((cert) => (
                                <PathwayCompactRow key={cert.id} cert={cert} />
                              ))}
                            </ul>
                            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                              {CERTIFICATIONS_COPY.nextCohortHint}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
        </motion.div>
      </section>

      {/* Pathway consultation */}
      <section className={sectionSurface('cool', 'py-24 overflow-hidden')}>
        <SectionAmbience tone="cool" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100/80 dark:bg-slate-800 z-[1]" />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row gap-12 items-center"
          >
            <div className="lg:w-1/2">
              <Badge className="mb-6 bg-pms-gradient-orange text-white border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">Pathway advisory</Badge>
              <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                Not sure which <br />
                <span className="text-pms-gradient-orange">pathway fits?</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium text-lg leading-relaxed mb-8 max-w-xl">
                We map your experience, timeline, and study capacity to the right PMI, PRINCE2, or Six Sigma route.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <Clock className="h-6 w-6 text-brand-orange mb-3" />
                  <div className="text-xs font-black uppercase text-slate-400 mb-1">Start with</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">Your timeline</div>
                </div>
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <Tag className="h-6 w-6 text-brand-orange mb-3" />
                  <div className="text-xs font-black uppercase text-slate-400 mb-1">Then assess</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">Readiness gap</div>
                </div>
              </div>
              <Link href="/contact">
                <Button size="lg" className="h-14 px-8 rounded-2xl bg-brand-orange hover:bg-brand-hover text-white font-bold text-base transition-all">
                  {CTAS.pathwayConsultation}
                </Button>
              </Link>
            </div>

            <div className="lg:w-1/2 w-full">
              <div className="bg-pms-navy rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl border border-slate-800 group">
                <div className="absolute top-0 right-0 w-64 h-64 opacity-40 bg-pms-gradient-blue-purple blur-[100px] -mr-32 -mt-32" />
                
                <h3 className="text-2xl font-bold text-white mb-8 relative z-10 flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-brand-orange" />
                  How we guide your decision
                </h3>
                
                <ul className="space-y-6 relative z-10">
                  {[
                    { title: "Certification target", desc: "PMI, PRINCE2, Six Sigma, or hybrid — matched to your role." },
                    { title: "Weekly capacity", desc: "Foundation, Professional, or Mastery to fit your schedule." },
                    { title: "Readiness gap", desc: "Content, mocks, governance, or mentorship — what comes first." }
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-5">
                      <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 mt-1">
                        <CheckCircle2 className="h-5 w-5 text-brand-orange" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white mb-1">{item.title}</div>
                        <div className="text-sm text-slate-400 font-medium">{item.desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Unified High-Impact CTA Section */}
      <section className={sectionSurface('warm', 'py-32')}>
        <SectionAmbience tone="warm" />
        <div className="container relative z-10 mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl group [&_h2]:!text-white dark:[&_h2]:!text-slate-900"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/10 via-transparent to-brand-purple/10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/20 blur-[120px] -mr-48 -mt-48 transition-all group-hover:bg-brand-orange/30 duration-700" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <Badge className="mb-8 bg-brand-orange text-white border-none px-6 py-2 text-xs font-black uppercase tracking-[0.3em] rounded-full">Personalized Roadmap</Badge>
              <h2 className="text-4xl md:text-7xl font-bold text-white dark:text-slate-900 mb-8 tracking-tight leading-[1.1] md:px-12">
                Not sure which path <span className="text-brand-orange">is right for you?</span>
              </h2>
              <p className="text-slate-300 dark:text-slate-600 text-lg md:text-2xl mb-14 leading-relaxed font-medium max-w-3xl mx-auto">
                Our certification experts can help you map out a personalized professional development 
                plan based on your experience and career aspirations.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/certifications/compare">
                  <Button size="lg" variant="brand" className="h-16 px-10 rounded-2xl font-bold text-lg shadow-xl transition-all hover:scale-105">
                    Compare Frameworks
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-16 px-10 rounded-2xl border-white/30 bg-white text-black hover:bg-slate-100 hover:text-black dark:border-slate-300 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 dark:hover:text-white font-bold text-lg transition-all"
                  >
                    Talk to an Advisor
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function PathwayCompactRow({ cert }: { cert: CertificationSummary }) {
  return (
    <li>
      <Link
        href={`/certifications/${cert.id}`}
        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 px-5 py-4 hover:bg-white/80 dark:hover:bg-slate-900/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-bold text-slate-900 dark:text-white">{cert.name}</span>
            <PathwayEnrollmentBadge certId={cert.id} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
            {cert.outputValue}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-orange shrink-0">
          View overview
          <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    </li>
  );
}

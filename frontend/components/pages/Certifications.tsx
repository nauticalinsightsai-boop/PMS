'use client';
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowRight, 
  Clock, 
  Tag, 
  CheckCircle2,
  Search,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as siteData from "@/data/siteData";
import type { CertificationSummary } from "@/types/site";
import { CERTIFICATIONS_COPY, CTAS } from "@/lib/brand-voice";
import { CertificationPathwayVisual } from "@/components/CertificationPathwayVisual";
import { SectionAmbience, sectionSurface } from "@/components/SectionAmbience";
import { PathwayEnrollmentBadge } from "@/components/PathwayEnrollmentBadge";
import {
  isEnrollmentOpen,
  PATHWAY_FAMILY_TABS,
  type PathwayFamilyTab,
} from "@/lib/certification-enrollment";
import { useRegion } from "@/contexts/RegionContext";
import { getCertDurationLabel, getListingPriceForCert } from "@/lib/regional-catalogue";
import { RegionalPrice } from "@/components/RegionalPrice";

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
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

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
    <div ref={containerRef} className="flex flex-col min-h-screen selection:bg-brand-orange selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-28 overflow-hidden bg-gradient-to-b from-orange-50/80 via-slate-50 to-slate-50 dark:from-[#1a0f0c] dark:via-slate-950 dark:to-slate-950">
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
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
              Find your <span className="text-pms-gradient-orange">pathway</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
              {CERTIFICATIONS_COPY.heroSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 -mt-20 relative z-20">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-800"
          >
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PathwayFamilyTab)} className="w-full">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
                <TabsList className="bg-slate-50 dark:bg-slate-800/50 p-1.5 h-auto flex-wrap justify-start rounded-2xl border border-slate-100 dark:border-slate-800">
                  <TabsTrigger value="PMI" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-brand-orange data-[state=active]:text-white font-bold text-sm transition-all">
                    PMI®
                  </TabsTrigger>
                  <TabsTrigger value="PRINCE2" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-teal-600 data-[state=active]:text-white font-bold text-sm transition-all">
                    PRINCE2®
                  </TabsTrigger>
                  <TabsTrigger value="SixSigma" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-slate-700 data-[state=active]:text-white font-bold text-sm transition-all">
                    Lean Six Sigma
                  </TabsTrigger>
                </TabsList>

                <div className="relative max-w-md w-full group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-orange transition-colors" />
                  <input
                    type="text"
                    placeholder="Search this family..."
                    className="w-full h-14 pl-14 pr-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 font-bold text-base transition-all dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {PATHWAY_FAMILY_TABS.map((familyId) => {
                const family = siteData.familyConfigs[familyId];
                const certs = familyCerts(familyId);
                const openCerts = certs.filter((c) => isEnrollmentOpen(c.id, regionId));
                const closedCerts = certs.filter((c) => !isEnrollmentOpen(c.id, regionId));

                return (
                  <TabsContent key={familyId} value={familyId} className="mt-0">
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-base leading-relaxed mb-8 max-w-3xl">
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
                        {openCerts.length > 0 && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
                            <AnimatePresence mode="popLayout">
                              {openCerts.map((cert) => (
                                <PathwayFeaturedCard key={cert.id} cert={cert} familyName={family.name} />
                              ))}
                            </AnimatePresence>
                          </div>
                        )}

                        {closedCerts.length > 0 && (
                          <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
                              {openCerts.length > 0
                                ? CERTIFICATIONS_COPY.familyMorePathways
                                : CERTIFICATIONS_COPY.nextCohortLabel}
                            </h3>
                            <ul className="rounded-2xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-800/30">
                              {closedCerts.map((cert) => (
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
        </div>
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
                <Button size="lg" className="h-16 px-10 rounded-2xl bg-brand-orange hover:bg-brand-deep text-white font-bold text-lg shadow-xl transition-all hover:scale-105">
                  Compare Frameworks
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 px-10 rounded-2xl border-white/30 bg-white text-black hover:bg-slate-100 hover:text-black dark:border-slate-300 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 dark:hover:text-white font-bold text-lg transition-all"
                >
                  Talk to an Advisor
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function PathwayFeaturedCard({
  cert,
  familyName,
}: {
  cert: CertificationSummary;
  familyName: string;
}) {
  const { regionId, gccCountry } = useRegion();
  const listing = getListingPriceForCert(cert.id, regionId, gccCountry);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.35 }}
      className="lg:max-w-xl"
    >
      <Card className="h-full flex flex-col gap-0 border border-slate-100 dark:border-slate-800 py-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden ring-2 ring-brand-orange/20">
        <CertificationPathwayVisual cert={cert} />
        <CardHeader className="p-5 pb-2">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="w-fit bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none text-[10px] font-bold px-3 py-1">
              {familyName}
            </Badge>
            <PathwayEnrollmentBadge certId={cert.id} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight mb-3 leading-tight">
            {cert.name}
          </CardTitle>
          <div className="flex items-center gap-2 mb-4 p-2 rounded-xl bg-brand-orange/5 border border-brand-orange/10">
            <Zap className="h-3 w-3 text-brand-orange shrink-0" />
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
              {cert.outputValue}
            </span>
          </div>
          <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {cert.desc}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 px-5 pb-5">
          <div className="flex flex-wrap gap-2 mb-5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tight">
              <Clock className="h-3 w-3 text-brand-orange" />
              <span>{getCertDurationLabel(cert.id) ?? cert.pricing?.Foundation?.duration ?? 'Flexible'}</span>
            </div>
            {listing.active && (
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                <RegionalPrice
                  original={listing.original}
                  active={listing.active}
                  membership={listing.membership}
                  showScholarshipLabels={listing.showScholarship}
                  regionalLabel={listing.regionalLabel}
                  footnote={listing.footnote}
                  compact
                />
              </div>
            )}
          </div>
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
        <CardFooter className="px-5 pb-5 pt-6">
          <Link href={`/certifications/${cert.id}`} className="w-full">
            <Button className="w-full h-12 rounded-2xl font-bold text-base bg-brand-orange hover:bg-brand-hover text-white transition-all">
              View pathway
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
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

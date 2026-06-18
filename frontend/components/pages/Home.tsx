'use client';
import dynamic from 'next/dynamic';
import { motion } from "motion/react";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Trophy, 
  BookOpen, 
  Zap, 
  TrendingUp, 
  LayoutGrid, 
  Calendar, 
  FileText, 
  LayoutDashboard, 
  Map, 
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebsiteData } from "@/services/WebsiteDataService";
import { BRAND, CTAS, HOME_COPY } from "@/lib/brand-voice";
import { MARKETING_STOCK_IMAGES, MARKETING_HERO_SOCIAL_AVATARS, marketingTestimonialAvatar } from "@/lib/marketing-stock-images";
import type { HomePageConfigV2 } from '@pms/site-content';
import { PathwayFeaturedCard } from "@/components/PathwayFeaturedCard";
import { FamilyExploreCard } from "@/components/FamilyExploreCard";
import { SectionAmbience, sectionSurface } from "@/components/SectionAmbience";
import { MembershipDualPrice } from '@/components/MembershipDualPrice';
import { MEMBERSHIP_PRICING } from '@/lib/membership-plans';
import { useHomePageConfig } from '@/lib/home-config';
import { PmpRoadmapLeadForm } from '@/components/forms/PmpRoadmapLeadForm';
import { ResponsiveSnapScroll } from '@/components/ResponsiveSnapScroll';
import { PmpRoadmapCtaLink, ComparePathwaysCtaLink } from '@/components/pmp/PmpRoadmapCtaLink';
import { PMP_ROADMAP_FORM_ANCHOR } from '@/content/pmp/program-offer';
import { T169_SUPPORT_COPY } from '@/content/pmp/flagship-t169';
import { COMPARE_PATHWAYS_HREF, PMP_ROADMAP_CTA_HREF } from '@/lib/pmp-roadmap-cta';
import { getT169FeaturedCardOverrides } from '@/lib/t169-featured-cards';
import { PMS_SKOOL_COMMUNITY_JOIN_URL, externalHrefLinkProps } from '@/config/pms-site';
import {
  T176_COMMUNITY_NOTE,
  T176_HOMEPAGE_CERT_DISCLAIMER,
  T176_SOCIAL_PROOF_REPLACEMENT,
  T176_SOCIAL_PROOF_REGIONAL,
} from '@/content/t176-claims';
import { NewsletterSubscribeForm } from '@/components/forms/NewsletterSubscribeForm';

const Pmp2026FlagshipSections = dynamic(
  () =>
    import('@/components/home/Pmp2026FlagshipSections').then((m) => ({
      default: m.Pmp2026FlagshipSections,
    })),
  { loading: () => null },
);

const HomeTestimonialsSection = dynamic(
  () =>
    import('@/components/home/HomeTestimonialsSection').then((m) => ({
      default: m.HomeTestimonialsSection,
    })),
  { loading: () => null },
);

import * as siteData from "@/data/siteData";

/** Featured Pathways: exactly 6 cards in 2 rows × 3 columns on lg+ */
const featuredPathways = siteData.featuredCertifications;

const SECTION_PY = 'py-16 sm:py-20 md:py-24 lg:py-32';
const SECTION_HEADING_MB = 'mb-10 md:mb-16 lg:mb-20';
const HERO_BTN =
  'w-full sm:w-auto bg-brand-orange hover:bg-brand-hover text-white h-12 sm:h-14 px-6 sm:px-8 rounded-full font-bold text-base sm:text-lg shadow-lg shadow-brand-orange/20 transition-all';
const HERO_BTN_OUTLINE =
  'w-full sm:w-auto border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 h-12 sm:h-14 px-6 sm:px-8 rounded-full font-bold text-base sm:text-lg transition-all';

export function Home({ initialHomeConfig }: { initialHomeConfig?: HomePageConfigV2 }) {
  const { get } = useWebsiteData();
  const homeCms = useHomePageConfig();
  const serverSlide =
    initialHomeConfig?.heroSlides.find((slide) => slide.visible) ??
    initialHomeConfig?.heroSlides[0];
  const [reduceMotion, setReduceMotion] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const featuredFromCms = homeCms.featuredCertIds
    .map((id) => {
      const featured = siteData.featuredCertifications.find((item) => item.id === id);
      if (featured) return featured;
      const cert = siteData.certifications.find((item) => item.id === id);
      if (!cert) return null;
      return {
        id: cert.id,
        title: cert.name,
        desc: cert.desc,
        family: cert.familyId,
        color: cert.color,
      };
    })
    .filter((item): item is (typeof siteData.featuredCertifications)[number] => Boolean(item));
  const featuredPathwaysResolved =
    featuredFromCms.length > 0 ? featuredFromCms.slice(0, 6) : featuredPathways;
  const finalCta = homeCms.activeCta;
  const sections = homeCms.sections;
  const statsCount = homeCms.stats?.professionalsCount ?? initialHomeConfig?.stats?.professionalsCount ?? 1284;
  const statsLabel = homeCms.stats?.professionalsLabel ?? initialHomeConfig?.stats?.professionalsLabel ?? 'professionals in the network';
  const heroTitle =
    homeCms.heroTitle || serverSlide?.heading || get('hero_title', HOME_COPY.heroTitle);
  const heroSubtitle =
    homeCms.heroSubtitle || serverSlide?.description || get('hero_subtitle', HOME_COPY.heroSubtitle);
  const testimonials =
    homeCms.visibleTestimonials.length > 0
      ? homeCms.visibleTestimonials.map((t) => ({
          id: t.id,
          name: t.name,
          role: t.role,
          content: t.quote,
          avatar: t.avatarUrl ?? marketingTestimonialAvatar(Number(t.id) || 0),
          company: '',
        }))
      : siteData.testimonials;
  const insightsItems = homeCms.insightsBand?.items ?? [
    { title: "AI in Project Management", desc: "How to leverage generative AI for planning and risk assessment.", href: "/newsletter/ai-augmented-project-manager" },
    { title: "2026 Salary Trends", desc: "The latest data on certification ROI across global markets.", href: "/newsletter/2026-pmp-exam-changes" },
    { title: "Hybrid Leadership", desc: "Mastering the balance between predictive and agile frameworks.", href: "/newsletter/hybrid-methodologies-enterprise" },
  ];

  const renderPrimaryCta = () => {
    const action = homeCms.primaryAction;
    const primaryLink = homeCms.ctaPrimaryLink || PMP_ROADMAP_CTA_HREF;
    const label =
      homeCms.ctaPrimary ||
      get('cta_primary', HOME_COPY.ctaPrimary);
    const btnClass = HERO_BTN;

    if (
      action === 'link' &&
      (primaryLink.includes(PMP_ROADMAP_FORM_ANCHOR) || primaryLink === PMP_ROADMAP_CTA_HREF)
    ) {
      return (
        <PmpRoadmapCtaLink
          label={label}
          className={cn(btnClass, 'w-full sm:w-auto')}
        />
      );
    }

    if (action === 'link') {
      const href = homeCms.ctaPrimaryLink || '/membership';
      return (
        <Link href={href} className="block w-full sm:w-auto">
          <Button size="lg" className={btnClass}>{label}</Button>
        </Link>
      );
    }

    const useHeroConsultationCalendly =
      action === 'calendly' ||
      action === 'register_modal' ||
      (action === 'contact' && primaryLink.includes('topic=consultation'));

    if (useHeroConsultationCalendly) {
      return (
        <PmpRoadmapCtaLink
          label={label || CTAS.pmp2026Roadmap}
          className={cn(btnClass, 'w-full sm:w-auto')}
        />
      );
    }

    return (
      <PmpRoadmapCtaLink
        label={label || CTAS.pmp2026Roadmap}
        className={cn(btnClass, 'w-full sm:w-auto')}
      />
    );
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-clip selection:bg-brand-orange selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-0 md:min-h-[85vh] lg:min-h-[90vh] flex items-center pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24 overflow-x-hidden max-lg:overflow-y-visible lg:overflow-hidden bg-gradient-to-br from-violet-50/70 via-background to-orange-50/30 dark:from-[#0f0e38] dark:via-[#07071c] dark:to-[#12081a]">
        {/* PMS gradient ambient: orange + blue-purple from logo system */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-12%] right-[-8%] w-[42%] h-[42%] rounded-full blur-[120px] opacity-30 bg-pms-gradient-orange" />
          <div className="absolute bottom-[-15%] left-[-12%] w-[48%] h-[48%] rounded-full blur-[120px] opacity-40 bg-pms-gradient-blue-purple" />
          <div className="absolute top-[15%] left-[-5%] w-[32%] h-[38%] rounded-full blur-[110px] opacity-25 bg-pms-gradient-blue-purple dark:opacity-35" />
          <div className="absolute bottom-[10%] right-[5%] w-[28%] h-[32%] rounded-full blur-[100px] opacity-20 bg-pms-gradient-blue-cyan dark:opacity-25" />
        </div>

        <div className="container relative z-10 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-center">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.6 }}
              className="relative z-10 min-w-0"
            >
              <Badge className="mb-4 sm:mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                {get('hero_badge', HOME_COPY.heroBadge)}
              </Badge>
              
              <h1 className="font-heading text-hero font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight leading-[1.1] text-balance">
                {heroTitle}
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 max-w-lg leading-relaxed font-medium">
                {heroSubtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="w-full sm:w-auto">{renderPrimaryCta()}</div>
                <ComparePathwaysCtaLink buttonClassName={HERO_BTN_OUTLINE} />
              </div>

              <p className="mt-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed font-medium">
                {HOME_COPY.heroMicrocopy}
              </p>
              
              <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="flex -space-x-3">
                  {MARKETING_HERO_SOCIAL_AVATARS.map((avatar) => (
                    <div key={avatar.src} className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-950 overflow-hidden shadow-sm">
                      <img
                        src={avatar.src}
                        alt={avatar.alt}
                        width={avatar.width}
                        height={avatar.height}
                        aria-hidden
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm font-medium text-slate-500">
                  <span className="text-slate-900 dark:text-white font-bold">{statsCount.toLocaleString()}</span> {statsLabel}
                </div>
              </div>
            </motion.div>

            <div id={PMP_ROADMAP_FORM_ANCHOR} className="scroll-mt-24 contents">
              {/* Hero lead form: tablet/mobile */}
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.7 }}
                className="relative z-20 lg:hidden"
              >
                <PmpRoadmapLeadForm placement="home_hero_mobile" variant="hero" />
              </motion.div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.8 }}
                className="relative z-30 isolate hidden lg:block"
              >
                <PmpRoadmapLeadForm placement="home_hero_desktop" variant="hero" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Pmp2026FlagshipSections />

      {(sections?.latestNews !== false) && homeCms.latestNews.length > 0 && (
        <section className={`${SECTION_PY} bg-white dark:bg-slate-950`}>
          <div className="container mx-auto">
            <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 ${SECTION_HEADING_MB}`}>
              <div>
                <Badge className="mb-4 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Latest News
                </Badge>
                <h2 className="font-heading text-section font-bold text-slate-900 dark:text-white tracking-tight">
                  From the PMStructure desk
                </h2>
              </div>
              <Link href="/newsletter">
                <Button variant="ghost" className="text-brand-orange font-bold rounded-full px-6">
                  View Newsletter <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homeCms.latestNews.map((item) => (
                <Card key={item.id} className="rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6">
                  <CardHeader className="p-0 mb-4">
                    <h3 className="text-2xl font-bold tracking-tight">{item.title}</h3>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </CardContent>
                  {item.link && (
                    <CardFooter className="p-0 pt-6">
                      <Link href={item.link}>
                        <Button variant="link" className="p-0 h-auto text-brand-orange font-bold">
                          Read article: {item.title} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {(sections?.featuredPathways !== false) && (
      <section className={sectionSurface('soft', SECTION_PY)}>
        <SectionAmbience tone="soft" />
        <div className="container relative z-10 mx-auto">
          <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 ${SECTION_HEADING_MB}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-section font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-4 sm:mb-6">
                {homeCms.featuredPathways?.title ?? (
                  <>Featured <span className="text-pms-gradient-orange">Pathways</span></>
                )}
              </h2>
              <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-lg font-medium leading-relaxed">
                {homeCms.featuredPathways?.subtitle ?? get('featured_subtitle', HOME_COPY.featuredSubtitle)}
              </p>
            </motion.div>
            <Link href="/certifications">
              <Button variant="ghost" className="text-brand-orange font-bold text-lg hover:bg-brand-orange/5 rounded-full px-6">
                View All Certifications
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <ResponsiveSnapScroll
            desktopLayoutClassName="md:grid md:grid-cols-2 lg:grid-cols-3"
            gapClassName="gap-6 md:gap-8"
            mobileItemClassName="w-[min(92vw,19rem)]"
          >
            {featuredPathwaysResolved.map((featured, index) => {
              const cert = siteData.certifications.find(c => c.id === featured.id) || siteData.certifications[0];
              const t169 = getT169FeaturedCardOverrides(featured.id);
              
              return (
                <motion.div
                  key={featured.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <PathwayFeaturedCard
                    cert={cert}
                    familyLabel={featured.family}
                    badgeLabel={t169?.badgeLabel}
                    title={t169?.title ?? featured.title}
                    description={t169?.description ?? featured.desc}
                    metaLine={t169?.metaLine}
                    ctaLabel={t169?.ctaLabel}
                    ctaHref={t169?.ctaHref}
                    visualSubtitle={t169?.title ?? featured.title}
                  />
                </motion.div>
              );
            })}
          </ResponsiveSnapScroll>
          <p className="mt-10 max-w-3xl text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
            {T176_HOMEPAGE_CERT_DISCLAIMER}
          </p>
        </div>
      </section>
      )}

      {(sections?.programFamilies !== false) && (
      <section className={sectionSurface('purple', SECTION_PY)}>
        <SectionAmbience tone="purple" />
        <div className="container relative z-10 mx-auto">
          <div className={`text-center max-w-3xl mx-auto ${SECTION_HEADING_MB}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-section font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight leading-none">
                {get('frameworks_title', HOME_COPY.frameworksTitle)}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                {get('frameworks_subtitle', HOME_COPY.frameworksSubtitle)}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {(["PMI", "PRINCE2", "SixSigma"] as const)
              .filter((familyId) => {
                const cfg = homeCms.programFamilies.find((f) => f.familyId === familyId);
                return cfg ? cfg.visible : true;
              })
              .map((familyId, index) => (
              <FamilyExploreCard
                key={familyId}
                family={siteData.familyConfigs[familyId]}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
      )}

      {(sections?.insightsBand !== false) && (
      <section className={`${SECTION_PY} bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900 relative overflow-x-hidden max-lg:overflow-y-visible lg:overflow-hidden [&_h2]:!text-white dark:[&_h2]:!text-slate-900 [&_h4]:!text-white dark:[&_h4]:!text-pms-navy`}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[35%] h-[35%] rounded-full blur-[100px] opacity-30 dark:opacity-50 bg-pms-gradient-blue-purple" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full blur-[100px] opacity-25 dark:opacity-40 bg-pms-gradient-orange" />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-section font-bold text-white dark:text-slate-900 mb-6 sm:mb-8 tracking-tight leading-tight">
                {homeCms.insightsBand?.title ?? (<>Insights for the Future of <span className="text-pms-gradient-orange">Project Leadership</span></>)}
              </h2>
              <p className="text-lg text-slate-300 dark:text-slate-600 mb-12 leading-relaxed font-medium">
                {homeCms.insightsBand?.subtitle ?? 'The project management landscape is evolving. We provide the guidance you need to navigate AI integration and hybrid methodologies.'}
              </p>
              <div className="space-y-8">
                {insightsItems.map((item) => (
                  <Link key={item.title} href={item.href} className="flex gap-6 group">
                    <div className="h-1 w-12 bg-brand-orange mt-4 group-hover:w-16 transition-all duration-500 rounded-full shrink-0" />
                    <div>
                      <h4 className="text-xl font-bold text-white dark:text-pms-navy group-hover:text-brand-orange transition-colors tracking-tight">{item.title}</h4>
                      <p className="text-base text-slate-300 dark:text-slate-600 mt-1 font-medium">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <PmpRoadmapLeadForm placement="home_insights" variant="insights" />
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {(sections?.membership !== false) && (
      <section className={sectionSurface('warm', SECTION_PY)}>
        <SectionAmbience tone="warm" />
        <div className="container relative z-10 mx-auto">
          <div className={`max-w-3xl mx-auto text-center ${SECTION_HEADING_MB}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-section font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight leading-none">
                {homeCms.membership?.sectionTitle ?? get('membership_title', 'Membership Plans')}
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {T169_SUPPORT_COPY.membership}{' '}
                {homeCms.membership?.sectionSubtitle ?? get('membership_subtitle', HOME_COPY.membershipSubtitle)}
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(homeCms.membership?.benefits ?? [
                { title: "Course Discounts", desc: "Up to 30% off all certification prep courses.", iconKey: "trophy" },
                { title: "Premium Resources", desc: "Access to 500+ templates and study guides.", iconKey: "book" },
                { title: "CV Maker Access", desc: "Professional PM-focused resume builder.", iconKey: "file" },
                { title: "Member-Only Tools", desc: "Advanced study planners and ROI calculators.", iconKey: "layout" },
                { title: "Community Access", desc: "Priority entry to private study circles.", iconKey: "users" },
                { title: "Expert Webinars", desc: "Monthly live sessions with industry veterans.", iconKey: "zap" },
              ]).map((benefit, i) => {
                const iconMap: Record<string, typeof Trophy> = { trophy: Trophy, book: BookOpen, file: FileText, layout: LayoutDashboard, users: Users, zap: Zap };
                const Icon = iconMap[benefit.iconKey] ?? Trophy;
                return (
                <motion.div 
                  key={benefit.title} 
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-5 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all group"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800 text-brand-orange h-fit shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 tracking-tight">{benefit.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{benefit.desc}</p>
                  </div>
                </motion.div>
              );})}
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900 text-white border-none shadow-xl p-6 sm:p-10 h-full flex flex-col justify-between rounded-[2rem] sm:rounded-[2.5rem] relative overflow-hidden group [&_h3]:text-white">
                <div className="relative z-10">
                  <Badge className="bg-brand-orange text-white border-none mb-8 px-4 py-1 text-[10px] font-bold uppercase tracking-widest">Best Value</Badge>
                  <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Professional Membership</h3>
                  <p className="text-slate-300 text-base mb-8 font-medium leading-relaxed">The complete toolkit for the ambitious project professional.</p>
                  <div className="mb-8">
                    <MembershipDualPrice
                      monthlyUsd={MEMBERSHIP_PRICING.professional.monthlyUsd}
                      yearlyUsd={MEMBERSHIP_PRICING.professional.yearlyUsd}
                      variant="dark"
                    />
                  </div>
                  <ul className="space-y-4 mb-10">
                    {[
                      "Full platform access",
                      "Direct mentor access each month",
                      "20% off regional certification tuition",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-4 text-base font-bold">
                        <CheckCircle2 className="h-5 w-5 text-brand-orange" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/membership" className="relative z-10 block">
                  <Button variant="outline" className="w-full h-14 font-bold text-lg rounded-2xl transition-all">
                    View membership
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {(sections?.community !== false) && (
      <section className={sectionSurface('blend', SECTION_PY)}>
        <SectionAmbience tone="blend" />
        <div className="container relative z-10 mx-auto">
          <motion.div 
            className="bg-slate-50 dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-16 lg:p-20 border border-slate-100 dark:border-slate-800 overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-20 items-center">
              <div>
                <div className="flex items-center gap-3 text-brand-orange mb-8">
                  <LayoutGrid className="h-6 w-6" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">{BRAND.name} Network</span>
                </div>
                <h2 className="font-heading text-section font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight leading-tight">Join the Global <span className="text-brand-orange">PM Network</span></h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed font-medium">
                  {T169_SUPPORT_COPY.community}
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                  {T176_SOCIAL_PROOF_REPLACEMENT}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
                  {T176_COMMUNITY_NOTE}
                </p>
                <div className="grid grid-cols-2 gap-6 mb-10">
                  {[
                    { title: "Skool Community", icon: MessageSquare },
                    { title: "Study Circles", icon: Users },
                    { title: "Peer Discussions", icon: MessageSquare },
                    { title: "Live Sessions", icon: Calendar },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center gap-4 group">
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-800 text-brand-orange shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="text-base font-bold text-slate-900 dark:text-slate-300 tracking-tight">{item.title}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href={PMS_SKOOL_COMMUNITY_JOIN_URL}
                  {...externalHrefLinkProps(PMS_SKOOL_COMMUNITY_JOIN_URL)}
                  className="inline-block w-full sm:w-auto"
                >
                  <Button variant="brand" className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 rounded-2xl font-bold text-base sm:text-lg transition-all group/btn">
                    Join Community
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="rounded-3xl overflow-hidden shadow-lg aspect-square">
                    <img
                      src={MARKETING_STOCK_IMAGES.communityGrid[0].src}
                      alt={MARKETING_STOCK_IMAGES.communityGrid[0].alt}
                      width={MARKETING_STOCK_IMAGES.communityGrid[0].width}
                      height={MARKETING_STOCK_IMAGES.communityGrid[0].height}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-lg aspect-[4/3]">
                    <img
                      src={MARKETING_STOCK_IMAGES.communityGrid[1].src}
                      alt={MARKETING_STOCK_IMAGES.communityGrid[1].alt}
                      width={MARKETING_STOCK_IMAGES.communityGrid[1].width}
                      height={MARKETING_STOCK_IMAGES.communityGrid[1].height}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="space-y-6 mt-0 lg:mt-12">
                  <div className="rounded-3xl overflow-hidden shadow-lg aspect-[4/3]">
                    <img
                      src={MARKETING_STOCK_IMAGES.communityGrid[2].src}
                      alt={MARKETING_STOCK_IMAGES.communityGrid[2].alt}
                      width={MARKETING_STOCK_IMAGES.communityGrid[2].width}
                      height={MARKETING_STOCK_IMAGES.communityGrid[2].height}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-lg aspect-square">
                    <img
                      src={MARKETING_STOCK_IMAGES.communityGrid[3].src}
                      alt={MARKETING_STOCK_IMAGES.communityGrid[3].alt}
                      width={MARKETING_STOCK_IMAGES.communityGrid[3].width}
                      height={MARKETING_STOCK_IMAGES.communityGrid[3].height}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      )}

      {/* Newsletter Section */}
      <section className={sectionSurface('cool', SECTION_PY)}>
        <SectionAmbience tone="cool" />
        <div className="container relative z-10 mx-auto">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-16 lg:p-20 relative overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-slate-500/5 to-transparent pointer-events-none" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
              <div className="min-w-0">
                <Badge className="mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Weekly Insights
                </Badge>
                <h2 className="font-heading text-section font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight leading-tight">
                  The <span className="text-brand-orange">Structure</span> Report
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium max-w-lg">
                  {T176_SOCIAL_PROOF_REGIONAL}
                </p>
                <NewsletterSubscribeForm
                  formId="home-newsletter"
                  pagePath="/"
                  className="max-w-md"
                  inputClassName="h-14 rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-brand-orange/30"
                  buttonClassName="h-14 px-8 rounded-2xl font-bold text-lg shadow-xl transition-all"
                />
                <p className="mt-4 text-xs text-slate-400 font-medium">
                  We respect your privacy.{' '}
                  <Link href="/legal/privacy" className="text-brand-orange font-semibold hover:underline">
                    Privacy Policy
                  </Link>
                  . Unsubscribe at any time.
                </p>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-4 sm:gap-6">
                {[
                  { title: "Exam Strategies", icon: Sparkles },
                  { title: "AI in PM", icon: Zap },
                  { title: "Salary Trends", icon: TrendingUp },
                  { title: "Case Studies", icon: BookOpen },
                ].map((topic) => (
                  <div key={topic.title} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <topic.icon className="h-6 w-6 text-brand-orange mb-4" />
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{topic.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Tools Section */}
      <section className={sectionSurface('soft', SECTION_PY)}>
        <SectionAmbience tone="soft" />
        <div className="container relative z-10 mx-auto">
          <div className={`text-center ${SECTION_HEADING_MB}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-section font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight leading-none">
                Career <span className="text-brand-orange">Accelerators</span>
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                {T169_SUPPORT_COPY.resourceStore}
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                title: "CV Maker",
                desc: "Build a PM-specific resume that gets noticed.",
                icon: FileText,
                color: "text-brand-purple",
                action: "external" as const,
                href: "https://thecvmaker.com/",
                ctaLabel: 'Build My CV',
              },
              {
                title: "Study Planner",
                desc: "Custom schedules based on your exam date.",
                icon: Calendar,
                color: "text-brand-orange",
                action: "link" as const,
                href: "/contact?topic=waitlist&offering=study-planner",
                ctaLabel: CTAS.joinWaitlist,
              },
              {
                title: "Cert Comparison",
                desc: "Find the right certification for your goals.",
                icon: LayoutDashboard,
                color: "text-indigo-600",
                action: "link" as const,
                href: COMPARE_PATHWAYS_HREF,
                ctaLabel: CTAS.comparePathways,
              },
              {
                title: "Roadmap Guidance",
                desc: "Step-by-step career progression maps.",
                icon: Map,
                color: "text-emerald-600",
                action: "scroll" as const,
                ctaLabel: CTAS.pmp2026Roadmap,
              },
            ].map((tool, index) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] p-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <CardHeader className="p-6 pb-4">
                    <div className={cn("p-4 rounded-xl bg-white dark:bg-slate-800 w-fit mb-6 shadow-sm", tool.color)}>
                      <tool.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold mb-4 tracking-tight">{tool.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                      {tool.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto border-0 bg-transparent p-6 pt-0">
                    {tool.action === 'scroll' ? (
                      <PmpRoadmapCtaLink
                        label={tool.ctaLabel}
                        className="w-full h-12 rounded-2xl bg-brand-orange hover:bg-brand-hover text-white font-bold text-base shadow-md shadow-brand-orange/20"
                      />
                    ) : (
                      <Link
                        href={tool.href!}
                        className="w-full"
                        {...(tool.action === 'external'
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        <Button className="w-full h-12 rounded-2xl bg-brand-orange hover:bg-brand-hover text-white font-bold text-base shadow-md shadow-brand-orange/20 dark:bg-brand-orange dark:hover:bg-brand-hover dark:text-white group/link">
                          {tool.ctaLabel ?? 'Try Tool'}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                        </Button>
                      </Link>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {(sections?.testimonials !== false) && (
        <HomeTestimonialsSection testimonials={testimonials} />
      )}

      {(sections?.globalFootprint !== false) && homeCms.activeFootprint.length > 0 && (
        <section className={`${SECTION_PY} bg-white dark:bg-slate-950`}>
          <div className="container mx-auto">
            <div className={`max-w-3xl ${SECTION_HEADING_MB}`}>
              <Badge className="mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                Global Footprint
              </Badge>
              <h2 className="font-heading text-section font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-4 sm:mb-6">
                Work, learning, and impact across regions
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Published locations from the homepage CMS appear here when marked visible on the map.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homeCms.activeFootprint.map((entry) => (
                <Card key={entry.id} className="rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6">
                  <CardHeader className="p-0 mb-4">
                    <Badge className="w-fit bg-white dark:bg-slate-800 text-slate-500 border-none text-[10px] font-bold uppercase tracking-widest">
                      {entry.category || 'Footprint'}
                    </Badge>
                    <CardTitle className="text-2xl font-bold tracking-tight mt-4">{entry.item}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-sm font-bold text-brand-orange">{entry.location}</p>
                    {entry.year && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">{entry.year}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {(sections?.finalCta !== false) && (
      <section className={sectionSurface('warm', SECTION_PY)}>
        <SectionAmbience tone="warm" />
        <div className="container relative z-10 mx-auto">
          <motion.div 
            className="relative rounded-[2rem] sm:rounded-[3rem] bg-slate-900 overflow-hidden px-5 py-14 sm:px-8 sm:py-20 md:px-16 md:py-24 lg:px-20 lg:py-32 text-center shadow-2xl [&_h2]:text-white"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-orange/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 tracking-tight leading-tight text-balance">
                {finalCta?.title || <>Ready to Start Your <span className="text-brand-orange">Journey?</span></>}
              </h2>
              <p className="text-slate-400 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                {finalCta?.description ||
                  'Start with eligibility, timeline, and weekly study capacity.'}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <PmpRoadmapCtaLink
                  className="w-full sm:w-auto bg-brand-orange hover:bg-brand-hover text-white h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-bold rounded-2xl shadow-xl"
                />
                <ComparePathwaysCtaLink
                  buttonClassName="w-full sm:w-auto border-white/20 bg-white text-black hover:bg-slate-100 hover:text-black dark:bg-transparent dark:text-white dark:border-white/30 dark:hover:bg-white/10 dark:hover:text-white h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-bold rounded-2xl transition-all"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      )}
    </div>
  );
}
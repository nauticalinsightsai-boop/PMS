'use client';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { LazyMotion, domAnimation, m } from 'motion/react';
import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Users, 
  Trophy, 
  BookOpen, 
  Zap, 
  LayoutGrid, 
  Calendar, 
  FileText, 
  LayoutDashboard, 
  Map, 
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PATHWAY_MOBILE_CAROUSEL_ITEM_CLASS, PATHWAY_MOBILE_CAROUSEL_SLIDE_CLASS, PATHWAY_MOBILE_CARD_SHELL_CLASS } from '@/lib/brand-visual';
import { BRAND, CTAS, HOME_COPY } from '@/lib/brand-voice';
import { MARKETING_STOCK_IMAGES, MARKETING_HERO_SOCIAL_AVATARS, marketingTestimonialAvatar } from '@/lib/marketing-stock-images';
import {
  resolveHomeHeroSubtitle,
  type HomePageConfigV2,
} from '@pms/site-content';
import { HomeHeroAccentRotator } from '@/components/home/HomeHeroAccentRotator';
import { PathwayFeaturedCard } from '@/components/PathwayFeaturedCard';
import { FamilyExploreCard } from '@/components/FamilyExploreCard';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { MembershipDualPrice } from '@/components/MembershipDualPrice';
import { MEMBERSHIP_PRICING } from '@/lib/membership-plans';
import { useHomePageConfig } from '@/lib/home-config';
import { PMP_ROADMAP_FORM_ANCHOR } from '@/content/pmp/program-offer';
import { T169_SUPPORT_COPY } from '@/content/pmp/flagship-t169';
import { COMPARE_PATHWAYS_HREF, PMP_ROADMAP_CTA_HREF, scrollToPmpRoadmapForm } from '@/lib/pmp-roadmap-cta';
import { getT169FeaturedCardOverrides } from '@/lib/t169-featured-cards';
import type { JoinWaitlistContext } from '@/components/forms/JoinWaitlistDialog';
import { buildGeneralWaitlistContext } from '@/lib/waitlist-contact-href';
import { getPhase2Seo } from '@/content/seo/phase-2-page-seo';
import { PMS_SKOOL_COMMUNITY_JOIN_URL, externalHrefLinkProps } from '@/config/pms-site';
import { COMMUNITY_PLATFORM_LABEL } from '@/config/community';
import { LazyWhenVisible } from '@/components/LazyWhenVisible';
import { useIsLgUp } from '@/hooks/useIsLgUp';
import { featuredCertifications, certifications, familyConfigs } from '@/data/certification-index';

const HomeTestimonialsSection = dynamic(
  () =>
    import('@/components/home/HomeTestimonialsSection').then((mod) => ({
      default: mod.HomeTestimonialsSection,
    })),
  { loading: () => null },
);

const HomeStudentSuccessSection = dynamic(
  () =>
    import('@/components/home/HomeStudentSuccessSection').then((mod) => ({
      default: mod.HomeStudentSuccessSection,
    })),
  { loading: () => null },
);

const HomePmp2026GuideBand = dynamic(
  () =>
    import('@/components/home/HomePmp2026GuideBand').then((mod) => ({
      default: mod.HomePmp2026GuideBand,
    })),
  { loading: () => null },
);

const ResponsiveSnapScroll = dynamic(
  () =>
    import('@/components/ResponsiveSnapScroll').then((mod) => ({
      default: mod.ResponsiveSnapScroll,
    })),
  { ssr: false, loading: () => null },
);

const PmpRoadmapLeadForm = dynamic(
  () =>
    import('@/components/forms/PmpRoadmapLeadForm').then((mod) => ({
      default: mod.PmpRoadmapLeadForm,
    })),
  {
    loading: () => (
      <div
        className="min-h-[420px] w-full rounded-2xl border border-slate-200/80 bg-white/60 dark:border-slate-800 dark:bg-slate-900/40 animate-pulse"
        aria-hidden
      />
    ),
  },
);

const RelatedGuidesLinks = dynamic(
  () =>
    import('@/components/seo/RelatedGuidesLinks').then((mod) => ({
      default: mod.RelatedGuidesLinks,
    })),
  { loading: () => null },
);

const JoinWaitlistDialog = dynamic(
  () =>
    import('@/components/forms/JoinWaitlistDialog').then((mod) => ({
      default: mod.JoinWaitlistDialog,
    })),
  { ssr: false, loading: () => null },
);

const WebsiteCalendlyButton = dynamic(
  () =>
    import('@/components/calendly/WebsiteCalendlyButton').then((mod) => ({
      default: mod.WebsiteCalendlyButton,
    })),
  {
    loading: () => (
      <span className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-brand-orange/80 px-6 text-sm font-bold text-white sm:h-14 sm:w-auto">
        {CTAS.pathwayConsultation}
      </span>
    ),
  },
);

const SECTION_PY = 'py-16 sm:py-20 md:py-24 lg:py-32';
const SECTION_HEADING_MB = 'mb-10 md:mb-16 lg:mb-20';
const HERO_BTN =
  'w-full sm:w-auto bg-brand-orange hover:bg-brand-hover text-white h-12 sm:h-14 px-6 sm:px-8 rounded-full font-bold text-base sm:text-lg shadow-lg shadow-brand-orange/20 transition-all';
const HERO_BTN_OUTLINE =
  'w-full sm:w-auto border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 h-12 sm:h-14 px-6 sm:px-8 rounded-full font-bold text-base sm:text-lg transition-all';

const HOME_RELATED_LINKS = getPhase2Seo('/')?.relatedLinks;

type CareerAcceleratorTool =
  | {
      title: string;
      desc: string;
      icon: typeof FileText;
      color: string;
      action: 'external';
      href: string;
      ctaLabel: string;
    }
  | {
      title: string;
      desc: string;
      icon: typeof LayoutDashboard;
      color: string;
      action: 'link';
      href: string;
      ctaLabel: string;
    }
  | {
      title: string;
      desc: string;
      icon: typeof Map;
      color: string;
      action: 'calendly';
      funnelLabel: string;
      ctaLabel: string;
    }
  | {
      title: string;
      desc: string;
      icon: typeof Calendar;
      color: string;
      action: 'waitlist';
      ctaLabel: string;
      waitlistHeadline: string;
    };

const CAREER_ACCELERATOR_TOOLS: CareerAcceleratorTool[] = [
  {
    title: 'CV Maker',
    desc: 'Build a PM-specific resume that gets noticed.',
    icon: FileText,
    color: 'text-brand-purple',
    action: 'external',
    href: 'https://thecvmaker.com/',
    ctaLabel: 'Build My CV',
  },
  {
    title: 'Study Planner',
    desc: 'Custom schedules based on your exam date.',
    icon: Calendar,
    color: 'text-brand-orange',
    action: 'waitlist',
    ctaLabel: CTAS.joinWaitlist,
    waitlistHeadline: 'Study Planner',
  },
  {
    title: 'Cert Comparison',
    desc: 'Find the right certification for your goals.',
    icon: LayoutDashboard,
    color: 'text-indigo-600',
    action: 'link',
    href: COMPARE_PATHWAYS_HREF,
    ctaLabel: 'Compare cert.',
  },
  {
    title: 'Roadmap Guidance',
    desc: 'Step-by-step career progression maps.',
    icon: Map,
    color: 'text-emerald-600',
    action: 'calendly',
    funnelLabel: 'home_career_roadmap',
    ctaLabel: 'Get my roadmap',
  },
];

type FeaturedPathway = (typeof featuredCertifications)[number];

/** Featured Pathways: exactly 6 cards in 2 rows × 3 columns on lg+ */
const featuredPathways = featuredCertifications;
export function Home({
  initialHomeConfig,
  children,
}: {
  initialHomeConfig?: HomePageConfigV2;
  children?: React.ReactNode;
}) {
  const homeCms = useHomePageConfig(initialHomeConfig);
  const isLgUp = useIsLgUp();
  const heroFormPlacement = isLgUp ? 'home_hero_desktop' : 'home_hero_mobile';
  const serverSlide =
    initialHomeConfig?.heroSlides.find((slide) => slide.visible) ??
    initialHomeConfig?.heroSlides[0];
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const [waitlistOpen, setWaitlistOpen] = React.useState(false);
  const [waitlistContext, setWaitlistContext] = React.useState<JoinWaitlistContext | null>(null);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const featuredFromCms = homeCms.featuredCertIds
    .map((id) => {
      const featured = featuredCertifications.find((item) => item.id === id);
      if (featured) return featured;
      const cert = certifications.find((item) => item.id === id);
      if (!cert) return null;
      return {
        id: cert.id,
        title: cert.name,
        desc: cert.desc,
        family: cert.familyId,
        color: cert.color,
      };
    })
    .filter((item): item is FeaturedPathway => Boolean(item));
  const featuredPathwaysResolved =
    featuredFromCms.length > 0 ? featuredFromCms.slice(0, 6) : featuredPathways;
  const finalCta = homeCms.activeCta;
  const sections = homeCms.sections;
  const statsLabel = homeCms.stats?.professionalsLabel ?? initialHomeConfig?.stats?.professionalsLabel ?? 'professionals in the network';
  const professionalsCount =
    homeCms.stats?.professionalsCount ??
    initialHomeConfig?.stats?.professionalsCount ??
    1284;
  const heroSubtitleRaw =
    homeCms.heroSubtitle || serverSlide?.description || HOME_COPY.heroSubtitle;
  const heroSubtitleResolved = resolveHomeHeroSubtitle(heroSubtitleRaw);

  const sanitizeAvatarUrl = (url: string | undefined | null, index: number) => {
    const trimmed = url?.trim() ?? '';
    if (
      trimmed &&
      !trimmed.includes('pravatar.cc') &&
      !trimmed.includes('picsum.photos')
    ) {
      return trimmed;
    }
    return marketingTestimonialAvatar(index);
  };

  const testimonials =
    homeCms.visibleTestimonials.length > 0
      ? homeCms.visibleTestimonials.map((t, index) => ({
          id: t.id,
          name: t.name,
          role: t.role,
          content: t.quote,
          avatar: sanitizeAvatarUrl(t.avatarUrl, Number(t.id) || index),
          company: '',
        }))
      : [];
  const showTestimonialPlaceholder = false;
  const insightsItems = homeCms.insightsBand?.items ?? [
    { title: "AI in Project Management", desc: "Use generative AI for planning and risk assessment.", href: "/newsletter/ai-augmented-project-manager" },
    { title: "2026 Salary Trends", desc: "Certification ROI data across global markets.", href: "/newsletter/2026-pmp-exam-changes" },
    { title: "Hybrid Leadership", desc: "Balance predictive and agile frameworks at scale.", href: "/newsletter/hybrid-methodologies-enterprise" },
  ];
  const finalCtaTitle =
    finalCta?.title && finalCta.title !== 'Institute' ? finalCta.title : null;

  const renderPrimaryCta = () => {
    const action = homeCms.primaryAction;
    const primaryLink = homeCms.ctaPrimaryLink || PMP_ROADMAP_CTA_HREF;
    const label =
      homeCms.ctaPrimary ||
      HOME_COPY.ctaPrimary;
    const btnClass = HERO_BTN;

    if (
      action === 'link' &&
      primaryLink &&
      (primaryLink.includes(PMP_ROADMAP_FORM_ANCHOR) || primaryLink === PMP_ROADMAP_CTA_HREF)
    ) {
      return (
        <Button size="lg" className={cn(btnClass, 'w-full sm:w-auto')} type="button" onClick={scrollToPmpRoadmapForm}>
          {label}
        </Button>
      );
    }

    if (
      action === 'link' &&
      primaryLink
    ) {
      return (
        <Link href={primaryLink} className="block w-full sm:w-auto">
          <Button size="lg" className={btnClass}>{label}</Button>
        </Link>
      );
    }

    return (
      <WebsiteCalendlyButton
        size="lg"
        className={cn(btnClass, 'w-full sm:w-auto')}
        tier="mentor"
        funnelLabel="home_hero_mentor"
        utm={{ utm_source: 'pmstructure', utm_medium: 'home', utm_campaign: 'hero_mentor' }}
      >
        {label}
      </WebsiteCalendlyButton>
    );
  };

  return (
    <LazyMotion features={domAnimation} strict>
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
            <m.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0 }}
              className="relative z-30 min-w-0 overflow-x-clip"
            >
              {children}

              <HomeHeroAccentRotator />

              <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 max-w-lg leading-relaxed font-medium">
                {heroSubtitleResolved}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="w-full sm:w-auto">{renderPrimaryCta()}</div>
                <Link href={homeCms.ctaSecondaryLink || COMPARE_PATHWAYS_HREF} className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className={HERO_BTN_OUTLINE}>
                    {homeCms.ctaSecondary || CTAS.findPathway}
                  </Button>
                </Link>
              </div>
              
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
                        fetchPriority="low"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm font-medium text-slate-500 max-w-md">
                  <span className="text-slate-900 dark:text-white font-bold">{professionalsCount.toLocaleString()}</span>{' '}
                  {statsLabel}
                </div>
              </div>
            </m.div>

            <div id={PMP_ROADMAP_FORM_ANCHOR} className="relative z-10 scroll-mt-24 w-full min-w-0">
              <div className="relative z-30 isolate w-full min-w-0">
                <PmpRoadmapLeadForm placement={heroFormPlacement} variant="hero" heroCopy={homeCms.heroForm} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <LazyWhenVisible minHeightClassName="min-h-[12rem]">
        <HomePmp2026GuideBand />
      </LazyWhenVisible>

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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-4 md:mb-6">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-section font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-4 sm:mb-6">
                {homeCms.featuredPathways?.title ?? (
                  <>
                    <span className="hidden md:inline">Featured </span>
                    <span className="text-pms-gradient-orange">Pathways</span>
                  </>
                )}
              </h2>
              <p className="hidden md:block text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed whitespace-nowrap">
                {homeCms.featuredPathways?.subtitle ?? HOME_COPY.featuredSubtitle}
              </p>
            </m.div>
          </div>

          <ResponsiveSnapScroll
            className="pt-4 md:pt-6"
            desktopLayoutClassName="md:grid md:grid-cols-2 lg:grid-cols-3"
            gapClassName="gap-6 md:gap-8"
            mobileItemClassName={PATHWAY_MOBILE_CAROUSEL_SLIDE_CLASS}
          >
            {featuredPathwaysResolved.map((featured, index) => {
              const cert = certifications.find(c => c.id === featured.id) || certifications[0];
              const t169 = getT169FeaturedCardOverrides(featured.id);
              
              return (
                <m.div
                  key={featured.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={PATHWAY_MOBILE_CAROUSEL_ITEM_CLASS}
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
                </m.div>
              );
            })}
          </ResponsiveSnapScroll>
        </div>
      </section>
      )}

      {(sections?.programFamilies !== false) && (
      <section className={sectionSurface('purple', SECTION_PY)}>
        <SectionAmbience tone="purple" />
        <div className="container relative z-10 mx-auto">
          <div className={`text-center max-w-3xl mx-auto ${SECTION_HEADING_MB}`}>
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-section font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight leading-none">
                {HOME_COPY.frameworksTitle}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                {HOME_COPY.frameworksSubtitle}
              </p>
            </m.div>
          </div>

          <ResponsiveSnapScroll
            desktopLayoutClassName="md:grid md:grid-cols-2 lg:grid-cols-3"
            gapClassName="gap-6 md:gap-8"
            mobileItemClassName={PATHWAY_MOBILE_CAROUSEL_SLIDE_CLASS}
            mobileNaturalHeight
          >
            {(["PMI", "PRINCE2", "SixSigma"] as const)
              .filter((familyId) => {
                const cfg = homeCms.programFamilies.find((f) => f.familyId === familyId);
                return cfg ? cfg.visible : true;
              })
              .map((familyId, index) => (
              <FamilyExploreCard
                key={familyId}
                family={familyConfigs[familyId]}
                index={index}
              />
            ))}
          </ResponsiveSnapScroll>
        </div>
      </section>
      )}

      {(sections?.insightsBand !== false) && (
      <section className={`${SECTION_PY} relative overflow-x-hidden max-lg:overflow-y-visible lg:overflow-hidden bg-gradient-to-br from-violet-50/70 via-background to-orange-50/30 dark:from-[#0f0e38] dark:via-[#07071c] dark:to-[#12081a]`}>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-12%] right-[-8%] w-[42%] h-[42%] rounded-full blur-[120px] opacity-30 bg-pms-gradient-orange" />
          <div className="absolute bottom-[-15%] left-[-12%] w-[48%] h-[48%] rounded-full blur-[120px] opacity-40 bg-pms-gradient-blue-purple" />
          <div className="absolute top-[15%] left-[-5%] w-[32%] h-[38%] rounded-full blur-[110px] opacity-25 bg-pms-gradient-blue-purple dark:opacity-35" />
          <div className="absolute bottom-[10%] right-[5%] w-[28%] h-[32%] rounded-full blur-[100px] opacity-20 bg-pms-gradient-blue-cyan dark:opacity-25" />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-center">
            <m.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-section font-bold text-slate-900 dark:text-white mb-6 sm:mb-8 tracking-tight leading-tight">
                {homeCms.insightsBand?.title ?? (
                  <>
                    Insights for{' '}
                    <span className="text-pms-gradient-orange">project leaders</span>
                  </>
                )}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-medium">
                {homeCms.insightsBand?.subtitle ??
                  'The project management landscape is evolving. We provide the guidance you need to navigate AI integration and hybrid methodologies.'}
              </p>
              <div className="space-y-8">
                {insightsItems.map((item) => (
                  <Link key={item.title} href={item.href} className="flex gap-6 group">
                    <div className="h-1 w-12 bg-brand-orange mt-4 group-hover:w-16 transition-all duration-500 rounded-full shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-orange transition-colors tracking-tight">{item.title}</h3>
                      <p className="text-base text-slate-600 dark:text-slate-400 mt-1 font-medium">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/newsletter" className="mt-10 hidden sm:inline-block">
                <Button variant="ghost" className="text-brand-orange font-bold rounded-full px-0 hover:bg-transparent hover:text-brand-hover">
                  View all insights <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </m.div>
            <LazyWhenVisible minHeightClassName="min-h-[420px]">
            <div className="relative z-10 scroll-mt-24 w-full min-w-0">
            <m.div
              className="relative z-30 isolate w-full min-w-0"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <PmpRoadmapLeadForm placement="home_insights" variant="hero" />
            </m.div>
            </div>
            </LazyWhenVisible>
          </div>
        </div>
      </section>
      )}

      {(sections?.membership !== false) && (
      <section className={sectionSurface('warm', SECTION_PY)}>
        <SectionAmbience tone="warm" />
        <div className="container relative z-10 mx-auto">
          <div className={`max-w-3xl mx-auto text-center ${SECTION_HEADING_MB}`}>
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-section font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight leading-none">
                {homeCms.membership?.sectionTitle ?? 'Membership Plans'}
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {homeCms.membership?.sectionSubtitle ?? HOME_COPY.membershipSubtitle}
              </p>
            </m.div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="lg:col-span-2">
              <ResponsiveSnapScroll
                desktopLayoutClassName="md:grid md:grid-cols-2"
                gapClassName="gap-6"
                mobileItemClassName={PATHWAY_MOBILE_CAROUSEL_SLIDE_CLASS}
              >
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
                <m.div 
                  key={benefit.title} 
                  className={cn(
                    PATHWAY_MOBILE_CAROUSEL_ITEM_CLASS,
                    'flex h-full flex-col sm:flex-row gap-4 sm:gap-6 p-5 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all group',
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800 text-brand-orange h-fit shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 tracking-tight">{benefit.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{benefit.desc}</p>
                  </div>
                </m.div>
              );})}
              </ResponsiveSnapScroll>
            </div>
            <m.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900 text-white border-none shadow-xl p-6 sm:p-10 h-full flex flex-col justify-between rounded-[2rem] sm:rounded-[2.5rem] relative overflow-hidden group/card transition-shadow duration-300 hover:shadow-2xl [&_h3]:text-white">
                <div className="relative z-10">
                  <div className="mb-6 flex flex-wrap items-start gap-3">
                    <Badge className="bg-brand-orange text-white border-none px-4 py-1 text-[10px] font-bold uppercase tracking-widest shrink-0">
                      Best Value
                    </Badge>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                      <span className="block">Professional</span>
                      <span className="block">Membership</span>
                    </h3>
                  </div>
                  <p className="text-slate-300 text-base mb-8 font-medium leading-relaxed">The complete toolkit for the ambitious project professional.</p>
                  <div className="mb-8 transition-transform duration-300 group-hover/card:scale-[1.02] motion-reduce:transform-none">
                    <MembershipDualPrice
                      monthlyUsd={MEMBERSHIP_PRICING.professional.monthlyUsd}
                      yearlyUsd={MEMBERSHIP_PRICING.professional.yearlyUsd}
                      variant="dark"
                    />
                  </div>
                </div>
                <Link href="/membership" className="relative z-10 block w-full">
                  <Button
                    className={cn(HERO_BTN, 'w-full sm:w-full h-14 rounded-full')}
                  >
                    View membership
                  </Button>
                </Link>
              </Card>
            </m.div>
          </div>
        </div>
      </section>
      )}

      {(sections?.community !== false) && (
      <section className={sectionSurface('blend', SECTION_PY)}>
        <SectionAmbience tone="blend" />
        <div className="container relative z-10 mx-auto">
          <m.div 
            className="bg-slate-50 dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-16 lg:p-20 border border-slate-100 dark:border-slate-800 overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-start">
              <div>
                <div className="flex items-center gap-3 text-brand-orange mb-6">
                  <LayoutGrid className="h-6 w-6" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">{BRAND.name} Network</span>
                </div>
                <h2 className="font-heading text-section font-bold text-slate-900 dark:text-white mb-4 sm:mb-5 tracking-tight leading-tight">Join the <span className="text-brand-orange">PM network</span></h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                  {T169_SUPPORT_COPY.community}
                </p>
                <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  {[
                    { title: `${COMMUNITY_PLATFORM_LABEL} Community`, icon: MessageSquare },
                    { title: "Study Circles", icon: Users },
                    { title: "Peer Discussions", icon: MessageSquare },
                    { title: "Live Sessions", icon: Calendar },
                  ].map((item) => (
                    <div key={item.title} className="flex min-w-0 items-center gap-3 sm:gap-4 group">
                      <div className="shrink-0 rounded-xl bg-white p-2.5 text-brand-orange shadow-sm transition-transform duration-300 group-hover:scale-110 dark:bg-slate-800 sm:p-3">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="min-w-0 text-sm font-bold leading-snug tracking-tight text-slate-900 dark:text-slate-300 sm:text-base">
                        {item.title}
                      </span>
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
                  <div className="relative rounded-3xl overflow-hidden shadow-lg aspect-square">
                    <Image
                      src={MARKETING_STOCK_IMAGES.communityGrid[0].src}
                      alt={MARKETING_STOCK_IMAGES.communityGrid[0].alt}
                      width={MARKETING_STOCK_IMAGES.communityGrid[0].width}
                      height={MARKETING_STOCK_IMAGES.communityGrid[0].height}
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="relative rounded-3xl overflow-hidden shadow-lg aspect-[4/3]">
                    <Image
                      src={MARKETING_STOCK_IMAGES.communityGrid[1].src}
                      alt={MARKETING_STOCK_IMAGES.communityGrid[1].alt}
                      width={MARKETING_STOCK_IMAGES.communityGrid[1].width}
                      height={MARKETING_STOCK_IMAGES.communityGrid[1].height}
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="space-y-6 mt-0 lg:mt-12">
                  <div className="relative rounded-3xl overflow-hidden shadow-lg aspect-[4/3]">
                    <Image
                      src={MARKETING_STOCK_IMAGES.communityGrid[2].src}
                      alt={MARKETING_STOCK_IMAGES.communityGrid[2].alt}
                      width={MARKETING_STOCK_IMAGES.communityGrid[2].width}
                      height={MARKETING_STOCK_IMAGES.communityGrid[2].height}
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="relative rounded-3xl overflow-hidden shadow-lg aspect-square">
                    <Image
                      src={MARKETING_STOCK_IMAGES.communityGrid[3].src}
                      alt={MARKETING_STOCK_IMAGES.communityGrid[3].alt}
                      width={MARKETING_STOCK_IMAGES.communityGrid[3].width}
                      height={MARKETING_STOCK_IMAGES.communityGrid[3].height}
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </section>
      )}

      <LazyWhenVisible minHeightClassName="min-h-[24rem]">
        <HomeStudentSuccessSection />
      </LazyWhenVisible>

      {/* Career Tools Section */}
      <section className={sectionSurface('soft', SECTION_PY)}>
        <SectionAmbience tone="soft" />
        <div className="container relative z-10 mx-auto">
          <div className={`text-center ${SECTION_HEADING_MB}`}>
            <m.div
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
            </m.div>
          </div>
          
          <ResponsiveSnapScroll
            desktopLayoutClassName="sm:grid sm:grid-cols-2 lg:grid-cols-4"
            gapClassName="gap-6 md:gap-8"
            mobileItemClassName={PATHWAY_MOBILE_CAROUSEL_SLIDE_CLASS}
          >
            {CAREER_ACCELERATOR_TOOLS.map((tool, index) => (
              <m.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={PATHWAY_MOBILE_CAROUSEL_ITEM_CLASS}
              >
                <Card className={cn(PATHWAY_MOBILE_CARD_SHELL_CLASS, 'w-full h-full flex flex-col border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] p-4 bg-slate-50/50 dark:bg-slate-900/50')}>
                  <CardHeader className="p-6 pb-4">
                    <div className="mb-4 flex items-center gap-4">
                      <div className={cn('shrink-0 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800', tool.color)}>
                        <tool.icon className="h-8 w-8" />
                      </div>
                      <CardTitle className="mb-0 text-2xl font-bold tracking-tight">{tool.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                      {tool.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto border-0 bg-transparent p-6 pt-0">
                    {tool.action === 'waitlist' ? (
                      <Button
                        type="button"
                        className="w-full h-12 rounded-2xl bg-brand-orange hover:bg-brand-hover text-white font-bold text-base shadow-md shadow-brand-orange/20 dark:bg-brand-orange dark:hover:bg-brand-hover dark:text-white"
                        onClick={() => {
                          setWaitlistContext(
                            buildGeneralWaitlistContext(
                              tool.waitlistHeadline ?? tool.title,
                              `Home career accelerator: ${tool.title}`,
                            ),
                          );
                          setWaitlistOpen(true);
                        }}
                      >
                        {tool.ctaLabel}
                      </Button>
                    ) : tool.action === 'calendly' ? (
                      <WebsiteCalendlyButton
                        tier="mentor"
                        funnelLabel={tool.funnelLabel}
                        utm={{
                          utm_source: 'pmstructure',
                          utm_medium: 'home',
                          utm_campaign: 'career_accelerators',
                          utm_content: tool.funnelLabel,
                        }}
                        className="w-full h-12 rounded-2xl bg-brand-orange hover:bg-brand-hover text-white font-bold text-base shadow-md shadow-brand-orange/20 dark:bg-brand-orange dark:hover:bg-brand-hover dark:text-white"
                      >
                        {tool.ctaLabel}
                      </WebsiteCalendlyButton>
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
              </m.div>
            ))}
          </ResponsiveSnapScroll>
        </div>
      </section>

      {(sections?.testimonials !== false) && testimonials.length > 0 && (
        <LazyWhenVisible minHeightClassName="min-h-[16rem]">
        <HomeTestimonialsSection
          testimonials={testimonials}
          usePlaceholder={showTestimonialPlaceholder}
        />
        </LazyWhenVisible>
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
          <m.div 
            className="relative rounded-[2rem] sm:rounded-[3rem] bg-slate-900 overflow-hidden px-5 py-14 sm:px-8 sm:py-20 md:px-16 md:py-24 lg:px-20 lg:py-32 text-center shadow-2xl [&_h2]:text-white"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-orange/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 tracking-tight leading-tight text-balance">
                {finalCtaTitle ?? <>Ready to <span className="text-brand-orange">begin?</span></>}
              </h2>
              <p className="text-slate-400 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                {finalCta?.description ||
                  'Start with eligibility, timeline, and weekly study capacity.'}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <WebsiteCalendlyButton
                  size="lg"
                  className="w-full sm:w-auto bg-brand-orange hover:bg-brand-hover text-white h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-bold rounded-2xl shadow-xl"
                  tier="mentor"
                  funnelLabel="home_final_roadmap"
                  utm={{
                    utm_source: 'pmstructure',
                    utm_medium: 'home',
                    utm_campaign: 'final_mentor',
                    utm_content: 'get_my_roadmap',
                  }}
                >
                  Get My Roadmap
                </WebsiteCalendlyButton>
                <WebsiteCalendlyButton
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/20 bg-white text-black hover:bg-slate-100 hover:text-black dark:bg-transparent dark:text-white dark:border-white/30 dark:hover:bg-white/10 dark:hover:text-white h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-bold rounded-2xl transition-all"
                  tier="mentor"
                  funnelLabel="home_final_mentor"
                  utm={{ utm_source: 'pmstructure', utm_medium: 'home', utm_campaign: 'final_mentor' }}
                >
                  {CTAS.talkToAMentor}
                </WebsiteCalendlyButton>
              </div>
              {HOME_RELATED_LINKS?.length ? (
                <RelatedGuidesLinks
                  title="Explore PM Structure guides"
                  links={HOME_RELATED_LINKS}
                  currentPath="/"
                  collapsible
                  variant="dark"
                  className="mx-auto mt-8 max-w-xl text-left sm:mt-10"
                />
              ) : null}
            </div>
          </m.div>
        </div>
      </section>
      )}
    </div>
    {waitlistOpen ? (
      <JoinWaitlistDialog
        open={waitlistOpen}
        onOpenChange={setWaitlistOpen}
        context={waitlistContext}
      />
    ) : null}
    </LazyMotion>
  );
}
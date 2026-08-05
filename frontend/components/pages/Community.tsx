'use client';
import * as React from "react";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { LazyMotion, domAnimation, m } from "motion/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Star, 
  GraduationCap,
  ArrowRight,
  Heart,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePublishedSiteDocument } from "@/lib/usePublishedSiteDocument";
import { globalContentString, type GlobalContentMap } from '@/lib/cms/global-content';
import {
  FIELD_KEYS,
  defaultCommunityPageConfig,
  parseCommunityPageConfig,
  type CommunityPageConfig,
  type StoreCatalog,
} from "@pms/site-content";
import { BRAND, COMMUNITY_COPY } from "@/lib/brand-voice";
import { MARKETING_STOCK_IMAGES } from "@/lib/marketing-stock-images";
import { pageHeroSection, SectionAmbience, sectionSurface } from "@/components/SectionAmbience";
import { PMS_SKOOL_COMMUNITY_JOIN_URL, externalHrefLinkProps } from '@/config/pms-site';
import { COMMUNITY_PRODUCT_LABEL } from '@/config/community';
import { CommunityWaitlistForm } from '@/components/forms/CommunityWaitlistForm';
import {
  RegisterNowDialog,
  type RegisterNowContext,
} from '@/components/forms/RegisterNowDialog';
import { ResponsiveSnapScroll } from '@/components/ResponsiveSnapScroll';
import { PATHWAY_MOBILE_CAROUSEL_ITEM_CLASS, PATHWAY_MOBILE_CAROUSEL_SLIDE_CLASS, PATHWAY_MOBILE_CARD_SHELL_CLASS } from '@/lib/brand-visual';

const StoreContent = dynamic(
  () => import('@/components/pages/Store').then((m) => ({ default: m.StoreContent })),
  { loading: () => null },
);

const communityChannels = [
  {
    title: `${BRAND.name} ${COMMUNITY_PRODUCT_LABEL}`,
    desc: "Our primary hub for structured cohort learning, live sessions, and certification prep discussions.",
    icon: LayoutGrid,
    color: "text-amber-500",
    bg: "bg-amber-500/5 dark:bg-amber-500/10",
    joinHref: PMS_SKOOL_COMMUNITY_JOIN_URL,
    cta: 'Join Community Waitlist',
    ctaVariant: 'brand' as const,
  },
  {
    title: "Study Circles",
    desc: "Small, focused groups dedicated to specific certifications like PMP or PRINCE2.",
    icon: GraduationCap,
    color: "text-brand-purple",
    bg: "bg-brand-purple/5 dark:bg-brand-purple/10",
    joinHref: PMS_SKOOL_COMMUNITY_JOIN_URL,
    cta: 'Join Study Circles Waitlist',
    ctaVariant: 'outline' as const,
  },
];

const mentorshipFeatures = [
  {
    title: "Peer Mentorship",
    desc: "Connect with professionals preparing for the same exams you are targeting.",
    icon: Heart
  },
  {
    title: "Expert Office Hours",
    desc: "Weekly live sessions with senior PMs to discuss career hurdles and complex projects.",
    icon: Star
  },
  {
    title: "Career Pathing",
    desc: "Structured guidance on moving from Junior to Senior and Executive PM roles.",
    icon: GraduationCap
  }
];

function CommunityNetworkContent({
  mentorshipTitle,
  mentorshipSubtitle,
  joinUrl,
}: {
  mentorshipTitle: string;
  mentorshipSubtitle: string;
  joinUrl: string;
}) {
  const [registerOpen, setRegisterOpen] = React.useState(false);
  const [registerContext, setRegisterContext] = React.useState<RegisterNowContext | null>(null);

  const openEventRegistration = (event: {
    date: string;
    title: string;
    host: string;
    type: string;
  }) => {
    setRegisterContext({
      headline: event.title,
      subject: `Event registration: ${event.title}`,
      eventType: event.type,
      eventDate: event.date,
      host: event.host,
      formId: 'community_event_register',
      formLabel: 'Community event registration',
      placement: `Community event: ${event.title}`,
    });
    setRegisterOpen(true);
  };

  return (
    <>
      {/* Community Channels */}
      <section className="relative z-20 pt-14 pb-20 md:pt-16">
        <div className="container mx-auto">
          <ResponsiveSnapScroll
            desktopLayoutClassName="md:grid-cols-2 items-stretch"
            gapClassName="gap-8"
            mobileItemClassName={PATHWAY_MOBILE_CAROUSEL_SLIDE_CLASS}
            className="max-w-4xl mx-auto"
          >
            {communityChannels.map((channel, index) => (
              <m.div
                key={channel.title}
                className={PATHWAY_MOBILE_CAROUSEL_ITEM_CLASS}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className={cn(PATHWAY_MOBILE_CARD_SHELL_CLASS, 'flex h-full flex-col border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 pb-0')}>
                  <CardHeader className={cn("flex flex-1 flex-col p-8", channel.bg)}>
                    <div className={cn("p-4 rounded-xl bg-white dark:bg-slate-900 shadow-sm mb-6 w-fit transition-transform group-hover:scale-110", channel.color)}>
                      <channel.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">{channel.title}</h3>
                    <CardDescription className="mt-3 flex-1 text-base font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                      {channel.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto shrink-0 px-8 pt-0 pb-5">
                    <Link
                      href={joinUrl}
                      className="block w-full"
                      {...externalHrefLinkProps(joinUrl)}
                    >
                      <Button
                        variant={channel.ctaVariant}
                        className={cn(
                          'h-auto w-full justify-center gap-2 rounded-xl py-5 font-bold',
                          channel.ctaVariant === 'brand'
                            ? 'border-transparent shadow-xl'
                            : 'border-slate-200 dark:border-slate-700',
                        )}
                      >
                        {channel.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </m.div>
            ))}
          </ResponsiveSnapScroll>
        </div>
      </section>

      {/* Mentorship & Growth */}
      <section
        id="community-waitlist"
        tabIndex={-1}
        className={sectionSurface('purple', 'scroll-mt-24 py-32')}
      >
        <SectionAmbience tone="purple" />
        <div className="container relative z-10 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
            <m.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
                {mentorshipTitle}
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                {mentorshipSubtitle}
              </p>
              <ResponsiveSnapScroll
                desktopLayoutClassName="md:grid-cols-1"
                gapClassName="gap-8"
                mobileItemClassName={PATHWAY_MOBILE_CAROUSEL_SLIDE_CLASS}
              >
                {mentorshipFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    className={cn(
                      PATHWAY_MOBILE_CAROUSEL_ITEM_CLASS,
                      'flex h-full items-center gap-6 group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:pl-2.5 md:shadow-none',
                    )}
                  >
                    <div className="shrink-0 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-brand-purple shadow-sm transition-transform group-hover:scale-110 dark:border-slate-800 dark:bg-slate-900">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{feature.title}</h3>
                      <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </ResponsiveSnapScroll>
            </m.div>
            <m.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative flex min-h-[28rem] flex-col lg:min-h-0"
            >
              <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden aspect-[2/3] lg:aspect-auto rounded-[3rem] bg-slate-100 dark:bg-slate-800 shadow-2xl border-4 border-white dark:border-slate-900">
                <Image
                  src={MARKETING_STOCK_IMAGES.mentorship.src}
                  alt={MARKETING_STOCK_IMAGES.mentorship.alt}
                  width={MARKETING_STOCK_IMAGES.mentorship.width}
                  height={MARKETING_STOCK_IMAGES.mentorship.height}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex min-h-0 flex-col overflow-hidden bg-gradient-to-t from-slate-950/98 via-slate-950/94 to-slate-950/88 px-4 pt-4 pb-4 sm:px-5 sm:pt-5 sm:pb-5">
                  <CommunityWaitlistForm className="flex min-h-0 flex-1 flex-col" />
                </div>
              </div>
            </m.div>
          </div>
        </div>
      </section>

      {/* Events Feed */}
      <section className={sectionSurface('cool', 'py-32')}>
        <SectionAmbience tone="cool" />
        <div className="container relative z-10 mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">Live Sessions & Events</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mt-4 font-medium">Join our upcoming interactive workshops and networking mixers.</p>
          </div>
          
          <ResponsiveSnapScroll
            desktopLayoutClassName="md:grid-cols-2 lg:grid-cols-3"
            gapClassName="gap-8"
            mobileItemClassName={PATHWAY_MOBILE_CAROUSEL_SLIDE_CLASS}
          >
            {[
              { date: "Oct 24", title: "PMP Exam Strategy Workshop", host: "Robert Vance, PMP", type: "Study Circle" },
              { date: "Oct 26", title: "Agile Leadership in Tech", host: "Elena Gilbert", type: "Expert Session" },
              { date: "Oct 29", title: "Global PM Networking Mixer", host: `${BRAND.name} Team`, type: "Networking" },
            ].map((event) => (
              <Card key={event.title} className="flex h-full flex-col border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] overflow-hidden group bg-white dark:bg-slate-900">
                <CardContent className="p-0">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <Badge className="text-[10px] uppercase tracking-widest font-bold bg-brand-purple/10 text-brand-purple border-none px-3 py-1">
                        {event.type}
                      </Badge>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.date}</div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-orange transition-colors tracking-tight">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                      <Users className="h-4 w-4 text-brand-orange" />
                      <span>Host: {event.host}</span>
                    </div>
                  </div>
                  <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      type="button"
                      size="sm"
                      variant="brand"
                      className="w-full rounded-lg h-10 px-4 font-bold text-xs"
                      onClick={() => openEventRegistration(event)}
                    >
                      Register Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ResponsiveSnapScroll>
        </div>
      </section>

      {/* Final CTA */}
      <section className={sectionSurface('warm', 'py-32')}>
        <SectionAmbience tone="warm" />
        <div className="container relative z-10 mx-auto">
          <div className="bg-slate-900 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 to-brand-orange/10 pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto min-w-0">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">Ready to join the structure?</h2>
              <p className="text-slate-400 text-lg md:text-xl mb-12 font-medium leading-relaxed">
                Your professional network supports readiness and delivery judgment. Start building it with {BRAND.name}.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
                <Link
                  href={joinUrl}
                  {...externalHrefLinkProps(joinUrl)}
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    variant="brand"
                    className="w-full min-h-14 h-auto whitespace-normal rounded-2xl px-6 py-3 text-base font-bold shadow-xl transition-all sm:w-auto sm:px-8 sm:py-0 sm:text-lg"
                  >
                    Join Community Waitlist
                  </Button>
                </Link>
                <Link href="/membership" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full min-h-14 h-auto whitespace-normal rounded-2xl border-white/30 bg-transparent px-6 py-3 text-base font-bold text-white shadow-none transition-all hover:bg-white/10 hover:text-white sm:w-auto sm:px-8 sm:py-0 sm:text-lg"
                  >
                    Explore Membership
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RegisterNowDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        context={registerContext}
      />
    </>
  );
}

type CommunityTab = "community" | "store";

export function Community({
  initialTab = "community",
  initialPageConfig,
  globalContent,
  initialStoreCatalog,
}: {
  initialTab?: CommunityTab;
  initialPageConfig?: CommunityPageConfig;
  globalContent?: GlobalContentMap;
  initialStoreCatalog?: StoreCatalog;
}) {
  const fallback = defaultCommunityPageConfig();
  const { data: pageConfig } = usePublishedSiteDocument(FIELD_KEYS.COMMUNITY_PAGE_CONFIG, {
    parse: (raw) => (raw ? parseCommunityPageConfig(raw) : null),
    initialData: initialPageConfig ?? fallback,
  });
  const hero = pageConfig?.hero ?? fallback.hero;
  const configuredJoinUrl = pageConfig?.network?.ctaHref?.trim();
  const communityJoinUrl =
    configuredJoinUrl && /^https?:\/\//i.test(configuredJoinUrl)
      ? configuredJoinUrl
      : PMS_SKOOL_COMMUNITY_JOIN_URL;
  const mentorshipTitle = globalContentString(
    globalContent,
    'community_mentorship_title',
    'A Culture of Mentorship',
  );
  const mentorshipSubtitle = globalContentString(
    globalContent,
    'community_mentorship_subtitle',
    'We believe the best way to master project management is to learn from those who have already walked the path. Our community is built on a foundation of mutual support and professional generosity.',
  );
  const router = useRouter();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = React.useState<CommunityTab>(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tab: CommunityTab) => {
    setActiveTab(tab);
    router.replace(tab === "store" ? "/community?view=store" : "/community", { scroll: false });
    requestAnimationFrame(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };


  const heroTabButtonClass = (tab: "community" | "store") =>
    cn(
      "h-12 px-6 rounded-xl font-bold text-base transition-all",
      activeTab === tab
        ? "bg-brand-orange hover:bg-brand-hover text-white shadow-xl border-transparent"
        : "border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 bg-transparent shadow-none",
    );

  return (
    <LazyMotion features={domAnimation} strict>
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className={pageHeroSection('blend', 'text-center pb-10 md:pb-12')}>
        <SectionAmbience tone="blend" />
        
        <div className="container relative z-10 mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
              {hero.badge || globalContentString(globalContent, 'community_badge', COMMUNITY_COPY.heroBadge)}
            </Badge>
            <h1 className="font-heading text-hero font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
              {hero.title || globalContentString(globalContent, 'community_title', COMMUNITY_COPY.heroTitle)}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
              {hero.subtitle || globalContentString(globalContent, 'community_subtitle', COMMUNITY_COPY.heroSubtitle)}
            </p>
            <div className="mt-10 flex justify-center">
              <div
                className="inline-flex flex-col sm:flex-row justify-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                role="tablist"
                aria-label="Community and resource store"
              >
                <Button
                  type="button"
                  size="lg"
                  variant="ghost"
                  role="tab"
                  aria-selected={activeTab === "community"}
                  className={heroTabButtonClass("community")}
                  onClick={() => handleTabChange("community")}
                >
                  Join {COMMUNITY_PRODUCT_LABEL}
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="ghost"
                  role="tab"
                  aria-selected={activeTab === "store"}
                  className={heroTabButtonClass("store")}
                  onClick={() => handleTabChange("store")}
                >
                  Browse Resources
                </Button>
              </div>
            </div>
          </m.div>
        </div>
      </section>

      <div ref={contentRef} className="scroll-mt-24">
        {activeTab === "community" ? (
          <CommunityNetworkContent
            mentorshipTitle={mentorshipTitle}
            mentorshipSubtitle={mentorshipSubtitle}
            joinUrl={communityJoinUrl}
          />
        ) : (
          <StoreContent initialCatalog={initialStoreCatalog} />
        )}
      </div>
    </div>
    </LazyMotion>
  );
}

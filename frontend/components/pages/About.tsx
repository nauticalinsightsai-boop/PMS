'use client';
import { LazyMotion, domAnimation, m } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Heart } from "lucide-react";
import { usePublishedSiteDocument } from "@/lib/usePublishedSiteDocument";
import { FIELD_KEYS, defaultAboutPageConfig, parseAboutPageConfig, type AboutPageConfig } from "@pms/site-content";
import { globalContentString, type GlobalContentMap } from "@/lib/cms/global-content";
import { BRAND, BRAND_LINES, CTAS } from "@/lib/brand-voice";
import { PmpRoadmapCtaLink } from '@/components/pmp/PmpRoadmapCtaLink';
import { WebsiteCalendlyButton } from '@/components/calendly/WebsiteCalendlyButton';
import { SectionAmbience, sectionSurface } from "@/components/SectionAmbience";
import { MARKETING_STOCK_IMAGES, MARKETING_PAGE_IMAGES } from "@/lib/marketing-stock-images";
import { PageHeroWithImage } from "@/components/marketing/PageMarketingImage";

export function About({
  initialPageConfig,
  globalContent,
}: {
  initialPageConfig?: AboutPageConfig;
  globalContent?: GlobalContentMap;
}) {
  const fallback = defaultAboutPageConfig();
  const { data: pageConfig } = usePublishedSiteDocument(FIELD_KEYS.ABOUT_PAGE_CONFIG, {
    parse: (raw) => (raw ? parseAboutPageConfig(raw) : null),
    initialData: initialPageConfig ?? fallback,
  });
  const hero = pageConfig?.hero ?? fallback.hero;
  const mission = pageConfig?.mission ?? fallback.mission;
  const story = pageConfig?.story ?? fallback.story;

  return (
    <LazyMotion features={domAnimation} strict>
    <div className="flex flex-col min-h-screen">
      <section className={sectionSurface('blend', 'py-24 md:py-32')}>
        <SectionAmbience tone="blend" />
        <div className="container relative z-10 mx-auto">
          <PageHeroWithImage
            image={MARKETING_PAGE_IMAGES.aboutHero}
            imageAspectClassName="h-[min(28rem,80vw)] w-full sm:h-[28rem]"
          >
            <div className="max-w-3xl mx-auto lg:mx-0 text-center lg:text-left">
              <Badge className="mb-6 bg-brand-purple/10 text-brand-purple border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                {hero.badge || globalContentString(globalContent, 'mission_badge', 'Our Mission')}
              </Badge>
              <h1 className="font-heading text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
                {hero.title || globalContentString(globalContent, 'mission_title', 'Structured project management education and advisory')}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {hero.subtitle ||
                  mission.subtitle ||
                  globalContentString(globalContent, 'mission_subtitle', BRAND_LINES.positioning)}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-10">
                <PmpRoadmapCtaLink
                  ctaLocation="hero"
                  size="default"
                  className="bg-brand-orange hover:bg-brand-hover text-white font-semibold px-5 h-10 rounded-full shadow-lg shadow-brand-orange/20 transition-all"
                />
                <WebsiteCalendlyButton
                  size="default"
                  variant="outline"
                  className="h-10 px-5 rounded-full font-semibold border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  tier="discovery"
                  funnelLabel="about_hero_mentor"
                  utm={{ utm_source: 'pmstructure', utm_medium: 'about', utm_campaign: 'hero' }}
                >
                  {CTAS.talkToAMentor}
                </WebsiteCalendlyButton>
              </div>
            </div>
          </PageHeroWithImage>
        </div>
      </section>

      <section className={sectionSurface('purple', 'py-20')}>
        <SectionAmbience tone="purple" />
        <div className="container relative z-10 mx-auto">
          <h2 className="sr-only">Our values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Readiness", desc: "Measurable preparation, not passive content consumption.", icon: Target },
              { title: "Governance", desc: "Decision rights, escalation, and delivery discipline.", icon: Award },
              { title: "Community", desc: "Peer support, study circles, and practical templates.", icon: Users },
              { title: "Integrity", desc: "Clear scope, evidence-conscious guidance, no overclaiming.", icon: Heart },
            ].map((value, index) => (
              <m.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-brand-purple w-fit mb-6">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight dark:text-white">{value.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">{value.desc}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionSurface('warm', 'py-24')}>
        <SectionAmbience tone="warm" />
        <div className="container relative z-10 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-8 tracking-tight dark:text-white">
                {story.title || globalContentString(globalContent, 'story_title', 'Our Story')}
              </h2>
              <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-lg">
                <p>
                  {story.text1 ||
                    globalContentString(
                      globalContent,
                      'story_text_1',
                      `${BRAND.name} began as a structured study circle for busy project professionals preparing for PMI exams. The gap was never lack of material: it was lack of pathway, accountability, and readiness measurement.`,
                    )}
                </p>
                <p>
                  {story.text2 ||
                    globalContentString(
                      globalContent,
                      'story_text_2',
                      `Today we support learners and teams across regions with independent exam-preparation pathways, advisory services, and practical tools. Our focus remains certification readiness, governance thinking, and delivery discipline.`,
                    )}
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                <div className="rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800 aspect-[4/5]">
                  <img
                    src={MARKETING_STOCK_IMAGES.aboutStory[0].src}
                    alt={MARKETING_STOCK_IMAGES.aboutStory[0].alt}
                    width={MARKETING_STOCK_IMAGES.aboutStory[0].width}
                    height={MARKETING_STOCK_IMAGES.aboutStory[0].height}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800 aspect-square mt-10 sm:mt-14">
                  <img
                    src={MARKETING_STOCK_IMAGES.aboutStory[1].src}
                    alt={MARKETING_STOCK_IMAGES.aboutStory[1].alt}
                    width={MARKETING_STOCK_IMAGES.aboutStory[1].width}
                    height={MARKETING_STOCK_IMAGES.aboutStory[1].height}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-brand-purple text-white p-8 rounded-2xl shadow-xl hidden md:block">
                <div className="text-sm font-bold opacity-90 uppercase tracking-wider leading-relaxed max-w-[12rem]">
                  Structured PMP 2026 readiness support
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </LazyMotion>
  );
}
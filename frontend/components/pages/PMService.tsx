'use client';
import { LazyMotion, domAnimation, m } from "motion/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { WebsiteCalendlyButton } from '@/components/calendly/WebsiteCalendlyButton';
import { SERVICES_COPY, CTAS } from "@/lib/brand-voice";
import { pageHeroSection, SectionAmbience, sectionSurface } from "@/components/SectionAmbience";
import { usePublishedSiteDocument } from "@/lib/usePublishedSiteDocument";
import {
  FIELD_KEYS,
  defaultServicesPageConfig,
  parseServicesPageConfig,
  type ServicesPageConfig,
} from "@pms/site-content";
import { serviceIcon } from "@/lib/service-icons";
import {
  PM_SERVICE_ADVISORY_FORM_ANCHOR,
  PmServiceAdvisoryLeadForm,
} from '@/components/forms/PmServiceAdvisoryLeadForm';
import { ResponsiveSnapScroll } from '@/components/ResponsiveSnapScroll';
import {
  PATHWAY_CARD_RADIUS_CLASS,
  PATHWAY_MOBILE_CAROUSEL_ITEM_CLASS,
  PATHWAY_MOBILE_CAROUSEL_SLIDE_CLASS,
  PATHWAY_MOBILE_CARD_SHELL_CLASS,
  SERVICE_SNAP_CARD_CLASS,
} from '@/lib/brand-visual';

const SERVICE_COLORS = [
  { color: "text-brand-orange", bg: "bg-brand-orange/10" },
  { color: "text-brand-purple", bg: "bg-brand-purple/10" },
  { color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/10" },
  { color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/10" },
];
export function PMService({
  initialPageConfig,
  overrideH1,
  overrideSubtitle,
}: {
  initialPageConfig?: ServicesPageConfig;
  overrideH1?: string;
  overrideSubtitle?: string;
}) {
  const fallback = defaultServicesPageConfig();
  const { data: pageConfig } = usePublishedSiteDocument(FIELD_KEYS.SERVICES_PAGE_CONFIG, {
    parse: (raw) => (raw ? parseServicesPageConfig(raw) : null),
    initialData: initialPageConfig ?? fallback,
  });
  const hero = pageConfig?.hero ?? fallback.hero;
  const services = (pageConfig?.services ?? fallback.services)
    .filter((s) => s.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <LazyMotion features={domAnimation} strict>
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className={cn(pageHeroSection('warm'), 'relative overflow-hidden')}>
        <SectionAmbience tone="warm" />
        <div className="container relative z-10 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto md:mx-0 text-center md:text-left"
            >
              <Badge className="mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                {hero.badge || SERVICES_COPY.heroBadge}
              </Badge>
              <h1 className="font-heading text-hero font-bold tracking-tight leading-tight text-slate-900 dark:text-white mb-8">
                {overrideH1?.trim() || hero.title || SERVICES_COPY.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-2xl font-medium md:mx-0 mx-auto">
                {overrideSubtitle?.trim() || hero.subtitle || SERVICES_COPY.heroSubtitle}
              </p>
              <div className="flex flex-col lg:flex-row gap-4 justify-center md:justify-start">
                <WebsiteCalendlyButton
                  size="lg"
                  variant="brand"
                  className="h-14 w-full lg:w-auto px-8 rounded-2xl font-bold text-base sm:text-lg shadow-xl shadow-brand-orange/20"
                  tier="advisor"
                  funnelLabel="pm_service_hero_consultation"
                  utm={{ utm_source: 'pmstructure', utm_medium: 'pm_service', utm_campaign: 'hero' }}
                >
                  {CTAS.talkToAdvisor}
                </WebsiteCalendlyButton>
                <WebsiteCalendlyButton
                  size="lg"
                  variant="outline"
                  className="h-14 w-full lg:w-auto px-8 rounded-2xl font-bold text-base sm:text-lg border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  tier="advisor"
                  funnelLabel="pm_service_corporate_cohort"
                  utm={{
                    utm_source: 'pmstructure',
                    utm_medium: 'pm_service',
                    utm_campaign: 'corporate-cohort',
                  }}
                >
                  {CTAS.requestCorporateCohortBrief}
                </WebsiteCalendlyButton>
              </div>
            </m.div>

            <div id={PM_SERVICE_ADVISORY_FORM_ANCHOR} className="scroll-mt-24 w-full min-w-0">
              <m.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="relative z-30 isolate"
              >
                <PmServiceAdvisoryLeadForm placement="pm_service_hero" />
              </m.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className={sectionSurface('soft', 'py-24 scroll-mt-24')}>
        <SectionAmbience tone="soft" />
        <div className="container relative z-10 mx-auto">
          <h2 className="mb-10 text-3xl font-bold tracking-tight dark:text-white">Our services</h2>
          <ResponsiveSnapScroll
            desktopLayoutClassName="md:grid md:grid-cols-2 md:items-stretch"
            gapClassName="gap-8"
            mobileItemClassName={PATHWAY_MOBILE_CAROUSEL_SLIDE_CLASS}
          >
            {services.map((service, index) => {
              const Icon = serviceIcon(service.iconKey);
              const palette = SERVICE_COLORS[index % SERVICE_COLORS.length];
              return (
                <m.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={PATHWAY_MOBILE_CAROUSEL_ITEM_CLASS}
                >
                  <Card
                    className={cn(
                      SERVICE_SNAP_CARD_CLASS,
                      PATHWAY_MOBILE_CARD_SHELL_CLASS,
                      PATHWAY_CARD_RADIUS_CLASS,
                      'flex flex-col border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 md:rounded-[2.5rem] md:p-8',
                    )}
                  >
                    <div className="mb-4 flex shrink-0 items-start justify-between md:mb-8">
                      <div className={cn('rounded-2xl p-4 md:rounded-3xl md:p-5', palette.bg, palette.color)}>
                        <Icon className="h-7 w-7 md:h-8 md:w-8" />
                      </div>
                      <Badge variant="outline" className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                        Service {index + 1}
                      </Badge>
                    </div>

                    <CardHeader className="max-md:min-h-[8.5rem] shrink-0 space-y-0 p-0 md:min-h-0">
                      <CardTitle className="mb-3 line-clamp-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white max-md:min-h-[3.25rem] md:mb-4 md:min-h-0 md:text-3xl">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-sm font-medium leading-relaxed text-slate-900 dark:text-slate-300 max-md:min-h-[4.5rem] md:min-h-0 md:text-base">
                        {service.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="min-h-0 flex-1 p-0">
                      <ul className="mb-6 space-y-2 max-md:min-h-[5.5rem] md:mb-8 md:space-y-4">
                        {service.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-200 md:gap-3 md:text-sm">
                            <CheckCircle2 className={cn('h-4 w-4 shrink-0 md:h-5 md:w-5', palette.color)} />
                            <span className="line-clamp-1">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <WebsiteCalendlyButton
                      variant="brand"
                      tier="advisor"
                      className="mt-auto h-11 w-full shrink-0 rounded-xl font-bold group md:h-14 md:rounded-2xl"
                      funnelLabel={`pm_service_card_${service.id}`}
                      utm={{
                        utm_source: 'pmstructure',
                        utm_medium: 'pm_service',
                        utm_campaign: service.id,
                      }}
                    >
                      <span className="line-clamp-1">{service.title}</span>
                      <ArrowRight className="ml-2 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
                    </WebsiteCalendlyButton>
                  </Card>
                </m.div>
              );
            })}
          </ResponsiveSnapScroll>
        </div>
      </section>

      {/* Trust note */}
      <section className={sectionSurface('purple', 'py-24')}>
        <SectionAmbience tone="purple" />
        <div className="container relative z-10 mx-auto text-center max-w-4xl">
          <div className="flex justify-center mb-8">
            <ShieldCheck className="h-16 w-16 text-brand-orange opacity-50" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-slate-900 dark:text-white">
            Advisory for delivery teams and PMOs
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            PM Structure helps organizations establish governance rhythm, reporting discipline, and structured certification readiness planning. Client references are shared only with permission.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className={sectionSurface('cool', 'py-24')}>
        <SectionAmbience tone="cool" />
        <div className="container relative z-10 mx-auto">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800">
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">Ready to elevate your project performance?</h2>
              <p className="text-slate-900 dark:text-slate-300 text-xl mb-12 leading-relaxed font-medium">
                Our team is standing by to help you solve your most complex project management challenges.
              </p>
              <WebsiteCalendlyButton
                size="lg"
                variant="brand"
                className="h-16 px-12 rounded-2xl font-bold text-xl shadow-xl"
                tier="advisor"
                funnelLabel="pm_service_final_cta"
                utm={{ utm_source: 'pmstructure', utm_medium: 'pm_service', utm_campaign: 'final' }}
              >
                Contact Our Experts
              </WebsiteCalendlyButton>
            </div>
          </div>
        </div>
      </section>
    </div>
    </LazyMotion>
  );
}
'use client';
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Heart } from "lucide-react";
import { useWebsiteData } from "@/services/WebsiteDataService";
import { usePublishedSiteDocument } from "@/lib/usePublishedSiteDocument";
import { FIELD_KEYS, defaultAboutPageConfig, parseAboutPageConfig } from "@pms/site-content";
import { BRAND, BRAND_LINES } from "@/lib/brand-voice";
import { SectionAmbience, sectionSurface } from "@/components/SectionAmbience";

export function About() {
  const { get } = useWebsiteData();
  const fallback = defaultAboutPageConfig();
  const { data: pageConfig } = usePublishedSiteDocument(FIELD_KEYS.ABOUT_PAGE_CONFIG, {
    parse: (raw) => (raw ? parseAboutPageConfig(raw) : null),
  });
  const hero = pageConfig?.hero ?? fallback.hero;
  const mission = pageConfig?.mission ?? fallback.mission;

  return (
    <div className="flex flex-col min-h-screen">
      <section className={sectionSurface('blend', 'py-24 md:py-32')}>
        <SectionAmbience tone="blend" />
        <div className="container relative z-10 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-brand-purple/10 text-brand-purple border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
              {hero.badge || get('mission_badge', 'Our Mission')}
            </Badge>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
              {hero.title || get('mission_title', 'Structured project management education and advisory')}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {mission.subtitle || get('mission_subtitle', BRAND_LINES.positioning)}
            </p>
          </div>
        </div>
      </section>

      <section className={sectionSurface('purple', 'py-20')}>
        <SectionAmbience tone="purple" />
        <div className="container relative z-10 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Readiness", desc: "Measurable preparation, not passive content consumption.", icon: Target },
              { title: "Governance", desc: "Decision rights, escalation, and delivery discipline.", icon: Award },
              { title: "Community", desc: "Peer support, study circles, and practical templates.", icon: Users },
              { title: "Integrity", desc: "Clear scope, evidence-conscious guidance, no overclaiming.", icon: Heart },
            ].map((value, index) => (
              <motion.div
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
              </motion.div>
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
                {get('story_title', 'Our Story')}
              </h2>
              <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-lg">
                <p>
                  {get('story_text_1', `${BRAND.name} began as a structured study circle for busy project professionals preparing for PMI exams. The gap was never lack of material — it was lack of pathway, accountability, and readiness measurement.`)}
                </p>
                <p>
                  {get('story_text_2', `Today we support learners and teams across regions with independent exam-preparation pathways, advisory services, and practical tools. Our focus remains certification readiness, governance thinking, and delivery discipline.`)}
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
                <img 
                  src="https://picsum.photos/seed/team/800/800" 
                  alt="Our Team" 
                  className="object-cover w-full h-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-brand-purple text-white p-8 rounded-2xl shadow-xl hidden md:block">
                <div className="text-4xl font-bold mb-1">5+</div>
                <div className="text-sm font-bold opacity-80 uppercase tracking-wider">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

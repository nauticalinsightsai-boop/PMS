'use client';
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Briefcase, 
  Settings, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";
import Link from "next/link";
import { SERVICES_COPY, CTAS } from "@/lib/brand-voice";
import { pageHeroSection, SectionAmbience, sectionSurface } from "@/components/SectionAmbience";

const services = [
  {
    title: "Pathway consultation",
    description: "Map experience, timeline, and goals to the right PMI, PRINCE2, or Six Sigma route.",
    icon: Briefcase,
    benefits: ["Portfolio Strategy", "Risk Assessment", "Resource Optimization"],
    color: "text-brand-orange",
    bg: "bg-brand-orange/10"
  },
  {
    title: "Governance & PMO",
    description: "Clear roles, reporting, escalation, and control rhythms.",
    icon: Settings,
    benefits: ["Framework Design", "Standardized Reporting", "Maturity Assessment"],
    color: "text-brand-purple",
    bg: "bg-brand-purple/10"
  },
  {
    title: "Corporate training",
    description: "Cohort pathways with shared language and governance — not content-only delivery.",
    icon: Globe,
    benefits: ["Custom Curriculum", "Interactive Workshops", "Post-Training Support"],
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/10"
  },
  {
    title: "Exam readiness",
    description: "Mocks, weak-area tracking, revision, and mentor review.",
    icon: Zap,
    benefits: ["Scrum Implementation", "Kanban Optimization", "Cultural Alignment"],
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/10"
  }
];

export function PMService() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className={pageHeroSection('warm')}>
        <SectionAmbience tone="warm" />
        <div className="container relative z-10 mx-auto text-center md:text-left">
          <div className="max-w-4xl mx-auto md:mx-0">
            <Badge className="mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
              {SERVICES_COPY.heroBadge}
            </Badge>
            <h1 className="font-heading text-hero font-bold tracking-tight leading-tight text-slate-900 dark:text-white mb-8">
              {SERVICES_COPY.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-2xl font-medium md:mx-0 mx-auto">
              {SERVICES_COPY.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/contact?topic=consultation">
                <Button size="lg" variant="brand" className="h-14 px-10 rounded-2xl font-bold text-lg shadow-xl shadow-brand-orange/20">
                  {CTAS.pathwayConsultation}
                </Button>
              </Link>
              <Link href="#services">
                <Button variant="outline" size="lg" className="border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white h-14 px-10 rounded-2xl font-bold text-lg">
                  View Case Studies
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className={sectionSurface('soft', 'py-24 scroll-mt-24')}>
        <SectionAmbience tone="soft" />
        <div className="container relative z-10 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden flex flex-col p-8">
                  <div className="flex items-start justify-between mb-8">
                    <div className={cn("p-5 rounded-3xl", service.bg, service.color)}>
                      <service.icon className="h-8 w-8" />
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest text-slate-400 px-3 py-1">
                      Service {index + 1}
                    </Badge>
                  </div>
                  
                  <CardHeader className="p-0 mb-6">
                    <CardTitle className="text-3xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">{service.title}</CardTitle>
                    <CardDescription className="text-base text-slate-900 dark:text-slate-300 font-medium leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-0 flex-1">
                    <ul className="space-y-4 mb-8">
                      {service.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-slate-200">
                          <CheckCircle2 className={cn("h-5 w-5 shrink-0", service.color)} />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <Link href="/contact" className="w-full">
                    <Button variant="brand" className="w-full h-14 rounded-2xl font-bold group">
                      Learn More <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Quote Section */}
      <section className={sectionSurface('purple', 'py-24')}>
        <SectionAmbience tone="purple" />
        <div className="container relative z-10 mx-auto text-center max-w-4xl">
          <div className="flex justify-center mb-8">
            <ShieldCheck className="h-16 w-16 text-brand-orange opacity-50" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight text-slate-900 dark:text-white">&quot;PM Structure helped our team establish governance rhythm and reporting discipline — delivery became clearer within the first quarter.&quot;</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-12 w-12 rounded-full bg-slate-200" />
            <div className="text-left">
              <div className="font-bold">Jonathan Vance</div>
              <div className="text-sm text-slate-500">Director of Operations, Global Logistics</div>
            </div>
          </div>
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
              <Link href="/contact">
                <Button size="lg" variant="brand" className="h-16 px-12 rounded-2xl font-bold text-xl shadow-xl">
                  Contact Our Experts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

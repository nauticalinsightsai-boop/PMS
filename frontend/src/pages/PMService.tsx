import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Briefcase, 
  Settings, 
  Users, 
  BarChart, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Project Management Consulting",
    description: "Expert guidance for your organization's complex project portfolios. We help establish governance and best practices.",
    icon: Briefcase,
    benefits: ["Portfolio Strategy", "Risk Assessment", "Resource Optimization"],
    color: "text-brand-orange",
    bg: "bg-brand-orange/10"
  },
  {
    title: "PMO Establishment",
    description: "Design and implement a High-Performance Project Management Office (PMO) tailored to your business goals.",
    icon: Settings,
    benefits: ["Framework Design", "Standardized Reporting", "Maturity Assessment"],
    color: "text-brand-purple",
    bg: "bg-brand-purple/10"
  },
  {
    title: "Corporate Training",
    description: "Upskill your entire project team with customized on-site or virtual training programs based on global standards.",
    icon: Globe,
    benefits: ["Custom Curriculum", "Interactive Workshops", "Post-Training Support"],
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/10"
  },
  {
    title: "Agile Transformation",
    description: "Transition from traditional to agile or hybrid methodologies with the help of our experienced agile coaches.",
    icon: Zap,
    benefits: ["Scrum Implementation", "Kanban Optimization", "Cultural Alignment"],
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/10"
  }
];

export function PMService() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-slate-50 dark:bg-slate-900/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <Badge className="mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
              Professional Services
            </Badge>
            <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">
              Strategic <span className="text-brand-orange">PM Services</span>
            </h1>
            <p className="text-xl text-slate-900 dark:text-slate-300 mb-10 leading-relaxed max-w-2xl font-medium">
              We go beyond education. Our expert consultants partner with your organization to deliver excellence, optimize performance, and achieve measurable project success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white h-14 px-10 rounded-2xl font-bold text-lg shadow-xl shadow-brand-orange/20">
                Book a Consultation
              </Button>
              <Button variant="outline" size="lg" className="border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white h-14 px-10 rounded-2xl font-bold text-lg">
                View Case Studies
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
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
                  
                  <Button className="w-full h-14 rounded-2xl bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-brand-orange dark:hover:bg-brand-orange dark:hover:text-white transition-all text-white font-bold group">
                    Learn More <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Quote Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="flex justify-center mb-8">
            <ShieldCheck className="h-16 w-16 text-brand-orange opacity-50" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight text-slate-900 dark:text-white">"PMStructure brought a level of organization and strategic foresight that transformed our project delivery culture within months."</h2>
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
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800">
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">Ready to elevate your project performance?</h2>
              <p className="text-slate-900 dark:text-slate-300 text-xl mb-12 leading-relaxed font-medium">
                Our team is standing by to help you solve your most complex project management challenges.
              </p>
              <Button size="lg" className="bg-brand-orange hover:bg-brand-deep text-white h-16 px-12 rounded-2xl font-bold text-xl shadow-xl">
                Contact Our Experts
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

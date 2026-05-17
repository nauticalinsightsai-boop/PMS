import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Heart } from "lucide-react";
import { useWebsiteData } from "../services/WebsiteDataService";

export function About() {
  const { get } = useWebsiteData();

  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-24 md:py-32 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-brand-purple/10 text-brand-purple border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
              {get('mission_badge', 'Our Mission')}
            </Badge>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
              {get('mission_title', 'Structuring the Future of Project Management')}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {get('mission_subtitle', 'PMStructure was founded on a simple principle: professional certification shouldn\'t be a maze. We provide the structure, resources, and community needed to turn career goals into professional reality.')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-slate-900/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Empowerment", desc: "Giving PMs the tools to lead with confidence.", icon: Target },
              { title: "Excellence", desc: "Maintaining the highest standards in prep materials.", icon: Award },
              { title: "Community", desc: "Building a global network of mutual support.", icon: Users },
              { title: "Integrity", desc: "Honest, transparent guidance for every student.", icon: Heart },
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

      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-8 tracking-tight dark:text-white">
                {get('story_title', 'Our Story')}
              </h2>
              <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-lg">
                <p>
                  {get('story_text_1', 'Started in 2018 by a group of senior project managers in London, PMStructure began as a small study group focused on the PMP exam. We realized that while the official materials were comprehensive, they lacked a structured pathway for busy professionals.')}
                </p>
                <p>
                  {get('story_text_2', 'Today, we serve over 50,000 students across South Asia, Europe, and the US. Our platform has evolved from a simple blog into a full-scale educational ecosystem, but our core mission remains the same: to provide the most structured and effective certification prep in the world.')}
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

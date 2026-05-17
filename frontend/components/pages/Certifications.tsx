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
  Filter,
  Search,
  Sparkles,
  Zap,
  BarChart,
  ShieldCheck,
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as siteData from "@/data/siteData";

export function Certifications() {
  const [activeTab, setActiveTab] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const certifications = siteData.certifications;

  const filteredCerts = certifications.filter(cert => {
    const matchesTab = activeTab === "all" || cert.familyId === activeTab;
    const matchesSearch = cert.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         cert.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-white dark:bg-slate-950 selection:bg-brand-orange selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-orange/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-purple/5 rounded-full blur-[120px]" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
              Professional Pathways
            </Badge>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
              Certification <span className="text-brand-orange">Directory</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
              Browse our comprehensive directory of industry-leading certifications. 
              Find the right path for your career stage and professional goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 -mt-20 relative z-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-800"
          >
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
                <TabsList className="bg-slate-50 dark:bg-slate-800/50 p-1.5 h-auto flex-wrap justify-start rounded-2xl border border-slate-100 dark:border-slate-800">
                  <TabsTrigger value="all" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-900 font-bold text-sm transition-all">
                    All Frameworks
                  </TabsTrigger>
                  <TabsTrigger value="PMI" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-brand-orange data-[state=active]:text-white font-bold text-sm transition-all">
                    PMI®
                  </TabsTrigger>
                  <TabsTrigger value="PRINCE2" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-teal-600 data-[state=active]:text-white font-bold text-sm transition-all">
                    PRINCE2
                  </TabsTrigger>
                  <TabsTrigger value="SixSigma" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-slate-700 data-[state=active]:text-white font-bold text-sm transition-all">
                    Lean Six Sigma
                  </TabsTrigger>
                </TabsList>
                
                <div className="relative max-w-md w-full group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-orange transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search certifications..." 
                    className="w-full h-14 pl-14 pr-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 font-bold text-base transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <TabsContent value={activeTab} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredCerts.map((cert, index) => {
                      const family = siteData.familyConfigs[cert.familyId] || siteData.familyConfigs["PMI"];
                      const foundationPrice = cert.pricing.Foundation.price;
                      
                      return (
                        <motion.div
                          key={cert.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4 }}
                        >
                          <Card className="h-full flex flex-col border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden">
                            <CardHeader className="p-5 pb-2">
                              <Badge 
                                className="w-fit mb-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none text-[10px] font-bold px-3 py-1"
                              >
                                {family.name}
                              </Badge>
                              <CardTitle className="text-2xl font-bold tracking-tight mb-3 leading-tight">
                                {cert.name}
                              </CardTitle>
                              <div className="flex items-center gap-2 mb-4 p-2 rounded-xl bg-brand-orange/5 border border-brand-orange/10">
                                <Zap className="h-3 w-3 text-brand-orange shrink-0" />
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">{cert.outputValue}</span>
                              </div>
                              <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                {cert.desc}
                              </CardDescription>
                            </CardHeader>
                            
                            <CardContent className="flex-1 px-5 pb-5">
                              <div className="flex flex-wrap gap-2 mb-5">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tight">
                                  <Clock className="h-3 w-3 text-brand-orange" />
                                  <span>{cert.pricing.Foundation.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tight">
                                  <Tag className="h-3 w-3 text-brand-orange" />
                                  <span>${foundationPrice}</span>
                                </div>
                              </div>

                              <ul className="space-y-3">
                                {(cert.learningOutcomes?.slice(0, 3) || ["Expert-Led Sessions", "Pass Guarantee"]).map((item) => (
                                  <li key={item} className="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="h-3 w-3 mr-2 text-brand-orange shrink-0" />
                                    <span className="line-clamp-1">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                            
                            <CardFooter className="px-5 pb-5 pt-6">
                              <Link href={`/certifications/${cert.id}`} className="w-full">
                                <Button className="w-full h-12 rounded-2xl font-bold text-base bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-brand-orange dark:hover:bg-brand-orange dark:hover:text-white text-white transition-all">
                                  View Pathway
                                </Button>
                              </Link>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
                
                {filteredCerts.length === 0 && (
                  <div className="py-48 text-center">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center justify-center p-12 rounded-full bg-ivory dark:bg-slate-800 mb-10 shadow-inner"
                    >
                      <Search className="h-16 w-16 text-slate-300" />
                    </motion.div>
                    <h3 className="text-4xl font-bold mb-6 text-obsidian dark:text-white tracking-tight">No certifications found</h3>
                    <p className="text-xl text-carbon/60 dark:text-slate-400 max-w-md mx-auto font-medium">Try adjusting your search or filters to find what you're looking for.</p>
                    <Button 
                      variant="link" 
                      className="mt-10 text-brand-orange font-black text-xl h-auto"
                      onClick={() => {setSearchQuery(""); setActiveTab("all");}}
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* Foundation Direct Featured Section */}
      <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden relative">
        <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 dark:bg-slate-800" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row gap-12 items-center"
          >
            <div className="lg:w-1/2">
              <Badge className="mb-6 bg-brand-orange text-white border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">Fast Track</Badge>
              <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                Foundation Direct <br />
                <span className="text-brand-orange">Pathway</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium text-lg lg:text-xl leading-relaxed mb-8 max-w-xl">
                The ultimate accelerated bridge to project management. Master essential vocabulary and concepts across all major frameworks in record time.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <Clock className="h-6 w-6 text-brand-orange mb-3" />
                  <div className="text-xs font-black uppercase text-slate-400 mb-1">Duration</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">2 Days</div>
                </div>
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <Tag className="h-6 w-6 text-brand-orange mb-3" />
                  <div className="text-xs font-black uppercase text-slate-400 mb-1">Starting At</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">$150</div>
                </div>
              </div>
              <Link href="/certifications/foundation-direct">
                <Button size="lg" className="h-16 px-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg hover:bg-brand-orange transition-all">
                  Access Foundation Direct
                </Button>
              </Link>
            </div>

            <div className="lg:w-1/2 w-full">
              <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl border border-slate-800 group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/20 blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-brand-orange/30" />
                
                <h3 className="text-2xl font-bold text-white mb-8 relative z-10 flex items-center gap-3">
                  <Zap className="h-6 w-6 text-brand-orange" />
                  What You'll Master
                </h3>
                
                <ul className="space-y-6 relative z-10">
                  {[
                    { title: "Unified Vocabulary", desc: "Speak the language of PMI, PRINCE2, and Agile simultaneously." },
                    { title: "Multi-Framework Bridge", desc: "Compare and contrast core methodologies for best-fit selection." },
                    { title: "Career Readiness", desc: "Build a roadmap for advanced professional certifications." }
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

      {/* Strategic Tiers Section - Refined and Integrated */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/3 pt-4">
              <Badge className="mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">Engagement Models</Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">Strategic Tiers</h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium text-lg leading-relaxed mb-8">
                Beyond individual certifications, we offer tier-based engagement models for organizational transformation.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold">
                  <CheckCircle2 className="h-5 w-5 text-brand-orange" />
                  <span>Custom Learning Paths</span>
                </div>
                <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold">
                  <CheckCircle2 className="h-5 w-5 text-brand-orange" />
                  <span>Enterprise Coaching</span>
                </div>
                <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold">
                  <CheckCircle2 className="h-5 w-5 text-brand-orange" />
                  <span>Executive Alignment</span>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Professional Tier */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm"
              >
                <div className="p-4 rounded-2xl bg-brand-orange/10 text-brand-orange w-fit mb-6">
                  <BarChart className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Professional Services</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium text-sm leading-relaxed">
                  Focus on operational excellence, stabilizing processes, and driving team-level performance.
                </p>
                <ul className="space-y-4 mb-8">
                  {["PMO Operations", "Resource Planning", "Methodology Rollout"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <Zap className="h-3 w-3 text-brand-orange" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Mastery Tier */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/20 blur-3xl -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="p-4 rounded-2xl bg-white/10 text-white w-fit mb-6">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Mastery Consulting</h3>
                  <p className="text-slate-400 mb-8 font-medium text-sm leading-relaxed">
                    High-stakes leadership transformation and enterprise-wide agility alignment.
                  </p>
                  <ul className="space-y-4 mb-8">
                    {["Executive Transformation", "Crisis Recovery", "Enterprise Agile"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-xs font-bold text-white/70">
                        <Zap className="h-3 w-3 text-brand-orange" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Unified High-Impact CTA Section */}
      <section className="py-32 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/10 via-transparent to-brand-purple/10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/20 blur-[120px] -mr-48 -mt-48 transition-all group-hover:bg-brand-orange/30 duration-700" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <Badge className="mb-8 bg-brand-orange text-white border-none px-6 py-2 text-xs font-black uppercase tracking-[0.3em] rounded-full">Personalized Roadmap</Badge>
              <h2 className="text-4xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.1] md:px-12">
                Not sure which path <span className="text-brand-orange">is right for you?</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-2xl mb-14 leading-relaxed font-medium max-w-3xl mx-auto">
                Our certification experts can help you map out a personalized professional development 
                plan based on your experience and career aspirations.
              </p>
              
              <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  <Button size="lg" className="h-16 px-10 rounded-2xl bg-brand-orange hover:bg-brand-deep text-white font-bold text-lg shadow-xl transition-all hover:scale-105">
                    Compare Frameworks
                  </Button>
                  <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl border-white/10 text-white hover:bg-white/10 font-bold text-lg transition-all">
                    Talk to an Advisor
                  </Button>
                </div>
                
                <div className="hidden lg:block h-12 w-px bg-white/10 mx-4" />
                
                <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 px-8 py-4 rounded-3xl group/phone transition-all hover:bg-white/10">
                  <Phone className="h-6 w-6 text-brand-orange group-hover/phone:rotate-12 transition-transform" />
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Direct Line</div>
                    <div className="text-xl font-bold text-white tracking-tight">+1 (800) PM-ROADMAP</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

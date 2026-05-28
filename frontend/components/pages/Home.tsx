'use client';
import { motion } from "motion/react";
import * as React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
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
  ShieldCheck, 
  TrendingUp, 
  Slack, 
  Calendar, 
  FileText, 
  LayoutDashboard, 
  Map, 
  Star,
  Quote,
  MessageSquare,
  Award,
  Sparkles,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { RegisterModal } from "@/components/RegisterModal";
import { cn } from "@/lib/utils";
import { useWebsiteData } from "@/services/WebsiteDataService";
import { BRAND, CTAS, HOME_COPY } from "@/lib/brand-voice";
import { PathwayFeaturedCard } from "@/components/PathwayFeaturedCard";
import { FamilyExploreCard } from "@/components/FamilyExploreCard";
import { SectionAmbience, sectionSurface } from "@/components/SectionAmbience";
import { MembershipDualPrice } from '@/components/MembershipDualPrice';
import { MEMBERSHIP_PRICING } from '@/lib/membership-plans';

import * as siteData from "@/data/siteData";

/** Featured Pathways: exactly 6 cards in 2 rows × 3 columns on md+ */
const featuredPathways = siteData.featuredCertifications;

export function Home() {
  const { get } = useWebsiteData();
  const [reduceMotion, setReduceMotion] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  const emblaPlugins = React.useMemo(
    () => (reduceMotion ? [] : [Autoplay({ delay: 5000 })]),
    [reduceMotion],
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, emblaPlugins);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  const handleNewsletterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/newsletter";
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-brand-orange selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-24 overflow-visible bg-gradient-to-br from-violet-50/70 via-background to-orange-50/30 dark:from-[#0f0e38] dark:via-[#07071c] dark:to-[#12081a]">
        {/* PMS gradient ambient — orange + blue-purple from logo system */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-12%] right-[-8%] w-[42%] h-[42%] rounded-full blur-[120px] opacity-30 bg-pms-gradient-orange" />
          <div className="absolute bottom-[-15%] left-[-12%] w-[48%] h-[48%] rounded-full blur-[120px] opacity-40 bg-pms-gradient-blue-purple" />
          <div className="absolute top-[15%] left-[-5%] w-[32%] h-[38%] rounded-full blur-[110px] opacity-25 bg-pms-gradient-blue-purple dark:opacity-35" />
          <div className="absolute bottom-[10%] right-[5%] w-[28%] h-[32%] rounded-full blur-[100px] opacity-20 bg-pms-gradient-blue-cyan dark:opacity-25" />
        </div>

        <div className="container relative z-10 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <Badge className="mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                {get('hero_badge', HOME_COPY.heroBadge)}
              </Badge>
              
              <h1 className="font-heading text-hero font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
                {get('hero_title', HOME_COPY.heroTitle)}
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-lg leading-relaxed font-medium">
                {get('hero_subtitle', HOME_COPY.heroSubtitle)}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <RegisterModal trigger={
                  <Button size="lg" className="bg-brand-orange hover:bg-brand-hover text-white h-14 px-8 rounded-full font-bold text-lg shadow-lg shadow-brand-orange/20 transition-all">
                    {CTAS.pathwayConsultation}
                  </Button>
                } />
                <Link href="/certifications">
                  <Button size="lg" variant="outline" className="border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 h-14 px-8 rounded-full font-bold text-lg transition-all">
                    {CTAS.findPathway}
                  </Button>
                </Link>
              </div>
              
              <div className="mt-16 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-950 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?u=${i + 20}`} alt="" aria-hidden className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-sm font-medium text-slate-500">
                  <span className="text-slate-900 dark:text-white font-bold">1,284</span> professionals in the network
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-30 isolate hidden lg:block"
            >
              <div className="relative z-0 aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
                <div
                  className="w-full h-full bg-gradient-to-br from-brand-purple/20 via-slate-100 to-brand-orange/20 dark:from-brand-purple/30 dark:via-slate-800 dark:to-brand-orange/20"
                  role="img"
                  aria-label="Professional growth and certification readiness"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
              </div>

              {/* Minimal Stats Card — high z-index so it sits above hero image and left column */}
              <div className="absolute -bottom-10 -left-10 z-50 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 ring-1 ring-slate-100/80 dark:ring-slate-700/80">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-12 w-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                    <Award className="h-6 w-6" />
                  </div>
                  <div className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Readiness-led prep</div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Across all certification pathways in 2026.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Pathways Section */}
      <section className={sectionSurface('soft', 'py-32')}>
        <SectionAmbience tone="soft" />
        <div className="container relative z-10 mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-4xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-6">
                Featured <span className="text-pms-gradient-orange">Pathways</span>
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg font-medium leading-relaxed">
                {HOME_COPY.featuredSubtitle}
              </p>
            </motion.div>
            <Link href="/certifications">
              <Button variant="ghost" className="text-brand-orange font-bold text-lg hover:bg-brand-orange/5 rounded-full px-6">
                View All Certifications
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPathways.map((featured, index) => {
              const cert = siteData.certifications.find(c => c.id === featured.id) || siteData.certifications[0];
              
              return (
                <motion.div
                  key={featured.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PathwayFeaturedCard
                    cert={cert}
                    familyLabel={featured.family}
                    title={featured.title}
                    description={featured.desc}
                    visualSubtitle={featured.title}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certification Families Section */}
      <section className={sectionSurface('purple', 'py-32')}>
        <SectionAmbience tone="purple" />
        <div className="container relative z-10 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-none">
                {get('frameworks_title', HOME_COPY.frameworksTitle)}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                {get('frameworks_subtitle', HOME_COPY.frameworksSubtitle)}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {(["PMI", "PRINCE2", "SixSigma"] as const).map((familyId, index) => (
              <FamilyExploreCard
                key={familyId}
                family={siteData.familyConfigs[familyId]}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stay Ahead — inverted band: dark when site is light, light when site is dark */}
      <section className="py-32 bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900 relative overflow-hidden [&_h2]:!text-white dark:[&_h2]:!text-slate-900 [&_h4]:!text-white dark:[&_h4]:!text-pms-navy">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[35%] h-[35%] rounded-full blur-[100px] opacity-30 dark:opacity-50 bg-pms-gradient-blue-purple" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full blur-[100px] opacity-25 dark:opacity-40 bg-pms-gradient-orange" />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-4xl md:text-6xl font-bold text-white dark:text-slate-900 mb-8 tracking-tight leading-tight">
                Insights for the Future of <span className="text-pms-gradient-orange">Project Leadership</span>
              </h2>
              <p className="text-lg text-slate-300 dark:text-slate-600 mb-12 leading-relaxed font-medium">
                The project management landscape is evolving. We provide the guidance you need to navigate AI integration and hybrid methodologies.
              </p>
              <div className="space-y-8">
                {[
                  { title: "AI in Project Management", desc: "How to leverage generative AI for planning and risk assessment.", href: "/newsletter/ai-augmented-project-manager" },
                  { title: "2026 Salary Trends", desc: "The latest data on certification ROI across global markets.", href: "/newsletter/2026-pmp-exam-changes" },
                  { title: "Hybrid Leadership", desc: "Mastering the balance between predictive and agile frameworks.", href: "/newsletter/hybrid-methodologies-enterprise" },
                ].map((item) => (
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
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-700 dark:border-slate-200 group">
                <div
                  className="object-cover w-full h-full bg-gradient-to-tr from-brand-cyan/20 to-brand-purple/30 dark:from-slate-800 dark:to-brand-purple/40 transition-all duration-700"
                  role="img"
                  aria-label="Future of project management learning"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white text-slate-900 dark:bg-slate-900 dark:text-white p-8 rounded-3xl shadow-xl max-w-xs hidden xl:block border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-brand-orange/10 text-brand-orange">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div className="text-4xl font-bold tracking-tight text-pms-navy dark:text-white">92%</div>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
                  Of employers prioritize PMs with specialized certifications in 2026.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className={sectionSurface('warm', 'py-32')}>
        <SectionAmbience tone="warm" />
        <div className="container relative z-10 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-none">
                {get('membership_title', 'Membership Plans')}
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {get('membership_subtitle', HOME_COPY.membershipSubtitle)}
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Course Discounts", desc: "Up to 30% off all certification prep courses.", icon: Trophy },
                { title: "Premium Resources", desc: "Access to 500+ templates and study guides.", icon: BookOpen },
                { title: "CV Maker Access", desc: "Professional PM-focused resume builder.", icon: FileText },
                { title: "Member-Only Tools", desc: "Advanced study planners and ROI calculators.", icon: LayoutDashboard },
                { title: "Community Access", desc: "Priority entry to private study circles.", icon: Users },
                { title: "Expert Webinars", desc: "Monthly live sessions with industry veterans.", icon: Zap },
              ].map((benefit, i) => (
                <motion.div 
                  key={benefit.title} 
                  className="flex gap-6 p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all group"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800 text-brand-orange h-fit shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 tracking-tight">{benefit.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900 text-white border-none shadow-xl p-10 h-full flex flex-col justify-between rounded-[2.5rem] relative overflow-hidden group [&_h3]:text-white">
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
                  <Button variant="brand" className="w-full h-14 font-bold text-lg rounded-2xl transition-all">
                    Join Now
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className={sectionSurface('blend', 'py-32')}>
        <SectionAmbience tone="blend" />
        <div className="container relative z-10 mx-auto">
          <motion.div 
            className="bg-slate-50 dark:bg-slate-900 rounded-[3rem] p-12 md:p-20 border border-slate-100 dark:border-slate-800 overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <div className="flex items-center gap-3 text-brand-orange mb-8">
                  <Slack className="h-6 w-6" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">{BRAND.name} Network</span>
                </div>
                <h2 className="font-heading text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">Join the Global <span className="text-brand-orange">PM Network</span></h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                  Don't study in isolation. Connect with 1,284+ professionals in our Slack-based community.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-10">
                  {[
                    { title: "Slack Community", icon: MessageSquare },
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
                <Link href="/community">
                  <Button variant="brand" className="h-14 px-10 rounded-2xl font-bold text-lg transition-all group/btn">
                    Join Community
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="rounded-3xl overflow-hidden shadow-lg aspect-square">
                    <div className="w-full h-full bg-brand-purple/10 dark:bg-brand-purple/20" aria-hidden />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-lg aspect-[4/3]">
                    <div className="w-full h-full bg-brand-orange/10 dark:bg-brand-orange/20" aria-hidden />
                  </div>
                </div>
                <div className="space-y-6 mt-12">
                  <div className="rounded-3xl overflow-hidden shadow-lg aspect-[4/3]">
                    <div className="w-full h-full bg-brand-cyan/10 dark:bg-brand-cyan/20" aria-hidden />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-lg aspect-square">
                    <div className="w-full h-full bg-slate-200/50 dark:bg-slate-700/50" aria-hidden />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={sectionSurface('cool', 'py-32')}>
        <SectionAmbience tone="cool" />
        <div className="container relative z-10 mx-auto">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-slate-500/5 to-transparent pointer-events-none" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <Badge className="mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Weekly Insights
                </Badge>
                <h2 className="font-heading text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                  The <span className="text-brand-orange">Structure</span> Report
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium max-w-lg">
                  Join 1,284+ project professionals receiving weekly deep-dives on methodology, leadership, and career growth.
                </p>
                <form
                  className="flex flex-col sm:flex-row gap-4 max-w-md"
                  onSubmit={handleNewsletterSubscribe}
                >
                  <Input 
                    placeholder="Enter your email" 
                    className="h-14 rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-brand-orange/30"
                  />
                  <Button type="submit" variant="brand" className="h-14 px-8 rounded-2xl font-bold text-lg shadow-xl transition-all">
                    Subscribe
                  </Button>
                </form>
                <p className="mt-4 text-xs text-slate-400 font-medium">
                  We respect your privacy.{' '}
                  <Link href="/legal/privacy" className="text-brand-orange font-semibold hover:underline">
                    Privacy Policy
                  </Link>
                  . Unsubscribe at any time.
                </p>
              </div>
              <div className="hidden lg:grid grid-cols-2 gap-6">
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
      <section className={sectionSurface('soft', 'py-32')}>
        <SectionAmbience tone="soft" />
        <div className="container relative z-10 mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-none">
                Career <span className="text-brand-orange">Accelerators</span>
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                Professional utilities designed to streamline your certification journey and career advancement.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "CV Maker",
                desc: "Build a PM-specific resume that gets noticed.",
                icon: FileText,
                color: "text-brand-purple",
                href: "/membership",
              },
              {
                title: "Study Planner",
                desc: "Custom schedules based on your exam date.",
                icon: Calendar,
                color: "text-brand-orange",
                href: "/certifications",
              },
              {
                title: "Cert Comparison",
                desc: "Find the right certification for your goals.",
                icon: LayoutDashboard,
                color: "text-indigo-600",
                href: "/certifications/compare",
              },
              {
                title: "Roadmap Guidance",
                desc: "Step-by-step career progression maps.",
                icon: Map,
                color: "text-emerald-600",
                href: "/pm-service",
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
                    <Link href={tool.href} className="w-full">
                      <Button className="w-full h-12 rounded-2xl bg-brand-orange hover:bg-brand-hover text-white font-bold text-base shadow-md shadow-brand-orange/20 dark:bg-brand-orange dark:hover:bg-brand-hover dark:text-white group/link">
                        Try Tool
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Success / Carousel Section */}
      <section className={sectionSurface('cool', 'py-32 overflow-hidden')}>
        <SectionAmbience tone="cool" />
        <div className="container relative z-10 mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/3">
              <Badge className="mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">Our Impact</Badge>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Student Success</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                Join professionals building structured project management capability with {BRAND.name}.
              </p>
              
              <div className="flex items-center gap-4 mb-10">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 w-12 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="" aria-hidden className="object-cover w-full h-full" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center text-yellow-500 mb-0.5">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                    4.9/5 <span className="text-xs font-medium text-slate-400 ml-1">Average Rating</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {siteData.testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => emblaApi?.scrollTo(idx)}
                    className={cn(
                      "min-h-11 min-w-11 inline-flex items-center justify-center rounded-full transition-all",
                      selectedIndex === idx ? "bg-brand-orange/15" : "hover:bg-muted"
                    )}
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    <span
                      className={cn(
                        "block h-2 rounded-full transition-all",
                        selectedIndex === idx ? "w-8 bg-brand-orange" : "w-2 bg-slate-200 dark:bg-slate-800",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:w-2/3 w-full">
              <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
                <div className="flex">
                  {siteData.testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="flex-[0_0_100%] md:flex-[0_0_50%] min-w-0 pl-6">
                      <Card className="h-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-8 rounded-[2.5rem] relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <Quote className="absolute top-8 right-8 h-12 w-12 text-slate-50 dark:text-slate-800/50 -rotate-12 transition-transform group-hover:rotate-0" />
                        <div className="relative z-10">
                          <div className="flex items-center text-yellow-500 mb-6">
                            {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                          </div>
                          <p className="text-lg italic text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-medium">
                            "{testimonial.content}"
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-slate-100 overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                              <img src={testimonial.avatar} alt={testimonial.name} className="object-cover w-full h-full" />
                            </div>
                            <div>
                              <div className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-tight">{testimonial.name}</div>
                              <div className="text-sm font-medium text-slate-500">{testimonial.role}</div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={sectionSurface('warm', 'py-32')}>
        <SectionAmbience tone="warm" />
        <div className="container relative z-10 mx-auto">
          <motion.div 
            className="relative rounded-[3rem] bg-slate-900 overflow-hidden px-8 py-20 md:px-20 md:py-32 text-center shadow-2xl [&_h2]:text-white"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-orange/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="font-heading text-4xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">Ready to Start Your <span className="text-brand-orange">Journey?</span></h2>
              <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                Start with eligibility, timeline, and weekly study capacity.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <RegisterModal trigger={
                  <Button size="lg" className="bg-brand-orange hover:bg-brand-hover text-white h-14 px-10 text-lg font-bold rounded-2xl shadow-xl transition-all group/btn">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                } />
                <Link href="/certifications">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 bg-white text-black hover:bg-slate-100 hover:text-black dark:bg-transparent dark:text-white dark:border-white/30 dark:hover:bg-white/10 dark:hover:text-white h-14 px-10 text-lg font-bold rounded-2xl transition-all"
                  >
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

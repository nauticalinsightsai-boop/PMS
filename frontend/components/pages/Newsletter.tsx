'use client';
import * as React from "react";
import { LazyMotion, domAnimation } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Search, ArrowRight, TrendingUp, Loader2 } from "lucide-react";
import { 
  CategoryChip, 
  ArticleCard, 
  FeaturedPost, 
  CTABanner 
} from "@/components/NewsletterComponents";
import { PAGE_HERO_PADDING } from "@/components/SectionAmbience";
import { useNewsletterPageData } from '@/hooks/useNewsletterPageData';
import type { NewsletterHubConfig } from '@pms/site-content/newsletter';
import type { NewsletterArticle } from '@pms/site-content/newsletter-posts';
import { getNewsletterArticleHref } from "@pms/site-content/newsletter-posts";
import { NewsletterSubscribeForm } from "@/components/forms/NewsletterSubscribeForm";
import { NewsletterHeroSubscribeForm } from "@/components/forms/NewsletterHeroSubscribeForm";

import { T176_SOCIAL_PROOF_REGIONAL } from '@/content/t176-claims';

function renderHeroTitle(title: string) {
  const marker = "Structure";
  const index = title.indexOf(marker);
  if (index === -1) return title;
  return (
    <>
      {title.slice(0, index)}
      <span className="text-pms-gradient-blue-cyan">{marker}</span>
      {title.slice(index + marker.length)}
    </>
  );
}

export function Newsletter({
  initialHub,
  initialArticles,
  initialTopicNames,
}: {
  initialHub?: NewsletterHubConfig;
  initialArticles?: NewsletterArticle[];
  initialTopicNames?: string[];
}) {
  const { hub, articles, categories, isLoading } = useNewsletterPageData({
    hub: initialHub,
    articles: initialArticles,
    topicNames: initialTopicNames,
  });
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [visibleCount, setVisibleCount] = React.useState(4);

  React.useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [activeCategory, categories]);

  React.useEffect(() => {
    setVisibleCount(4);
  }, [activeCategory, searchQuery]);

  const topicOptions = React.useMemo(
    () => categories.filter((cat) => cat !== "All"),
    [categories],
  );

  const filteredArticles = React.useMemo(() => {
    const byCategory =
      activeCategory === "All"
        ? articles
        : articles.filter((a) => a.category === activeCategory);
    const query = searchQuery.trim().toLowerCase();
    if (!query) return byCategory;
    return byCategory.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query),
    );
  }, [activeCategory, articles, searchQuery]);

  const featuredArticle = filteredArticles[0] ?? articles[0];
  const visibleArticles = filteredArticles.slice(0, visibleCount);

  if (isLoading && articles.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation} strict>
    <div className="flex flex-col min-h-screen">
      {/* 1. Newsletter Hero / Title Section */}
      <section
        className={`relative border-b border-slate-100 dark:border-slate-900 overflow-hidden bg-gradient-to-br from-cyan-50/70 via-slate-50 to-blue-50/50 dark:from-[#061628] dark:via-slate-950 dark:to-[#0a1535] ${PAGE_HERO_PADDING}`}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-15%] right-[-8%] w-[45%] h-[48%] rounded-full blur-[120px] opacity-35 bg-pms-gradient-blue-cyan" />
          <div className="absolute bottom-[-25%] left-[-12%] w-[42%] h-[45%] rounded-full blur-[120px] opacity-30 bg-pms-gradient-blue-purple dark:opacity-40" />
          <div className="absolute top-[30%] left-[35%] w-[22%] h-[28%] rounded-full blur-[100px] opacity-15 bg-pms-gradient-blue-cyan dark:opacity-25" />
        </div>
        <div className="container relative z-10 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="max-w-3xl text-center lg:text-left mx-auto lg:mx-0">
              <Badge variant="outline" className="mb-6 border-[#0859b3]/25 text-[#0859b3] dark:text-[#57d5e2] bg-[#0859b3]/5 dark:bg-[#57d5e2]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                {hub.hero.badge}
              </Badge>
              <h1 className="font-heading text-hero font-bold tracking-tight leading-tight text-slate-900 dark:text-white mb-8">
                {renderHeroTitle(hub.hero.title)}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium max-w-2xl lg:mx-0 mx-auto">
                {hub.hero.subtitle} {T176_SOCIAL_PROOF_REGIONAL}
              </p>
              <p className="mt-6">
                <Link
                  href="/membership"
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange hover:text-brand-hover transition-colors"
                >
                  Explore membership benefits
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </p>
            </div>
            <div className="space-y-6 w-full max-w-md mx-auto lg:max-w-none">
              <NewsletterHeroSubscribeForm
                placement="newsletter_hero_desktop"
                topicOptions={topicOptions}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Topics / Categories Grid */}
      <section className="hidden md:block py-8 bg-slate-50/50 dark:bg-slate-900/20 sticky top-16 z-40 backdrop-blur-md border-b border-slate-100 dark:border-slate-900">
        <div className="container mx-auto">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest shrink-0 mr-2">Topics:</span>
              {categories.map((cat) => (
                <CategoryChip 
                  key={cat} 
                  label={cat} 
                  active={activeCategory === cat} 
                  onClick={() => setActiveCategory(cat)}
                />
              ))}
            </div>
            <div className="relative group w-full shrink-0 sm:w-56 md:w-64 lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-brand-purple transition-colors" />
              <Input
                placeholder="Search articles..."
                className="pl-10 h-10 w-full rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-brand-purple"
                aria-label="Search articles"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12">
        {/* 2. Featured Article */}
        <FeaturedPost article={featuredArticle} />

        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Career evidence</p>
            <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
              MENA project-talent gap: build evidence before personal brand
            </p>
          </div>
          <Link
            href="/newsletter/mena-project-talent-gap-career-evidence"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange hover:text-brand-hover"
          >
            Read the MENA career-evidence article
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium">
          <span className="text-slate-400 uppercase tracking-widest text-xs font-bold self-center mr-1">
            Editorial desks:
          </span>
          <Link href="/newsletter/author/sheikh-m-abdullah" className="text-brand-purple hover:underline">
            Sheikh M. Abdullah
          </Link>
          <Link href="/newsletter/author/pmp-readiness-mentor" className="text-brand-purple hover:underline">
            PMP Readiness Mentor desk
          </Link>
          <Link href="/newsletter/author/pmo-transformation-mentor" className="text-brand-purple hover:underline">
            PMO &amp; Transformation Mentor desk
          </Link>
        </div>

        <Separator className="my-12 opacity-50" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:items-stretch">
          {/* Main Content: Latest Posts */}
          <div className="lg:col-span-8 min-w-0">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-heading text-3xl font-bold">Latest Insights</h2>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <span>Sort by:</span>
                <select className="bg-transparent border-none focus:ring-0 cursor-pointer font-bold text-slate-900 dark:text-white">
                  <option>Newest First</option>
                  <option>Most Read</option>
                  <option>Long Reads</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {visibleArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>

            {visibleCount < filteredArticles.length && (
              <div className="mt-16 flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-12 rounded-2xl border-slate-200 dark:border-slate-800 font-bold group"
                  onClick={() => setVisibleCount((n) => Math.min(n + 2, filteredArticles.length))}
                >
                  Load More Articles <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar: Popular & Editor Picks: equal panels, stretch to main column height on lg */}
          <aside className="lg:col-span-4 flex flex-col gap-6 lg:h-full">
            <div className="flex flex-col flex-1 min-h-0 p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-6 shrink-0">
                <TrendingUp className="h-6 w-6 text-brand-orange" />
                <h3 className="font-heading text-2xl font-bold">Popular Now</h3>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-5 min-h-0">
                {articles.slice(0, 4).map((article, index) => (
                  <Link
                    key={article.slug}
                    href={getNewsletterArticleHref(article)}
                    className="flex gap-4 group"
                  >
                    <span
                      className="text-4xl font-heading font-extrabold tabular-nums leading-none text-slate-300 dark:text-slate-600 group-hover:text-brand-orange transition-colors duration-300 shrink-0"
                      aria-hidden
                    >
                      0{index + 1}
                    </span>
                    <div className="min-w-0">
                      <Badge variant="link" className="p-0 h-auto text-brand-purple text-[10px] uppercase tracking-widest font-bold mb-1">
                        {article.category}
                      </Badge>
                      <h3 className="font-bold leading-tight group-hover:text-brand-purple transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-2">{article.readTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col flex-1 min-h-0 p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <h3 className="font-heading text-2xl font-bold mb-6 shrink-0">Editor&apos;s Picks</h3>
              <div className="flex flex-1 flex-col justify-center gap-8 min-h-0">
                {articles.slice(4, 8).map((article) => (
                  <ArticleCard key={article.slug} article={article} variant="horizontal" />
                ))}
              </div>
              <Link href="/newsletter" className="block mt-6 shrink-0">
                <Button className="w-full bg-brand-purple hover:bg-brand-purple/90">
                  View all articles
                </Button>
              </Link>
            </div>
          </aside>
        </div>

        {/* 7. Join Newsletter CTA (Large) */}
        <section className="py-12">
          <div className="rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden bg-pms-gradient-orange">
            <div className="absolute inset-0 bg-white/5 pointer-events-none" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h3 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6">Stay Ahead of the Curve</h3>
              <p className="text-white/90 text-lg md:text-xl mb-10 leading-relaxed">
                {T176_SOCIAL_PROOF_REGIONAL}
              </p>
              <NewsletterSubscribeForm
                formId="newsletter-hub-signup"
                pagePath="/newsletter"
                layout="stacked"
                className="mx-auto max-w-md text-left"
                inputClassName="h-14 rounded-2xl bg-white text-slate-900"
                buttonClassName="h-14 w-full rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-lg"
              />
            </div>
          </div>
        </section>

        {/* 8. Membership CTA */}
        <CTABanner 
          title="Join the PM Structure Newsletter" 
          description="Members get access to case studies, exam simulators, and mentor-led sessions focused on readiness and practical project judgment."
          buttonText="Explore Membership"
          buttonHref="/membership"
          variant="purple"
        />
      </div>
    </div>
    </LazyMotion>
  );
}

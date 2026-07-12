'use client';
import * as React from "react";
import { LazyMotion, domAnimation, m } from "motion/react";
import Link from "next/link";
import { ArrowRight, Calendar, Bookmark, Share2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { NewsletterArticle } from "@pms/site-content/newsletter-posts";
import {
  getNewsletterArticleHref,
  resolveNewsletterArticleImage,
} from "@pms/site-content/newsletter-posts";
import { resolveNewsletterAuthorAvatar } from '@/lib/marketing-stock-images';

interface CategoryChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
        active 
          ? "bg-brand-purple text-white border-brand-purple shadow-md" 
          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-brand-purple hover:text-brand-purple"
      )}
    >
      {label}
    </button>
  );
};

interface ArticleCardProps {
  article: NewsletterArticle;
  href?: string;
  variant?: "default" | "compact" | "horizontal";
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, href, variant = "default" }) => {
  const linkHref = href ?? getNewsletterArticleHref(article);

  if (variant === "horizontal") {
    return (
      <LazyMotion features={domAnimation}>
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Link href={linkHref} className="flex gap-6 group">
          <div className="w-1/3 aspect-[4/3] rounded-2xl overflow-hidden shrink-0">
            <img 
              src={resolveNewsletterArticleImage(article.slug, article.image)} 
              alt={article.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col justify-center">
            <Badge variant="outline" className="w-fit mb-2 border-brand-purple/20 text-brand-purple bg-brand-purple/5">
              {article.category}
            </Badge>
            <h3 className="text-xl font-bold font-heading leading-tight group-hover:text-brand-purple transition-colors mb-2">
              {article.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {article.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}</span>
            </div>
          </div>
          </Link>
        </m.div>
      </LazyMotion>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="group"
    >
      <Link href={linkHref} className="block h-full">
      <Card className="h-full overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-full flex-col px-5 py-5 sm:px-6 sm:py-6 md:px-7 md:py-7">
          <div className="aspect-video overflow-hidden rounded-2xl mb-5 sm:mb-6">
            <img 
              src={resolveNewsletterArticleImage(article.slug, article.image)} 
              alt={article.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
          <CardHeader className="space-y-3 p-0">
            <div className="flex items-center justify-between gap-3">
              <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none hover:bg-brand-purple hover:text-white transition-colors">
                {article.category}
              </Badge>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading leading-snug group-hover:text-brand-purple transition-colors">
              {article.title}
            </h3>
          </CardHeader>
          <CardContent className="mt-auto flex flex-1 flex-col p-0 pt-3">
            <p className="text-muted-foreground line-clamp-3 leading-relaxed mb-5">
              {article.excerpt}
            </p>
            <div className="mt-auto space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                  <img
                    src={article.authorImage?.trim() || resolveNewsletterAuthorAvatar(article.author)}
                    alt={article.author}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{article.author}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {article.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {article.readTime}
                </span>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
      </Link>
    </m.div>
    </LazyMotion>
  );
};

export const FeaturedPost: React.FC<{ article: NewsletterArticle; storyHref?: string }> = ({
  article,
  storyHref,
}) => {
  const href = storyHref ?? getNewsletterArticleHref(article);
  return (
    <section id="featured-story" className="py-12 md:py-20 scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <Link href={href} className="block">
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-2xl group"
          >
            <img 
              src={resolveNewsletterArticleImage(article.slug, article.image)} 
              alt={article.title} 
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-8 left-8">
              <Badge className="bg-brand-purple text-white border-none px-6 py-1.5 text-sm font-bold shadow-lg">Featured Story</Badge>
            </div>
          </m.div>
          </Link>
        </div>
        <div className="lg:col-span-5">
          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground mb-6">
            <span className="flex items-center gap-1.5 text-brand-orange"><Calendar className="h-4 w-4" /> {article.date}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {article.readTime}</span>
          </div>
          <Link href={href}>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-[1.1] hover:text-brand-purple transition-colors">
            {article.title}
          </h2>
          </Link>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                <img
                  src={article.authorImage?.trim() || resolveNewsletterAuthorAvatar(article.author)}
                  alt={article.author}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{article.author}</div>
                <div className="text-xs text-muted-foreground">{article.authorTitle || 'PM Structure'}</div>
              </div>
            </div>
            <Link href={href} className="inline-flex items-center text-brand-purple font-bold text-lg group p-0 hover:underline">
              Read full story <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export const CTABanner: React.FC<{
  title: string;
  description: string;
  buttonText: string;
  buttonHref?: string;
  variant?: "orange" | "purple";
}> = ({ title, description, buttonText, buttonHref = "/newsletter", variant = "orange" }) => {
  const variants = {
    orange: "bg-pms-gradient-orange",
    purple: "bg-pms-gradient-blue-purple",
  };

  return (
    <section className="py-12">
      <div
        className={cn(
          "rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 md:p-16 text-center relative overflow-hidden",
          variants[variant],
        )}
      >
        <div className="absolute inset-0 bg-white/5 pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 rounded-full blur-[80px] bg-white/10 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto min-w-0">
          <h3 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-6 text-balance">{title}</h3>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-10 leading-relaxed">{description}</p>
          <Link href={buttonHref} className="inline-flex w-full sm:w-auto justify-center">
            <Button
              size="lg"
              className="w-full min-h-14 h-auto whitespace-normal rounded-2xl bg-white px-6 py-3 text-base font-bold text-slate-900 shadow-xl hover:bg-slate-100 sm:w-auto sm:px-10 sm:py-0 sm:text-lg"
            >
              {buttonText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

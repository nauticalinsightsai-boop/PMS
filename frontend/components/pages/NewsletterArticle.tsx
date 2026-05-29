'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ArticleCard, CTABanner } from '@/components/NewsletterComponents';
import { PAGE_HERO_PADDING, SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import type { NewsletterArticle } from '@pms/site-content/newsletter-posts';

export function NewsletterArticlePage({
  article,
  relatedArticles,
}: {
  article: NewsletterArticle;
  relatedArticles: NewsletterArticle[];
}) {
  return (
    <article className="flex flex-col min-h-screen">
      <section
        className={`relative border-b border-slate-100 dark:border-slate-900 overflow-hidden bg-gradient-to-br from-cyan-50/70 via-slate-50 to-blue-50/50 dark:from-[#061628] dark:via-slate-950 dark:to-[#0a1535] ${PAGE_HERO_PADDING}`}
      >
        <SectionAmbience tone="cool" />
        <div className="container relative z-10 mx-auto max-w-4xl">
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-purple hover:text-brand-orange transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to The Structure Report
          </Link>
          <Badge className="mb-4 bg-brand-purple/10 text-brand-purple border-none text-[10px] font-bold uppercase tracking-widest">
            {article.category}
          </Badge>
          <h1 className="font-heading text-hero font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
            {article.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8">
            {article.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-brand-orange" aria-hidden />
              {article.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden />
              {article.readTime}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4" aria-hidden />
              {article.author}
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl py-12 md:py-16">
        <div className="aspect-[16/10] rounded-[2rem] overflow-hidden shadow-xl mb-12">
          <img
            src={article.image}
            alt=""
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none prose-p:font-medium prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-headings:font-heading">
          {article.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            This article is editorial content from PM Structure. It does not replace official
            certification-body guidance. For pathway and readiness support,{' '}
            <Link href="/certifications" className="text-brand-orange font-bold hover:underline">
              explore certifications
            </Link>
            .
          </p>
        </div>
      </div>

      {relatedArticles.length > 0 ? (
        <section className={sectionSurface('cool', 'py-20 border-t border-slate-100 dark:border-slate-900')}>
          <SectionAmbience tone="cool" />
          <div className="container relative z-10 mx-auto">
            <h2 className="font-heading text-3xl font-bold mb-10 text-slate-900 dark:text-white">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.slug} article={related} variant="horizontal" />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CTABanner
        title="Stay ahead of the curve"
        description="Get weekly insights on certification strategy, agile leadership, and career growth."
        buttonText="View all articles"
        buttonHref="/newsletter"
      />
    </article>
  );
}

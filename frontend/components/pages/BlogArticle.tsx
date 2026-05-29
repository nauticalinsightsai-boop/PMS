'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ArticleCard } from '@/components/NewsletterComponents';
import { PAGE_HERO_PADDING, SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import type { BlogArticle } from '@pms/site-content/cms-posts';
import { getBlogArticleHref } from '@/lib/blog/posts';

export function BlogArticlePage({
  article,
  relatedArticles,
}: {
  article: BlogArticle;
  relatedArticles: BlogArticle[];
}) {
  return (
    <article className="flex flex-col min-h-screen">
      <section
        className={`relative border-b border-slate-100 dark:border-slate-900 overflow-hidden bg-gradient-to-br from-purple-50/70 via-slate-50 to-orange-50/40 dark:from-[#120818] dark:via-slate-950 dark:to-[#1a0f08] ${PAGE_HERO_PADDING}`}
      >
        <SectionAmbience tone="purple" />
        <div className="container relative z-10 mx-auto max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-purple hover:text-brand-orange transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to blog
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

      <section className={sectionSurface('soft', 'py-16 md:py-20')}>
        <SectionAmbience tone="soft" />
        <div className="container relative z-10 mx-auto max-w-3xl">
          {article.image ? (
            <img
              src={article.image}
              alt=""
              className="w-full rounded-3xl mb-12 aspect-[16/9] object-cover shadow-lg"
            />
          ) : null}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {article.body.map((paragraph, i) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={i} className="font-heading text-2xl font-bold mt-10 mb-4">
                    {paragraph.replace(/^##\s+/, '')}
                  </h2>
                );
              }
              return (
                <p key={i} className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </section>

      {relatedArticles.length > 0 ? (
        <section className={sectionSurface('blend', 'py-16 border-t border-slate-100 dark:border-slate-900')}>
          <SectionAmbience tone="blend" />
          <div className="container relative z-10 mx-auto">
            <h2 className="font-heading text-2xl font-bold mb-8">Related articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              {relatedArticles.map((related) => (
                <ArticleCard
                  key={related.slug}
                  article={related}
                  href={getBlogArticleHref(related)}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}

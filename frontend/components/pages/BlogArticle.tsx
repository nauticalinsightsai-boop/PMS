import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ArticleCard } from '@/components/NewsletterComponents';
import { ArticleMarkdown } from '@/components/marketing/ArticleMarkdown';
import { PAGE_HERO_PADDING, SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import type { BlogArticle } from '@pms/site-content/cms-posts';
import { getBlogArticleHref } from '@/lib/blog/posts';
import { resolveNewsletterArticleImage } from '@pms/site-content/newsletter-posts';
import { youtubeEmbedUrl } from '@pms/site-content/youtube';

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
            <>
              <div className="mb-12 aspect-[16/9] overflow-hidden rounded-3xl shadow-lg md:hidden">
                <img
                  src={resolveNewsletterArticleImage(article.slug, article.image)}
                  alt=""
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mb-12 hidden aspect-[16/9] overflow-hidden rounded-3xl shadow-lg md:block">
                <img
                  src={resolveNewsletterArticleImage(article.slug, article.image)}
                  alt=""
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </>
          ) : null}

          {article.youtubeUrl ? (
            <div className="mb-10 overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-xl dark:border-slate-800">
              <iframe
                src={youtubeEmbedUrl(article.youtubeUrl) ?? article.youtubeUrl}
                title={`${article.title} video`}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}

          {article.audioUrl ? (
            <div className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">Listen to this article</p>
              <audio src={article.audioUrl} controls className="w-full" preload="metadata" />
            </div>
          ) : null}

          <ArticleMarkdown body={article.body} markdown={article.markdown} />
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

import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ArticleCard, CTABanner } from '@/components/NewsletterComponents';
import { ArticleMarkdown } from '@/components/marketing/ArticleMarkdown';
import { youtubeEmbedUrl } from '@pms/site-content/youtube';
import { PAGE_HERO_PADDING, SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import type { NewsletterArticle } from '@pms/site-content/newsletter-posts';
import { resolveNewsletterArticleImage } from '@pms/site-content/newsletter-posts';
import { resolveNewsletterAuthorAvatar } from '@/lib/marketing-stock-images';

function articleAuthorAvatar(article: NewsletterArticle): string {
  return article.authorImage?.trim() || resolveNewsletterAuthorAvatar(article.author);
}

function AuthorByline({ article }: { article: NewsletterArticle }) {
  const content = (
    <>
      <span className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={articleAuthorAvatar(article)}
          alt={article.author}
          width={28}
          height={28}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      </span>
      <span className="font-semibold text-slate-700 dark:text-slate-200">{article.author}</span>
    </>
  );

  if (article.authorSlug) {
    return (
      <Link
        href={`/newsletter/author/${article.authorSlug}`}
        className="inline-flex items-center gap-2 transition-colors hover:text-brand-purple"
      >
        {content}
      </Link>
    );
  }
  return <span className="inline-flex items-center gap-2">{content}</span>;
}

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
            <AuthorByline article={article} />
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-brand-orange" aria-hidden />
              {article.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden />
              {article.readTime}
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl py-12 md:py-16">
        <div className="aspect-[16/10] rounded-[2rem] overflow-hidden shadow-xl mb-12 md:hidden">
          <img
            src={resolveNewsletterArticleImage(article.slug, article.imageMobile ?? article.image)}
            alt={article.heroImageAlt ?? article.title}
            width={1200}
            height={750}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="hidden md:block aspect-[16/10] rounded-[2rem] overflow-hidden shadow-xl mb-12">
          <img
            src={resolveNewsletterArticleImage(article.slug, article.image)}
            alt={article.heroImageAlt ?? article.title}
            width={1200}
            height={750}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

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

        {article.authorBio || article.authorSlug ? (
          <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-slate-200 p-6 dark:border-slate-800 sm:flex-row sm:items-start">
            <span className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={articleAuthorAvatar(article)}
                alt={article.author}
                width={64}
                height={64}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-purple">
                {article.authorTitle || 'Author'}
              </p>
              {article.authorSlug ? (
                <Link
                  href={`/newsletter/author/${article.authorSlug}`}
                  className="font-heading text-xl font-bold text-slate-900 hover:text-brand-purple dark:text-white"
                >
                  {article.author}
                </Link>
              ) : (
                <p className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                  {article.author}
                </p>
              )}
              {article.authorBio ? (
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {article.authorBio}
                </p>
              ) : null}
              {article.authorSlug ? (
                <Link
                  href={`/newsletter/author/${article.authorSlug}`}
                  className="mt-3 inline-block text-sm font-bold text-brand-orange hover:underline"
                >
                  View all articles by {article.author}
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}

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
        title={article.ctaLabel ? 'Take the next structured step' : 'Stay ahead of the curve'}
        description={
          article.ctaLabel
            ? 'Use this article as a decision aid, then speak with PM Structure about your pathway and readiness.'
            : 'Get weekly insights on certification strategy, agile leadership, and career growth.'
        }
        buttonText={article.ctaLabel || 'View all articles'}
        buttonHref={article.ctaUrl || '/newsletter'}
        tracking={{
          slug: article.slug,
          pageLocation: 'newsletter-article-footer',
        }}
      />
    </article>
  );
}

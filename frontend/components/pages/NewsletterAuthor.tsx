import Link from 'next/link';
import { ArrowLeft, Globe, Linkedin, Mail, Twitter } from 'lucide-react';
import { ArticleCard, CTABanner } from '@/components/NewsletterComponents';
import { PAGE_HERO_PADDING, SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import type { NewsletterAuthor } from '@pms/site-content/newsletter-authors';
import type { NewsletterArticle } from '@pms/site-content/newsletter-posts';
import { resolveNewsletterAuthorAvatar } from '@/lib/marketing-stock-images';

function authorAvatar(author: NewsletterAuthor): string {
  return author.avatarUrl?.trim() || resolveNewsletterAuthorAvatar(author.name);
}

export function NewsletterAuthorPage({
  author,
  articles,
}: {
  author: NewsletterAuthor;
  articles: NewsletterArticle[];
}) {
  const socials = [
    author.linkedinUrl ? { icon: Linkedin, href: author.linkedinUrl, label: 'LinkedIn' } : null,
    author.twitterUrl ? { icon: Twitter, href: author.twitterUrl, label: 'X / Twitter' } : null,
    author.websiteUrl ? { icon: Globe, href: author.websiteUrl, label: 'Website' } : null,
    author.email ? { icon: Mail, href: `mailto:${author.email}`, label: 'Email' } : null,
  ].filter(Boolean) as { icon: typeof Linkedin; href: string; label: string }[];

  return (
    <div className="flex flex-col min-h-screen">
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
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-lg dark:border-slate-700 dark:bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={authorAvatar(author)}
                alt={author.name}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="font-heading text-hero font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                {author.name}
              </h1>
              {author.title ? (
                <p className="mt-1 text-lg font-semibold text-brand-purple">{author.title}</p>
              ) : null}
              {socials.length > 0 ? (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {socials.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-brand-purple hover:text-brand-purple dark:border-slate-700 dark:text-slate-300"
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          {author.bio ? (
            <p className="mt-8 max-w-3xl text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {author.bio}
            </p>
          ) : null}
        </div>
      </section>

      <section className={sectionSurface('cool', 'py-16 md:py-20')}>
        <SectionAmbience tone="cool" />
        <div className="container relative z-10 mx-auto">
          <h2 className="font-heading text-3xl font-bold mb-10 text-slate-900 dark:text-white">
            {articles.length > 0
              ? `Articles by ${author.name}`
              : `No articles by ${author.name} yet`}
          </h2>
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              Check back soon: new articles from this author will appear here.
            </p>
          )}
        </div>
      </section>

      <CTABanner
        title="Stay ahead of the curve"
        description="Get weekly insights on certification strategy, agile leadership, and career growth."
        buttonText="View all articles"
        buttonHref="/newsletter"
      />
    </div>
  );
}

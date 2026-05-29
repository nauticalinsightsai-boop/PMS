'use client';

import * as React from 'react';
import { Search, ArrowRight, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArticleCard, FeaturedPost } from '@/components/NewsletterComponents';
import { PAGE_HERO_PADDING } from '@/components/SectionAmbience';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { getBlogArticleHref } from '@/lib/blog/posts';
import { useWebsiteData } from '@/services/WebsiteDataService';

export function Blog() {
  const { get } = useWebsiteData();
  const { articles, isLoading } = useBlogPosts();
  const [query, setQuery] = React.useState('');
  const [visibleCount, setVisibleCount] = React.useState(6);

  const q = query.trim().toLowerCase();
  const filtered = React.useMemo(() => {
    if (!q) return articles;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q),
    );
  }, [articles, q]);

  const featured = filtered[0] ?? articles[0];
  const visible = filtered.slice(0, visibleCount);

  if (isLoading && articles.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section
        className={`relative border-b border-slate-100 dark:border-slate-900 overflow-hidden bg-gradient-to-br from-purple-50/70 via-slate-50 to-orange-50/40 dark:from-[#120818] dark:via-slate-950 dark:to-[#1a0f08] ${PAGE_HERO_PADDING}`}
      >
        <div className="container relative z-10 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <Badge
              variant="outline"
              className="mb-6 border-brand-purple/25 text-brand-purple bg-brand-purple/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              {get('blog_badge', 'Blog & insights')}
            </Badge>
            <h1 className="font-heading text-hero font-bold tracking-tight leading-tight text-slate-900 dark:text-white mb-6">
              {get('blog_title', 'PM Structure Blog')}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {get(
                'blog_subtitle',
                'Practical guidance on certification pathways, safety leadership, and professional development.',
              )}
            </p>
            <div className="relative max-w-md mx-auto mt-10">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles…"
                className="pl-10 h-12"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search blog"
              />
            </div>
          </div>
        </div>
      </section>

      {featured && !q ? (
        <section className="py-16 border-b border-slate-100 dark:border-slate-900">
          <div className="container mx-auto">
            <FeaturedPost
              article={featured}
              storyHref={getBlogArticleHref(featured)}
            />
          </div>
        </section>
      ) : null}

      <section className="py-16 md:py-20">
        <div className="container mx-auto">
          {visible.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No articles match your search.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visible.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  href={getBlogArticleHref(article)}
                />
              ))}
            </div>
          )}
          {filtered.length > visibleCount ? (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="rounded-full px-8"
                onClick={() => setVisibleCount((n) => n + 6)}
              >
                Load more
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { parseArticleSegments } from '@pms/site-content/article-markdown';
import { cn } from '@/lib/utils';

const proseClass =
  'prose prose-slate dark:prose-invert max-w-none prose-p:font-medium prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-headings:font-heading prose-a:text-brand-orange prose-blockquote:border-brand-orange';

export function ArticleMarkdownPreview({
  content,
  device,
  compact,
}: {
  content: string;
  device: 'desktop' | 'mobile';
  compact?: boolean;
}) {
  const segments = parseArticleSegments(content);

  return (
    <div
      className={cn(
        proseClass,
        compact && 'prose-sm',
        device === 'mobile' && 'text-[13px] leading-relaxed',
      )}
    >
      {segments.map((segment, index) => {
        if (segment.type === 'figure') {
          const src = device === 'mobile' ? segment.mobile || segment.desktop : segment.desktop;
          return (
            <figure key={`fig-${index}`} className="my-4 not-prose">
              <div
                className={cn(
                  'overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800',
                  device === 'mobile' ? 'mx-auto aspect-[9/16] w-full max-w-[220px]' : 'aspect-[16/10] w-full',
                )}
              >
                <img src={src} alt={segment.alt} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </div>
              {segment.alt ? (
                <figcaption className="mt-1.5 text-center text-[10px] text-muted-foreground">{segment.alt}</figcaption>
              ) : null}
            </figure>
          );
        }
        if (segment.type === 'center') {
          return (
            <div key={`center-${index}`} className="my-3 text-center text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{segment.content}</ReactMarkdown>
            </div>
          );
        }
        return (
          <div key={`md-${index}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{segment.content}</ReactMarkdown>
          </div>
        );
      })}
    </div>
  );
}

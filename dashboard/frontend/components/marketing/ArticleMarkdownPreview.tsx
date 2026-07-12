'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { parseArticleSegments } from '@pms/site-content/article-markdown';
import { sanitizeArticleHtml } from '@pms/site-content/sanitize-html';
import { cn } from '@/lib/utils';

const articleBodyClass = 'article-wysiwyg max-w-none';

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
        articleBodyClass,
        compact && 'text-sm',
        device === 'mobile' && 'text-[13px] leading-relaxed',
      )}
    >
      {segments.map((segment, index) => {
        if (segment.type === 'figure') {
          const src = device === 'mobile' ? segment.mobile || segment.desktop : segment.desktop;
          return (
            <figure key={`fig-${index}`} className="my-4">
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
          const centerSource = segment.content;
          const isHtml = /<[a-z][\s\S]*>/i.test(centerSource);
          if (isHtml) {
            return (
              <div
                key={`center-${index}`}
                className={cn('my-3 text-center text-sm', articleBodyClass, compact && 'text-sm')}
                dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(centerSource) }}
              />
            );
          }
          return (
            <div key={`center-${index}`} className={cn('my-3 text-center text-sm', articleBodyClass, compact && 'text-sm')}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{centerSource}</ReactMarkdown>
            </div>
          );
        }
        if (segment.type === 'html') {
          return (
            <div
              key={`html-${index}`}
              className={cn(articleBodyClass, compact && 'text-sm')}
              dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(segment.content) }}
            />
          );
        }
        return (
          <div key={`md-${index}`} className={cn(articleBodyClass, compact && 'text-sm')}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{segment.content}</ReactMarkdown>
          </div>
        );
      })}
    </div>
  );
}

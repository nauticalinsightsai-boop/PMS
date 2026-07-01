import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  articleMarkdownFromBody,
  parseArticleSegments,
  type ArticleSegment,
} from '@pms/site-content/article-markdown';
import { cn } from '@/lib/utils';

const proseClass =
  'prose prose-slate dark:prose-invert max-w-none prose-p:font-medium prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-headings:font-heading prose-a:text-brand-orange prose-strong:text-slate-900 dark:prose-strong:text-white prose-blockquote:border-brand-orange prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300';

function ResponsiveFigure({
  desktop,
  mobile,
  alt,
  compact,
}: {
  desktop: string;
  mobile: string;
  alt: string;
  compact?: boolean;
}) {
  return (
    <figure className={cn('my-8', compact && 'my-4')}>
      <div
        className={cn(
          'overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-md dark:border-slate-800 dark:bg-slate-900',
          compact ? 'rounded-xl' : 'rounded-2xl',
        )}
      >
        <div className="hidden md:block">
          <div className={cn('relative w-full', compact ? 'aspect-[16/10]' : 'aspect-[16/9]')}>
            <img src={desktop} alt={alt} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            {!compact ? (
              <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Desktop
              </span>
            ) : null}
          </div>
        </div>
        <div className="md:hidden">
          <div className={cn('relative mx-auto w-full max-w-[280px]', compact ? 'aspect-[9/16]' : 'aspect-[9/16]')}>
            <img
              src={mobile || desktop}
              alt={alt}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            {!compact ? (
              <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Mobile
              </span>
            ) : null}
          </div>
        </div>
      </div>
      {alt ? (
        <figcaption className="mt-2 text-center text-xs font-medium text-muted-foreground">{alt}</figcaption>
      ) : null}
    </figure>
  );
}

function SegmentBlock({ segment, compact }: { segment: ArticleSegment; compact?: boolean }) {
  if (segment.type === 'figure') {
    return (
      <ResponsiveFigure
        desktop={segment.desktop}
        mobile={segment.mobile}
        alt={segment.alt}
        compact={compact}
      />
    );
  }

  if (segment.type === 'center') {
    return (
      <div className={cn('my-6 text-center', compact && 'my-3 text-sm')}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{segment.content}</ReactMarkdown>
      </div>
    );
  }

  return (
    <div className={cn(proseClass, compact && 'prose-sm')}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{segment.content}</ReactMarkdown>
    </div>
  );
}

export function ArticleMarkdown({
  body,
  markdown,
  compact,
  className,
}: {
  body: string[];
  markdown?: string;
  compact?: boolean;
  className?: string;
}) {
  const source = articleMarkdownFromBody(body, markdown);
  const segments = parseArticleSegments(source);

  return (
    <div className={cn('space-y-2', className)}>
      {segments.map((segment, index) => (
        <SegmentBlock key={`${segment.type}-${index}`} segment={segment} compact={compact} />
      ))}
    </div>
  );
}

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
        device === 'mobile' && 'max-w-full text-[13px] leading-relaxed',
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
                  device === 'mobile' ? 'aspect-[9/16] max-w-[220px] mx-auto' : 'aspect-[16/10]',
                )}
              >
                <img src={src} alt={segment.alt} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </div>
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

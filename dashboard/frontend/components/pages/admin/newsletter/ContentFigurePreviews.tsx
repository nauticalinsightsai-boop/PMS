'use client';

import React, { useMemo } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { parseArticleSegments } from '@pms/site-content/article-markdown';
import { cn } from '@/lib/utils';

type FigurePreview = {
  desktop: string;
  mobile: string;
  alt: string;
};

const FIGURE_PREVIEW_HEIGHT = 'h-[11rem]';

function FigurePreviewFrame({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className={cn('flex w-full items-center justify-center', FIGURE_PREVIEW_HEIGHT)}>
      <div className="h-full w-full aspect-[16/10] overflow-hidden rounded-lg border border-border bg-black/5">
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
    </div>
  );
}

function FigurePair({
  figure,
  index,
  compact,
}: {
  figure: FigurePreview;
  index: number;
  compact?: boolean;
}) {
  const mobileSrc = figure.mobile.trim() || figure.desktop;

  return (
    <div className={cn('rounded-xl border border-border bg-muted/10', compact ? 'p-3' : 'p-4')}>
      <p className="mb-3 text-xs font-semibold text-muted-foreground">
        Image {index + 1}
        {figure.alt ? ` — ${figure.alt}` : ''}
      </p>
      <div className={cn('grid items-end gap-3', compact ? 'grid-cols-1 sm:grid-cols-2' : 'gap-4 md:grid-cols-2')}>
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Monitor size={14} className="text-emerald-600" />
            Desktop
          </p>
          <FigurePreviewFrame src={figure.desktop} alt={figure.alt || 'Desktop'} />
        </div>
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Smartphone size={14} className="text-emerald-600" />
            Mobile
          </p>
          <FigurePreviewFrame src={mobileSrc} alt={figure.alt || 'Mobile'} />
        </div>
      </div>
    </div>
  );
}

export function ContentFigurePreviews({
  content,
  featuredDesktop: featuredDesktopProp,
  featuredMobile,
  compact,
}: {
  content: string;
  featuredDesktop?: string;
  featuredMobile?: string;
  compact?: boolean;
}) {
  const figures = useMemo(() => {
    const fromContent = parseArticleSegments(content)
      .filter((segment) => segment.type === 'figure')
      .map((segment) =>
        segment.type === 'figure'
          ? { desktop: segment.desktop, mobile: segment.mobile, alt: segment.alt }
          : null,
      )
      .filter((item): item is FigurePreview => Boolean(item?.desktop));

    const featuredDesktop = featuredDesktopProp?.trim();
    const featured: FigurePreview[] = featuredDesktop
      ? [
          {
            desktop: featuredDesktop,
            mobile: featuredMobile?.trim() || featuredDesktop,
            alt: 'Featured image',
          },
        ]
      : [];

    if (featured.length === 0) return fromContent;

    const rest = fromContent.filter(
      (figure) => figure.desktop !== featuredDesktop && figure.mobile !== featuredDesktop,
    );
    return [...featured, ...rest];
  }, [content, featuredDesktopProp, featuredMobile]);

  if (figures.length === 0) {
    return (
      <div
        className={cn(
          'rounded-xl border border-dashed border-border bg-muted/10 text-center text-muted-foreground',
          compact ? 'px-3 py-5 text-xs' : 'px-4 py-8 text-sm',
        )}
      >
        Upload a <strong>Featured Image</strong> or insert images in the article — desktop and mobile previews appear here.
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', !compact && 'space-y-4')}>
      {figures.map((figure, index) => (
        <FigurePair key={`${figure.desktop}-${index}`} figure={figure} index={index} compact={compact} />
      ))}
    </div>
  );
}

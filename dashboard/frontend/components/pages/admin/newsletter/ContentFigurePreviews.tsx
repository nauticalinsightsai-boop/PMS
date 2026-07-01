'use client';

import React, { useMemo } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { parseArticleSegments } from '@pms/site-content/article-markdown';

type FigurePreview = {
  desktop: string;
  mobile: string;
  alt: string;
};

function FigurePair({ figure, index }: { figure: FigurePreview; index: number }) {
  const mobileSrc = figure.mobile.trim() || figure.desktop;

  return (
    <div className="rounded-xl border border-border bg-muted/10 p-4">
      <p className="mb-3 text-xs font-semibold text-muted-foreground">
        Image {index + 1}
        {figure.alt ? ` — ${figure.alt}` : ''}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Monitor size={14} className="text-emerald-600" />
            Desktop
          </p>
          <div className="aspect-[16/10] overflow-hidden rounded-lg border border-border bg-black/5">
            <img src={figure.desktop} alt={figure.alt || 'Desktop'} className="h-full w-full object-cover" />
          </div>
        </div>
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Smartphone size={14} className="text-emerald-600" />
            Mobile
          </p>
          <div className="mx-auto aspect-[9/16] max-h-[280px] w-full max-w-[160px] overflow-hidden rounded-lg border border-border bg-black/5">
            <img src={mobileSrc} alt={figure.alt || 'Mobile'} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContentFigurePreviews({
  content,
  featuredDesktop,
  featuredMobile,
}: {
  content: string;
  featuredDesktop?: string;
  featuredMobile?: string;
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

    if (fromContent.length > 0) return fromContent;

    const desktop = featuredDesktop?.trim();
    if (!desktop) return [];
    return [
      {
        desktop,
        mobile: featuredMobile?.trim() || desktop,
        alt: 'Featured image',
      },
    ];
  }, [content, featuredDesktop, featuredMobile]);

  if (figures.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-8 text-center text-sm text-muted-foreground">
        Add images with the toolbar <strong>Image</strong> button — desktop and mobile previews appear here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {figures.map((figure, index) => (
        <FigurePair key={`${figure.desktop}-${index}`} figure={figure} index={index} />
      ))}
    </div>
  );
}

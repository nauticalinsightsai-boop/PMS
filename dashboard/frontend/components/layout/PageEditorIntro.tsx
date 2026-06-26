'use client';

import React from 'react';
import { ExternalLink, Globe2 } from 'lucide-react';
import { siteUrl } from '@/lib/site-config';
import { cn } from '@/lib/utils';

export function PageEditorIntro({
  publicPath,
  description,
  className,
}: {
  publicPath: string;
  description: string;
  className?: string;
}) {
  const liveUrl = `${siteUrl.replace(/\/$/, '')}${publicPath}`;

  return (
    <div
      className={cn(
        'dashboard-panel flex flex-col gap-3 border-l-4 border-l-brand-orange/80 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6',
        className,
      )}
    >
      <div className="flex min-w-0 gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
          <Globe2 className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          <p className="text-xs text-muted-foreground/80">
            Save draft, then <strong className="font-semibold text-foreground">Publish</strong> to update
            the live site.
          </p>
        </div>
      </div>
      <a
        href={liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-brand-orange/40 hover:text-brand-orange"
      >
        View live
        <span className="font-mono text-[11px] text-muted-foreground">{publicPath}</span>
        <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
      </a>
    </div>
  );
}

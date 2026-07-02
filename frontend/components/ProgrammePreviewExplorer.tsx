'use client';

import * as React from 'react';
import Image from 'next/image';
import { ExternalLink, FileText, Maximize2, PlayCircle, Presentation } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  MaterialFullscreenDialog,
} from '@/components/programme/ProgrammeMaterialViewer';
import type {
  ProgrammeInfographicHero,
  ProgrammeInlineSection,
  ProgrammePreviewContent,
  ProgrammePreviewPanel,
} from '@/lib/pathway-programme-preview';

const PANEL_ICON = {
  pdf: FileText,
  slides: Presentation,
  video: PlayCircle,
} as const;

function panelSupportsFullscreen(panel: ProgrammePreviewPanel): boolean {
  if (!panel.available) return false;
  if (panel.kind === 'video') return !!(panel.videoSrc || panel.videoEmbedUrl);
  return false;
}

/** URL to open the material in a new browser tab (PDF, slides deck, or video). */
function panelOpenUrl(panel: ProgrammePreviewPanel): string | null {
  if (!panel.available) return null;
  if (panel.kind === 'video') return panel.videoEmbedUrl || panel.videoSrc || null;
  if (panel.kind === 'pdf') return panel.pdfSrc || null;
  if (panel.kind === 'slides') return panel.slidesPdfSrc || null;
  return null;
}

function InlineSections({ sections }: { sections: ProgrammeInlineSection[] }) {
  return (
    <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/40">
      {sections.map((section) => (
        <div key={section.heading}>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-orange mb-2">
            {section.heading}
          </p>
          <ul className="space-y-1.5">
            {section.bullets.map((bullet) => (
              <li
                key={bullet}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed pl-3 relative before:absolute before:left-0 before:top-2 before:h-1 before:w-1 before:rounded-full before:bg-brand-orange"
              >
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function DocumentOpenLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-brand-orange/30 bg-brand-orange/5 px-4 py-3 text-sm font-bold text-brand-orange transition-colors hover:bg-brand-orange/10"
    >
      <ExternalLink className="h-4 w-4" />
      Open {label} in new tab
    </a>
  );
}

function PanelBody({
  panel,
  variant = 'inline',
}: {
  panel: ProgrammePreviewPanel;
  variant?: 'inline' | 'fullscreen';
}) {
  if (!panel.available) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium py-2">
        Preview for this section is being prepared.
      </p>
    );
  }

  if (panel.kind === 'video') {
    const videoShellClass = cn(
      'overflow-hidden rounded-xl bg-slate-950',
      variant === 'inline' ? 'aspect-video' : 'flex min-h-0 flex-1 items-center justify-center',
    );
    const videoClass =
      variant === 'inline'
        ? 'h-full w-full object-contain'
        : 'max-h-[min(calc(100dvh-11rem),56rem)] w-full object-contain';

    if (panel.videoEmbedUrl) {
      return (
        <div className={videoShellClass}>
          <iframe
            title={panel.videoTitle ?? panel.title}
            src={panel.videoEmbedUrl}
            className={cn('w-full', variant === 'fullscreen' ? 'min-h-[min(calc(100dvh-11rem),56rem)]' : 'h-full')}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    if (panel.videoSrc) {
      return (
        <div className={videoShellClass}>
          <video
            className={videoClass}
            controls
            playsInline
            preload="metadata"
            title={panel.videoTitle ?? panel.title}
          >
            <source src={panel.videoSrc} type="video/mp4" />
          </video>
        </div>
      );
    }
  }

  if (panel.kind === 'pdf') {
    if (panel.pdfSrc) {
      return <DocumentOpenLink href={panel.pdfSrc} label={panel.title.toLowerCase()} />;
    }
    if (panel.inlineSections?.length) {
      return <InlineSections sections={panel.inlineSections} />;
    }
  }

  if (panel.kind === 'slides') {
    if (panel.slidesPdfSrc) {
      return <DocumentOpenLink href={panel.slidesPdfSrc} label={panel.title.toLowerCase()} />;
    }
    if (panel.inlineSections?.length) {
      return <InlineSections sections={panel.inlineSections} />;
    }
  }

  return null;
}

function InfographicHero({ hero }: { hero: ProgrammeInfographicHero }) {
  const [fullscreenOpen, setFullscreenOpen] = React.useState(false);

  if (hero.imageSrc) {
    return (
      <>
        <figure className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setFullscreenOpen(true)}
            className="group relative block w-full cursor-zoom-in text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-inset"
            aria-label={`Expand ${hero.title} to fullscreen`}
          >
            <Image
              src={hero.imageSrc}
              alt={hero.title}
              width={1600}
              height={900}
              className="pointer-events-none w-full h-auto object-contain"
              priority
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold text-white opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              Click to enlarge
            </span>
          </button>
          <figcaption className="border-t border-slate-100 px-4 py-3 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{hero.title}</p>
                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{hero.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setFullscreenOpen(true)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-orange px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-brand-orange/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
              >
                <Maximize2 className="h-3.5 w-3.5" aria-hidden />
                Open fullscreen
              </button>
            </div>
          </figcaption>
        </figure>

        <MaterialFullscreenDialog
          open={fullscreenOpen}
          onOpenChange={setFullscreenOpen}
          title={hero.title}
          description={hero.subtitle}
        >
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto">
            <Image
              src={hero.imageSrc}
              alt={hero.title}
              width={1600}
              height={900}
              quality={95}
              sizes="100vw"
              className="h-auto max-h-[min(calc(100dvh-11rem),900px)] w-full max-w-[min(96vw,1600px)] object-contain"
            />
          </div>
        </MaterialFullscreenDialog>
      </>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-orange/20 bg-gradient-to-br from-brand-orange/5 via-white to-brand-purple/5 dark:from-brand-orange/10 dark:via-slate-900 dark:to-brand-purple/10 p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-1">Pathway map</p>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{hero.title}</h3>
      <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">{hero.subtitle}</p>
      <ol className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {hero.steps.map((step, index) => (
          <li
            key={step.label}
            className="flex gap-3 rounded-xl border border-slate-100 bg-white/90 p-3 dark:border-slate-800 dark:bg-slate-950/60"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-orange text-xs font-extrabold text-white">
              {index + 1}
            </span>
            <div className="min-w-0 text-left">
              <p className="text-sm font-bold text-slate-900 dark:text-white">{step.label}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                {step.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ProgrammePreviewExplorer({
  preview,
  className,
}: {
  preview: ProgrammePreviewContent;
  className?: string;
}) {
  const firstAvailablePanelId = React.useMemo(
    () => preview.panels.find((panel) => panel.available)?.id,
    [preview.panels],
  );
  const [openPanel, setOpenPanel] = React.useState<string[]>(() =>
    firstAvailablePanelId ? [firstAvailablePanelId] : [],
  );
  const [fullscreenPanelId, setFullscreenPanelId] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (openPanel.length > 0) return;
    if (firstAvailablePanelId) setOpenPanel([firstAvailablePanelId]);
  }, [firstAvailablePanelId, openPanel.length]);

  const fullscreenPanel = React.useMemo(
    () => preview.panels.find((panel) => panel.id === fullscreenPanelId),
    [preview.panels, fullscreenPanelId],
  );

  const openFullscreen = React.useCallback((panelId: string) => {
    setOpenPanel([panelId]);
    setFullscreenPanelId(panelId);
  }, []);

  return (
    <div className={cn('space-y-5', className)}>
      <InfographicHero hero={preview.infographic} />

      <div>
        <p className="text-label mb-3">Explore materials</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-3 -mt-1">
          PDFs open in a new browser tab. Videos play inline below.
        </p>
        <Accordion
          value={openPanel}
          onValueChange={setOpenPanel}
          className="w-full rounded-2xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden"
        >
          {preview.panels.map((panel) => {
            const Icon = PANEL_ICON[panel.kind];
            return (
              <AccordionItem
                key={panel.id}
                value={panel.id}
                className="border-0 px-4 bg-white dark:bg-slate-900 data-open:bg-slate-50/80 dark:data-open:bg-slate-950/50"
              >
                <AccordionTrigger className="py-4 hover:no-underline hover:text-brand-orange">
                  <span className="flex items-center gap-3 text-left">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-slate-900 dark:text-white">
                        {panel.title}
                      </span>
                      <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                        {panel.description}
                      </span>
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-3">
                  <PanelBody panel={panel} variant="inline" />
                  {panelSupportsFullscreen(panel) ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        Watch fullscreen, or open the video in a new tab.
                      </p>
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        {panelOpenUrl(panel) ? (
                          <a
                            href={panelOpenUrl(panel) as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-orange/40 px-3 py-1.5 text-xs font-bold text-brand-orange transition-colors hover:bg-brand-orange/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                          >
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                            Open in new tab
                          </a>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => openFullscreen(panel.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-orange px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-brand-orange/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                        >
                          <Maximize2 className="h-3.5 w-3.5" aria-hidden />
                          Open fullscreen
                        </button>
                      </div>
                    </div>
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {fullscreenPanel && panelSupportsFullscreen(fullscreenPanel) ? (
        <MaterialFullscreenDialog
          open={fullscreenPanelId !== undefined}
          onOpenChange={(open) => {
            if (!open) setFullscreenPanelId(undefined);
          }}
          title={fullscreenPanel.title}
          description={fullscreenPanel.description}
        >
          <PanelBody panel={fullscreenPanel} variant="fullscreen" />
        </MaterialFullscreenDialog>
      ) : null}
    </div>
  );
}
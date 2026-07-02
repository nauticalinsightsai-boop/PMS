'use client';

import * as React from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ExternalLink, FileText, Presentation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  EmbeddedPdf,
  MaterialFullscreenDialog,
} from '@/components/programme/ProgrammeMaterialViewer';
import type {
  ProgrammeInfographicHero,
  ProgrammePreviewContent,
  ProgrammePreviewPanel,
} from '@/lib/pathway-programme-preview';

export type PathwayModalStep = 'roadmap' | 'materials';

function panelDocumentUrl(panel: ProgrammePreviewPanel | undefined): string | null {
  if (!panel?.available) return null;
  if (panel.kind === 'pdf') return panel.pdfSrc ?? null;
  if (panel.kind === 'slides') return panel.slidesPdfSrc ?? null;
  return null;
}

function RoadmapSlide({ hero }: { hero: ProgrammeInfographicHero }) {
  if (hero.imageSrc) {
    return (
      <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <Image
          src={hero.imageSrc}
          alt={hero.title}
          width={1600}
          height={900}
          className="w-full h-auto object-contain"
          priority
        />
        <figcaption className="border-t border-slate-100 px-4 py-3 dark:border-slate-800">
          <p className="text-sm font-bold text-slate-900 dark:text-white">{hero.title}</p>
          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{hero.subtitle}</p>
        </figcaption>
      </figure>
    );
  }

  return (
    <div className="rounded-2xl border border-brand-orange/20 bg-gradient-to-br from-brand-orange/5 via-white to-brand-purple/5 p-5 dark:from-brand-orange/10 dark:via-slate-900 dark:to-brand-purple/10 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-1">Pathway map</p>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{hero.title}</h3>
      <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">{hero.subtitle}</p>
      <ol className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {hero.steps.map((step, index) => (
          <li
            key={step.label}
            className="flex gap-3 rounded-xl border border-slate-100 bg-white/90 p-3 dark:border-slate-800 dark:bg-slate-950/60"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-orange text-xs font-extrabold text-white">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white">{step.label}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-slate-400">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function VideoFrame({
  panel,
  overviewVideoSrc,
  loading,
}: {
  panel: ProgrammePreviewPanel | undefined;
  overviewVideoSrc?: string | null;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading overview video…</p>
      </div>
    );
  }

  const embedUrl = panel?.videoEmbedUrl?.trim() || null;
  const fileUrl = overviewVideoSrc?.trim() || panel?.videoSrc?.trim() || null;

  if (embedUrl) {
    return (
      <div className="aspect-video overflow-hidden rounded-2xl bg-slate-950">
        <iframe
          title={panel?.videoTitle ?? panel?.title ?? 'Overview video'}
          src={embedUrl}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (fileUrl) {
    return (
      <div className="aspect-video overflow-hidden rounded-2xl bg-slate-950">
        <video
          className="h-full w-full object-contain"
          controls
          playsInline
          preload="metadata"
          src={fileUrl}
        />
      </div>
    );
  }

  if (!panel?.available) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Overview video is being prepared. You can still review the programme guide and session slides below.
        </p>
      </div>
    );
  }

  return (
    <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center dark:border-slate-700 dark:bg-slate-900/50">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        Overview video is being prepared. You can still review the programme guide and session slides below.
      </p>
    </div>
  );
}

function DocumentLinkButton({
  href,
  label,
  description,
  icon: Icon,
  onOpen,
}: {
  href: string;
  label: string;
  description: string;
  icon: typeof FileText;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-left transition-colors hover:border-brand-orange/40 hover:bg-brand-orange/5 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-brand-orange/10"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white">
          {label}
          <ExternalLink className="h-3.5 w-3.5 text-brand-orange opacity-70 transition-opacity group-hover:opacity-100" />
        </span>
        <span className="mt-0.5 block text-xs font-medium text-slate-500 dark:text-slate-400">{description}</span>
      </span>
    </button>
  );
}

export function PathwayModalPreviewFlow({
  preview,
  step,
  outcomes,
  overviewVideoSrc,
  materialsLoading = false,
  className,
}: {
  preview: ProgrammePreviewContent;
  step: PathwayModalStep;
  outcomes: string[];
  overviewVideoSrc?: string | null;
  materialsLoading?: boolean;
  className?: string;
}) {
  const guidePanel = preview.panels.find((panel) => panel.id === 'guide');
  const slidesPanel = preview.panels.find((panel) => panel.id === 'slides');
  const videoPanel = preview.panels.find((panel) => panel.id === 'video');
  const guideUrl = panelDocumentUrl(guidePanel);
  const slidesUrl = panelDocumentUrl(slidesPanel);
  const [documentViewer, setDocumentViewer] = React.useState<{
    title: string;
    description: string;
    src: string;
    openUrl: string;
  } | null>(null);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-center gap-2">
        <StepDot active={step === 'roadmap'} label="Pathway map" />
        <span className="h-px w-8 bg-slate-200 dark:bg-slate-700" aria-hidden />
        <StepDot active={step === 'materials'} label="Programme materials" />
      </div>

      {step === 'roadmap' ? (
        <section key="roadmap" className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
          <div>
            <p className="text-label mb-2">Your pathway map</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Review the roadmap for this tier, then tap Next to preview programme materials.
            </p>
          </div>
          <RoadmapSlide hero={preview.infographic} />
          {outcomes.length > 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-800/90">
              <p className="mb-3 text-label">Programme focus</p>
              <ul className="space-y-2">
                {outcomes.slice(0, 4).map((item) => (
                  <li key={item} className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    · {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : (
        <section key="materials" className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
          <div>
            <p className="text-label mb-2">Programme materials</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Watch the overview, then open the guide or slides to read in this window.
            </p>
          </div>
          <VideoFrame panel={videoPanel} overviewVideoSrc={overviewVideoSrc} loading={materialsLoading} />
          <div className="grid gap-3 sm:grid-cols-2">
            {guideUrl ? (
              <DocumentLinkButton
                href={guideUrl}
                label="Programme guide"
                description={guidePanel?.description ?? 'Chapter 0: programme foundation (read in this window).'}
                icon={FileText}
                onOpen={() =>
                  setDocumentViewer({
                    title: 'Programme guide',
                    description:
                      guidePanel?.description ?? 'Chapter 0: programme foundation (read in this window).',
                    src: guideUrl,
                    openUrl: guideUrl,
                  })
                }
              />
            ) : (
              <UnavailableDoc label="Programme guide" />
            )}
            {slidesUrl ? (
              <DocumentLinkButton
                href={slidesUrl}
                label="Session slides"
                description={slidesPanel?.description ?? 'D0: 2026 PMP Navigator deck (read in this window).'}
                icon={Presentation}
                onOpen={() =>
                  setDocumentViewer({
                    title: 'Session slides',
                    description:
                      slidesPanel?.description ?? 'D0: 2026 PMP Navigator deck (read in this window).',
                    src: slidesUrl,
                    openUrl: slidesUrl,
                  })
                }
              />
            ) : (
              <UnavailableDoc label="Session slides" />
            )}
          </div>
        </section>
      )}

      {documentViewer ? (
        <MaterialFullscreenDialog
          open
          onOpenChange={(open) => {
            if (!open) setDocumentViewer(null);
          }}
          title={documentViewer.title}
          description={documentViewer.description}
        >
          <EmbeddedPdf
            src={documentViewer.src}
            title={documentViewer.title}
            variant="fullscreen"
            openUrl={documentViewer.openUrl}
          />
        </MaterialFullscreenDialog>
      ) : null}
    </div>
  );
}

function StepDot({ active, label }: { active: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn(
          'h-2.5 w-2.5 rounded-full transition-colors',
          active ? 'bg-brand-orange' : 'bg-slate-300 dark:bg-slate-600',
        )}
        aria-hidden
      />
      <span
        className={cn(
          'text-[11px] font-semibold uppercase tracking-wide',
          active ? 'text-brand-orange' : 'text-slate-400 dark:text-slate-500',
        )}
      >
        {label}
      </span>
    </span>
  );
}

function UnavailableDoc({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
      {label} (coming soon)
    </div>
  );
}

export function PathwayModalStepActions({
  step,
  onNext,
  onBack,
  enrollActions,
}: {
  step: PathwayModalStep;
  onNext: () => void;
  onBack: () => void;
  enrollActions?: React.ReactNode;
}) {
  if (step === 'roadmap') {
    return (
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          className="h-12 w-full rounded-2xl text-base bg-brand-orange text-white hover:bg-brand-orange/90"
          onClick={onNext}
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {enrollActions}
      <Button
        type="button"
        variant="outline"
        className="h-12 w-full rounded-2xl text-base border-slate-200 dark:border-slate-700"
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to pathway map
      </Button>
    </div>
  );
}

'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, Loader2, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function MaterialFullscreenDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onOpenChange]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[140] flex flex-col bg-slate-950" role="dialog" aria-modal="true" aria-label={title}>
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="min-w-0 pr-2">
          <p className="text-sm font-bold text-white">{title}</p>
          {description ? (
            <p className="mt-0.5 text-xs font-medium text-slate-400">{description}</p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-white hover:bg-white/10"
          onClick={() => onOpenChange(false)}
          aria-label="Close fullscreen view"
        >
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
        {children}
      </div>
      <p className="pointer-events-none shrink-0 pb-4 text-center text-xs font-medium text-slate-500">
        Press Esc or close to return
      </p>
    </div>,
    document.body,
  );
}

export function EmbeddedPdf({
  src,
  title,
  variant = 'inline',
  openUrl,
}: {
  src: string;
  title: string;
  variant?: 'inline' | 'fullscreen';
  openUrl?: string;
}) {
  const [status, setStatus] = React.useState<'loading' | 'ready' | 'error'>('loading');

  React.useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    const check = async () => {
      try {
        const response = await fetch(src, { method: 'HEAD', cache: 'no-store' });
        if (cancelled) return;
        if (response.ok) {
          setStatus('ready');
          return;
        }
        setStatus('error');
      } catch {
        // Cross-origin R2 URLs may block HEAD; still attempt iframe embed.
        if (!cancelled) setStatus('ready');
      }
    };

    void check();
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (status === 'loading') {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50',
          variant === 'inline' ? 'h-[min(28rem,55vh)]' : 'min-h-[min(calc(100dvh-11rem),56rem)] flex-1',
        )}
      >
        <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading {title.toLowerCase()}…
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center dark:border-slate-600 dark:bg-slate-900/50',
          variant === 'inline' ? 'h-[min(28rem,55vh)]' : 'min-h-[min(calc(100dvh-11rem),56rem)] flex-1',
        )}
      >
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{title} is not available yet</p>
        <p className="max-w-md text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
          The PDF file could not be loaded. Upload it in the dashboard under Programme assets (Cloudflare R2), or
          add the bundled file to <code className="rounded bg-slate-200/80 px-1 py-0.5 dark:bg-slate-800">frontend/public/programme/</code>.
        </p>
        {openUrl ? (
          <a
            href={openUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-orange/40 px-3 py-1.5 text-xs font-bold text-brand-orange hover:bg-brand-orange/10"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Try opening in new tab
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
        variant === 'fullscreen' && 'h-full border-white/10 bg-white',
      )}
    >
      <iframe
        title={title}
        src={`${src}#toolbar=0&navpanes=0`}
        className={cn(
          'w-full',
          variant === 'inline' ? 'h-[min(28rem,55vh)]' : 'min-h-[min(calc(100dvh-11rem),56rem)] flex-1',
        )}
      />
    </div>
  );
}

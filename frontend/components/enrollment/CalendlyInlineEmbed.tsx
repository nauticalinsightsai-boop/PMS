'use client';

import * as React from 'react';
import { buildCalendlyInlineWidgetUrl } from '@/lib/calendly/embed-url';
import { loadCalendlyWidget } from '@/lib/calendly/open-themed-popup';
import { cn } from '@/lib/utils';

type Props = {
  schedulingUrl: string;
  className?: string;
  /** Tighter Calendly chrome + enrollment surface colors. */
  integrated?: boolean;
};

export function CalendlyInlineEmbed({ schedulingUrl, className = '', integrated = false }: Props) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [status, setStatus] = React.useState<'loading' | 'ready' | 'error'>('loading');

  React.useEffect(() => {
    const parent = hostRef.current;
    if (!parent || typeof window === 'undefined') return;

    let cancelled = false;
    const url = buildCalendlyInlineWidgetUrl(schedulingUrl, {
      host: window.location.hostname,
      minimalChrome: integrated,
      surface: integrated ? 'enrollment' : 'default',
    });

    if (!url) {
      setStatus('error');
      return;
    }

    parent.innerHTML = '';
    setStatus('loading');

    loadCalendlyWidget()
      .then(() => {
        if (cancelled || !hostRef.current) return;
        if (!window.Calendly?.initInlineWidget) {
          setStatus('error');
          return;
        }
        window.Calendly.initInlineWidget({ url, parentElement: hostRef.current });
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
      parent.innerHTML = '';
    };
  }, [schedulingUrl, integrated]);

  return (
    <div className={cn('seat-reservation-calendly relative w-full min-w-0', className)}>
      {status === 'loading' && (
        <div className="absolute inset-0 z-10 flex min-h-[480px] items-center justify-center bg-white/90 text-sm text-slate-500 dark:bg-slate-950/90">
          Loading checkout…
        </div>
      )}
      {status === 'error' && (
        <div className="flex min-h-[200px] items-center justify-center px-4 text-center text-sm text-red-600">
          Unable to load payment scheduler. Please refresh or contact support.
        </div>
      )}
      {status !== 'error' && (
        <div ref={hostRef} className="calendly-inline-widget-host w-full min-h-[480px]" />
      )}
    </div>
  );
}

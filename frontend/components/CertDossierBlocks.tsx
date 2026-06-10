'use client';

import * as React from 'react';
import { Award, CheckCircle2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dossierTextToBullets } from '@/lib/dossier-text-bullets';

export function DossierCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800',
        className,
      )}
    >
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{title}</h4>
      {children}
    </div>
  );
}

export function DossierBulletList({
  text,
  items,
  icon = 'dot',
}: {
  text?: string | null;
  items?: string[];
  icon?: 'dot' | 'check';
}) {
  const bullets = items?.length ? items : dossierTextToBullets(text);
  if (!bullets.length) return null;

  return (
    <ul className="space-y-3">
      {bullets.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          {icon === 'check' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-green-500" />
          ) : (
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
          )}
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Collapsed preview; expands on hover (desktop) or tap (all devices). */
export function ExpandableExamRegistration({
  examFormat,
  registrationSteps,
  title = 'Exam Format & Registration',
}: {
  examFormat?: string | null;
  registrationSteps?: string | null;
  title?: string;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const examBullets = React.useMemo(
    () => dossierTextToBullets(examFormat || 'Standard proctored examination.'),
    [examFormat],
  );
  const registrationBullets = React.useMemo(
    () => dossierTextToBullets(registrationSteps || 'Apply via governing body website.'),
    [registrationSteps],
  );
  const totalItems = examBullets.length + registrationBullets.length;

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-100 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900',
        expanded ? 'p-6 shadow-md ring-1 ring-brand-orange/15' : 'p-4 sm:p-5',
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 text-left"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
      >
        <h3
          className={cn(
            'font-bold flex items-center gap-3',
            expanded ? 'text-2xl' : 'text-lg sm:text-xl',
          )}
        >
          <Award className="h-6 w-6 text-brand-orange shrink-0" />
          {title}
        </h3>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300',
            expanded && 'rotate-180',
          )}
        />
      </button>

      <p className="mt-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
        {expanded
          ? 'Official exam and registration'
          : `${totalItems} details — hover or tap to expand`}
      </p>

      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          expanded ? 'mt-5 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <DossierCard title="Official exam">
              <DossierBulletList items={examBullets} />
            </DossierCard>
            <DossierCard title="Registration steps">
              <DossierBulletList items={registrationBullets} />
            </DossierCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExpandableLearningOutcomes({
  outcomes,
  title = 'Learning Outcomes',
  icon: Icon = CheckCircle2,
}: {
  outcomes: string[];
  title?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-100 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900',
        expanded ? 'p-6 shadow-md ring-1 ring-brand-orange/15' : 'p-4 sm:p-5',
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 text-left"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
      >
        <h3
          className={cn(
            'font-bold flex items-center gap-3',
            expanded ? 'text-2xl' : 'text-lg sm:text-xl',
          )}
        >
          <Icon className="h-6 w-6 text-brand-orange shrink-0" />
          {title}
        </h3>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300',
            expanded && 'rotate-180',
          )}
        />
      </button>

      <p className="mt-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
        {expanded
          ? 'All outcomes'
          : `${outcomes.length} outcomes — hover or tap to expand`}
      </p>

      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          expanded ? 'mt-5 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="grid gap-3">
            {outcomes.map((outcome) => (
              <div
                key={outcome}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50"
              >
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  {outcome}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

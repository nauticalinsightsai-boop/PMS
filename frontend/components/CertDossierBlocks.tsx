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
  const examPreview = examBullets.slice(0, 2);
  const regPreview = registrationBullets.slice(0, 2);
  const hiddenCount =
    Math.max(0, examBullets.length - examPreview.length) +
    Math.max(0, registrationBullets.length - regPreview.length);

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-100 bg-white p-6 transition-shadow duration-300 dark:border-slate-800 dark:bg-slate-900',
        expanded && 'shadow-md ring-1 ring-brand-orange/15',
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
        <h3 className="text-2xl font-bold flex items-center gap-3">
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

      <p className="mt-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
        {expanded
          ? 'Official exam and registration'
          : `Hover or tap to view exam format and registration (${totalItems} details)`}
      </p>

      <div
        className={cn(
          'mt-5 transition-all duration-300 ease-out',
          expanded ? 'opacity-100' : 'opacity-90',
        )}
      >
        {expanded ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <DossierCard title="Official exam">
              <DossierBulletList items={examBullets} />
            </DossierCard>
            <DossierCard title="Registration steps">
              <DossierBulletList items={registrationBullets} />
            </DossierCard>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                Official exam
              </p>
              <DossierBulletList items={examPreview} />
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                Registration steps
              </p>
              <DossierBulletList items={regPreview} />
            </div>
          </div>
        )}
      </div>

      {!expanded && hiddenCount > 0 && (
        <p className="mt-3 text-center text-xs font-bold uppercase tracking-widest text-brand-orange/80">
          +{hiddenCount} more
        </p>
      )}
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
  const preview = outcomes.slice(0, 2);
  const rest = outcomes.slice(2);

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-100 bg-white p-6 transition-shadow duration-300 dark:border-slate-800 dark:bg-slate-900',
        expanded && 'shadow-md ring-1 ring-brand-orange/15',
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
        <h3 className="text-2xl font-bold flex items-center gap-3">
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

      <p className="mt-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
        {expanded ? 'All outcomes' : `Hover or tap to view all ${outcomes.length} outcomes`}
      </p>

      <div
        className={cn(
          'mt-5 grid gap-3 transition-all duration-300 ease-out',
          expanded ? 'opacity-100' : 'opacity-90',
        )}
      >
        {(expanded ? outcomes : preview).map((outcome) => (
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

      {!expanded && rest.length > 0 && (
        <p className="mt-3 text-center text-xs font-bold uppercase tracking-widest text-brand-orange/80">
          +{rest.length} more
        </p>
      )}
    </div>
  );
}

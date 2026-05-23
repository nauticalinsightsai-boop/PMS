'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Award, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { FamilyConfig } from '@/types/site';

const FAMILY_WASH: Record<string, string> = {
  PMI: 'from-violet-50/70 via-white/95 to-orange-50/20 dark:from-violet-950/30 dark:via-slate-900 dark:to-slate-950',
  PRINCE2:
    'from-cyan-50/60 via-white/95 to-violet-50/15 dark:from-cyan-950/25 dark:via-slate-900 dark:to-slate-950',
  SixSigma:
    'from-slate-100/90 via-white/95 to-slate-50/40 dark:from-slate-800/35 dark:via-slate-900 dark:to-slate-950',
};

function FamilyIcon({ familyId }: { familyId: string }) {
  if (familyId === 'PMI') return <Award className="h-8 w-8" aria-hidden />;
  if (familyId === 'PRINCE2') return <ShieldCheck className="h-8 w-8" aria-hidden />;
  return <TrendingUp className="h-8 w-8" aria-hidden />;
}

export function FamilyExploreCard({
  family,
  index,
}: {
  family: FamilyConfig;
  index: number;
}) {
  const wash = FAMILY_WASH[family.id] ?? FAMILY_WASH.PMI;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group h-full"
    >
      <div
        className={cn(
          'relative flex h-full min-h-[18rem] flex-col overflow-hidden rounded-[2.5rem]',
          'border border-slate-200/90 dark:border-slate-700/80',
          'bg-gradient-to-br',
          wash,
          'shadow-[0_8px_32px_-12px_rgba(11,11,42,0.14)]',
          'ring-1 ring-inset ring-white/60 dark:ring-white/[0.04]',
          'backdrop-blur-sm',
          'transition-all duration-500 ease-out',
          'hover:-translate-y-1.5',
          'hover:shadow-[0_28px_60px_-18px_rgba(11,11,42,0.24)]',
          family.border,
          'hover:border-opacity-60',
        )}
      >
        <div className={cn('absolute inset-x-0 top-0 z-[1] h-1.5', family.accent)} aria-hidden />

        <div
          className={cn(
            'pointer-events-none absolute -right-20 -top-20 z-0 h-56 w-56 rounded-full opacity-[0.22] blur-3xl',
            family.accent,
          )}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 z-0 h-44 w-44 rounded-full bg-pms-gradient-orange opacity-[0.08] blur-3xl dark:opacity-[0.12]"
          aria-hidden
        />

        <div className="relative z-10 flex flex-1 flex-col p-10 md:p-11">
          <div
            className={cn(
              'mb-8 flex h-16 w-16 items-center justify-center rounded-2xl text-white',
              'shadow-[0_12px_28px_-8px_rgba(11,11,42,0.35)]',
              'ring-2 ring-white/40 dark:ring-slate-600/50',
              'transition-transform duration-500 group-hover:scale-[1.06]',
              family.accent,
            )}
          >
            <FamilyIcon familyId={family.id} />
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            {family.name}
          </h3>
          <p className="text-base text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium flex-1">
            {family.description}
          </p>

          <Link href={`/certifications?family=${family.id}`} className="mt-auto">
            <Button
              variant="link"
              className={cn(
                'p-0 font-bold text-base h-auto group/link',
                family.text,
                'dark:text-white dark:hover:text-brand-orange',
              )}
            >
              Explore Family
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

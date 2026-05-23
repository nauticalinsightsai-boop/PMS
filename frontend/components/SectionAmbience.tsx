import { cn } from '@/lib/utils';

/** Brand gradient washes for page sections — reduces flat white/black feel */
export type SectionTone = 'warm' | 'cool' | 'purple' | 'blend' | 'soft';

const toneBackground: Record<SectionTone, string> = {
  warm: 'bg-gradient-to-b from-orange-50/55 via-background to-background dark:from-background dark:via-card dark:to-background',
  cool: 'bg-gradient-to-b from-cyan-50/50 via-background to-background dark:from-background dark:via-card dark:to-background',
  purple: 'bg-gradient-to-b from-violet-50/50 via-background to-background dark:from-background dark:via-card dark:to-background',
  blend:
    'bg-gradient-to-br from-orange-50/35 via-background to-violet-50/30 dark:from-card dark:via-background dark:to-[var(--shell-gradient-dark-to)]',
  soft: 'bg-gradient-to-b from-slate-50/90 via-background to-background dark:from-card/80 dark:via-background dark:to-background',
};

type Orb = { className: string };

const toneOrbs: Record<SectionTone, Orb[]> = {
  warm: [
    { className: 'top-[-12%] right-[-8%] w-[38%] h-[38%] opacity-25 bg-pms-gradient-orange' },
    { className: 'bottom-[-15%] left-[-10%] w-[32%] h-[32%] opacity-15 bg-pms-gradient-orange' },
  ],
  cool: [
    { className: 'top-[-10%] right-[-5%] w-[40%] h-[40%] opacity-30 bg-pms-gradient-blue-cyan' },
    { className: 'bottom-[-18%] left-[-12%] w-[35%] h-[35%] opacity-22 bg-pms-gradient-blue-purple' },
  ],
  purple: [
    { className: 'top-[-15%] left-[-8%] w-[42%] h-[40%] opacity-28 bg-pms-gradient-blue-purple' },
    { className: 'bottom-[-12%] right-[-10%] w-[30%] h-[30%] opacity-18 bg-pms-gradient-blue-cyan' },
  ],
  blend: [
    { className: 'top-[-10%] right-[-8%] w-[36%] h-[36%] opacity-22 bg-pms-gradient-orange' },
    { className: 'bottom-[-15%] left-[-10%] w-[40%] h-[40%] opacity-28 bg-pms-gradient-blue-purple' },
    { className: 'top-[40%] left-[40%] w-[20%] h-[22%] opacity-12 bg-pms-gradient-blue-cyan' },
  ],
  soft: [
    { className: 'top-[-8%] right-[20%] w-[28%] h-[28%] opacity-15 bg-pms-gradient-blue-purple' },
    { className: 'bottom-[-10%] left-[10%] w-[24%] h-[24%] opacity-12 bg-pms-gradient-orange' },
  ],
};

/** Shared vertical rhythm for page heroes (aligned with Certifications). */
export const PAGE_HERO_PADDING = 'pt-32 pb-28';

export function sectionSurface(tone: SectionTone, className?: string) {
  return cn('relative overflow-hidden', toneBackground[tone], className);
}

export function pageHeroSection(tone: SectionTone, className?: string) {
  return sectionSurface(tone, cn(PAGE_HERO_PADDING, className));
}

export function SectionAmbience({ tone }: { tone: SectionTone }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {toneOrbs[tone].map((orb) => (
        <div
          key={orb.className}
          className={cn('absolute rounded-full blur-[120px]', orb.className)}
        />
      ))}
    </div>
  );
}

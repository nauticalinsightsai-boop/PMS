import { Award, ShieldCheck, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFamilyGradient } from '@/lib/brand-visual';
import type { CertificationSummary } from '@/types/site';

interface CertificationPathwayVisualProps {
  cert: CertificationSummary;
  /** Short label under the icon (e.g. cert code) */
  subtitle?: string;
  className?: string;
}

function familyIcon(familyId: string) {
  if (familyId === 'PRINCE2') return ShieldCheck;
  if (familyId === 'SixSigma') return TrendingUp;
  return Award;
}

/** Gradient header with family icon — featured pathways & certifications grid */
export function CertificationPathwayVisual({
  cert,
  subtitle,
  className,
}: CertificationPathwayVisualProps) {
  const headerGradient = getFamilyGradient(cert.familyId);
  const accent = cert.color ?? '#2851b9';
  const Icon = familyIcon(cert.familyId);

  return (
    <div className={cn('relative h-36 w-full shrink-0 overflow-hidden', className)}>
      <div className="absolute inset-0" style={{ background: headerGradient }} />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-white/10" />
      <div className="relative flex h-full flex-col items-center justify-center gap-2.5 px-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/95 shadow-lg ring-1 ring-white/50 transition-transform duration-300 group-hover/pathway:scale-105"
          style={{ color: accent }}
        >
          <Icon className="h-8 w-8" aria-hidden />
        </div>
        {subtitle ? (
          <span className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white drop-shadow-md">
            {subtitle}
          </span>
        ) : null}
      </div>
    </div>
  );
}

import { CertFamilyMark } from '@/components/CertFamilyMark';
import { cn } from '@/lib/utils';
import { getFamilyGradient } from '@/lib/brand-visual';
import type { CertificationSummary } from '@/types/site';

interface CertificationPathwayVisualProps {
  cert: CertificationSummary;
  /** Short label under the icon (e.g. cert code) */
  subtitle?: string;
  className?: string;
}

/** Gradient header with family mark — featured pathways & certifications grid */
export function CertificationPathwayVisual({
  cert,
  subtitle,
  className,
}: CertificationPathwayVisualProps) {
  const headerGradient = getFamilyGradient(cert.familyId);
  const accent = cert.color ?? '#2851b9';
  const isPmi = cert.familyId === 'PMI';
  const isPrince2 = cert.familyId === 'PRINCE2';
  const isSixSigma = cert.familyId === 'SixSigma';
  const hasBrandLogo = isPmi || isPrince2 || isSixSigma;
  /** Wordmark already includes the PRINCE2 name — omit cert subtitle under the logo. */
  const showSubtitle = Boolean(subtitle) && !isPrince2;

  return (
    <div className={cn('relative h-36 w-full shrink-0 overflow-hidden', className)}>
      <div className="absolute inset-0" style={{ background: headerGradient }} />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-white/10" />
      <div className="relative flex h-full flex-col items-center justify-center gap-2.5 px-4">
        <div
          className={cn(
            'flex h-16 items-center justify-center rounded-2xl shadow-lg ring-1 transition-transform duration-300 group-hover/pathway:scale-105',
            (isPmi || isSixSigma) && 'w-16 bg-white/95 p-1.5 ring-white/50',
            isPrince2 && 'w-[5.75rem] bg-white/95 px-2 ring-white/50',
            !hasBrandLogo && 'w-16 bg-white/95 ring-white/50',
          )}
          style={hasBrandLogo ? undefined : { color: accent }}
        >
          <CertFamilyMark
            familyId={cert.familyId}
            imageClassName={isPrince2 ? 'h-9 w-full max-w-[5rem]' : 'h-11 w-11 object-contain'}
            iconClassName="h-8 w-8"
          />
        </div>
        {showSubtitle ? (
          <span className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white drop-shadow-md">
            {subtitle}
          </span>
        ) : null}
      </div>
    </div>
  );
}

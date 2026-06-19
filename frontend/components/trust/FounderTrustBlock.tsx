import { Badge } from '@/components/ui/badge';
import { BRAND } from '@/lib/brand-voice';

/** Public mount requires owner credential approval (see pmstructure-author-reviewer-registry.csv). */
export const FOUNDER_TRUST_PUBLIC_MOUNT_APPROVED = false;

const FOUNDER_COPY =
  'PM Structure is led by Sheikh M. Abdullah, a project-management and engineering professional with PMP, PMI-RMP, LEED, and ISO lead-auditor credentials, and practical experience across complex project environments. The platform is built to help serious candidates structure their PMP 2026 readiness instead of relying on random study material.';

type FounderTrustBlockProps = {
  /** Set true only after Sheikh M. Abdullah approves public credential display. */
  enabled?: boolean;
  className?: string;
};

/**
 * Founder/mentor trust layer (T-178). Default hidden until owner approves credentials.
 */
export function FounderTrustBlock({ enabled = FOUNDER_TRUST_PUBLIC_MOUNT_APPROVED, className }: FounderTrustBlockProps) {
  if (!enabled) return null;

  return (
    <aside
      className={className}
      aria-label={`About ${BRAND.name} founder`}
    >
      <Badge className="mb-4 bg-amber-500/10 text-amber-700 dark:text-amber-300 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
        Credential verification required before public display
      </Badge>
      <p className="text-base font-medium leading-relaxed text-slate-600 dark:text-slate-400">{FOUNDER_COPY}</p>
    </aside>
  );
}

import {
  PLATFORM_LEARNERS_CLEARED,
  PLATFORM_LEARNERS_CLEARED_LABEL,
} from './platformMarketingStats'

/**
 * Platform-level proof metrics for /go/* portals (aggregate, not individual CV lines).
 * Order: cleared learners → issuing bodies → pathways → regional pricing.
 */
export const VERIFIED_PROOF_METRICS = [
  { label: PLATFORM_LEARNERS_CLEARED_LABEL, value: PLATFORM_LEARNERS_CLEARED },
  { label: 'Issuing bodies covered', value: 'PMI · PRINCE2 · Six Sigma' },
  { label: 'Certification pathways', value: '55+ structured prep programs' },
  { label: 'Regional pricing', value: 'Scholarship tiers by residence' },
] as const

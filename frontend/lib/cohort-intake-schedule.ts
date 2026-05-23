type PathwayFamilyTab = 'PMI' | 'PRINCE2' | 'SixSigma';

/**
 * Staggered intake months relative to the rolling baseline (first day of next calendar month).
 * Keeps flagship pathways on earlier cohorts; specialist pathways spread Jun–Sep.
 */
export type CohortIntakeTier = 'next' | 'priority' | 'standard' | 'extended';

/** Extra months added on top of the rolling “next month” baseline. */
export const COHORT_TIER_EXTRA_MONTHS: Record<CohortIntakeTier, number> = {
  next: 0,
  priority: 1,
  standard: 2,
  extended: 3,
};

const FAMILY_DEFAULT_TIER: Record<PathwayFamilyTab, CohortIntakeTier> = {
  PMI: 'extended',
  PRINCE2: 'extended',
  SixSigma: 'extended',
};

/** Per-pathway intake tier (overrides family default). */
export const CERT_COHORT_INTAKE_TIER: Record<string, CohortIntakeTier> = {
  // PMI — flagship row + portfolio
  capm: 'next',
  'pmi-rmp': 'next',
  pmp: 'priority',
  pgmp: 'priority',
  pfmp: 'priority',
  'pmi-sp': 'standard',
  'pmi-cp': 'standard',
  'pmi-acp': 'extended',
  'pmi-pba': 'extended',
  'pmi-pmocp': 'extended',
  'pmi-cpmai': 'extended',
  'gpm-b': 'extended',

  // PRINCE2 — flagship row
  prince2: 'next',
  'prince2-practitioner': 'priority',
  'prince2-agile': 'standard',
  'prince2-agile-practitioner': 'standard',
  msp: 'extended',
  mop: 'extended',
  mor: 'extended',
  p3o: 'extended',

  // Lean Six Sigma — flagship row
  'lss-green': 'next',
  'lss-yellow': 'priority',
  'lss-black': 'standard',
  'lss-white': 'extended',
  'lss-master': 'extended',
  'lss-champion': 'extended',

  'foundation-direct': 'extended',
};

const CERT_FAMILY: Record<string, PathwayFamilyTab> = {
  capm: 'PMI',
  'pmi-rmp': 'PMI',
  pmp: 'PMI',
  pgmp: 'PMI',
  pfmp: 'PMI',
  'pmi-sp': 'PMI',
  'pmi-cp': 'PMI',
  'pmi-acp': 'PMI',
  'pmi-pba': 'PMI',
  'pmi-pmocp': 'PMI',
  'pmi-cpmai': 'PMI',
  'gpm-b': 'PMI',
  prince2: 'PRINCE2',
  'prince2-practitioner': 'PRINCE2',
  'prince2-agile': 'PRINCE2',
  'prince2-agile-practitioner': 'PRINCE2',
  msp: 'PRINCE2',
  mop: 'PRINCE2',
  mor: 'PRINCE2',
  p3o: 'PRINCE2',
  'lss-green': 'SixSigma',
  'lss-yellow': 'SixSigma',
  'lss-black': 'SixSigma',
  'lss-white': 'SixSigma',
  'lss-master': 'SixSigma',
  'lss-champion': 'SixSigma',
  'foundation-direct': 'PMI',
};

export function resolveCohortIntakeTier(certId: string): CohortIntakeTier {
  const explicit = CERT_COHORT_INTAKE_TIER[certId];
  if (explicit) return explicit;
  const family = CERT_FAMILY[certId];
  if (family) return FAMILY_DEFAULT_TIER[family];
  return 'extended';
}

/** Months ahead of today for the next intake (always lands on the 1st of that month). */
export function getCohortMonthsAhead(certId: string): number {
  const tier = resolveCohortIntakeTier(certId);
  return 1 + COHORT_TIER_EXTRA_MONTHS[tier];
}

export function getScheduledCohortDate(certId: string, from: Date = new Date()): Date {
  const monthsAhead = getCohortMonthsAhead(certId);
  return new Date(from.getFullYear(), from.getMonth() + monthsAhead, 1);
}

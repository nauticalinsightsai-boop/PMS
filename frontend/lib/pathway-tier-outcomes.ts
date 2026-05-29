export type PathwayOutcomeTier = 'foundation' | 'professional' | 'mastery';

export type PathwayOutcomesByTier = Partial<Record<PathwayOutcomeTier, string[]>>;

const DEFAULT_BY_TIER: Record<PathwayOutcomeTier, string[]> = {
  foundation: [
    'Understand certification scope, domains, and how this pathway is structured',
    'Build core vocabulary with self-paced LMS lessons and templates',
    'Clarify prerequisites, timelines, and your study plan',
    'Gain confidence before moving into exam-focused preparation',
  ],
  professional: [
    'Apply exam content with structured mocks and scenario practice',
    'Strengthen weak domains with cohort support and review',
    'Use exam-style templates, drills, and pacing strategies',
    'Prepare to sit the exam with a focused, exam-ready plan',
  ],
  mastery: [
    'Extend certification knowledge into real delivery and leadership contexts',
    'Work with mentors on implementation, governance, and accountability',
    'Bridge exam prep to sustained organizational impact',
    'Practice readiness review before advanced engagement begins',
  ],
};

/** Per-cert overrides (optional); keys match site certification ids. */
const CERT_OVERRIDES: Record<string, PathwayOutcomesByTier> = {
  pmp: {
    foundation: [
      'Map PMP exam domains at a conceptual level across predictive and agile work',
      'Learn pathway structure, LMS navigation, and baseline study planning',
      'Build core PM vocabulary before intensive exam preparation',
      'Clarify eligibility, timelines, and how Foundation fits your PMP path',
    ],
    professional: [
      'Apply PMP ECO scenarios with mocks, templates, and timed practice',
      'Strengthen people, process, and business environment domains',
      'Use cohort support, drills, and limited 1:1 review for weak areas',
      'Prepare exam-day strategy, pacing, and confidence for test day',
    ],
    mastery: [
      'Translate PMP knowledge into program delivery and stakeholder leadership',
      'Mentor-led readiness review and structured accountability',
      'Integrate governance, benefits, and quality in real-world contexts',
      'Extend exam mastery to broader organizational implementation',
    ],
  },
};

function normalizeTierKey(tierId: string): PathwayOutcomeTier | null {
  if (tierId === 'foundation') return 'foundation';
  if (tierId === 'professional') return 'professional';
  if (
    tierId === 'mastery' ||
    tierId === 'mastery_corporate' ||
    tierId === 'mastery_advisory'
  ) {
    return 'mastery';
  }
  return null;
}

/** Up to four bullet outcomes for a pathway tier card. */
export function resolvePathwayTierOutcomes(
  siteCertId: string,
  tierId: string,
  certOutcomes?: PathwayOutcomesByTier,
  legacyOutcomes?: string[],
): string[] {
  const key = normalizeTierKey(tierId);
  if (!key) return legacyOutcomes?.slice(0, 4) ?? [];

  const fromCert = certOutcomes?.[key];
  if (fromCert?.length) return fromCert.slice(0, 4);

  const fromOverride = CERT_OVERRIDES[siteCertId]?.[key];
  if (fromOverride?.length) return fromOverride.slice(0, 4);

  return DEFAULT_BY_TIER[key].slice(0, 4);
}

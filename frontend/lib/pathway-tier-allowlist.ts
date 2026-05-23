/**
 * Pathway UI tier allowlists — matrix rows may exist for pricing/admin but not be sold on-site.
 * Keys: siteData cert id. Values: tierIds shown on cert detail / pathway cards / compare.
 *
 * Omitted certs: all globally visible matrix tiers for that course (see regional-catalogue.json).
 */
export const SITE_CERT_PATHWAY_TIERS: Partial<Record<string, readonly string[]>> = {
  /** CAPM: matrix row is Professional only (no F/M rows). */
  capm: ['professional'],
  /** PMI-RMP: Foundation + Professional only — no mentor-led Mastery pathway. */
  'pmi-rmp': ['foundation', 'professional'],
  'pmi-sp': ['professional', 'mastery'],
  'pmi-pba': ['professional', 'mastery'],
  'pmi-pmocp': ['professional', 'mastery'],
  'prince2': ['professional'],
  'lss-white': ['foundation'],
  'lss-master': ['mastery_advisory'],
};

export function isPathwayTierAllowed(siteCertId: string, tierId: string): boolean {
  const allow = SITE_CERT_PATHWAY_TIERS[siteCertId];
  if (!allow) return true;
  return allow.includes(tierId);
}

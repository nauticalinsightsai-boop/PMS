/**
 * Pathway UI tier allowlists: matrix rows may exist for pricing/admin but not be sold on-site.
 * Keys: siteData cert id. Values: tierIds shown on cert detail / pathway cards / compare.
 *
 * Omitted certs: all globally visible matrix tiers for that course (see regional-catalogue.json).
 */
export { SITE_CERT_PATHWAY_TIERS } from '../../packages/regional-catalogue/scholarship';
import { isScholarshipPathwayTierAllowed } from '../../packages/regional-catalogue/scholarship';

export function isPathwayTierAllowed(siteCertId: string, tierId: string): boolean {
  return isScholarshipPathwayTierAllowed(siteCertId, tierId);
}

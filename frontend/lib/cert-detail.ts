import type { CertificationSummary } from '@/types/site';
import type { CertificationRegistryEntry } from '@pms/site-content';

export type ResolvedCertMarketing = CertificationSummary & {
  detailHeroTitle: string;
  detailHeroSubtitle: string;
  outputValueDisplay: string;
  recommendedCtaDisplay: string;
  targetAudienceDisplay: string;
};

export function resolveCertMarketing(
  siteCert: CertificationSummary,
  registryEntry?: CertificationRegistryEntry | null,
): ResolvedCertMarketing {
  return {
    ...siteCert,
    name: registryEntry?.name ?? siteCert.name,
    desc: registryEntry?.detailHeroSubtitle ?? registryEntry?.desc ?? siteCert.desc,
    color: registryEntry?.color ?? siteCert.color,
    gradient: registryEntry?.gradient ?? siteCert.gradient,
    detailHeroTitle: registryEntry?.detailHeroTitle ?? `${siteCert.name} Pathway`,
    detailHeroSubtitle: registryEntry?.detailHeroSubtitle ?? registryEntry?.desc ?? siteCert.desc,
    outputValueDisplay: registryEntry?.outputValue ?? siteCert.outputValue ?? '',
    recommendedCtaDisplay: registryEntry?.recommendedCta ?? siteCert.recommendedCTA ?? '',
    targetAudienceDisplay: registryEntry?.targetAudience ?? siteCert.targetAudience ?? '',
  };
}

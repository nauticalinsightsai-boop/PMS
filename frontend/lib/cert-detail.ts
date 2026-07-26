import type { CertificationSummary } from '@/types/site';
import type { CertificationRegistryEntry } from '@pms/site-content';
import { getPacketBCertDifferentiation } from '@/content/seo/packet-b-cert-differentiation';
import { getPhase2Seo } from '@/content/seo/phase-2-page-seo';

export type ResolvedCertMarketing = CertificationSummary & {
  detailHeroTitle: string;
  detailHeroSubtitle: string;
  outputValueDisplay: string;
  recommendedCtaDisplay: string;
  targetAudienceDisplay: string;
};

function pickRegistryString(
  registryValue: string | undefined,
  siteValue: string | undefined,
  fallback = '',
): string {
  const trimmed = registryValue?.trim();
  if (trimmed) return trimmed;
  return siteValue?.trim() || fallback;
}

function pickRegistryArray(registryValue: string[] | undefined, siteValue: string[] | undefined): string[] {
  if (registryValue?.length) return registryValue;
  return siteValue ?? [];
}

export function resolveCertMarketing(
  siteCert: CertificationSummary,
  registryEntry?: CertificationRegistryEntry | null,
): ResolvedCertMarketing {
  return {
    ...siteCert,
    name: registryEntry?.name ?? siteCert.name,
    desc: registryEntry?.desc ?? siteCert.desc,
    color: registryEntry?.color ?? siteCert.color,
    gradient: registryEntry?.gradient ?? siteCert.gradient,
    pricing: registryEntry?.pricing ?? siteCert.pricing,
    targetAudience: pickRegistryString(registryEntry?.targetAudience, siteCert.targetAudience),
    prerequisites: pickRegistryString(registryEntry?.prerequisites, siteCert.prerequisites),
    examFormat: pickRegistryString(registryEntry?.examFormat, siteCert.examFormat),
    registrationSteps: pickRegistryString(registryEntry?.registrationSteps, siteCert.registrationSteps),
    officialFee: pickRegistryString(registryEntry?.officialFee, siteCert.officialFee),
    trainingPriceRange: pickRegistryString(registryEntry?.trainingPriceRange, siteCert.trainingPriceRange),
    learningOutcomes: pickRegistryArray(registryEntry?.learningOutcomes, siteCert.learningOutcomes),
    pathwayOutcomes: registryEntry?.pathwayOutcomes ?? siteCert.pathwayOutcomes,
    suggestedResources: pickRegistryArray(registryEntry?.suggestedResources, siteCert.suggestedResources),
    recommendedCTA: pickRegistryString(registryEntry?.recommendedCta, siteCert.recommendedCTA),
    regionalDemand: pickRegistryString(registryEntry?.regionalDemand, siteCert.regionalDemand),
    outputValue: pickRegistryString(registryEntry?.outputValue, siteCert.outputValue),
    // Phase 2 / Packet B route H1 wins over CMS registry so production CMS cannot
    // reintroduce pathway-intent copy on credential overview routes (e.g. /certifications/pmp).
    detailHeroTitle:
      getPhase2Seo(`/certifications/${siteCert.id}`)?.h1 ??
      getPacketBCertDifferentiation(siteCert.id)?.h1 ??
      registryEntry?.detailHeroTitle ??
      (siteCert.id === 'pmp' ? 'PMP Certification: Credential & Exam Overview' : `${siteCert.name} Pathway`),
    detailHeroSubtitle:
      registryEntry?.detailHeroSubtitle ??
      getPacketBCertDifferentiation(siteCert.id)?.intro ??
      registryEntry?.desc ??
      siteCert.desc,
    outputValueDisplay: pickRegistryString(registryEntry?.outputValue, siteCert.outputValue),
    recommendedCtaDisplay: pickRegistryString(registryEntry?.recommendedCta, siteCert.recommendedCTA),
    targetAudienceDisplay: pickRegistryString(registryEntry?.targetAudience, siteCert.targetAudience),
  };
}

import { certifications } from '@/data/certification-index';
import { resolveCertMarketing } from '@/lib/cert-detail';
import { MARKETING_HERO_H1_CLASS } from '@/lib/brand-visual';
import type { CertificationsRegistry } from '@pms/site-content';
import { cn } from '@/lib/utils';

/** Server-rendered cert detail hero title + subtitle for LCP (no client hydration delay). */
export function CertificationDetailHeroServer({
  certId,
  initialRegistry,
}: {
  certId: string;
  initialRegistry?: CertificationsRegistry;
}) {
  const siteCert = certifications.find((c) => c.id === certId) ?? certifications[0];
  const registryEntry = initialRegistry?.entries.find(
    (e) => e.id === siteCert.id && !e.archived,
  );
  const cert = resolveCertMarketing(siteCert, registryEntry);
  // This is a route-local display correction. Keep registry data available to
  // all other consumers (including metadata and analytics), while ensuring
  // the public PMP detail H1 has the approved title.
  const visibleHeroTitle = cert.id === 'pmp' ? 'PMP 2026 Pathway' : cert.detailHeroTitle;

  return (
    <>
      <h1
        id={`cert-detail-hero-title-${certId}`}
        className={cn(
          MARKETING_HERO_H1_CLASS,
          'mb-8 max-w-full text-balance lg:text-6xl xl:text-7xl',
          cert.id === 'pmp' && 'whitespace-nowrap',
        )}
      >
        {visibleHeroTitle.includes('Pathway') ? (
          visibleHeroTitle
        ) : (
          <>
            {cert.name} <br />
            <span className="text-brand-orange">Pathway</span>
          </>
        )}
      </h1>
      <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-xl leading-relaxed font-medium line-clamp-2 md:line-clamp-none">
        {cert.detailHeroSubtitle}
      </p>
    </>
  );
}

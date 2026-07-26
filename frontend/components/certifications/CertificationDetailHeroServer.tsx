import { certifications } from '@/data/certification-index';
import { resolveCertMarketing } from '@/lib/cert-detail';
import { MARKETING_HERO_H1_CLASS } from '@/lib/brand-visual';
import type { CertificationsRegistry } from '@pms/site-content';
import { cn } from '@/lib/utils';

/** Server-rendered cert detail hero title + subtitle for LCP (no client hydration delay). */
export function CertificationDetailHeroServer({
  certId,
  initialRegistry,
  overrideH1,
  overrideSubtitle,
}: {
  certId: string;
  initialRegistry?: CertificationsRegistry;
  overrideH1?: string;
  overrideSubtitle?: string;
}) {
  const siteCert = certifications.find((c) => c.id === certId) ?? certifications[0];
  const registryEntry = initialRegistry?.entries.find(
    (e) => e.id === siteCert.id && !e.archived,
  );
  const cert = resolveCertMarketing(siteCert, registryEntry);
  const adapted = Boolean(overrideH1?.trim());

  return (
    <>
      <h1
        id={`cert-detail-hero-title-${certId}`}
        className={cn(
          MARKETING_HERO_H1_CLASS,
          'mb-8 max-w-full text-balance lg:text-6xl xl:text-7xl',
        )}
      >
        {adapted ? (
          overrideH1
        ) : cert.id === 'pmp' || cert.detailHeroTitle.includes('Pathway') ? (
          cert.detailHeroTitle
        ) : (
          <>
            {cert.name} <br />
            <span className="text-brand-orange">Pathway</span>
          </>
        )}
      </h1>
      <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-xl leading-relaxed font-medium line-clamp-2 md:line-clamp-none">
        {overrideSubtitle?.trim() || cert.detailHeroSubtitle}
      </p>
    </>
  );
}

'use client';

import type { ChannelLandingPage } from '@/types/channelLandingPage';
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes';
import { certifications } from '@/data/siteData';
import { BRAND } from '@/lib/brand-voice';
import PortalPathwayCard from '@/components/channel-landing/portal/PortalPathwayCard';

type Props = {
  page: ChannelLandingPage;
  theme: PlatformPortalTheme;
};

function certFor(id: string) {
  return certifications.find((c) => c.id === id) ?? certifications[0];
}

/** Compact portal card titles — drop redundant family prefix where the badge already shows PMI. */
function portalPathwayTitle(certId: string, fallback: string) {
  if (certId === 'pmi-rmp') return 'RMP®';
  return fallback;
}

export default function PortalFeaturedPathways({ page, theme }: Props) {
  const engagement = page.portalEngagement;
  const ids = engagement?.featuredCertIds?.length
    ? engagement.featuredCertIds
    : ['pmp', 'pmi-rmp'];

  const featured = ids.slice(0, 2);
  if (featured.length === 0) return null;

  return (
    <section
      className="portal-featured-pathways mb-6 sm:mb-8"
      aria-label="Featured certification pathways"
    >
      <div className="portal-tier-section-head mb-4 space-y-1">
        <h3
          className="text-meta font-mono uppercase tracking-[0.2em]"
          style={{ color: theme.textMuted, fontFamily: theme.fontFamily }}
        >
          Explore certifications
        </h3>
        <p
          className="text-body-sm max-w-2xl leading-relaxed"
          style={{ color: theme.textMuted, fontFamily: theme.fontFamily }}
        >
          {BRAND.fullName} — view pathways, cohort timing, and regional tuition on the website.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-stretch">
        {featured.map((certId, index) => {
          const cert = certFor(certId);
          return (
            <PortalPathwayCard
              key={certId}
              cert={cert}
              theme={theme}
              familyLabel={index === 0 ? 'PMI' : cert.familyId}
              title={portalPathwayTitle(certId, cert.name)}
              description={cert.desc}
              layout="compact"
              collapsible
            />
          );
        })}
      </div>
    </section>
  );
}

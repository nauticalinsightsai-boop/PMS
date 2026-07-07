'use client';

import { useEffect, useState } from 'react';
import type { ChannelLandingPage } from '@/types/channelLandingPage';
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes';
import { certifications } from '@/data/siteData';
import { BRAND } from '@/lib/brand-voice';
import { usesPortalWebsiteLayoutChrome } from '@/lib/channel-landing-pages/platformOfferPack';
import { portalSpacing } from '@/lib/channel-landing-pages/portalSpacing';
import PortalPathwayCard from '@/components/channel-landing/portal/PortalPathwayCard';

type Props = {
  page: ChannelLandingPage;
  theme: PlatformPortalTheme;
  sectionOrder?: number;
};

function certFor(id: string) {
  return certifications.find((c) => c.id === id) ?? certifications[0];
}

/** Compact portal card titles: drop redundant family prefix where the badge already shows PMI. */
function portalPathwayTitle(certId: string, fallback: string) {
  if (certId === 'pmi-rmp') return 'RMP®';
  return fallback;
}

/** Tailwind `sm` — desktop grid uses independent card expand state. */
function useIsSmUp() {
  const [isSmUp, setIsSmUp] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const sync = () => setIsSmUp(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return isSmUp;
}

export default function PortalFeaturedPathways({ page, theme, sectionOrder = 0 }: Props) {
  const isSmUp = useIsSmUp();
  const [expandedCertId, setExpandedCertId] = useState<string | null>(null);
  const engagement = page.portalEngagement;
  const ids = engagement?.featuredCertIds?.length
    ? engagement.featuredCertIds
    : ['pmp', 'pmi-rmp'];

  const featured = ids.slice(0, 2);
  const layoutChrome = usesPortalWebsiteLayoutChrome(page.channelId);
  const subtitle = layoutChrome
    ? `${BRAND.name}: view pathways, cohort timing, and regional tuition on the website.`
    : `${BRAND.name}: view pathways, cohort timing, and regional tuition for your certification track.`;

  if (featured.length === 0) return null;

  return (
    <section
      className={`portal-featured-pathways ${portalSpacing.section}`}
      style={{ order: sectionOrder }}
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
          {subtitle}
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
              className="flex h-full flex-col"
              expanded={isSmUp ? undefined : expandedCertId === certId}
              onExpandedChange={
                isSmUp
                  ? undefined
                  : (next) => setExpandedCertId(next ? certId : null)
              }
            />
          );
        })}
      </div>
    </section>
  );
}

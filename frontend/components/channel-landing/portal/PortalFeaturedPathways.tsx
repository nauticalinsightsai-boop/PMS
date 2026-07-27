'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChannelLandingPage } from '@/types/channelLandingPage';
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes';
import { certifications } from '@/data/siteData';
import { BRAND } from '@/lib/brand-voice';
import { usesPortalWebsiteLayoutChrome } from '@/lib/channel-landing-pages/platformOfferPack';
import { portalSpacing } from '@/lib/channel-landing-pages/portalSpacing';
import PortalPathwayCard from '@/components/channel-landing/portal/PortalPathwayCard';
import PortalSectionHead from '@/components/channel-landing/portal/primitives/PortalSectionHead';

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

export default function PortalFeaturedPathways({ page, theme, sectionOrder = 0 }: Props) {
  const [expandedCertId, setExpandedCertId] = useState<string | null>(null);
  const expandedCertIdRef = useRef<string | null>(null);
  useEffect(() => { expandedCertIdRef.current = expandedCertId; }, [expandedCertId]);
  const setDisclosure = (certId: string, expanded: boolean) => {
    const marker = window.history.state?.__pmsPathwayDisclosure;
    if (!expanded) {
      if (marker?.v === 1 && marker.surface === 'portal-featured' && marker.certId === certId) window.history.back();
      else setExpandedCertId(null);
      return;
    }
    const next = { ...(window.history.state ?? {}), __pmsPathwayDisclosure: { v: 1, surface: 'portal-featured', certId } };
    if (marker?.v === 1 && marker.surface === 'portal-featured') window.history.replaceState(next, '');
    else window.history.pushState(next, '');
    setExpandedCertId(certId);
  };
  useEffect(() => {
    const onPopState = () => {
      const previousCertId = expandedCertIdRef.current;
      const marker = window.history.state?.__pmsPathwayDisclosure;
      const certId = marker?.v === 1 && marker.surface === 'portal-featured' ? marker.certId : null;
      setExpandedCertId(certId);
      requestAnimationFrame(() => {
        if (certId) document.querySelector<HTMLElement>(`[data-pathway-region="${certId}"]`)?.focus();
        else if (previousCertId) document.querySelector<HTMLButtonElement>(`[data-pathway-details="${previousCertId}"]`)?.focus();
      });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
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
      <PortalSectionHead
        theme={theme}
        title="Explore certifications"
        subtitle={subtitle}
        className="mb-4"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start">
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
              className="flex flex-col"
              expanded={expandedCertId === certId}
              onExpandedChange={(next) => setDisclosure(certId, next)}
            />
          );
        })}
      </div>
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
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

function platformExploreCopy(channelId: string): { title: string; subtitle: string } {
  const platformName: Record<string, string> = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    linkedin: 'LinkedIn',
    whatsapp: 'WhatsApp',
  };
  const platform = platformName[channelId];
  if (platform) {
    return {
      title: `Explore certifications from ${platform}`,
      subtitle: `Continue from ${platform}: compare certification pathways, cohort timing, and regional tuition on PM Structure.`,
    };
  }
  return {
    title: 'Explore certifications',
    subtitle: `${BRAND.name}: view certification pathways, cohort timing, and regional tuition on the website.`,
  };
}

/** Tailwind `sm` breakpoint: desktop grid uses independent card expand state. */
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
  const exploreCopy = platformExploreCopy(page.channelId);
  const subtitle = layoutChrome
    ? exploreCopy.subtitle
    : `${BRAND.name}: view certification pathways, cohort timing, and regional tuition for your certification track.`;

  if (featured.length === 0) return null;

  return (
    <section
      className={`portal-featured-pathways ${portalSpacing.section}`}
      style={{ order: sectionOrder }}
      aria-label="Featured certification pathways"
    >
      <PortalSectionHead
        theme={theme}
        title={exploreCopy.title}
        subtitle={subtitle}
        className="mb-4"
      />

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

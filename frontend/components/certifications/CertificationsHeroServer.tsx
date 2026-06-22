import { CERTIFICATIONS_COPY } from '@/lib/brand-voice';
import { MARKETING_HERO_H1_CLASS } from '@/lib/brand-visual';
import {
  defaultCertificationsHubConfig,
  type CertificationsHubConfig,
} from '@pms/site-content';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/** Visible server-rendered hero copy for LCP on /certifications (no client hydration delay). */
export function CertificationsHeroServer({
  config,
}: {
  config?: CertificationsHubConfig;
}) {
  const hub = config ?? defaultCertificationsHubConfig();
  const badge = hub.hero.badge || CERTIFICATIONS_COPY.heroBadge;
  const title = hub.hero.title || CERTIFICATIONS_COPY.heroTitle;
  const subtitle = hub.hero.subtitle || CERTIFICATIONS_COPY.heroSubtitle;

  return (
    <div className="relative z-30 min-w-0 text-center lg:text-left">
      <Badge className="mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
        {badge}
      </Badge>
      <h1
        id="certifications-hero-title"
        className={cn(MARKETING_HERO_H1_CLASS, 'mb-8 leading-tight')}
      >
        {title}
      </h1>
      <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
        {subtitle}
      </p>
    </div>
  );
}

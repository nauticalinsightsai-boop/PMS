import { HOME_COPY } from '@/lib/brand-voice';
import { PMS_SITE_DESCRIPTION } from '@/config/pms-site';

/** Server-rendered crawlable copy before client hydration (H1 lives in Home.tsx). */
export function HomeServerHeading() {
  return (
    <header className="sr-only">
      <p>{HOME_COPY.heroSubtitle}</p>
      <p>{PMS_SITE_DESCRIPTION}</p>
    </header>
  );
}

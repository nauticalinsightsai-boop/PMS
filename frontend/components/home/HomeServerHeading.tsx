import { HOME_COPY } from '@/lib/brand-voice';
import { T169_SEO } from '@/content/pmp/flagship-t169';

/** Server-rendered crawlable copy before client hydration (H1 lives in Home.tsx). */
export function HomeServerHeading() {
  return (
    <header className="sr-only">
      <h1>{HOME_COPY.heroTitle}</h1>
      <p>{HOME_COPY.heroSubtitle}</p>
      <p>{T169_SEO.homeDescription}</p>
    </header>
  );
}

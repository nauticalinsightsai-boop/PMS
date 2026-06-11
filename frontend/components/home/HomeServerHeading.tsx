import { HOME_COPY } from '@/lib/brand-voice';
import { PMS_SITE_DESCRIPTION } from '@/config/pms-site';

/** Server-rendered H1 for crawlers and view-source before client hydration. */
export function HomeServerHeading() {
  return (
    <header className="sr-only">
      <h1>
        {HOME_COPY.heroTitle}
        {HOME_COPY.heroTitleAccents.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>
      <p>{HOME_COPY.heroSubtitle}</p>
      <p>{PMS_SITE_DESCRIPTION}</p>
    </header>
  );
}

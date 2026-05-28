import { buildLegacyGoSlugRedirects } from '@pms/booking-crm';

export function getGoSlugRedirects() {
  return buildLegacyGoSlugRedirects().map((r) => ({
    source: r.source,
    destination: r.destination,
    permanent: r.permanent,
  }));
}

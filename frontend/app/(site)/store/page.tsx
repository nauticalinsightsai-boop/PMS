import { permanentRedirect } from 'next/navigation';
import { fetchPublishedDocument } from '@/lib/cms/fetch-published-document';
import { defaultStoreCatalog, parseStoreCatalog } from '@pms/site-content';
import { FIELD_KEYS } from '@pms/site-content/keys';

/** Legacy URL: canonical route is /community?view=store */
export default async function StorePage() {
  await fetchPublishedDocument(
    FIELD_KEYS.STORE_CATALOG,
    (raw) => (raw ? parseStoreCatalog(raw) : null),
    defaultStoreCatalog(),
  );
  permanentRedirect('/community?view=store');
}

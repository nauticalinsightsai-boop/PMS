import { redirect } from 'next/navigation';
import { marketingSiteUrl } from '@/lib/site-config';

type Props = {
  params: Promise<{ channel: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Channel portals are served by the marketing app — not dashboard. */
export default async function GoPortalRedirect({ params, searchParams }: Props) {
  const { channel } = await params;
  const sp = await searchParams;
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) value.forEach((v) => qs.append(key, v));
    else qs.set(key, value);
  }
  const query = qs.toString();
  const base = marketingSiteUrl.replace(/\/$/, '');
  redirect(`${base}/go/${encodeURIComponent(channel)}${query ? `?${query}` : ''}`);
}

import { redirect } from 'next/navigation';
import { BOOKING_CRM_CTA_PATH } from '@/lib/dashboard/bookingCrmRedirects';

type Props = { params: Promise<{ channelKey: string }> };

/** Legacy /cta/[channelKey] → canonical CTA admin (no query params). */
export default async function CtaChannelLegacyRedirectPage({ params }: Props) {
  await params;
  redirect(BOOKING_CRM_CTA_PATH);
}

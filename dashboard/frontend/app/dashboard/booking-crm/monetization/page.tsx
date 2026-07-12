import { permanentRedirect } from 'next/navigation';

/** Legacy stub — Monetization redirects to CTA Management. */
export default function Page() {
  permanentRedirect('/dashboard/booking-crm/cta');
}

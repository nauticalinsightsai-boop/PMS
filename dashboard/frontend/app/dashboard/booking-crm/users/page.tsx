import { permanentRedirect } from 'next/navigation';

/** Legacy stub — Booking CRM users module redirects to CTA Management. */
export default function Page() {
  permanentRedirect('/dashboard/booking-crm/cta');
}

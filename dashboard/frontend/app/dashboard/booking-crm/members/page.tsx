import { permanentRedirect } from 'next/navigation';

/** Legacy stub — Members Management redirects to CTA Management. */
export default function Page() {
  permanentRedirect('/dashboard/booking-crm/cta');
}

import { permanentRedirect } from 'next/navigation';

export default function Page() {
  permanentRedirect('/dashboard/booking-crm/bookings');
}

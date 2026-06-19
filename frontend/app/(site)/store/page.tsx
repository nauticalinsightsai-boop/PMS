import { permanentRedirect } from 'next/navigation';

export default function StorePage() {
  permanentRedirect('/community?view=store');
}

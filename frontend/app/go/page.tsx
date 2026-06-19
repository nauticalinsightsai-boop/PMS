import { permanentRedirect } from 'next/navigation';

/** Default channel portal entry (website reference layout). */
export default function GoIndexPage() {
  permanentRedirect('/go/website');
}

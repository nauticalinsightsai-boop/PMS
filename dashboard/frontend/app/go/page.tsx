import { redirect } from 'next/navigation';
import { marketingSiteUrl } from '@/lib/site-config';

export default function GoIndexRedirect() {
  redirect(`${marketingSiteUrl.replace(/\/$/, '')}/go/website`);
}

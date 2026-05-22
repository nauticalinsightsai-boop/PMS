import { redirect } from 'next/navigation';

export default function LegacyPagesHomeEditor() {
  redirect('/dashboard/site-system/home');
}

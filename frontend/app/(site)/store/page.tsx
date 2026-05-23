import { redirect } from 'next/navigation';

export default function StorePage() {
  redirect('/community?view=store');
}

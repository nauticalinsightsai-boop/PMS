import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function CheckoutCancelPage() {
  return (
    <div className="container mx-auto max-w-lg py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">Checkout cancelled</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        No charge was made. You can return to your pathway when ready.
      </p>
      <Link href="/certifications" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
        Browse pathways
      </Link>
    </div>
  );
}

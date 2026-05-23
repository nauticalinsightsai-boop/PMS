import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto max-w-lg py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank you</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Your checkout session was created. Complete payment when Stripe is configured.
      </p>
      <Link href="/certifications" className={cn(buttonVariants({ size: 'lg' }))}>
        Back to pathways
      </Link>
    </div>
  );
}

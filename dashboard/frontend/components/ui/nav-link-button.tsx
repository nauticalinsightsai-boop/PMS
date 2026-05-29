'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NavLinkButtonProps = VariantProps<typeof buttonVariants> & {
  href: string;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
};

/** Next.js Link styled as a button — use instead of Button render={Link} (Base UI breaks link nav). */
export function NavLinkButton({
  href,
  variant,
  size,
  className,
  children,
  ...rest
}: NavLinkButtonProps) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)} {...rest}>
      {children}
    </Link>
  );
}

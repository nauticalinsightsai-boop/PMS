import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-section text-3xl md:text-4xl">{title}</h1>
      <GlassCard className="p-12 md:p-20 flex flex-col items-center justify-center text-center premium-shadow">
        <p className="text-muted-foreground text-sm max-w-md">
          The {title} module is under active development. Check back soon or open Settings for platform
          configuration.
        </p>
        <Link
          href="/dashboard/site-system/settings"
          className="mt-6 inline-flex h-9 items-center justify-center rounded-lg border border-brand-orange/40 px-4 text-sm font-medium text-brand-orange hover:bg-brand-orange/10"
        >
          Platform settings
        </Link>
      </GlassCard>
    </div>
  );
}

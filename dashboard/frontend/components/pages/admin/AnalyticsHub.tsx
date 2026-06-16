'use client';

import Link from 'next/link';
import { BarChart3, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  GA4_MEASUREMENT_ID,
  GA4_STREAM_NAME,
  GOOGLE_ANALYTICS_DASHBOARD_URL,
} from '@/constants/analytics';

export function AnalyticsHub() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                Dashboard
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-medium text-foreground">Analytics</li>
          </ol>
        </nav>
        <div className="flex items-center gap-3">
          <BarChart3 size={28} className="text-foreground" aria-hidden />
          <h1 className="text-3xl font-bold tracking-tight font-heading">Analytics</h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Website traffic and conversion events for pmstructure.com. Reporting lives in Google
          Analytics 4; the public site sends events only after visitors accept analytics cookies.
        </p>
      </div>

      <GlassCard className="p-6 md:p-8 space-y-6 premium-shadow">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Google Analytics 4</h2>
          <p className="text-sm text-muted-foreground">
            Stream: {GA4_STREAM_NAME} · Measurement ID:{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{GA4_MEASUREMENT_ID}</code>
          </p>
        </div>

        <Button variant="brand" className="gap-2" asChild>
          <a
            href={GOOGLE_ANALYTICS_DASHBOARD_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Google Analytics
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        </Button>

        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li>Use <strong className="text-foreground font-medium">Reports → Realtime</strong> to confirm live traffic after deploy.</li>
          <li>Conversion events (enroll clicks, Calendly, leads) appear under Events once users accept cookies.</li>
          <li>Set <code className="text-xs">NEXT_PUBLIC_GA_MEASUREMENT_ID</code> on the marketing Vercel project if not already deployed.</li>
        </ul>
      </GlassCard>
    </div>
  );
}

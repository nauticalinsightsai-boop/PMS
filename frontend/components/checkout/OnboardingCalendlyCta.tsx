'use client';

import { Calendar } from 'lucide-react';
import { getOnboardingCalendlyUrl } from '@/config/pms-site';
import { Button } from '@/components/ui/button';
import { openCalendlyThemedPopup } from '@/lib/calendly/open-themed-popup';
import { cn } from '@/lib/utils';

type Props = {
  offeringId?: string | null;
  utmSource?: string;
  utmMedium?: string;
  className?: string;
};

export function OnboardingCalendlyCta({
  offeringId,
  utmSource = 'success_page',
  utmMedium = 'enrollment',
  className,
}: Props) {
  const handleClick = () => {
    void openCalendlyThemedPopup(
      getOnboardingCalendlyUrl(offeringId, { utmSource, utmMedium }),
      {
        funnelLabel: offeringId?.trim() ? `onboarding:${offeringId.trim()}` : 'onboarding',
        channelId: 'website',
        useProxy: true,
      },
    );
  };

  return (
    <Button
      type="button"
      variant="brand"
      size="lg"
      onClick={handleClick}
      className={cn('justify-center gap-2 rounded-2xl', className)}
    >
      <Calendar className="h-5 w-5" aria-hidden />
      Schedule your onboarding call
    </Button>
  );
}

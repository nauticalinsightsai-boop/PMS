import { Calendar } from 'lucide-react';
import { getOnboardingCalendlyUrl } from '@/config/pms-site';
import { buttonVariants } from '@/components/ui/button';
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
  return (
    <a
      href={getOnboardingCalendlyUrl(offeringId, { utmSource, utmMedium })}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({ size: 'lg', variant: 'brand' }),
        'justify-center gap-2 rounded-2xl',
        className,
      )}
    >
      <Calendar className="h-5 w-5" aria-hidden />
      Schedule your onboarding call
    </a>
  );
}

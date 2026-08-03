import { CTAS } from '@/lib/brand-voice';

export function enrollmentHeadingForTier(tierId: string): string {
  if (tierId === 'foundation') return 'Self-paced enrollment';
  if (tierId === 'professional') return 'Choose your delivery option';
  return CTAS.pathwayReserveSeat;
}

export function enrollmentPrimaryLabelForTier(tierId: string): string {
  if (tierId === 'foundation') return 'Self-paced enrollment';
  if (tierId === 'professional') return 'Choose delivery option';
  return CTAS.pathwayReserveSeat;
}

export function enrollmentProceedLabelForTier(tierId: string): string {
  if (tierId === 'foundation' || tierId === 'professional') return 'Continue to checkout';
  return CTAS.pathwayReserveSeat;
}

export function enrollmentDescriptionForTier(tierId: string): string {
  if (tierId === 'foundation') {
    return 'Review your self-paced pathway price and continue to checkout. Pricing for your region is shown below.';
  }
  if (tierId === 'professional') {
    return 'Choose your delivery option and continue to checkout. Pricing for your region is shown below.';
  }
  return 'Choose your payment option and reserve your pathway place. Pricing for your region is shown below.';
}

export function enrollmentMetadataDescriptionForTier(tierId: string): string {
  if (tierId === 'foundation') return 'Choose self-paced enrollment and continue to checkout.';
  if (tierId === 'professional') return 'Choose mentor-led or self-paced delivery and continue to checkout.';
  return 'Reserve a seat on your certification pathway with a deposit. Onboarding within 24 hours.';
}

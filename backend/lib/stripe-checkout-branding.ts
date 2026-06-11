export type CheckoutColorScheme = 'light' | 'dark';

const BRAND_ORANGE = '#ff4a38';

export function stripeCheckoutBranding(scheme: CheckoutColorScheme = 'light') {
  if (scheme === 'dark') {
    return {
      background_color: '#07071c',
      button_color: BRAND_ORANGE,
      border_style: 'rounded' as const,
    };
  }
  return {
    background_color: '#ffffff',
    button_color: BRAND_ORANGE,
    border_style: 'rounded' as const,
  };
}

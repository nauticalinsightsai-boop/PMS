/** Stable public newsletter subscription preferences. */
export const NEWSLETTER_SIGNUP_PREFERENCES = [
  'PMP',
  'PMI-RMP / Risk',
  'CAPM',
  'AI in Project Management',
  'Career Growth',
  'General Project Management',
] as const;

export type NewsletterSignupPreference =
  (typeof NEWSLETTER_SIGNUP_PREFERENCES)[number];

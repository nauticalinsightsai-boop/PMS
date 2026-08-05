const directives = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self' https://checkout.stripe.com",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://js.stripe.com https://assets.calendly.com",
  "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.facebook.com https://*.supabase.co",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.facebook.com https://graph.facebook.com https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://api.calendly.com https://api.bigdatacloud.net",
  "frame-src https://js.stripe.com https://hooks.stripe.com https://calendly.com https://www.youtube.com https://www.youtube-nocookie.com",
  "media-src 'self' blob: https://*.supabase.co",
  "worker-src 'self' blob:",
] as const;

export function contentSecurityPolicy(): string {
  return `${directives.join('; ')};`;
}

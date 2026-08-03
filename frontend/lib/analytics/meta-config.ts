export function getMetaPixelId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  return id || undefined;
}

function isLocalOrPreviewHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase();
  const isExactOrChildOf = (domain: string) =>
    normalized === domain || normalized.endsWith(`.${domain}`);
  return (
    normalized === 'localhost' ||
    normalized === '127.0.0.1' ||
    normalized === '[::1]' ||
    normalized === '::1' ||
    normalized.endsWith('.localhost') ||
    isExactOrChildOf('railway.app') ||
    isExactOrChildOf('up.railway.app') ||
    isExactOrChildOf('railway.internal')
  );
}

export function getConfiguredCanonicalMetaOrigins(): ReadonlySet<string> {
  const configured = [
    process.env.NEXT_PUBLIC_SITE_URL?.trim(),
    process.env.NEXT_PUBLIC_MARKETING_SITE_URL?.trim(),
  ].filter((value): value is string => Boolean(value));
  if (configured.length === 0) return new Set();

  const origins = new Set<string>();
  for (const raw of configured) {
    try {
      const url = new URL(raw);
      if (
        url.protocol !== 'https:' ||
        url.username ||
        url.password ||
        url.pathname !== '/' ||
        url.search ||
        url.hash ||
        isLocalOrPreviewHostname(url.hostname)
      ) {
        return new Set();
      }
      origins.add(url.origin);
    } catch {
      return new Set();
    }
  }
  return origins;
}

export function isCanonicalMetaBrowserOrigin(): boolean {
  if (typeof window === 'undefined') return false;
  return getConfiguredCanonicalMetaOrigins().has(window.location.origin);
}

export function isMetaPixelConfigured(): boolean {
  return Boolean(getMetaPixelId()) && isCanonicalMetaBrowserOrigin();
}

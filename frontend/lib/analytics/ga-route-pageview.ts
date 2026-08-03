const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const MAX_UTM_LENGTH = 200;

export type GaRoutePageview = {
  routeKey: string;
  params: {
    page_path: string;
    page_title: string;
    page_location: string;
  };
};

export function buildGaRoutePageview(input: {
  origin: string;
  pathname: string;
  search?: string;
  title: string;
}): GaRoutePageview | null {
  let origin: URL;
  try {
    origin = new URL(input.origin);
  } catch {
    return null;
  }
  if (origin.protocol !== 'https:' && origin.hostname !== 'localhost') return null;

  const pathname = input.pathname.startsWith('/') ? input.pathname : `/${input.pathname}`;
  const incoming = new URLSearchParams((input.search ?? '').split('#', 1)[0]);
  const sanitized = new URLSearchParams();
  for (const key of UTM_KEYS) {
    const value = incoming.get(key)?.trim().slice(0, MAX_UTM_LENGTH) ?? '';
    if (value) sanitized.set(key, value);
  }
  const query = sanitized.toString();
  const pagePath = `${pathname}${query ? `?${query}` : ''}`;
  return {
    routeKey: pagePath,
    params: {
      page_path: pagePath,
      page_title: input.title,
      page_location: `${origin.origin}${pagePath}`,
    },
  };
}

export function shouldDispatchGaRoute(previousRouteKey: string | null, nextRouteKey: string): boolean {
  return previousRouteKey !== nextRouteKey;
}

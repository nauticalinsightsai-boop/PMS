export function getMetaPixelId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  return id || undefined;
}

export function isMetaPixelConfigured(): boolean {
  return Boolean(getMetaPixelId());
}

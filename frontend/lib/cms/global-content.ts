export type GlobalContentMap = Record<string, string>;

export function globalContentString(
  map: GlobalContentMap | undefined,
  key: string,
  fallback: string,
): string {
  const value = map?.[key];
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

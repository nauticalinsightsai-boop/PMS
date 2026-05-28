/** Replace em/en dashes in portal marketing strings with plainer punctuation. */
export function normalizePortalCopyString(text: string): string {
  return text
    .replace(/\s*—\s*/g, '. ')
    .replace(/\s+–\s+/g, '. ')
    .replace(/\.\s+\./g, '.')
    .trim()
}

export function normalizePortalCopyDeep<T>(value: T): T {
  if (typeof value === 'string') return normalizePortalCopyString(value) as T
  if (Array.isArray(value)) return value.map((item) => normalizePortalCopyDeep(item)) as T
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = normalizePortalCopyDeep(v)
    }
    return out as T
  }
  return value
}

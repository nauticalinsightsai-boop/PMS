/** Replace em/en dashes in marketing copy with plain punctuation. */
export function normalizeEmDashText(text: string): string {
  return text
    .split('\n')
    .map((line) => {
      if (/^\s*\/\//.test(line)) {
        return line.replace(/\s*—\s*/g, ': ').replace(/\s+–\s+/g, ': ');
      }
      return line
        .replace(/\s*—\s*([A-Z"'(])/g, '. $1')
        .replace(/\s*—\s*/g, ': ')
        .replace(/\s+–\s+/g, ': ')
        .replace(/\.\s+\./g, '.')
        .replace(/:\s+:/g, ':')
        .replace(/\?\s+\./g, '?');
    })
    .join('\n')
    .trimEnd();
}

export function normalizeEmDashDeep<T>(value: T): T {
  if (typeof value === 'string') return normalizeEmDashText(value) as T;
  if (Array.isArray(value)) return value.map((item) => normalizeEmDashDeep(item)) as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = normalizeEmDashDeep(v);
    }
    return out as T;
  }
  return value;
}

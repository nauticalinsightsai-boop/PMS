import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('GlassCard legacy prop boundary', () => {
  it('consumes hover and liquid before spreading motion div props', () => {
    const source = readFileSync(resolve(process.cwd(), 'packages/ui/src/glass-card.tsx'), 'utf8');
    const signature = source.slice(source.indexOf('React.forwardRef'), source.indexOf('const variants'));

    expect(signature).toContain('hover, liquid, ...props');
    expect(signature).toContain('void hover');
    expect(signature).toContain('void liquid');
    expect(source).toContain('{...props}');
  });
});

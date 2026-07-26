import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./PortalButton.tsx', import.meta.url), 'utf8');

describe('PortalButton theme contract', () => {
  it('uses the declared recommended CTA, including a platform gradient', () => {
    const resolverStart = source.indexOf('function bgForVariant(');
    const resolverEnd = source.indexOf('export default function PortalButton(', resolverStart);
    const resolver = source.slice(resolverStart, resolverEnd);

    expect(resolverStart).toBeGreaterThanOrEqual(0);
    expect(resolverEnd).toBeGreaterThan(resolverStart);
    expect(resolver).toContain('theme.recommendedBg');
    expect(resolver).not.toMatch(/recommendedBg[\s\S]*?includes\(['"]gradient['"]\)/);
    expect(resolver).not.toMatch(/recommendedBg[\s\S]*?\?\s*bg\s*:\s*theme\.primary/);
  });

  it('applies the channel radius and resolved CTA background at the primitive boundary', () => {
    expect(source).toContain('borderRadius: theme.radius');
    expect(source).toMatch(
      /background:\s*variant === ['"]ghost['"]\s*\?\s*['"]transparent['"]\s*:\s*bg/,
    );
    expect(source).toMatch(
      /border:\s*variant === ['"]ghost['"][\s\S]*?theme\.cardBorder/,
    );
  });

  it('does not embed PMS orange styling in the shared portal primitive', () => {
    expect(source.toLowerCase()).not.toContain('#ff4a38');
    expect(source).not.toContain('bg-brand-orange');
    expect(source).not.toContain('shadow-brand-orange');
    expect(source).not.toContain('rounded-full');
  });
});

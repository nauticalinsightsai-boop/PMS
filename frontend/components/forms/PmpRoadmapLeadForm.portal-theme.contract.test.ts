import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(
  new URL('./PmpRoadmapLeadForm.tsx', import.meta.url),
  'utf8',
);

function sourceBetween(startMarker: string, endMarker: string): string {
  const start = source.lastIndexOf(startMarker);
  expect(start, `missing source marker: ${startMarker}`).toBeGreaterThanOrEqual(0);

  const end = source.indexOf(endMarker, start);
  expect(end, `missing source marker: ${endMarker}`).toBeGreaterThan(start);
  return source.slice(start, end);
}

function portalButtonBlocks(footer: string): string[] {
  return [...footer.matchAll(/<PortalButton\b/g)].map((match) => {
    const start = match.index ?? -1;
    expect(start, 'PortalButton match missing source index').toBeGreaterThanOrEqual(0);
    const end = footer.indexOf('</PortalButton>', start);
    expect(end, 'unclosed PortalButton').toBeGreaterThan(start);
    return footer.slice(start, end + '</PortalButton>'.length);
  });
}

describe('PmpRoadmapLeadForm portal theme contract', () => {
  it('routes Back, Submit, and Continue through the portal-native button primitive', () => {
    const footer = sourceBetween('<div className="flex gap-3">', '</form>');
    const portalButtons = portalButtonBlocks(footer);
    const back = portalButtons.find((button) => button.includes('Back')) ?? '';
    const submit = portalButtons.find((button) => button.includes('Submit')) ?? '';
    const continueButton =
      portalButtons.find((button) => button.includes('Continue')) ?? '';

    expect(portalButtons.length).toBeGreaterThanOrEqual(3);
    expect(back).toContain('onClick={handleStepBack}');
    expect(back).toContain('variant="ghost"');
    expect(submit).toContain('type="submit"');
    expect(continueButton).toContain(
      'onClick={() => handleStepNext(nextPmpQualificationStep(currentStep))}',
    );
    expect(continueButton).toContain('variant="recommended"');
  });

  it('does not carry the PMS orange button classes into a themed portal action', () => {
    const footer = sourceBetween('<div className="flex gap-3">', '</form>');
    const portalButtons = portalButtonBlocks(footer);

    expect(portalButtons.length).toBeGreaterThanOrEqual(3);
    for (const portalButton of portalButtons) {
      expect(portalButton).not.toMatch(/\bbg-brand-orange\b/);
      expect(portalButton).not.toMatch(/\bshadow-brand-orange(?:\/\d+)?\b/);
      expect(portalButton).toContain('theme={portalTheme}');
    }

    expect(footer).not.toMatch(
      /<Button\b[\s\S]*?backgroundColor:\s*portalCtaBackground\(portalTheme\)/,
    );
  });

  it('lets portal choice chips grow and wrap instead of clipping to one tight line', () => {
    const chipClass = sourceBetween(
      'const portalChoiceChipClass =',
      'function PortalChoiceSectionLabel(',
    );

    expect(chipClass).not.toMatch(/(?:^|\s)h-10(?:\s|$)/);
    expect(chipClass).not.toMatch(/(?:^|\s)leading-none(?:\s|$)/);
    expect(chipClass).toMatch(/(?:^|\s)(?:min-h-\S+|py-\S+)(?:\s|$)/);
    expect(chipClass).toMatch(/(?:^|\s)(?:leading-snug|leading-normal)(?:\s|$)/);
  });

  it('keeps portal section labels readable instead of collapsing their line box', () => {
    const labelComponent = sourceBetween(
      'function PortalChoiceSectionLabel(',
      'function RoadmapChoiceChip(',
    );

    expect(labelComponent).not.toMatch(/(?:^|\s)leading-none(?:\s|['"`])/);
    expect(labelComponent).toMatch(/(?:^|\s)leading-(?:snug|normal)(?:\s|['"`])/);
  });
});

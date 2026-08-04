import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const viewSource = readFileSync(
  new URL('./ChannelConsultationPortalView.tsx', import.meta.url),
  'utf8',
);
const formSource = readFileSync(
  new URL('../forms/PmpRoadmapLeadForm.tsx', import.meta.url),
  'utf8',
);
const wrapperSource = readFileSync(
  new URL('./portal/ChannelPortalRoadmapForm.tsx', import.meta.url),
  'utf8',
);

describe('ChannelConsultationPortalView roadmap → pathways gate', () => {
  it('keeps featured pathways hidden until roadmap submit (shared parent, all /go/*)', () => {
    expect(viewSource).toContain('const [roadmapSubmitted, setRoadmapSubmitted] = useState(false)');
    expect(viewSource).toContain('onSubmitted={() => setRoadmapSubmitted(true)}');
    expect(viewSource).toContain("case 'featured_pathways':");
    expect(viewSource).toContain('if (!roadmapSubmitted) return null');
    expect(viewSource).toContain(
      'return <PortalFeaturedPathways key={id} page={page} theme={theme} sectionOrder={order} />',
    );
    expect(viewSource).not.toContain('localStorage');
    expect(viewSource).not.toContain('sessionStorage');
  });

  it('scrolls pathways into view once after reveal without changing PROFESSIONAL_FLOW', () => {
    expect(viewSource).toContain(".querySelector('.portal-featured-pathways')");
    expect(viewSource).toContain("scrollIntoView({ behavior: 'smooth', block: 'nearest' })");
    expect(viewSource).not.toContain('PROFESSIONAL_FLOW =');
    expect(viewSource).toContain('pack?.flowOrder ?? PROFESSIONAL_FLOW');
  });

  it('fires onSubmitted only after successful public submit (not mid-wizard Continue)', () => {
    expect(formSource).toContain('onSubmitted?: () => void');
    expect(formSource).toContain('onSubmitted?.()');
    expect(formSource).toMatch(/setSubmitted\(true\);\s*\n\s*onSubmitted\?\.\(\)/);
    expect(wrapperSource).toContain('onSubmitted?: () => void');
    expect(wrapperSource).toContain('onSubmitted={onSubmitted}');
  });
});

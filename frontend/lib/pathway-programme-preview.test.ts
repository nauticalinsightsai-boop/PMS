import { describe, expect, it } from 'vitest';
import { getProgrammePreviewContent, programmePreviewHasVideo } from './pathway-programme-preview';

describe('pathway-programme-preview', () => {
  it('puts infographic first and expandable panels for PMP Foundation', () => {
    const preview = getProgrammePreviewContent(
      'pmp-preparation-foundation',
      'PMP® Foundation',
    );
    expect(preview.infographic.title).toContain('14-Day');
    expect(preview.infographic.imageSrc).toBe('/programme/pmp-foundation-roadmap.png');
    expect(preview.panels.map((p) => p.id)).toEqual(['guide', 'slides', 'video']);
    const guide = preview.panels.find((p) => p.id === 'guide');
    expect(guide?.pdfSrc).toBe('/programme/pmp-foundation-program-guide.pdf');
    const slides = preview.panels.find((p) => p.id === 'slides');
    expect(slides?.slidesPdfSrc).toBe('/programme/pmp-foundation-session-slides.pdf');
    const video = preview.panels.find((p) => p.kind === 'video');
    expect(video?.videoSrc).toBe('/videos/programme/pmp-foundation-orientation.mp4');
    expect(programmePreviewHasVideo(preview)).toBe(true);
  });

  it('provides default infographic and panels for other offerings', () => {
    const preview = getProgrammePreviewContent('capm-preparation-professional', 'CAPM®');
    expect(preview.infographic.steps.length).toBe(4);
    expect(preview.panels).toHaveLength(3);
    expect(programmePreviewHasVideo(preview)).toBe(false);
  });
});

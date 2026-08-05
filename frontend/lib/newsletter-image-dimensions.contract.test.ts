import { describe, expect, it } from 'vitest';
import { ensureArticleImageDimensions, sanitizeArticleHtml } from '@pms/site-content/sanitize-html';

describe('newsletter intrinsic image dimensions', () => {
  it('reduces the locked 193-instance denominator to zero missing dimensions', () => {
    const fixture = Array.from({ length: 193 }, (_, index) => `<img src="/newsletter-${index}.webp" alt="Image ${index}">`).join('');
    const output = sanitizeArticleHtml(fixture);
    const images = output.match(/<img\b[^>]*>/g) ?? [];
    expect(images).toHaveLength(193);
    expect(images.filter((tag) => !/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag))).toHaveLength(0);
  });

  it('preserves existing dimensions and adds only a missing counterpart', () => {
    expect(ensureArticleImageDimensions('<img src="a" width="640" height="480">')).toBe('<img src="a" width="640" height="480">');
    expect(ensureArticleImageDimensions('<img src="b" width="640">')).toContain('height="750"');
  });
});

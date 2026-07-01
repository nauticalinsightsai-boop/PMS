import { describe, expect, it } from 'vitest';
import { inferContentType } from './content-type';

describe('inferContentType', () => {
  it('uses declared type when present', () => {
    expect(inferContentType('file.bin', 'image/png')).toBe('image/png');
  });

  it('infers from extension when type is octet-stream', () => {
    expect(inferContentType('guide.pdf', 'application/octet-stream')).toBe('application/pdf');
    expect(inferContentType('clip.mp4', '')).toBe('video/mp4');
    expect(inferContentType('photo.jpg', '')).toBe('image/jpeg');
  });
});

import { describe, expect, it } from 'vitest';
import { getChannelMarkPath } from './channelMarkAssets';

describe('getChannelMarkPath light/dark pairs', () => {
  it('uses dark-surface mark on dark portal mode', () => {
    expect(getChannelMarkPath('twitter', 'dark')).toContain('x-mark-dark.png');
    expect(getChannelMarkPath('medium', 'dark')).toContain('medium-mark-dark.png');
  });

  it('uses light-surface mark on light portal mode', () => {
    expect(getChannelMarkPath('twitter', 'light')).toContain('x-mark-light.png');
    expect(getChannelMarkPath('medium', 'light')).toContain('medium-mark-light.png');
  });

  it('website has no custom mark (uses Lucide Globe fallback)', () => {
    expect(getChannelMarkPath('website', 'dark')).toBeNull();
    expect(getChannelMarkPath('website', 'light')).toBeNull();
  });

  it('uses single mark for ghost', () => {
    expect(getChannelMarkPath('ghost', 'dark')).toContain('ghost-mark.png');
    expect(getChannelMarkPath('ghost', 'light')).toContain('ghost-mark.png');
  });
});

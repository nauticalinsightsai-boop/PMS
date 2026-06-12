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

  it('keeps brand marks keyed to UI mode', () => {
    expect(getChannelMarkPath('website', 'dark')).toContain('pms-icon-dark.png');
    expect(getChannelMarkPath('website', 'light')).toContain('pms-icon.png');
  });
});

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { COMMUNITY_JOIN_FALLBACK_PATH, resolveCommunityJoinUrl } from '../config/community';

describe('community fallback', () => {
  it('fails closed to the first-party waitlist and exposes no invitation token', () => {
    expect(COMMUNITY_JOIN_FALLBACK_PATH).toBe('/community#community-waitlist');
    expect(resolveCommunityJoinUrl()).toBe(COMMUNITY_JOIN_FALLBACK_PATH);
    expect(resolveCommunityJoinUrl()).not.toContain('invitation_token');
    const source = readFileSync(
      fileURLToPath(new URL('../components/pages/Community.tsx', import.meta.url)),
      'utf8',
    );

    for (const label of [
      'Join Community Waitlist',
      'Join Study Circles Waitlist',
    ]) {
      expect(source).toContain(label);
    }
    expect(source.match(/Join Community Waitlist/g)).toHaveLength(2);
    expect(source).not.toMatch(/cta: 'Sign in'|Join the Community/);
    expect(source).toContain('id="community-waitlist"');
    expect(source).toContain('tabIndex={-1}');
    expect(source).toContain('href={joinUrl}');
    expect(source).not.toContain('invitation_token');
  });
});

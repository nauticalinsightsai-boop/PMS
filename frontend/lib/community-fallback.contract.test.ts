import { describe, expect, it } from 'vitest';
import { COMMUNITY_JOIN_FALLBACK_PATH, resolveCommunityJoinUrl } from '../config/community';

describe('community fallback', () => {
  it('fails closed to the first-party waitlist and exposes no invitation token', () => {
    expect(COMMUNITY_JOIN_FALLBACK_PATH).toBe('/community#community-waitlist');
    expect(resolveCommunityJoinUrl()).toBe(COMMUNITY_JOIN_FALLBACK_PATH);
    expect(resolveCommunityJoinUrl()).not.toContain('invitation_token');
  });
});

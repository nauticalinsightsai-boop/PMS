import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { GET } from '../app/(site)/join/route';
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

  it('redirects the legacy route with an origin-independent relative Location', () => {
    const response = GET();
    const routeSource = readFileSync(
      fileURLToPath(new URL('../app/(site)/join/route.ts', import.meta.url)),
      'utf8',
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/community#community-waitlist');
    expect(response.body).toBeNull();
    expect(response.headers.get('set-cookie')).toBeNull();
    expect(routeSource).not.toContain('request.nextUrl.origin');
    expect(routeSource).not.toMatch(/0\.0\.0\.0|internal-host|invitation_token|searchParams|x-forwarded|host/i);
  });
});

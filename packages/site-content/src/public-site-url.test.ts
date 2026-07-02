import { afterEach, describe, expect, it } from 'vitest';
import { resolvePublicSiteUrl } from './public-site-url';

describe('resolvePublicSiteUrl', () => {
  const env = { ...process.env };

  afterEach(() => {
    process.env = { ...env };
  });

  it('returns production apex on Railway when env is localhost', () => {
    process.env.RAILWAY_ENVIRONMENT = 'production';
    process.env.NODE_ENV = 'production';
    expect(resolvePublicSiteUrl('http://localhost:3000')).toBe('https://pmstructure.com');
  });

  it('keeps localhost in local development', () => {
    delete process.env.RAILWAY_ENVIRONMENT;
    process.env.NODE_ENV = 'development';
    expect(resolvePublicSiteUrl('http://localhost:3000', 'http://localhost:3000')).toBe(
      'http://localhost:3000',
    );
  });
});

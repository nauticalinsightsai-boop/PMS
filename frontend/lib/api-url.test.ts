import { afterEach, describe, expect, it } from 'vitest';
import { apiUrl } from './api-url';

describe('apiUrl', () => {
  const originalWindow = globalThis.window;
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    if (originalWindow === undefined) {
      // @ts-expect-error test cleanup
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }
  });

  it('returns relative paths in the browser', () => {
    globalThis.window = {} as Window & typeof globalThis;
    expect(apiUrl('/api/checkout/seat-deposit')).toBe('/api/checkout/seat-deposit');
  });

  it('returns absolute paths on the server', () => {
    // @ts-expect-error test cleanup
    delete globalThis.window;
    process.env.NEXT_PUBLIC_API_URL = 'https://pmstructure.com';
    expect(apiUrl('/api/checkout/seat-deposit')).toBe('https://pmstructure.com/api/checkout/seat-deposit');
  });

  it('defaults to local gateway on the server', () => {
    // @ts-expect-error test cleanup
    delete globalThis.window;
    delete process.env.NEXT_PUBLIC_API_URL;
    expect(apiUrl('api/regions')).toBe('http://localhost:3000/api/regions');
  });
});

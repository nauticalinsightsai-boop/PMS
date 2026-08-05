import { describe, expect, it, vi } from 'vitest';

const recordScholarshipEvent = vi.hoisted(() => vi.fn());

vi.mock('@/lib/scholarship-store', () => ({ recordScholarshipEvent }));

import { POST } from './route';

describe('retired scholarship event ingestion endpoint', () => {
  it('cannot write a formerly valid scholarship page-view event', async () => {
    const response = await POST();

    expect(response.status).toBe(410);
    expect(response.headers.get('cache-control')).toBe('no-store');
    await expect(response.json()).resolves.toEqual({
      error: 'Scholarship event ingestion is retired.',
    });
    expect(recordScholarshipEvent).not.toHaveBeenCalled();
  });

  it('does not parse or write attacker-controlled request bodies', async () => {
    const request = new Request('https://pmstructure.com/api/scholarship/events', {
      method: 'POST',
      body: '{malformed',
    });
    const json = vi.spyOn(request, 'json');

    const response = await POST();

    expect(response.status).toBe(410);
    expect(json).not.toHaveBeenCalled();
    expect(recordScholarshipEvent).not.toHaveBeenCalled();
  });
});

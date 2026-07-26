import { describe, expect, it } from 'vitest';
import { metadata as gccPrivacyMetadata } from '@/app/(site)/legal/privacy/gcc/page';
import { defaultSiteMetadata } from '@/lib/site-metadata';
import { PMS_SITE_NAME, PMS_SITE_URL } from '@/config/pms-site';

describe('/legal/privacy/gcc metadata', () => {
  it('cooperates with the global title template and emits a self-canonical', () => {
    const title = gccPrivacyMetadata.title;
    expect(typeof title === 'object' && title !== null && 'absolute' in title).toBe(true);
    const absolute =
      typeof title === 'object' && title !== null && 'absolute' in title
        ? String(title.absolute)
        : String(title);

    expect(absolute).toBe(`Privacy Policy (GCC) | ${PMS_SITE_NAME}`);
    expect(absolute).not.toMatch(/PM Structure \| PM Structure/);
    expect(absolute.match(/PM Structure/g)?.length ?? 0).toBe(1);

    // Plain string titles would be double-suffixed by the root template.
    expect(defaultSiteMetadata.title).toMatchObject({
      template: `%s | ${PMS_SITE_NAME}`,
    });
    expect(gccPrivacyMetadata.alternates?.canonical).toBe(
      `${PMS_SITE_URL}/legal/privacy/gcc`,
    );
  });
});

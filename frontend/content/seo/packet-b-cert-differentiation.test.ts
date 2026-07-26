import { describe, expect, it } from 'vitest';
import {
  PACKET_B_CERT_DIFFERENTIATION,
  PACKET_B_CERT_IDS,
  packetBUniqueWordCount,
} from '@/content/seo/packet-b-cert-differentiation';
import { buildCertMetadata } from '@/lib/site-metadata';
import { getPhase2Seo } from '@/content/seo/phase-2-page-seo';
import { T176_SEO } from '@/content/t176-claims';

function jaccard(a: string, b: string): number {
  const ta = new Set(
    a
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter(Boolean),
  );
  const tb = new Set(
    b
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter(Boolean),
  );
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter += 1;
  const union = ta.size + tb.size - inter;
  return union === 0 ? 0 : inter / union;
}

describe('Packet B certification differentiation', () => {
  it('gives each of the eight pages unique title, H1, and meta description', () => {
    const titles = new Set<string>();
    const h1s = new Set<string>();
    const descriptions = new Set<string>();

    for (const id of PACKET_B_CERT_IDS) {
      const entry = PACKET_B_CERT_DIFFERENTIATION[id];
      const phase2 = getPhase2Seo(entry.path);
      const meta = buildCertMetadata(id);
      expect(phase2?.title).toBe(entry.title);
      expect(phase2?.h1).toBe(entry.h1);
      expect(phase2?.description).toBe(entry.description);
      expect(String((meta as { description?: string }).description ?? meta.openGraph?.description)).toBe(
        entry.description,
      );
      expect(entry.description).not.toBe(T176_SEO.prince2Description);
      expect(entry.description).not.toBe(T176_SEO.lssDescription);
      expect(entry.description.length).toBeGreaterThanOrEqual(120);
      expect(entry.description.length).toBeLessThanOrEqual(200);
      titles.add(entry.title);
      h1s.add(entry.h1);
      descriptions.add(entry.description);
    }

    expect(titles.size).toBe(8);
    expect(h1s.size).toBe(8);
    expect(descriptions.size).toBe(8);
  });

  it('keeps unique source copy above the bounded minimum and below 0.70 within-cluster similarity', () => {
    for (const id of PACKET_B_CERT_IDS) {
      expect(packetBUniqueWordCount(PACKET_B_CERT_DIFFERENTIATION[id])).toBeGreaterThanOrEqual(120);
    }

    const prince2 = ['prince2-agile', 'prince2-agile-practitioner', 'msp', 'mop', 'mor'] as const;
    const lss = ['lss-green', 'lss-master', 'lss-champion'] as const;

    for (const cluster of [prince2, lss]) {
      for (let i = 0; i < cluster.length; i++) {
        for (let j = i + 1; j < cluster.length; j++) {
          const a = PACKET_B_CERT_DIFFERENTIATION[cluster[i]];
          const b = PACKET_B_CERT_DIFFERENTIATION[cluster[j]];
          const left = [a.intro, ...a.decisionCopy].join(' ');
          const right = [b.intro, ...b.decisionCopy].join(' ');
          expect(jaccard(left, right)).toBeLessThan(0.7);
        }
      }
    }
  });

  it('includes contextual related links for each differentiated page', () => {
    for (const id of PACKET_B_CERT_IDS) {
      const entry = PACKET_B_CERT_DIFFERENTIATION[id];
      expect(entry.related.length).toBeGreaterThanOrEqual(2);
      expect(entry.related.some((link) => link.href === '/certifications' || link.href === '/certifications/compare')).toBe(
        true,
      );
    }
  });
});

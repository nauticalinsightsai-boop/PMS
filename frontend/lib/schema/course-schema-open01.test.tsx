import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CertJsonLd } from '@/components/seo/CertJsonLd';
import { PmpCourseJsonLd } from '@/components/seo/PmpCourseJsonLd';
import { PMP_COURSE_PAGES } from '@/content/pmp/courses';
import { certifications } from '@/data/certification-index';
import { buildCoursesJson } from '@/lib/ai-files/builders';

Object.assign(globalThis, { React });

const schemaGraph = (markup: string) => {
  const json = markup.match(/<script[^>]*>(.*)<\/script>/)?.[1];
  return JSON.parse(json ?? '{}')['@graph'] as Array<{ '@type'?: string }>;
};

describe('OPEN-01 Course schema correction', () => {
  it('emits no Course node on all 27 certification reference routes', () => {
    expect(certifications).toHaveLength(27);
    for (const cert of certifications) {
      const graph = schemaGraph(renderToStaticMarkup(<CertJsonLd certId={cert.id} />));
      expect(graph.some((node) => node['@type'] === 'Course'), cert.id).toBe(false);
      expect(graph.some((node) => node['@type'] === 'WebPage'), cert.id).toBe(true);
      expect(graph.some((node) => node['@type'] === 'BreadcrumbList'), cert.id).toBe(true);
    }
  });

  it('retains exactly one Course node on each of the three supported routes', () => {
    expect(PMP_COURSE_PAGES.map((course) => course.path)).toEqual([
      '/pmp-foundation',
      '/pmp-professional',
      '/pmp-mastery',
    ]);
    for (const course of PMP_COURSE_PAGES) {
      const graph = schemaGraph(renderToStaticMarkup(<PmpCourseJsonLd course={course} />));
      expect(graph.filter((node) => node['@type'] === 'Course')).toHaveLength(1);
    }
  });

  it('publishes exactly the same three unique canonical routes in courses.json data', () => {
    const output = buildCoursesJson();
    const urls = output.courses.map((course) => course.url);
    expect(urls).toEqual([
      'https://pmstructure.com/pmp-foundation',
      'https://pmstructure.com/pmp-professional',
      'https://pmstructure.com/pmp-mastery',
    ]);
    expect(new Set(urls).size).toBe(3);
  });
});

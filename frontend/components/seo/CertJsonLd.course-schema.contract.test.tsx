import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PmpCourseJsonLd } from './PmpCourseJsonLd';
import { getPmpCourse, PMP_COURSE_PAGES, PMP_COURSE_PATHS } from '@/content/pmp/courses';
import { buildCourseSchema, organizationId } from '@/lib/schema';

const certJsonLdSource = readFileSync(new URL('./CertJsonLd.tsx', import.meta.url), 'utf8');
const pathwayJsonLdSource = readFileSync(new URL('./PmpCourseJsonLd.tsx', import.meta.url), 'utf8');

Object.assign(globalThis, { React });

describe('OPEN-01 Course schema contract', () => {
  it('CertJsonLd keeps WebPage + Breadcrumb and does not emit Course', () => {
    expect(certJsonLdSource).toContain('buildWebPageSchema');
    expect(certJsonLdSource).toContain('breadcrumbItemsToSchema');
    expect(certJsonLdSource).not.toContain('buildCourseSchema');
    expect(certJsonLdSource).not.toMatch(/['"]Course['"]/);
  });

  it('PmpCourseJsonLd retains Course for pathway pages', () => {
    expect(pathwayJsonLdSource).toContain('buildCourseSchema');
    expect(pathwayJsonLdSource).toContain('buildWebPageSchema');
  });

  it.each([...PMP_COURSE_PATHS])('pathway %s emits the source-backed inline Organization provider', (path) => {
    const course = PMP_COURSE_PAGES.find((c) => c.path === path);
    expect(course).toBeTruthy();
    const schema = buildCourseSchema({
      path: course!.path,
      name: course!.h1,
      description: course!.description,
    });
    expect(schema['@type']).toBe('Course');
    expect(schema['@id']).toBe(`https://pmstructure.com${path}#course`);
    expect(schema.provider).toEqual({
      '@type': 'Organization',
      '@id': organizationId(),
      name: 'PM Structure',
      url: 'https://pmstructure.com',
    });
  });

  it('getPmpCourse resolves all three pathway slugs', () => {
    for (const slug of ['pmp-foundation', 'pmp-professional', 'pmp-mastery']) {
      expect(getPmpCourse(slug)?.path).toBe(`/${slug}`);
    }
  });

  it.each(PMP_COURSE_PAGES)('preserves the non-Course JSON-LD blocks on $path', (course) => {
    const markup = renderToStaticMarkup(<PmpCourseJsonLd course={course} />);
    const json = markup.match(/<script[^>]*>(.*)<\/script>/)?.[1];
    const graph = JSON.parse(json ?? '{}')['@graph'] as Array<{ '@type': string }>;
    expect(graph.map((node) => node['@type'])).toEqual([
      'WebPage',
      'Course',
      'BreadcrumbList',
      'FAQPage',
    ]);
  });
});

import { marked } from 'marked';
import TurndownService from 'turndown';
import {
  isArticleHtmlContent,
  parseArticleSegments,
  type ArticleSegment,
} from '@pms/site-content/article-markdown';

const PROSE_EDITOR_CLASS =
  'article-wysiwyg prose prose-slate dark:prose-invert max-w-none prose-p:font-medium prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-headings:font-heading prose-a:text-brand-orange prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-brand-orange prose-blockquote:pl-4 prose-blockquote:italic prose-img:rounded-xl prose-hr:my-8';

let turndown: TurndownService | null = null;

function getTurndown(): TurndownService {
  if (turndown) return turndown;

  const service = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
  });

  service.addRule('underline', {
    filter: ['u'],
    replacement: (content) => `<u>${content}</u>`,
  });

  service.addRule('strikethrough', {
    filter: (node) => {
      const tag = node.nodeName.toLowerCase();
      return tag === 'del' || tag === 's' || tag === 'strike';
    },
    replacement: (content) => `~~${content}~~`,
  });

  service.addRule('horizontalRule', {
    filter: 'hr',
    replacement: () => '\n\n---\n\n',
  });

  turndown = service;
  return service;
}

marked.setOptions({
  gfm: true,
  breaks: true,
});

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function markdownToHtml(markdown: string): string {
  const trimmed = markdown.trim();
  if (!trimmed) return '<p><br></p>';
  const html = marked.parse(trimmed, { async: false });
  return typeof html === 'string' ? html : '<p><br></p>';
}

export function htmlToMarkdown(html: string): string {
  const cleaned = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/\u00a0/g, ' ')
    .trim();
  if (!cleaned || cleaned === '<p></p>' || cleaned === '<p><br></p>') return '';
  return getTurndown().turndown(cleaned).trim();
}

export function buildFigureHtml(desktop: string, mobile: string, alt: string): string {
  const d = desktop.trim();
  const m = (mobile.trim() || d).trim();
  const a = alt.trim() || 'Article image';
  return `<figure contenteditable="false" data-article-figure data-desktop="${escapeAttr(d)}" data-mobile="${escapeAttr(m)}" data-alt="${escapeAttr(a)}" class="article-figure-block my-8 not-prose"><img src="${escapeAttr(d)}" alt="${escapeAttr(a)}" class="w-full rounded-xl border border-border object-cover" draggable="false" /></figure>`;
}

export function buildCenterHtml(content: string): string {
  const inner = isArticleHtmlContent(content) ? content : markdownToHtml(content);
  return `<div data-article-center class="article-center-block my-6 text-center">${inner}</div>`;
}

export function buildInlineImageHtml(src: string, alt = ''): string {
  return `<figure class="my-6 not-prose"><img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" class="mx-auto max-w-full rounded-xl border border-border object-cover" /></figure>`;
}

function segmentToHtml(segment: ArticleSegment): string {
  if (segment.type === 'figure') {
    return buildFigureHtml(segment.desktop, segment.mobile, segment.alt);
  }
  if (segment.type === 'center') {
    return buildCenterHtml(segment.content);
  }
  if (segment.type === 'html') {
    return segment.content;
  }
  return markdownToHtml(segment.content);
}

/** Convert legacy markdown (or mixed) content to HTML for the WYSIWYG editor. */
export function normalizeArticleContent(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return '<p><br></p>';
  if (isArticleHtmlContent(trimmed)) return trimmed;

  const segments = parseArticleSegments(trimmed);
  const html = segments.map(segmentToHtml).join('');
  return html.trim() || '<p><br></p>';
}

/** Strip unsafe tags/attributes while preserving article semantics. */
export function sanitizeEditorHtml(html: string): string {
  if (typeof document === 'undefined') return html.trim();

  const template = document.createElement('template');
  template.innerHTML = html;

  const forbiddenTags = new Set(['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta']);
  const allowedAttrs = new Set([
    'href',
    'src',
    'alt',
    'class',
    'contenteditable',
    'data-article-figure',
    'data-article-center',
    'data-desktop',
    'data-mobile',
    'data-alt',
    'style',
    'target',
    'rel',
  ]);

  const walk = (node: Node) => {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType !== Node.ELEMENT_NODE) continue;
      const el = child as HTMLElement;
      const tag = el.tagName.toLowerCase();

      if (forbiddenTags.has(tag)) {
        el.remove();
        continue;
      }

      for (const attr of Array.from(el.attributes)) {
        const name = attr.name.toLowerCase();
        if (name.startsWith('on') || (!allowedAttrs.has(name) && !name.startsWith('data-article-'))) {
          el.removeAttribute(attr.name);
        }
      }

      if (tag === 'a') {
        const href = el.getAttribute('href') ?? '';
        if (/^\s*javascript:/i.test(href)) el.removeAttribute('href');
      }

      walk(el);
    }
  };

  walk(template.content);

  const cleaned = template.innerHTML.trim();
  if (!cleaned || cleaned === '<br>') return '';
  return cleaned;
}

export function isEditorEmpty(html: string): boolean {
  const trimmed = sanitizeEditorHtml(html);
  if (!trimmed) return true;
  const plain = trimmed
    .replace(/<figure[\s\S]*?<\/figure>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\u00a0/g, ' ')
    .trim();
  return !plain;
}

export { PROSE_EDITOR_CLASS };

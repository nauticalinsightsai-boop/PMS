import { marked } from 'marked';
import TurndownService from 'turndown';

const PROSE_EDITOR_CLASS =
  'prose prose-slate dark:prose-invert max-w-none prose-p:font-medium prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-headings:font-heading prose-a:text-brand-orange prose-blockquote:border-brand-orange prose-sm';

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

export { PROSE_EDITOR_CLASS };

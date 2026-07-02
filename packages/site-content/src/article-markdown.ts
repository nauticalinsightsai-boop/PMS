export type ArticleSegment =
  | { type: 'markdown'; content: string }
  | { type: 'html'; content: string }
  | { type: 'figure'; desktop: string; mobile: string; alt: string }
  | { type: 'center'; content: string };

const BLOCK_RE = /:::(figure|center)\n([\s\S]*?):::/g;
const HTML_BLOCK_RE =
  /(<figure\b[^>]*\bdata-article-figure\b[^>]*>[\s\S]*?<\/figure>|<div\b[^>]*\bdata-article-center\b[^>]*>[\s\S]*?<\/div>)/gi;

/** True when stored content is semantic HTML (not legacy markdown). */
export function isArticleHtmlContent(content: string): boolean {
  const trimmed = content.trim();
  if (!trimmed) return false;
  if (/:::(figure|center)\n/.test(trimmed)) return false;
  return /<(p|div|h[1-6]|ul|ol|li|blockquote|figure|hr|img|a)\b/i.test(trimmed);
}

function parseFigureHtml(html: string): { desktop: string; mobile: string; alt: string } {
  const desktop = html.match(/\bdata-desktop="([^"]*)"/)?.[1]?.trim() ?? '';
  const mobile = html.match(/\bdata-mobile="([^"]*)"/)?.[1]?.trim() ?? desktop;
  const alt = html.match(/\bdata-alt="([^"]*)"/)?.[1]?.trim() ?? '';
  const imgSrc = html.match(/<img[^>]+src="([^"]*)"/i)?.[1]?.trim() ?? '';
  return { desktop: desktop || imgSrc, mobile: mobile || desktop || imgSrc, alt };
}

function parseCenterHtml(html: string): string {
  return html.replace(/^<div\b[^>]*>/i, '').replace(/<\/div>$/i, '').trim();
}

function parseArticleHtmlSegments(raw: string): ArticleSegment[] {
  const segments: ArticleSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  HTML_BLOCK_RE.lastIndex = 0;
  while ((match = HTML_BLOCK_RE.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      const html = raw.slice(lastIndex, match.index).trim();
      if (html) segments.push({ type: 'html', content: html });
    }

    const block = match[1] ?? '';
    if (/data-article-figure/i.test(block)) {
      const { desktop, mobile, alt } = parseFigureHtml(block);
      if (desktop) segments.push({ type: 'figure', desktop, mobile, alt });
    } else {
      const text = parseCenterHtml(block);
      if (text) segments.push({ type: 'center', content: text });
    }
    lastIndex = HTML_BLOCK_RE.lastIndex;
  }

  const tail = raw.slice(lastIndex).trim();
  if (tail) segments.push({ type: 'html', content: tail });

  return segments.length > 0 ? segments : [{ type: 'html', content: raw }];
}

function parseFigureBody(body: string): { desktop: string; mobile: string; alt: string } {
  const desktop = body.match(/^desktop:\s*(.+)$/m)?.[1]?.trim() ?? '';
  const mobile = body.match(/^mobile:\s*(.+)$/m)?.[1]?.trim() ?? desktop;
  const alt = body.match(/^alt:\s*(.+)$/m)?.[1]?.trim() ?? '';
  return { desktop, mobile, alt };
}

/** Split article content into prose + custom figure/center blocks (markdown or HTML). */
export function parseArticleSegments(raw: string): ArticleSegment[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  if (isArticleHtmlContent(trimmed)) return parseArticleHtmlSegments(trimmed);

  const segments: ArticleSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  BLOCK_RE.lastIndex = 0;
  while ((match = BLOCK_RE.exec(trimmed)) !== null) {
    if (match.index > lastIndex) {
      const md = trimmed.slice(lastIndex, match.index).trim();
      if (md) segments.push({ type: 'markdown', content: md });
    }

    const kind = match[1];
    const body = match[2] ?? '';
    if (kind === 'figure') {
      const { desktop, mobile, alt } = parseFigureBody(body);
      if (desktop) segments.push({ type: 'figure', desktop, mobile, alt });
    } else {
      const text = body.trim();
      if (text) segments.push({ type: 'center', content: text });
    }
    lastIndex = BLOCK_RE.lastIndex;
  }

  const tail = trimmed.slice(lastIndex).trim();
  if (tail) segments.push({ type: 'markdown', content: tail });

  return segments.length > 0 ? segments : [{ type: 'markdown', content: trimmed }];
}

export function buildFigureBlock(desktop: string, mobile: string, alt: string): string {
  const mobileLine = mobile.trim() && mobile.trim() !== desktop.trim() ? `mobile: ${mobile.trim()}\n` : '';
  return `\n\n:::figure\ndesktop: ${desktop.trim()}\n${mobileLine}alt: ${alt.trim() || 'Article image'}\n:::\n\n`;
}

export function buildCenterBlock(text: string): string {
  return `\n\n:::center\n${text.trim() || 'Centered text'}\n:::\n\n`;
}

export function buildQuoteBlock(text: string, attribution?: string): string {
  const lines = text.trim().split('\n').map((line) => `> ${line}`);
  if (attribution?.trim()) lines.push(`> \u2014 ${attribution.trim()}`);
  return `\n\n${lines.join('\n')}\n\n`;
}

/** Serialize parsed segments back to stored article content. */
export function reassembleArticleMarkdown(segments: ArticleSegment[]): string {
  const parts = segments
    .map((segment) => {
      if (segment.type === 'markdown') return segment.content.trim();
      if (segment.type === 'html') return segment.content.trim();
      if (segment.type === 'center') return buildCenterBlock(segment.content).trim();
      if (segment.type === 'figure') {
        return buildFigureBlock(segment.desktop, segment.mobile, segment.alt).trim();
      }
      return '';
    })
    .filter(Boolean);
  return parts.join('\n\n').trim();
}

export function articleMarkdownFromBody(body: string[], markdown?: string): string {
  if (markdown?.trim()) return markdown.trim();
  return body.join('\n\n').trim();
}

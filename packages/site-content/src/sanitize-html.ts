/**
 * Server-safe HTML sanitizer for CMS / newsletter public render.
 * Strips scripts, event handlers, dangerous URLs, and disallowed tags.
 * Not a full browser DOMPurify replacement, but blocks common stored-XSS vectors.
 */

const FORBIDDEN_TAGS =
  /<\/?(?:script|iframe|object|embed|link|meta|base|form|input|button|textarea|select|option|svg|math|style|template|noscript)(?:\s[^>]*)?>/gi;

const EVENT_HANDLER_ATTR = /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;

const DANGEROUS_URL_ATTR =
  /(\s+(?:href|src|xlink:href|action|formaction)\s*=\s*)(["'])\s*(?:javascript|vbscript|data\s*:\s*text\/html)[^"']*\2/gi;

const DANGEROUS_URL_ATTR_UNQUOTED =
  /(\s+(?:href|src|xlink:href|action|formaction)\s*=\s*)(?:javascript|vbscript|data\s*:\s*text\/html)[^\s>]*/gi;

const STYLE_EXPRESSION = /(\s+style\s*=\s*)(["'])[\s\S]*?\2/gi;

export function sanitizeArticleHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';

  let out = html;
  // Repeat to catch nested/encoded attempts after partial strips.
  for (let i = 0; i < 3; i++) {
    out = out
      .replace(FORBIDDEN_TAGS, '')
      .replace(EVENT_HANDLER_ATTR, '')
      .replace(DANGEROUS_URL_ATTR, '$1$2#$2')
      .replace(DANGEROUS_URL_ATTR_UNQUOTED, '$1#')
      .replace(STYLE_EXPRESSION, '');
  }

  return out.trim();
}

/** Escape JSON for embedding inside <script type="application/ld+json">. */
export function escapeJsonForScript(json: string): string {
  return json.replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

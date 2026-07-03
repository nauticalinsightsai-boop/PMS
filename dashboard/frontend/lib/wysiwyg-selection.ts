/** Selection helpers for contentEditable WYSIWYG toolbars. */

export function getSelectionRange(): Range | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
}

export function isRangeInsideEditor(range: Range | null, editor: HTMLElement | null): boolean {
  if (!range || !editor) return false;
  return editor.contains(range.commonAncestorContainer);
}

export function saveEditorSelection(editor: HTMLElement | null): Range | null {
  const range = getSelectionRange();
  if (!isRangeInsideEditor(range, editor) || !range) return null;
  return range.cloneRange();
}

export function restoreEditorSelection(editor: HTMLElement | null, saved: Range | null) {
  if (!editor) return;
  editor.focus();
  const selection = window.getSelection();
  if (!selection) return;

  if (saved && isRangeInsideEditor(saved, editor)) {
    selection.removeAllRanges();
    selection.addRange(saved);
    return;
  }

  const range = document.createRange();
  range.selectNodeContents(editor);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

export function rangeClientRect(range: Range | null): DOMRect | null {
  if (!range) return null;
  const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0 || r.height > 0);
  if (rects.length === 0) return range.getBoundingClientRect();

  let left = rects[0].left;
  let top = rects[0].top;
  let right = rects[0].right;
  let bottom = rects[0].bottom;
  for (const r of rects.slice(1)) {
    left = Math.min(left, r.left);
    top = Math.min(top, r.top);
    right = Math.max(right, r.right);
    bottom = Math.max(bottom, r.bottom);
  }
  return new DOMRect(left, top, right - left, bottom - top);
}

const BLOCK_TAGS = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'div', 'li']);

export type EditorBlockMode = 'p' | number | 'blockquote' | 'ul' | 'ol';

/** Cross-browser block tag value for document.execCommand('formatBlock'). */
export function formatBlockValue(tag: string): string {
  const normalized = tag.replace(/^<|>$/g, '').toLowerCase();
  if (normalized === 'p') return 'p';
  if (normalized === 'blockquote') return 'blockquote';
  if (/^h[1-6]$/.test(normalized)) return normalized;
  return normalized;
}

function getBlockElement(node: Node, editor: HTMLElement): HTMLElement | null {
  let el: HTMLElement | null =
    node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
  while (el && el !== editor) {
    const tag = el.tagName.toLowerCase();
    if (BLOCK_TAGS.has(tag)) return el;
    el = el.parentElement;
  }
  return null;
}

function getListItem(node: Node, editor: HTMLElement): HTMLLIElement | null {
  let el: HTMLElement | null =
    node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
  while (el && el !== editor) {
    if (el.tagName === 'LI') return el as HTMLLIElement;
    el = el.parentElement;
  }
  return null;
}

function getContainingList(li: HTMLLIElement): HTMLUListElement | HTMLOListElement | null {
  const parent = li.parentElement;
  if (!parent) return null;
  const tag = parent.tagName;
  if (tag === 'UL' || tag === 'OL') return parent as HTMLUListElement | HTMLOListElement;
  return null;
}

function placeCaretInBlock(block: HTMLElement) {
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(block);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function unwrapListItem(li: HTMLLIElement): HTMLElement {
  const list = getContainingList(li);
  const p = document.createElement('p');
  p.innerHTML = li.innerHTML.trim() || '<br>';
  if (!list) {
    li.replaceWith(p);
    return p;
  }
  if (list.children.length === 1) {
    list.replaceWith(p);
    return p;
  }
  li.replaceWith(p);
  return p;
}

function replaceBlockTag(block: HTMLElement, tagName: string): HTMLElement {
  const nextTag = formatBlockValue(tagName);
  if (block.tagName.toLowerCase() === nextTag) return block;

  const replacement = document.createElement(nextTag);
  replacement.innerHTML = block.innerHTML.trim() || '<br>';
  block.replaceWith(replacement);
  return replacement;
}

function listItemsFromBlock(block: HTMLElement): HTMLLIElement[] {
  const items: HTMLLIElement[] = [];
  const html = block.innerHTML.trim();
  const lines = html
    .split(/<br\s*\/?>/i)
    .map((line) => line.trim())
    .filter(Boolean);
  const source = lines.length > 0 ? lines : [html.replace(/<[^>]+>/g, '').trim() || 'List item'];
  for (const line of source) {
    const li = document.createElement('li');
    li.innerHTML = line || 'List item';
    items.push(li);
  }
  return items;
}

function normalizeBlockForFormat(block: HTMLElement): HTMLElement {
  if (block.tagName === 'LI') return unwrapListItem(block as HTMLLIElement);
  return block;
}

/** Apply heading / paragraph / blockquote to the current block (execCommand + DOM fallback). */
export function applyEditorBlockFormat(
  editor: HTMLElement,
  saved: Range | null,
  tag: string,
): boolean {
  restoreEditorSelection(editor, saved);
  const tagName = formatBlockValue(tag);

  for (const value of [tagName, `<${tagName}>`, tagName.toUpperCase()]) {
    if (document.execCommand('formatBlock', false, value)) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const block = getBlockElement(selection.getRangeAt(0).commonAncestorContainer, editor);
        if (block && block.tagName.toLowerCase() === tagName) return true;
      } else {
        return true;
      }
    }
  }

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  let block = getBlockElement(selection.getRangeAt(0).commonAncestorContainer, editor);
  if (!block) {
    const empty = document.createElement(tagName);
    empty.innerHTML = '<br>';
    editor.appendChild(empty);
    placeCaretInBlock(empty);
    return true;
  }

  block = normalizeBlockForFormat(block);
  block = replaceBlockTag(block, tagName);
  placeCaretInBlock(block);
  return true;
}

/** Toggle or insert bullet / numbered list with DOM fallback. */
export function applyEditorList(
  editor: HTMLElement,
  saved: Range | null,
  ordered: boolean,
): boolean {
  restoreEditorSelection(editor, saved);
  const command = ordered ? 'insertOrderedList' : 'insertUnorderedList';
  if (document.execCommand(command, false)) return true;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  const existingLi = getListItem(range.commonAncestorContainer, editor);
  const wantTag = ordered ? 'OL' : 'UL';

  if (existingLi) {
    const list = getContainingList(existingLi);
    if (list?.tagName === wantTag) {
      const p = unwrapListItem(existingLi);
      placeCaretInBlock(p);
      return true;
    }
    if (list) {
      const replacement = document.createElement(ordered ? 'ol' : 'ul');
      replacement.innerHTML = list.innerHTML;
      list.replaceWith(replacement);
      const li = replacement.querySelector('li');
      if (li) placeCaretInBlock(li);
      return true;
    }
  }

  let block = getBlockElement(range.commonAncestorContainer, editor);
  if (!block) {
    block = document.createElement('p');
    block.innerHTML = '<br>';
    editor.appendChild(block);
  }

  if (block.tagName === 'LI') {
    block = unwrapListItem(block as HTMLLIElement);
  }

  const list = document.createElement(ordered ? 'ol' : 'ul');
  for (const li of listItemsFromBlock(block)) {
    list.appendChild(li);
  }
  block.replaceWith(list);
  const firstLi = list.querySelector('li');
  if (firstLi) placeCaretInBlock(firstLi);
  return true;
}

/** Insert horizontal rule with DOM fallback. */
export function insertEditorHorizontalRule(editor: HTMLElement, saved: Range | null): boolean {
  restoreEditorSelection(editor, saved);
  if (document.execCommand('insertHorizontalRule', false)) return true;

  const hr = document.createElement('hr');
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    editor.appendChild(hr);
    const p = document.createElement('p');
    p.innerHTML = '<br>';
    hr.after(p);
    placeCaretInBlock(p);
    return true;
  }

  const range = selection.getRangeAt(0);
  range.collapse(false);
  range.insertNode(hr);
  const p = document.createElement('p');
  p.innerHTML = '<br>';
  hr.after(p);
  placeCaretInBlock(p);
  return true;
}

/** Detect active block type at caret for toolbar highlighting. */
export function getActiveBlockTag(editor: HTMLElement | null): EditorBlockMode | null {
  if (!editor) return null;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  if (!isRangeInsideEditor(selection.getRangeAt(0), editor)) return null;

  const node = selection.getRangeAt(0).commonAncestorContainer;
  const listItem = getListItem(node, editor);
  if (listItem) {
    const list = getContainingList(listItem);
    if (list?.tagName === 'OL') return 'ol';
    if (list?.tagName === 'UL') return 'ul';
  }

  const block = getBlockElement(node, editor);
  if (!block) return 'p';

  const tag = block.tagName.toLowerCase();
  if (tag === 'blockquote') return 'blockquote';
  if (tag === 'p' || tag === 'div') return 'p';
  if (/^h([1-6])$/.test(tag)) return Number(tag.slice(1));
  return 'p';
}

function getAnchorFromRange(range: Range): HTMLAnchorElement | null {
  const node = range.commonAncestorContainer;
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    if (el.tagName === 'A') return el as HTMLAnchorElement;
    return el.closest('a');
  }
  return node.parentElement?.closest('a') ?? null;
}

function decorateEditorLink(anchor: HTMLAnchorElement) {
  anchor.setAttribute('target', '_blank');
  anchor.setAttribute('rel', 'noopener noreferrer');
}

/** Wrap selected text (or insert URL) as a link with execCommand + DOM fallback. */
export function applyEditorLink(editor: HTMLElement, saved: Range | null, url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;

  restoreEditorSelection(editor, saved);
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  if (!isRangeInsideEditor(range, editor)) return false;

  const existing = getAnchorFromRange(range);
  if (existing && editor.contains(existing)) {
    existing.href = trimmed;
    decorateEditorLink(existing);
    return true;
  }

  if (!range.collapsed && document.execCommand('createLink', false, trimmed)) {
    const anchor = getAnchorFromRange(range);
    if (anchor && editor.contains(anchor)) {
      decorateEditorLink(anchor);
      return true;
    }
  }

  const anchor = document.createElement('a');
  anchor.href = trimmed;
  decorateEditorLink(anchor);

  if (range.collapsed) {
    anchor.textContent = trimmed;
    range.insertNode(anchor);
    const after = document.createRange();
    after.setStartAfter(anchor);
    after.collapse(true);
    selection.removeAllRanges();
    selection.addRange(after);
    return true;
  }

  try {
    range.surroundContents(anchor);
  } catch {
    anchor.appendChild(range.extractContents());
    range.deleteContents();
    range.insertNode(anchor);
  }

  const after = document.createRange();
  after.setStartAfter(anchor);
  after.collapse(true);
  selection.removeAllRanges();
  selection.addRange(after);
  return true;
}

export function execEditorCommand(
  editor: HTMLElement,
  command: string,
  saved: Range | null,
  value?: string,
): boolean {
  restoreEditorSelection(editor, saved);
  const ok = document.execCommand(command, false, value);
  return ok;
}

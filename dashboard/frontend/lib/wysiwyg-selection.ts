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
  const rects = range.getClientRects();
  if (rects.length > 0) return rects[0] ?? null;
  return range.getBoundingClientRect();
}

/** Cross-browser block tag value for document.execCommand('formatBlock'). */
export function formatBlockValue(tag: string): string {
  const normalized = tag.replace(/^<|>$/g, '').toLowerCase();
  if (normalized === 'p') return 'p';
  if (normalized === 'blockquote') return 'blockquote';
  if (/^h[1-6]$/.test(normalized)) return normalized;
  return normalized;
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

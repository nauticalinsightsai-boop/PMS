'use client';

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Monitor,
  Quote,
  Redo2,
  Smartphone,
  Underline,
  Undo2,
} from 'lucide-react';
import { FeaturedImageUploadDialog } from '@/components/pages/admin/newsletter/FeaturedImageUploader';
import { LinkInsertPopover } from '@/components/pages/admin/newsletter/LinkInsertPopover';
import { isArticleHtmlContent } from '@pms/site-content/article-markdown';
import { uploadMediaFile } from '@/lib/cms/media-api';
import {
  buildCenterHtml,
  buildFigureHtml,
  buildInlineImageHtml,
  normalizeArticleContent,
  PROSE_EDITOR_CLASS,
  sanitizeEditorHtml,
} from '@/lib/article-editor-html';
import { cn } from '@/lib/utils';

export type MarkdownContentEditorHandle = {
  insertSnippet: (text: string) => void;
  focus: () => void;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
};

type LinkPopupState = {
  position: { top: number; left: number };
  url: string;
  savedRange: Range | null;
};

const HEADING_LEVELS = [
  { level: 1, label: 'H1', tag: 'h1' },
  { level: 2, label: 'H2', tag: 'h2' },
  { level: 3, label: 'H3', tag: 'h3' },
  { level: 4, label: 'H4', tag: 'h4' },
  { level: 5, label: 'H5', tag: 'h5' },
  { level: 6, label: 'H6', tag: 'h6' },
] as const;

function toolbarMouseDown(event: React.MouseEvent) {
  event.preventDefault();
}

function getSelectionRange(): Range | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
}

function restoreRange(range: Range | null) {
  if (!range) return;
  const selection = window.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
}

function rangeRect(range: Range | null): DOMRect | null {
  if (!range) return null;
  const rects = range.getClientRects();
  if (rects.length > 0) return rects[0] ?? null;
  return range.getBoundingClientRect();
}

function isRangeInsideEditor(range: Range | null, editor: HTMLElement | null): boolean {
  if (!range || !editor) return false;
  return editor.contains(range.commonAncestorContainer);
}

export const MarkdownContentEditor = forwardRef<MarkdownContentEditorHandle, Props>(function MarkdownContentEditor(
  { value, onChange, rows = 18, placeholder, className },
  ref,
) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastEmitted = useRef('');
  const skipSync = useRef(false);
  const savedLinkRange = useRef<Range | null>(null);

  const [blockMode, setBlockMode] = useState<'p' | number>('p');
  const [figureDialogOpen, setFigureDialogOpen] = useState(false);
  const [linkPopup, setLinkPopup] = useState<LinkPopupState | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const minHeight = `${Math.max(rows * 1.5, 16)}rem`;

  const emitChange = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const next = sanitizeEditorHtml(el.innerHTML);
    skipSync.current = true;
    lastEmitted.current = next;
    onChange(next);
  }, [onChange]);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (skipSync.current) {
      skipSync.current = false;
      return;
    }
    if (value === lastEmitted.current) return;
    el.innerHTML = normalizeArticleContent(value);
    lastEmitted.current = value;
  }, [value]);

  useEffect(() => {
    const el = editorRef.current;
    if (!el || value.trim()) return;
    if (!el.innerHTML.trim()) el.innerHTML = '<p><br></p>';
  }, [value]);

  // Migrate legacy markdown to HTML on first load.
  useEffect(() => {
    if (!value.trim()) return;
    if (isArticleHtmlContent(value)) return;
    const html = normalizeArticleContent(value);
    skipSync.current = true;
    lastEmitted.current = html;
    onChange(html);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-time migration
  }, []);

  const focusEditor = useCallback(() => {
    editorRef.current?.focus();
  }, []);

  const runCommand = useCallback(
    (command: string, commandValue?: string) => {
      focusEditor();
      document.execCommand(command, false, commandValue);
      emitChange();
    },
    [emitChange, focusEditor],
  );

  const insertHtmlAtCursor = useCallback(
    (html: string) => {
      focusEditor();
      document.execCommand('insertHTML', false, html);
      emitChange();
    },
    [emitChange, focusEditor],
  );

  useImperativeHandle(
    ref,
    () => ({
      insertSnippet: (text: string) => {
        const html = normalizeArticleContent(text);
        insertHtmlAtCursor(html);
      },
      focus: focusEditor,
    }),
    [focusEditor, insertHtmlAtCursor],
  );

  const applyHeading = (level: number, tag: string) => {
    setBlockMode(level);
    runCommand('formatBlock', tag);
  };

  const applyParagraph = () => {
    setBlockMode('p');
    runCommand('formatBlock', 'p');
  };

  const openLinkPopup = () => {
    const range = getSelectionRange();
    const editor = editorRef.current;
    if (!isRangeInsideEditor(range, editor)) {
      focusEditor();
    }
    const activeRange = getSelectionRange();
    if (!isRangeInsideEditor(activeRange, editor)) return;

    savedLinkRange.current = activeRange?.cloneRange() ?? null;
    const rect = rangeRect(activeRange);
    if (!rect) return;

    let existingUrl = 'https://';
    const anchor =
      activeRange?.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        ? (activeRange.commonAncestorContainer as HTMLElement).closest('a')
        : (activeRange?.commonAncestorContainer.parentElement?.closest('a') ?? null);
    if (anchor?.getAttribute('href')) {
      existingUrl = anchor.getAttribute('href') ?? existingUrl;
    }

    const popupWidth = 320;
    const left = Math.min(Math.max(rect.left, 12), window.innerWidth - popupWidth - 12);
    const top = Math.max(rect.top - 120, 12);

    setLinkPopup({
      position: { top, left },
      url: existingUrl,
      savedRange: savedLinkRange.current,
    });
  };

  const closeLinkPopup = useCallback(() => {
    setLinkPopup(null);
    savedLinkRange.current = null;
  }, []);

  useEffect(() => {
    if (!linkPopup) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (target && (target as Element).closest?.('[aria-label="Insert link"]')) return;
      closeLinkPopup();
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [linkPopup, closeLinkPopup]);

  const applyLink = () => {
    const url = linkPopup?.url.trim();
    if (!url) return;
    restoreRange(linkPopup?.savedRange ?? savedLinkRange.current);
    runCommand('createLink', url);
    closeLinkPopup();
  };

  const insertFigure = (desktopUrl: string, mobileUrl: string, alt: string) => {
    insertHtmlAtCursor(buildFigureHtml(desktopUrl, mobileUrl, alt));
  };

  const insertInlineImage = async (file: File) => {
    setUploading(true);
    try {
      const item = await uploadMediaFile(file, { kind: 'image', cmsContext: 'newsletter-body' });
      insertHtmlAtCursor(buildInlineImageHtml(item.url, file.name.replace(/\.[^.]+$/, '')));
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (list.length === 0) return;
    for (const file of list) {
      await insertInlineImage(file);
    }
  };

  const handlePaste = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;
    const imageItems = Array.from(items).filter((item) => item.type.startsWith('image/'));
    if (imageItems.length === 0) return;
    event.preventDefault();
    for (const item of imageItems) {
      const file = item.getAsFile();
      if (file) await insertInlineImage(file);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!(event.metaKey || event.ctrlKey)) return;
    const key = event.key.toLowerCase();
    if (key === 'b') {
      event.preventDefault();
      runCommand('bold');
    } else if (key === 'i') {
      event.preventDefault();
      runCommand('italic');
    } else if (key === 'u') {
      event.preventDefault();
      runCommand('underline');
    } else if (key === 'k') {
      event.preventDefault();
      openLinkPopup();
    }
  };

  const iconBtn =
    'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40';
  const headingBtn = (active: boolean) =>
    cn(
      'inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-1.5 text-xs font-bold transition-colors',
      active ? 'bg-emerald-600 text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    );

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-border bg-card shadow-sm', className)}>
      <div
        className="flex flex-wrap items-center gap-0.5 border-b border-border bg-background px-2 py-2"
        onMouseDown={toolbarMouseDown}
      >
        <button type="button" title="Undo" aria-label="Undo" onClick={() => runCommand('undo')} className={iconBtn}>
          <Undo2 size={15} />
        </button>
        <button type="button" title="Redo" aria-label="Redo" onClick={() => runCommand('redo')} className={iconBtn}>
          <Redo2 size={15} />
        </button>
        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        {HEADING_LEVELS.map((item) => (
          <button
            key={item.label}
            type="button"
            title={item.label}
            onClick={() => applyHeading(item.level, item.tag)}
            className={headingBtn(blockMode === item.level)}
          >
            {item.label}
          </button>
        ))}
        <button type="button" title="Paragraph" onClick={applyParagraph} className={headingBtn(blockMode === 'p')}>
          P
        </button>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        <button type="button" title="Bold (⌘B)" onClick={() => runCommand('bold')} className={iconBtn}>
          <Bold size={15} />
        </button>
        <button type="button" title="Italic (⌘I)" onClick={() => runCommand('italic')} className={iconBtn}>
          <Italic size={15} />
        </button>
        <button type="button" title="Underline (⌘U)" onClick={() => runCommand('underline')} className={iconBtn}>
          <Underline size={15} />
        </button>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        <button type="button" title="Bulleted list" onClick={() => runCommand('insertUnorderedList')} className={iconBtn}>
          <List size={15} />
        </button>
        <button type="button" title="Numbered list" onClick={() => runCommand('insertOrderedList')} className={iconBtn}>
          <ListOrdered size={15} />
        </button>
        <button type="button" title="Blockquote" onClick={() => runCommand('formatBlock', 'blockquote')} className={iconBtn}>
          <Quote size={15} />
        </button>
        <button type="button" title="Horizontal rule" onClick={() => runCommand('insertHorizontalRule')} className={iconBtn}>
          <Minus size={15} />
        </button>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        <button type="button" title="Align left" onClick={() => runCommand('justifyLeft')} className={iconBtn}>
          <AlignLeft size={15} />
        </button>
        <button type="button" title="Align center" onClick={() => runCommand('justifyCenter')} className={iconBtn}>
          <AlignCenter size={15} />
        </button>
        <button type="button" title="Align right" onClick={() => runCommand('justifyRight')} className={iconBtn}>
          <AlignRight size={15} />
        </button>
        <button
          type="button"
          title="Center block"
          onClick={() => insertHtmlAtCursor(buildCenterHtml('<p>Centered text</p>'))}
          className={iconBtn}
        >
          <span className="text-[10px] font-bold">CTR</span>
        </button>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        <button
          type="button"
          title="Insert image"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className={iconBtn}
        >
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />}
        </button>
        <button
          type="button"
          title="Responsive image (desktop + mobile)"
          onClick={() => setFigureDialogOpen(true)}
          className={iconBtn}
        >
          <Monitor size={14} />
          <Smartphone size={12} className="-ml-1" />
        </button>
        <button type="button" title="Link (⌘K)" onClick={openLinkPopup} className={iconBtn}>
          <Link2 size={15} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const files = event.target.files;
            if (files?.length) void handleImageFiles(files);
            event.target.value = '';
          }}
        />
      </div>

      <FeaturedImageUploadDialog
        open={figureDialogOpen}
        onClose={() => setFigureDialogOpen(false)}
        onInsert={insertFigure}
      />

      <LinkInsertPopover
        open={Boolean(linkPopup)}
        position={linkPopup?.position ?? null}
        url={linkPopup?.url ?? ''}
        onUrlChange={(url) => setLinkPopup((prev) => (prev ? { ...prev, url } : prev))}
        onApply={applyLink}
        onCancel={closeLinkPopup}
      />

      <div
        className={cn(
          'relative bg-background px-4 py-4 transition-colors',
          dragOver && 'bg-brand-orange/5 ring-2 ring-inset ring-brand-orange/30',
        )}
        style={{ minHeight }}
        onDragOver={(event) => {
          if (Array.from(event.dataTransfer.types).includes('Files')) {
            event.preventDefault();
            setDragOver(true);
          }
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          if (event.dataTransfer.files?.length) void handleImageFiles(event.dataTransfer.files);
        }}
      >
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline
          aria-label="Article body"
          data-placeholder={placeholder ?? 'Write your article…'}
          onInput={emitChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => {
            if (editorRef.current && !editorRef.current.innerHTML.trim()) {
              editorRef.current.innerHTML = '<p><br></p>';
            }
          }}
          className={cn(
            PROSE_EDITOR_CLASS,
            'min-h-[12rem] w-full outline-none focus:ring-0',
            'empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]',
            '[&_.article-figure-block]:relative [&_.article-figure-block]:cursor-default',
            '[&_.article-figure-block_img]:pointer-events-none',
          )}
        />
        {dragOver ? (
          <div className="pointer-events-none absolute inset-4 flex items-center justify-center rounded-xl border-2 border-dashed border-brand-orange/50 bg-brand-orange/5 text-sm font-semibold text-brand-orange">
            Drop image to insert
          </div>
        ) : null}
      </div>
    </div>
  );
});

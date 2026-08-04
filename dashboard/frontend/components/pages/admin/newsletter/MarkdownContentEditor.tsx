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
  buildFigureHtml,
  buildInlineImageHtml,
  normalizeArticleContent,
  ARTICLE_READING_COLUMN_CLASS,
  PROSE_EDITOR_CLASS,
  sanitizeEditorHtml,
} from '@/lib/article-editor-html';
import { cn } from '@/lib/utils';
import {
  applyEditorBlockFormat,
  applyEditorLink,
  applyEditorList,
  type EditorBlockMode,
  execEditorCommand,
  getActiveBlockTag,
  getSelectionRange,
  insertEditorHorizontalRule,
  isRangeInsideEditor,
  rangeClientRect,
  restoreEditorSelection,
  saveEditorSelection,
} from '@/lib/wysiwyg-selection';

export type MarkdownContentEditorHandle = {
  insertSnippet: (text: string) => void;
  focus: () => void;
};

type Props = {
  id?: string;
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

function toolbarMouseDown(event: React.MouseEvent, editor: HTMLElement | null, onSave: () => void) {
  onSave();
  event.preventDefault();
}

export const MarkdownContentEditor = forwardRef<MarkdownContentEditorHandle, Props>(function MarkdownContentEditor(
  { id, value, onChange, rows = 18, placeholder, className },
  ref,
) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastEmitted = useRef('');
  const skipSync = useRef(false);
  const savedSelectionRef = useRef<Range | null>(null);
  const savedLinkRange = useRef<Range | null>(null);
  const savedInsertRangeRef = useRef<Range | null>(null);

  const persistSelection = useCallback(() => {
    savedSelectionRef.current = saveEditorSelection(editorRef.current);
  }, []);

  const persistInsertPoint = useCallback(() => {
    const saved = saveEditorSelection(editorRef.current);
    if (!saved) return;
    savedSelectionRef.current = saved;
    savedInsertRangeRef.current = saved.cloneRange();
  }, []);

  useEffect(() => {
    const onSelectionChange = () => {
      const saved = saveEditorSelection(editorRef.current);
      if (saved) savedSelectionRef.current = saved;
      const active = getActiveBlockTag(editorRef.current);
      if (active !== null) setBlockMode(active);
    };
    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, []);

  const [blockMode, setBlockMode] = useState<EditorBlockMode>('p');
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
      const el = editorRef.current;
      if (!el) return;
      execEditorCommand(el, command, savedSelectionRef.current, commandValue);
      savedSelectionRef.current = saveEditorSelection(el);
      emitChange();
    },
    [emitChange],
  );

  const insertHtmlAtCursor = useCallback(
    (html: string) => {
      const el = editorRef.current;
      if (!el) return;
      const range = savedInsertRangeRef.current ?? savedSelectionRef.current;
      execEditorCommand(el, 'insertHTML', range, html);
      savedInsertRangeRef.current = null;
      savedSelectionRef.current = saveEditorSelection(el);
      emitChange();
    },
    [emitChange],
  );

  const runFormatBlock = useCallback(
    (tag: string) => {
      const el = editorRef.current;
      if (!el) return;
      applyEditorBlockFormat(el, savedSelectionRef.current, tag);
      savedSelectionRef.current = saveEditorSelection(el);
      const active = getActiveBlockTag(el);
      if (active !== null) setBlockMode(active);
      emitChange();
    },
    [emitChange],
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
    runFormatBlock(tag);
  };

  const runList = useCallback(
    (ordered: boolean) => {
      const el = editorRef.current;
      if (!el) return;
      applyEditorList(el, savedSelectionRef.current, ordered);
      savedSelectionRef.current = saveEditorSelection(el);
      const active = getActiveBlockTag(el);
      if (active !== null) setBlockMode(active);
      emitChange();
    },
    [emitChange],
  );

  const insertHorizontalRule = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    insertEditorHorizontalRule(el, savedSelectionRef.current);
    savedSelectionRef.current = saveEditorSelection(el);
    emitChange();
  }, [emitChange]);

  const applyBlockquote = () => {
    setBlockMode('blockquote');
    runFormatBlock('blockquote');
  };

  const applyParagraph = () => {
    setBlockMode('p');
    runFormatBlock('p');
  };

  const openLinkPopup = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Keep the range saved on toolbar mousedown — re-persisting here often loses the highlight.
    let range = savedSelectionRef.current;
    if (!isRangeInsideEditor(range, editor)) {
      range = getSelectionRange();
    }
    if (!isRangeInsideEditor(range, editor)) {
      restoreEditorSelection(editor, null);
      range = saveEditorSelection(editor);
    }
    if (!isRangeInsideEditor(range, editor)) return;

    savedLinkRange.current = range?.cloneRange() ?? null;
    const rect = rangeClientRect(range);
    if (!rect) return;

    let existingUrl = 'https://';
    const anchor =
      range?.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        ? (range.commonAncestorContainer as HTMLElement).closest('a')
        : (range?.commonAncestorContainer.parentElement?.closest('a') ?? null);
    if (anchor?.getAttribute('href')) {
      existingUrl = anchor.getAttribute('href') ?? existingUrl;
    }

    const popupWidth = 320;
    const popupHeight = 132;
    const gap = 8;
    const viewportPad = 12;
    const left = Math.min(
      Math.max(rect.left + rect.width / 2 - popupWidth / 2, viewportPad),
      window.innerWidth - popupWidth - viewportPad,
    );
    const aboveTop = rect.top - popupHeight - gap;
    const belowTop = rect.bottom + gap;
    const top =
      aboveTop >= viewportPad
        ? aboveTop
        : belowTop + popupHeight <= window.innerHeight - viewportPad
          ? belowTop
          : Math.max(aboveTop, viewportPad);

    setLinkPopup({
      position: { top, left },
      url: existingUrl,
      savedRange: savedLinkRange.current,
    });
  }, []);

  const closeLinkPopup = useCallback(() => {
    setLinkPopup(null);
    savedLinkRange.current = null;
  }, []);

  useEffect(() => {
    if (!linkPopup) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest('[data-link-popover]')) return;
      if (target?.closest('[data-link-toolbar-trigger]')) return;
      closeLinkPopup();
    };
    // Defer so the toolbar click that opened the popover does not immediately dismiss it.
    const attachId = window.setTimeout(() => {
      document.addEventListener('mousedown', onPointerDown);
    }, 0);
    return () => {
      window.clearTimeout(attachId);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [linkPopup, closeLinkPopup]);

  const applyLink = () => {
    const url = linkPopup?.url.trim();
    const el = editorRef.current;
    if (!url || !el) return;
    const range = linkPopup?.savedRange ?? savedLinkRange.current;
    const applied = applyEditorLink(el, range, url);

    if (applied) {
      savedSelectionRef.current = saveEditorSelection(el);
      emitChange();
    }
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
    persistInsertPoint();
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
      persistSelection();
      openLinkPopup();
    }
  };

  const iconBtn = (active = false) =>
    cn(
      'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40',
      active && 'bg-emerald-600 text-white hover:bg-emerald-600 hover:text-white',
    );
  const headingBtn = (active: boolean) =>
    cn(
      'inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-1.5 text-xs font-bold transition-colors',
      active ? 'bg-emerald-600 text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    );

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-border bg-card shadow-sm', className)}>
      <div
        className="flex flex-wrap items-center gap-0.5 border-b border-border bg-background px-2 py-2"
        onMouseDown={(event) => toolbarMouseDown(event, editorRef.current, persistSelection)}
      >
        <button type="button" title="Undo" aria-label="Undo" onClick={() => runCommand('undo')} className={iconBtn()}>
          <Undo2 size={15} />
        </button>
        <button type="button" title="Redo" aria-label="Redo" onClick={() => runCommand('redo')} className={iconBtn()}>
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

        <button type="button" title="Bold (⌘B)" onClick={() => runCommand('bold')} className={iconBtn()}>
          <Bold size={15} />
        </button>
        <button type="button" title="Italic (⌘I)" onClick={() => runCommand('italic')} className={iconBtn()}>
          <Italic size={15} />
        </button>
        <button type="button" title="Underline (⌘U)" onClick={() => runCommand('underline')} className={iconBtn()}>
          <Underline size={15} />
        </button>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        <button type="button" title="Bulleted list" onClick={() => runList(false)} className={iconBtn(blockMode === 'ul')}>
          <List size={15} />
        </button>
        <button type="button" title="Numbered list" onClick={() => runList(true)} className={iconBtn(blockMode === 'ol')}>
          <ListOrdered size={15} />
        </button>
        <button type="button" title="Blockquote" onClick={applyBlockquote} className={iconBtn(blockMode === 'blockquote')}>
          <Quote size={15} />
        </button>
        <button type="button" title="Horizontal rule" onClick={insertHorizontalRule} className={iconBtn()}>
          <Minus size={15} />
        </button>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        <button type="button" title="Align left" onClick={() => runCommand('justifyLeft')} className={iconBtn()}>
          <AlignLeft size={15} />
        </button>
        <button type="button" title="Align center" onClick={() => runCommand('justifyCenter')} className={iconBtn()}>
          <AlignCenter size={15} />
        </button>
        <button type="button" title="Align right" onClick={() => runCommand('justifyRight')} className={iconBtn()}>
          <AlignRight size={15} />
        </button>
        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        <button
          type="button"
          title="Insert image"
          disabled={uploading}
          data-image-toolbar-trigger
          onMouseDown={(event) => {
            event.preventDefault();
            persistInsertPoint();
          }}
          onClick={() => {
            persistInsertPoint();
            fileInputRef.current?.click();
          }}
          className={iconBtn()}
        >
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />}
        </button>
        <button
          type="button"
          title="Responsive image (desktop + mobile)"
          data-image-toolbar-trigger
          onMouseDown={(event) => {
            event.preventDefault();
            persistInsertPoint();
          }}
          onClick={() => {
            persistInsertPoint();
            setFigureDialogOpen(true);
          }}
          className={iconBtn()}
        >
          <Monitor size={14} />
          <Smartphone size={12} className="-ml-1" />
        </button>
        <button
          type="button"
          title="Link (⌘K)"
          data-link-toolbar-trigger
          onMouseDown={(event) => {
            event.preventDefault();
            persistSelection();
          }}
          onClick={() => openLinkPopup()}
          className={iconBtn()}
        >
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
        <div className={ARTICLE_READING_COLUMN_CLASS}>
          <div
            id={id}
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-multiline
            aria-label={id ? undefined : 'Article body'}
            data-placeholder={placeholder ?? 'Write your article…'}
            onInput={emitChange}
            onKeyUp={persistSelection}
            onMouseUp={persistSelection}
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
        </div>
        {dragOver ? (
          <div className="pointer-events-none absolute inset-4 flex items-center justify-center rounded-xl border-2 border-dashed border-brand-orange/50 bg-brand-orange/5 text-sm font-semibold text-brand-orange">
            Drop image to insert
          </div>
        ) : null}
      </div>
    </div>
  );
});

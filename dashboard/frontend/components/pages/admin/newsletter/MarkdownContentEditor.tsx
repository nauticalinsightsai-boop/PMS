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
  Bold,
  Code,
  ImagePlus,
  Images,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Table,
  Underline,
  Undo2,
  X,
} from 'lucide-react';
import { buildCenterBlock, buildFigureBlock, buildQuoteBlock } from '@pms/site-content/article-markdown';
import { FigureImagePicker } from '@/components/pages/admin/newsletter/FigureImagePicker';
import { MediaLibraryGrid } from '@/components/pages/admin/site-content/MediaLibraryGrid';
import { cn } from '@/lib/utils';

type Selection = { start: number; end: number };

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

const HEADING_LEVELS = [
  { level: 1, label: 'H1', prefix: '# ' },
  { level: 2, label: 'H2', prefix: '## ' },
  { level: 3, label: 'H3', prefix: '### ' },
  { level: 4, label: 'H4', prefix: '#### ' },
  { level: 5, label: 'H5', prefix: '##### ' },
  { level: 6, label: 'H6', prefix: '###### ' },
] as const;

export const MarkdownContentEditor = forwardRef<MarkdownContentEditorHandle, Props>(function MarkdownContentEditor(
  { value, onChange, rows = 18, placeholder, className },
  ref,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingSelection = useRef<Selection | null>(null);
  const historyRef = useRef<string[]>([value]);
  const historyIndexRef = useRef(0);
  const skipHistoryRef = useRef(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [blockMode, setBlockMode] = useState<'p' | number>('p');

  useEffect(() => {
    if (!pendingSelection.current || !textareaRef.current) return;
    const { start, end } = pendingSelection.current;
    pendingSelection.current = null;
    const el = textareaRef.current;
    el.focus();
    el.setSelectionRange(start, end);
  }, [value]);

  const pushHistory = useCallback(
    (next: string) => {
      if (skipHistoryRef.current) {
        skipHistoryRef.current = false;
        return;
      }
      const stack = historyRef.current.slice(0, historyIndexRef.current + 1);
      stack.push(next);
      if (stack.length > 50) stack.shift();
      historyRef.current = stack;
      historyIndexRef.current = stack.length - 1;
    },
    [],
  );

  const getSelection = useCallback((): Selection => {
    const el = textareaRef.current;
    if (!el) return { start: value.length, end: value.length };
    return { start: el.selectionStart, end: el.selectionEnd };
  }, [value.length]);

  const commit = useCallback(
    (next: string, selection: Selection) => {
      pendingSelection.current = selection;
      pushHistory(next);
      onChange(next);
    },
    [onChange, pushHistory],
  );

  const undo = () => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    skipHistoryRef.current = true;
    onChange(historyRef.current[historyIndexRef.current] ?? '');
  };

  const redo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    skipHistoryRef.current = true;
    onChange(historyRef.current[historyIndexRef.current] ?? '');
  };

  const insertAtCursor = useCallback(
    (snippet: string) => {
      const { start, end } = getSelection();
      const before = value.slice(0, start);
      const after = value.slice(end);
      const trimmedSnippet = snippet.trim();
      const needsGapBefore = before.length > 0 && !before.endsWith('\n\n');
      const needsGapAfter = after.length > 0 && !after.startsWith('\n');
      const block =
        (needsGapBefore ? '\n\n' : '') + trimmedSnippet + (needsGapAfter ? '\n\n' : '');
      const next = before + block + after;
      const caret = before.length + block.length;
      commit(next, { start: caret, end: caret });
    },
    [commit, getSelection, value],
  );

  useImperativeHandle(
    ref,
    () => ({
      insertSnippet: (text: string) => insertAtCursor(text.trimStart()),
      focus: () => textareaRef.current?.focus(),
    }),
    [insertAtCursor],
  );

  const wrapInline = (marker: string, placeholderText: string, endMarker = marker) => {
    const { start, end } = getSelection();
    const selected = value.slice(start, end) || placeholderText;
    const next = value.slice(0, start) + marker + selected + endMarker + value.slice(end);
    const cursorStart = start + marker.length;
    commit(next, { start: cursorStart, end: cursorStart + selected.length });
  };

  const prefixLines = (prefix: string, options?: { stripHeading?: boolean }) => {
    const { start, end } = getSelection();
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', end);
    const blockEnd = lineEnd === -1 ? value.length : lineEnd;
    const block = value.slice(lineStart, blockEnd);
    const lines = block.split('\n');
    const transformed = lines
      .map((line) => {
        let base = line;
        if (options?.stripHeading) base = base.replace(/^#{1,6}\s+/, '');
        base = base.replace(/^>\s+/, '');
        return `${prefix}${base}`;
      })
      .join('\n');
    const next = value.slice(0, lineStart) + transformed + value.slice(blockEnd);
    commit(next, { start: lineStart, end: lineStart + transformed.length });
  };

  const applyHeading = (level: number) => {
    setBlockMode(level);
    prefixLines(`${'#'.repeat(level)} `, { stripHeading: true });
  };

  const applyParagraph = () => {
    setBlockMode('p');
    prefixLines('', { stripHeading: true });
  };

  const insertLink = () => {
    const { start, end } = getSelection();
    const selected = value.slice(start, end) || 'link text';
    const snippet = `[${selected}](https://)`;
    const next = value.slice(0, start) + snippet + value.slice(end);
    const urlStart = start + selected.length + 3;
    commit(next, { start: urlStart, end: urlStart + 8 });
  };

  const insertTable = () => {
    insertAtCursor(
      '| Column 1 | Column 2 |\n| --- | --- |\n| Cell | Cell |',
    );
  };

  const insertFigure = (desktop: string, mobile: string, alt: string) => {
    insertAtCursor(buildFigureBlock(desktop, mobile, alt).trim());
  };

  const iconBtn =
    'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';
  const headingBtn = (active: boolean) =>
    cn(
      'inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-1.5 text-xs font-bold transition-colors',
      active ? 'bg-emerald-600 text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    );

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-border bg-card shadow-sm', className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-background px-2 py-2">
        <button type="button" title="Undo" aria-label="Undo" onClick={undo} className={iconBtn}>
          <Undo2 size={15} />
        </button>
        <button type="button" title="Redo" aria-label="Redo" onClick={redo} className={iconBtn}>
          <Redo2 size={15} />
        </button>
        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        {HEADING_LEVELS.map((item) => (
          <button
            key={item.label}
            type="button"
            title={item.label}
            onClick={() => applyHeading(item.level)}
            className={headingBtn(blockMode === item.level)}
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          title="Paragraph"
          onClick={applyParagraph}
          className={headingBtn(blockMode === 'p')}
        >
          P
        </button>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        <button type="button" title="Bold" onClick={() => wrapInline('**', 'bold')} className={iconBtn}>
          <Bold size={15} />
        </button>
        <button type="button" title="Italic" onClick={() => wrapInline('*', 'italic')} className={iconBtn}>
          <Italic size={15} />
        </button>
        <button type="button" title="Underline" onClick={() => wrapInline('<u>', 'text', '</u>')} className={iconBtn}>
          <Underline size={15} />
        </button>
        <button type="button" title="Strikethrough" onClick={() => wrapInline('~~', 'text')} className={iconBtn}>
          <Strikethrough size={15} />
        </button>
        <button type="button" title="Code" onClick={() => wrapInline('`', 'code')} className={iconBtn}>
          <Code size={15} />
        </button>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        <button type="button" title="Bulleted list" onClick={() => prefixLines('- ', { stripHeading: true })} className={iconBtn}>
          <List size={15} />
        </button>
        <button type="button" title="Numbered list" onClick={() => prefixLines('1. ', { stripHeading: true })} className={iconBtn}>
          <ListOrdered size={15} />
        </button>
        <button type="button" title="Quote" onClick={() => insertAtCursor(buildQuoteBlock('Quote text').trim())} className={iconBtn}>
          <Quote size={15} />
        </button>
        <button type="button" title="Divider" onClick={() => insertAtCursor('\n---\n')} className={iconBtn}>
          <Minus size={15} />
        </button>
        <button type="button" title="Center" onClick={() => insertAtCursor(buildCenterBlock('Centered text').trim())} className={iconBtn}>
          <AlignCenter size={15} />
        </button>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        <button
          type="button"
          title="Insert image"
          onClick={() => setImageDialogOpen((v) => !v)}
          className={cn(iconBtn, imageDialogOpen && 'bg-muted text-foreground')}
        >
          <ImagePlus size={15} />
        </button>
        <button type="button" title="Media library" onClick={() => setLibraryOpen(true)} className={iconBtn}>
          <Images size={15} />
        </button>
        <button type="button" title="Link" onClick={insertLink} className={iconBtn}>
          <Link2 size={15} />
        </button>
        <button type="button" title="Table" onClick={insertTable} className={iconBtn}>
          <Table size={15} />
        </button>
      </div>

      <FigureImagePicker
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        onInsert={insertFigure}
      />

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          pushHistory(e.target.value);
          onChange(e.target.value);
        }}
        rows={rows}
        placeholder={placeholder}
        className="block w-full resize-y border-0 bg-background px-4 py-4 text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
        style={{ minHeight: '22rem' }}
      />

      {libraryOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="font-bold">Insert from media library</h3>
              <button type="button" onClick={() => setLibraryOpen(false)} className="rounded-lg p-2 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              <MediaLibraryGrid
                compact
                onSelect={(url) => {
                  insertFigure(url, url, 'Article image');
                  setLibraryOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
});

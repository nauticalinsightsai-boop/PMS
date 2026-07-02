'use client';

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AlignCenter,
  Bold,
  Code,
  Eye,
  FileCode,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Monitor,
  Quote,
  Redo2,
  Smartphone,
  Strikethrough,
  Table,
  Underline,
  Undo2,
} from 'lucide-react';
import {
  type ArticleSegment,
  buildCenterBlock,
  buildFigureBlock,
  buildQuoteBlock,
  parseArticleSegments,
  reassembleArticleMarkdown,
} from '@pms/site-content/article-markdown';
import { FeaturedImageUploadDialog } from '@/components/pages/admin/newsletter/FeaturedImageUploader';
import { htmlToMarkdown, markdownToHtml, PROSE_EDITOR_CLASS } from '@/lib/article-editor-html';
import { cn } from '@/lib/utils';

type Selection = { start: number; end: number };
type EditorMode = 'visual' | 'source';

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

function VisualEditableBlock({
  markdown,
  onChange,
  onFocus,
  centered,
  placeholder,
}: {
  markdown: string;
  onChange: (markdown: string) => void;
  onFocus: (el: HTMLElement) => void;
  centered?: boolean;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const skipSync = useRef(false);
  const lastEmitted = useRef(markdown);

  useEffect(() => {
    if (!ref.current) return;
    if (skipSync.current) {
      skipSync.current = false;
      return;
    }
    if (markdown === lastEmitted.current) return;
    ref.current.innerHTML = markdownToHtml(markdown);
    lastEmitted.current = markdown;
  }, [markdown]);

  useEffect(() => {
    if (!ref.current || markdown) return;
    ref.current.innerHTML = '<p><br></p>';
  }, [markdown]);

  const handleInput = () => {
    if (!ref.current) return;
    const next = htmlToMarkdown(ref.current.innerHTML);
    skipSync.current = true;
    lastEmitted.current = next;
    onChange(next);
  };

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline
      data-placeholder={placeholder}
      onFocus={() => ref.current && onFocus(ref.current)}
      onInput={handleInput}
      className={cn(
        PROSE_EDITOR_CLASS,
        'min-h-[3rem] w-full rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-brand-orange/25',
        centered && 'text-center [&_p]:text-center',
        'empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]',
      )}
    />
  );
}

function FigureBlockCard({
  segment,
  onUpdate,
  onRemove,
}: {
  segment: Extract<ArticleSegment, { type: 'figure' }>;
  onUpdate: (patch: Partial<Extract<ArticleSegment, { type: 'figure' }>>) => void;
  onRemove: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const mobileSrc = segment.mobile.trim() || segment.desktop;

  return (
    <div className="rounded-xl border border-dashed border-brand-orange/40 bg-muted/20 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-bold text-foreground">
          In-article image{segment.alt ? ` — ${segment.alt}` : ''}
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-md border border-border px-2 py-1 text-[11px] font-semibold hover:bg-muted"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-md border border-destructive/40 px-2 py-1 text-[11px] font-semibold text-destructive hover:bg-destructive/10"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <Monitor size={12} /> Desktop
          </p>
          <div className="aspect-[16/10] overflow-hidden rounded-lg border border-border bg-black/5">
            <img src={segment.desktop} alt={segment.alt || 'Desktop'} className="h-full w-full object-cover" />
          </div>
        </div>
        <div>
          <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <Smartphone size={12} /> Mobile
          </p>
          <div className="aspect-[16/10] overflow-hidden rounded-lg border border-border bg-black/5">
            <img src={mobileSrc} alt={segment.alt || 'Mobile'} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <FeaturedImageUploadDialog
        open={editing}
        onClose={() => setEditing(false)}
        onInsert={(desktop, mobile, alt) => {
          onUpdate({ desktop, mobile, alt });
          setEditing(false);
        }}
      />
    </div>
  );
}

export const MarkdownContentEditor = forwardRef<MarkdownContentEditorHandle, Props>(function MarkdownContentEditor(
  { value, onChange, rows = 18, placeholder, className },
  ref,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeBlockRef = useRef<HTMLElement | null>(null);
  const selectionRef = useRef<Selection>({ start: 0, end: 0 });
  const pendingSelection = useRef<Selection | null>(null);
  const historyRef = useRef<string[]>([value]);
  const historyIndexRef = useRef(0);
  const skipHistoryRef = useRef(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [blockMode, setBlockMode] = useState<'p' | number>('p');
  const [editorMode, setEditorMode] = useState<EditorMode>('visual');

  const segments = useMemo(() => {
    const parsed = parseArticleSegments(value);
    return parsed.length > 0 ? parsed : [{ type: 'markdown' as const, content: '' }];
  }, [value]);

  const rememberSelection = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    selectionRef.current = { start: el.selectionStart, end: el.selectionEnd };
  }, []);

  useEffect(() => {
    if (!pendingSelection.current || !textareaRef.current) return;
    const { start, end } = pendingSelection.current;
    pendingSelection.current = null;
    const el = textareaRef.current;
    el.focus();
    el.setSelectionRange(start, end);
    selectionRef.current = { start, end };
  }, [value]);

  useEffect(() => {
    if (value === historyRef.current[historyIndexRef.current]) return;
    historyRef.current = [value];
    historyIndexRef.current = 0;
  }, [value]);

  const pushHistory = useCallback((next: string) => {
    if (skipHistoryRef.current) {
      skipHistoryRef.current = false;
      return;
    }
    const stack = historyRef.current.slice(0, historyIndexRef.current + 1);
    stack.push(next);
    if (stack.length > 50) stack.shift();
    historyRef.current = stack;
    historyIndexRef.current = stack.length - 1;
  }, []);

  const getSelection = useCallback((): Selection => {
    const el = textareaRef.current;
    if (el && document.activeElement === el) {
      return { start: el.selectionStart, end: el.selectionEnd };
    }
    return selectionRef.current;
  }, []);

  const commit = useCallback(
    (next: string, selection: Selection) => {
      pendingSelection.current = selection;
      selectionRef.current = selection;
      pushHistory(next);
      onChange(next);
    },
    [onChange, pushHistory],
  );

  const undo = () => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    skipHistoryRef.current = true;
    const next = historyRef.current[historyIndexRef.current] ?? '';
    selectionRef.current = { start: next.length, end: next.length };
    onChange(next);
  };

  const redo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    skipHistoryRef.current = true;
    const next = historyRef.current[historyIndexRef.current] ?? '';
    selectionRef.current = { start: next.length, end: next.length };
    onChange(next);
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
      focus: () => {
        if (editorMode === 'source') textareaRef.current?.focus();
        else activeBlockRef.current?.focus();
      },
    }),
    [editorMode, insertAtCursor],
  );

  const updateSegments = useCallback(
    (nextSegments: ArticleSegment[]) => {
      const normalized =
        nextSegments.length === 1 &&
        nextSegments[0]?.type === 'markdown' &&
        !nextSegments[0].content.trim()
          ? ''
          : reassembleArticleMarkdown(nextSegments);
      commit(normalized, { start: normalized.length, end: normalized.length });
    },
    [commit],
  );

  const updateSegmentAt = useCallback(
    (index: number, segment: ArticleSegment) => {
      const next = segments.map((item, i) => (i === index ? segment : item));
      updateSegments(next);
    },
    [segments, updateSegments],
  );

  const removeSegmentAt = useCallback(
    (index: number) => {
      const next = segments.filter((_, i) => i !== index);
      updateSegments(next.length > 0 ? next : [{ type: 'markdown', content: '' }]);
    },
    [segments, updateSegments],
  );

  const runVisualCommand = useCallback((command: string, commandValue?: string) => {
    const el = activeBlockRef.current;
    if (!el) return;
    el.focus();
    document.execCommand(command, false, commandValue);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, []);

  const wrapInline = (marker: string, placeholderText: string, endMarker = marker) => {
    if (editorMode === 'visual') {
      if (marker === '**') runVisualCommand('bold');
      else if (marker === '*') runVisualCommand('italic');
      else if (marker === '<u>') runVisualCommand('underline');
      else if (marker === '~~') runVisualCommand('strikeThrough');
      else if (marker === '`') runVisualCommand('insertHTML', `<code>${placeholderText}</code>`);
      return;
    }
    const { start, end } = getSelection();
    const selected = value.slice(start, end) || placeholderText;
    const next = value.slice(0, start) + marker + selected + endMarker + value.slice(end);
    const cursorStart = start + marker.length;
    commit(next, { start: cursorStart, end: cursorStart + selected.length });
  };

  const prefixLines = (prefix: string, options?: { stripHeading?: boolean }) => {
    if (editorMode === 'visual') {
      if (prefix === '- ') runVisualCommand('insertUnorderedList');
      else if (prefix === '1. ') runVisualCommand('insertOrderedList');
      return;
    }
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
        base = base.replace(/^(-|\d+\.)\s+/, '');
        return prefix ? `${prefix}${base}` : base;
      })
      .join('\n');
    const next = value.slice(0, lineStart) + transformed + value.slice(blockEnd);
    commit(next, { start: lineStart, end: lineStart + transformed.length });
  };

  const applyHeading = (level: number, tag: string) => {
    setBlockMode(level);
    if (editorMode === 'visual') {
      runVisualCommand('formatBlock', tag);
      return;
    }
    prefixLines(`${'#'.repeat(level)} `, { stripHeading: true });
    textareaRef.current?.focus();
  };

  const applyParagraph = () => {
    setBlockMode('p');
    if (editorMode === 'visual') {
      runVisualCommand('formatBlock', 'p');
      return;
    }
    prefixLines('', { stripHeading: true });
    textareaRef.current?.focus();
  };

  const insertLink = () => {
    if (editorMode === 'visual') {
      const url = window.prompt('Link URL', 'https://');
      if (!url) return;
      runVisualCommand('createLink', url);
      return;
    }
    const { start, end } = getSelection();
    const selected = value.slice(start, end) || 'link text';
    const snippet = `[${selected}](https://)`;
    const next = value.slice(0, start) + snippet + value.slice(end);
    const urlStart = start + selected.length + 3;
    commit(next, { start: urlStart, end: urlStart + 8 });
  };

  const insertTable = () => {
    insertAtCursor('| Column 1 | Column 2 |\n| --- | --- |\n| Cell | Cell |');
  };

  const insertFigure = (desktopUrl: string, mobileUrl: string, alt: string) => {
    insertAtCursor(buildFigureBlock(desktopUrl, mobileUrl, alt).trim());
  };

  const insertQuote = () => {
    if (editorMode === 'visual') {
      runVisualCommand('formatBlock', 'blockquote');
      return;
    }
    insertAtCursor(buildQuoteBlock('Quote text').trim());
  };

  const insertDivider = () => {
    if (editorMode === 'visual') {
      runVisualCommand('insertHorizontalRule');
      return;
    }
    insertAtCursor('\n---\n');
  };

  const insertCenterBlock = () => {
    insertAtCursor(buildCenterBlock('Centered text').trim());
  };

  const iconBtn =
    'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';
  const headingBtn = (active: boolean) =>
    cn(
      'inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-1.5 text-xs font-bold transition-colors',
      active ? 'bg-emerald-600 text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    );
  const modeBtn = (active: boolean) =>
    cn(
      'inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-semibold transition-colors',
      active ? 'bg-brand-orange text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    );

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-border bg-card shadow-sm', className)}>
      <div
        className="flex flex-wrap items-center gap-0.5 border-b border-border bg-background px-2 py-2"
        onMouseDown={toolbarMouseDown}
      >
        <button type="button" title="Visual editor" onClick={() => setEditorMode('visual')} className={modeBtn(editorMode === 'visual')}>
          <Eye size={14} />
          Visual
        </button>
        <button type="button" title="Markdown source" onClick={() => setEditorMode('source')} className={modeBtn(editorMode === 'source')}>
          <FileCode size={14} />
          Source
        </button>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

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
        <button type="button" title="Quote" onClick={insertQuote} className={iconBtn}>
          <Quote size={15} />
        </button>
        <button type="button" title="Divider" onClick={insertDivider} className={iconBtn}>
          <Minus size={15} />
        </button>
        <button type="button" title="Center block" onClick={insertCenterBlock} className={iconBtn}>
          <AlignCenter size={15} />
        </button>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        <button type="button" title="Insert image" onClick={() => setImageDialogOpen(true)} className={iconBtn}>
          <ImagePlus size={15} />
        </button>
        <button type="button" title="Link" onClick={insertLink} className={iconBtn}>
          <Link2 size={15} />
        </button>
        <button type="button" title="Table" onClick={insertTable} className={iconBtn}>
          <Table size={15} />
        </button>
      </div>

      <FeaturedImageUploadDialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        onInsert={insertFigure}
      />

      {editorMode === 'visual' ? (
        <div className="min-h-[16rem] space-y-4 bg-background px-4 py-4" style={{ minHeight: '16rem' }}>
          {segments.map((segment, index) => {
            if (segment.type === 'markdown') {
              return (
                <VisualEditableBlock
                  key={`md-${index}-${segment.content.slice(0, 24)}`}
                  markdown={segment.content}
                  placeholder={placeholder ?? 'Write your article…'}
                  onFocus={(el) => {
                    activeBlockRef.current = el;
                  }}
                  onChange={(content) => updateSegmentAt(index, { type: 'markdown', content })}
                />
              );
            }
            if (segment.type === 'center') {
              return (
                <div key={`center-${index}`} className="rounded-lg border border-border/60 bg-muted/10 px-2 py-1">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Centered</p>
                  <VisualEditableBlock
                    markdown={segment.content}
                    centered
                    onFocus={(el) => {
                      activeBlockRef.current = el;
                    }}
                    onChange={(content) => updateSegmentAt(index, { type: 'center', content })}
                  />
                </div>
              );
            }
            return (
              <FigureBlockCard
                key={`fig-${index}-${segment.desktop}`}
                segment={segment}
                onUpdate={(patch) => updateSegmentAt(index, { ...segment, ...patch })}
                onRemove={() => removeSegmentAt(index)}
              />
            );
          })}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onSelect={rememberSelection}
          onKeyUp={rememberSelection}
          onMouseUp={rememberSelection}
          onClick={rememberSelection}
          onChange={(e) => {
            rememberSelection();
            pushHistory(e.target.value);
            onChange(e.target.value);
          }}
          rows={rows}
          placeholder={placeholder}
          className="block w-full resize-y border-0 bg-background px-4 py-4 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
          style={{ minHeight: '16rem' }}
        />
      )}
    </div>
  );
});

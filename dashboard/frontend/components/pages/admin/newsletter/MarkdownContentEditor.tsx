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
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
  X,
} from 'lucide-react';
import { buildCenterBlock, buildFigureBlock, buildQuoteBlock } from '@pms/site-content/article-markdown';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

const toolbarBtn =
  'inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-md px-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors';
const divider = 'mx-1 h-5 w-px self-center bg-white/10';

function InlineImageDialog({
  open,
  onClose,
  onInsert,
}: {
  open: boolean;
  onClose: () => void;
  onInsert: (desktop: string, mobile: string, alt: string) => void;
}) {
  const [desktop, setDesktop] = useState('');
  const [mobile, setMobile] = useState('');
  const [alt, setAlt] = useState('');

  if (!open) return null;

  const previewDesktop = desktop.trim();
  const previewMobile = mobile.trim() || previewDesktop;

  return (
    <div className="border-b border-white/10 bg-slate-950/95 px-2.5 py-2">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold text-muted-foreground">Insert image (desktop + mobile)</p>
        <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
          <X size={13} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={desktop}
          onChange={(e) => setDesktop(e.target.value)}
          placeholder="Desktop URL"
          className="h-8 min-w-0 flex-1 text-xs"
        />
        <Input
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Mobile URL (optional)"
          className="h-8 min-w-0 flex-1 text-xs"
        />
        <Input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Caption"
          className="h-8 w-28 shrink-0 text-xs"
        />

        <div className="flex shrink-0 items-center gap-1.5">
          <div
            className="h-10 w-16 overflow-hidden rounded border border-dashed border-white/20 bg-muted/20"
            title="Desktop 16:10"
          >
            {previewDesktop ? (
              <img src={previewDesktop} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-[9px] text-muted-foreground">16:10</div>
            )}
          </div>
          <div
            className="h-10 w-6 overflow-hidden rounded border border-dashed border-white/20 bg-muted/20"
            title="Mobile 9:16"
          >
            {previewMobile ? (
              <img src={previewMobile} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-[8px] text-muted-foreground">9:16</div>
            )}
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="brand"
          className="h-8 shrink-0 px-3 text-xs"
          disabled={!previewDesktop}
          onClick={() => {
            onInsert(previewDesktop, previewMobile || previewDesktop, alt.trim() || 'Article image');
            setDesktop('');
            setMobile('');
            setAlt('');
            onClose();
          }}
        >
          Insert
        </Button>
      </div>
    </div>
  );
}

export const MarkdownContentEditor = forwardRef<MarkdownContentEditorHandle, Props>(function MarkdownContentEditor(
  { value, onChange, rows = 18, placeholder, className },
  ref,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingSelection = useRef<Selection | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  useEffect(() => {
    if (!pendingSelection.current || !textareaRef.current) return;
    const { start, end } = pendingSelection.current;
    pendingSelection.current = null;
    const el = textareaRef.current;
    el.focus();
    el.setSelectionRange(start, end);
  }, [value]);

  const getSelection = useCallback((): Selection => {
    const el = textareaRef.current;
    if (!el) return { start: value.length, end: value.length };
    return { start: el.selectionStart, end: el.selectionEnd };
  }, [value.length]);

  const commit = useCallback(
    (next: string, selection: Selection) => {
      pendingSelection.current = selection;
      onChange(next);
    },
    [onChange],
  );

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
      requestAnimationFrame(() => textareaRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
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

  const prefixLines = (
    makePrefix: (lineIndex: number) => string,
    options?: { stripHeading?: boolean },
  ) => {
    const { start, end } = getSelection();
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', end);
    const blockEnd = lineEnd === -1 ? value.length : lineEnd;
    const block = value.slice(lineStart, blockEnd);
    const lines = block.split('\n');
    const transformed = lines
      .map((line, i) => {
        let base = line;
        if (options?.stripHeading) base = base.replace(/^#{1,6}\s+/, '');
        base = base.replace(/^>\s+/, '');
        return `${makePrefix(i)}${base}`;
      })
      .join('\n');
    const next = value.slice(0, lineStart) + transformed + value.slice(blockEnd);
    commit(next, { start: lineStart, end: lineStart + transformed.length });
  };

  const insertLink = () => {
    const { start, end } = getSelection();
    const selected = value.slice(start, end) || 'link text';
    const snippet = `[${selected}](https://)`;
    const next = value.slice(0, start) + snippet + value.slice(end);
    const urlStart = start + selected.length + 3;
    commit(next, { start: urlStart, end: urlStart + 8 });
  };

  const insertDivider = () => insertAtCursor('\n---\n');

  const insertQuote = () => {
    const { start, end } = getSelection();
    const selected = value.slice(start, end) || 'Pull quote text goes here.';
    insertAtCursor(buildQuoteBlock(selected).trim());
  };

  const insertCenter = () => {
    const { start, end } = getSelection();
    const selected = value.slice(start, end) || 'Centered text';
    insertAtCursor(buildCenterBlock(selected).trim());
  };

  const insertFigure = (desktop: string, mobile: string, alt: string) => {
    insertAtCursor(buildFigureBlock(desktop, mobile, alt).trim());
  };

  const tools: Array<
    | { kind: 'divider' }
    | { kind: 'btn'; label: string; icon: React.ReactNode; onClick: () => void }
  > = [
    { kind: 'btn', label: 'Bold', icon: <Bold size={15} />, onClick: () => wrapInline('**', 'bold text') },
    { kind: 'btn', label: 'Italic', icon: <Italic size={15} />, onClick: () => wrapInline('*', 'italic text') },
    { kind: 'btn', label: 'Strikethrough', icon: <Strikethrough size={15} />, onClick: () => wrapInline('~~', 'struck text') },
    { kind: 'btn', label: 'Inline code', icon: <Code size={15} />, onClick: () => wrapInline('`', 'code') },
    { kind: 'divider' },
    { kind: 'btn', label: 'Heading 1', icon: <Heading1 size={16} />, onClick: () => prefixLines(() => '# ', { stripHeading: true }) },
    { kind: 'btn', label: 'Heading 2', icon: <Heading2 size={16} />, onClick: () => prefixLines(() => '## ', { stripHeading: true }) },
    { kind: 'btn', label: 'Heading 3', icon: <Heading3 size={16} />, onClick: () => prefixLines(() => '### ', { stripHeading: true }) },
    { kind: 'divider' },
    { kind: 'btn', label: 'Quote', icon: <Quote size={15} />, onClick: insertQuote },
    { kind: 'btn', label: 'Bulleted list', icon: <List size={15} />, onClick: () => prefixLines(() => '- ', { stripHeading: true }) },
    { kind: 'btn', label: 'Numbered list', icon: <ListOrdered size={15} />, onClick: () => prefixLines((i) => `${i + 1}. `, { stripHeading: true }) },
    { kind: 'btn', label: 'Center text', icon: <AlignCenter size={15} />, onClick: insertCenter },
    { kind: 'divider' },
    { kind: 'btn', label: 'Link', icon: <Link2 size={15} />, onClick: insertLink },
    { kind: 'btn', label: 'Image', icon: <ImagePlus size={15} />, onClick: () => setImageDialogOpen((v) => !v) },
    { kind: 'btn', label: 'Divider', icon: <Minus size={15} />, onClick: insertDivider },
  ];

  return (
    <div className={cn('overflow-hidden rounded-lg border border-white/10 bg-white/5', className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-white/10 bg-white/5 px-2 py-1.5">
        {tools.map((tool, i) =>
          tool.kind === 'divider' ? (
            <span key={`d-${i}`} className={divider} aria-hidden />
          ) : (
            <button
              key={tool.label}
              type="button"
              title={tool.label}
              aria-label={tool.label}
              onClick={tool.onClick}
              className={cn(toolbarBtn, tool.label === 'Image' && imageDialogOpen && 'bg-accent text-foreground')}
            >
              {tool.icon}
            </button>
          ),
        )}
      </div>
      <InlineImageDialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        onInsert={insertFigure}
      />
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="block w-full resize-y bg-transparent px-3.5 py-3 text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
        style={{ minHeight: '20rem' }}
      />
    </div>
  );
});

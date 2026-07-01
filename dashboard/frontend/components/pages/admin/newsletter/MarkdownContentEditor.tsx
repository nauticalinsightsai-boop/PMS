'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
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

  return (
    <div className="border-b border-white/10 bg-slate-950/95 px-3 py-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Insert responsive image</p>
        <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
          <X size={14} />
        </button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">Desktop image URL</label>
          <Input value={desktop} onChange={(e) => setDesktop(e.target.value)} placeholder="https://… (16:9 frame)" className="h-9 text-xs" />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">Mobile image URL</label>
          <Input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="https://… (9:16 frame)" className="h-9 text-xs" />
        </div>
      </div>
      <div className="mt-2">
        <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">Alt / caption</label>
        <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image" className="h-9 text-xs" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-dashed border-white/15 p-2">
          <p className="mb-1 text-[10px] font-bold uppercase text-muted-foreground">Desktop frame</p>
          <div className="aspect-[16/10] overflow-hidden rounded bg-muted/30">
            {desktop.trim() ? (
              <img src={desktop.trim()} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">16:10</div>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-dashed border-white/15 p-2">
          <p className="mb-1 text-[10px] font-bold uppercase text-muted-foreground">Mobile frame</p>
          <div className="mx-auto aspect-[9/16] max-w-[80px] overflow-hidden rounded bg-muted/30">
            {(mobile.trim() || desktop.trim()) ? (
              <img src={(mobile.trim() || desktop.trim())} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">9:16</div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          variant="brand"
          disabled={!desktop.trim()}
          onClick={() => {
            onInsert(desktop.trim(), mobile.trim() || desktop.trim(), alt.trim() || 'Article image');
            setDesktop('');
            setMobile('');
            setAlt('');
            onClose();
          }}
        >
          Insert image
        </Button>
      </div>
    </div>
  );
}

export function MarkdownContentEditor({
  value,
  onChange,
  rows = 18,
  placeholder,
  className,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const pendingSelection = useRef<Selection | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  useEffect(() => {
    if (!pendingSelection.current || !ref.current) return;
    const { start, end } = pendingSelection.current;
    pendingSelection.current = null;
    const el = ref.current;
    el.focus();
    el.setSelectionRange(start, end);
  }, [value]);

  const getSelection = useCallback((): Selection => {
    const el = ref.current;
    if (!el) return { start: value.length, end: value.length };
    return { start: el.selectionStart, end: el.selectionEnd };
  }, [value.length]);

  const commit = (next: string, selection: Selection) => {
    pendingSelection.current = selection;
    onChange(next);
  };

  const insertAtCursor = (snippet: string, caretOffset = snippet.length) => {
    const { start, end } = getSelection();
    const next = value.slice(0, start) + snippet + value.slice(end);
    commit(next, { start: start + caretOffset, end: start + caretOffset });
  };

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

  const insertDivider = () => {
    insertAtCursor('\n\n---\n\n');
  };

  const insertQuote = () => {
    const { start, end } = getSelection();
    const selected = value.slice(start, end) || 'Pull quote text goes here.';
    insertAtCursor(buildQuoteBlock(selected), buildQuoteBlock(selected).length);
  };

  const insertCenter = () => {
    const { start, end } = getSelection();
    const selected = value.slice(start, end) || 'Centered text';
    insertAtCursor(buildCenterBlock(selected));
  };

  const insertFigure = (desktop: string, mobile: string, alt: string) => {
    insertAtCursor(buildFigureBlock(desktop, mobile, alt));
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
    { kind: 'btn', label: 'Image (desktop + mobile)', icon: <ImagePlus size={15} />, onClick: () => setImageDialogOpen(true) },
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
              className={toolbarBtn}
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
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="block w-full resize-y bg-transparent px-3.5 py-3 text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
        style={{ minHeight: '24rem' }}
      />
    </div>
  );
}

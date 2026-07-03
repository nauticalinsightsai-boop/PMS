'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type Props = {
  open: boolean;
  position: { top: number; left: number } | null;
  url: string;
  onUrlChange: (url: string) => void;
  onApply: () => void;
  onCancel: () => void;
};

export function LinkInsertPopover({ open, position, url, onUrlChange, onApply, onCancel }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open || !position) return null;

  const popover = (
    <div
      data-link-popover
      className="fixed z-[100] w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-border bg-card p-3 shadow-xl"
      style={{ top: position.top, left: position.left }}
      role="dialog"
      aria-label="Insert link"
      onMouseDown={(event) => event.stopPropagation()}
    >
      <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Link URL</label>
      <input
        ref={inputRef}
        type="url"
        value={url}
        onChange={(event) => onUrlChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onApply();
          }
        }}
        placeholder="https://example.com"
        className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onApply}
          disabled={!url.trim()}
          className={cn(
            'rounded-lg px-3 py-1.5 text-xs font-semibold text-white',
            url.trim() ? 'bg-brand-orange hover:bg-brand-orange/90' : 'bg-muted-foreground/40 cursor-not-allowed',
          )}
        >
          Apply
        </button>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(popover, document.body);
}

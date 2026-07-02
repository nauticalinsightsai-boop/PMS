'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { NewsletterHeroMedia } from '@/components/pages/admin/newsletter/NewsletterHeroMedia';

/** Modal — desktop + mobile upload frames for inserting into article body. */
export function FeaturedImageUploadDialog({
  open,
  onClose,
  onInsert,
}: {
  open: boolean;
  onClose: () => void;
  onInsert: (desktopUrl: string, mobileUrl: string, alt: string) => void;
}) {
  const [desktopUrl, setDesktopUrl] = useState('');
  const [mobileUrl, setMobileUrl] = useState('');
  const [alt, setAlt] = useState('');

  if (!open) return null;

  const handleClose = () => {
    setDesktopUrl('');
    setMobileUrl('');
    setAlt('');
    onClose();
  };

  const canInsert = Boolean(desktopUrl.trim());

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        role="dialog"
        aria-labelledby="featured-image-dialog-title"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 id="featured-image-dialog-title" className="text-base font-bold text-foreground">
              Insert image
            </h3>
            <p className="text-sm text-muted-foreground">Upload desktop and mobile versions</p>
          </div>
          <button type="button" onClick={handleClose} className="rounded-lg p-2 hover:bg-muted" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 space-y-4">
          <NewsletterHeroMedia
            desktopUrl={desktopUrl}
            mobileUrl={mobileUrl}
            altText={alt}
            onDesktopChange={setDesktopUrl}
            onMobileChange={setMobileUrl}
            onAltChange={setAlt}
          />
        </div>

        <div className="flex shrink-0 justify-end gap-2 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canInsert}
            onClick={() => {
              const desktop = desktopUrl.trim();
              const mobile = mobileUrl.trim() || desktop;
              onInsert(desktop, mobile, alt.trim() || 'Article image');
              setDesktopUrl('');
              setMobileUrl('');
              setAlt('');
              onClose();
            }}
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background disabled:opacity-40"
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}

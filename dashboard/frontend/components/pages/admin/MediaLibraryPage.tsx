'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { MediaLibraryGrid } from './site-content/MediaLibraryGrid';

export function MediaLibraryPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ImageIcon className="h-7 w-7 text-brand-orange" />
            Media library
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">
            Upload images for the public site. Use them in newsletters, home hero slides, store products,
            and other CMS fields. Copy the URL or pick from the library inside any image field.
          </p>
        </div>
      </div>
      <MediaLibraryGrid />
    </div>
  );
}

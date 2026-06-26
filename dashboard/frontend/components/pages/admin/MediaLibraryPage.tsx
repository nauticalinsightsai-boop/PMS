'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { DashboardPageHeader } from '@/components/layout/DashboardPageHeader';
import { MediaLibraryGrid } from './site-content/MediaLibraryGrid';

export function MediaLibraryPage() {
  return (
    <div className="space-y-5">
      <DashboardPageHeader
        title="Media library"
        icon={ImageIcon}
        description="Browse site images, CMS references, and uploads. Upload files for newsletters, hero slides, and store products."
      />
      <MediaLibraryGrid />
    </div>
  );
}

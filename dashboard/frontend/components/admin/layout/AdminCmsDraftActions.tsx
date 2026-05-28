'use client';

import { CTAButton } from '@/components/ui/CTAButton';
import { ADMIN_CMS_PREVIEW_BUTTON_CLASS } from '@/components/admin/layout/adminCmsLayoutClasses';

export interface AdminCmsDraftActionsProps {
  onPreview?: () => void;
  previewLabel?: string;
  onSaveDraft: () => void;
  onPublish?: () => void;
  isManualSyncing?: boolean;
  isPublishing?: boolean;
  hasUnsavedChanges?: boolean;
  showPublish?: boolean;
}

export function AdminCmsDraftActions({
  onPreview,
  previewLabel = 'Preview',
  onSaveDraft,
  onPublish,
  isManualSyncing = false,
  isPublishing = false,
  hasUnsavedChanges = false,
  showPublish = true,
}: AdminCmsDraftActionsProps) {
  return (
    <>
      {onPreview ? (
        <button type="button" onClick={onPreview} className={ADMIN_CMS_PREVIEW_BUTTON_CLASS}>
          {previewLabel}
        </button>
      ) : null}
      <CTAButton
        variant="secondary"
        onClick={onSaveDraft}
        size="sm"
        disabled={isManualSyncing || isPublishing}
        className={`shrink-0 whitespace-nowrap transition-opacity ${hasUnsavedChanges ? 'opacity-100' : 'opacity-60'}`}
      >
        Save Draft
      </CTAButton>
      {showPublish && onPublish ? (
        <CTAButton
          variant="primary"
          onClick={onPublish}
          size="sm"
          disabled={isPublishing}
          className={`shrink-0 whitespace-nowrap transition-opacity ${isPublishing ? 'opacity-60 cursor-not-allowed' : 'opacity-100'}`}
        >
          Publish
        </CTAButton>
      ) : null}
    </>
  );
}
